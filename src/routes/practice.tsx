import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, Send, Square, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { AiAvatar, type AvatarEmotion } from "@/components/practice/AiAvatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSpeechSynthesis } from "@/components/mocktest/useSpeechSynthesis";
import { chatWithAi } from "@/lib/aiChat";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Practice with AI — IEA" },
      { name: "description", content: "Practice IELTS speaking with an AI partner." },
    ],
  }),
  component: PracticePage,
});

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

function getSpeechRecognitionCtor() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  const Ctor = w["SpeechRecognition"] ?? w["webkitSpeechRecognition"];
  if (typeof Ctor !== "function") return undefined;
  return Ctor as new () => {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onresult: ((event: { results: SpeechRecognitionResultList }) => void) | null;
    onerror: ((event: unknown) => void) | null;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
  };
}

function PracticePage() {
  const { speak, stop: stopSpeaking, isSpeaking } = useSpeechSynthesis();
  const [emotion, setEmotion] = useState<AvatarEmotion>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [recording, setRecording] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [typedText, setTypedText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [sttSupported, setSttSupported] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const stoppedByUserRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(scrollToBottom, [messages, scrollToBottom]);

  // Detect STT support
  useEffect(() => {
    setSttSupported(getSpeechRecognitionCtor() !== undefined);
  }, []);

  // Send greeting on first load
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    (async () => {
      setEmotion("thinking");
      try {
        const res = await chatWithAi({ data: { messages: [] } });
        setMessages([{ role: "model", text: res.text }]);
        setEmotion("speaking");
        await speak(res.text);
      } catch {
        toast.error("Could not reach AI. Check your connection.");
      }
      setEmotion("idle");
    })();
  }, [speak]);

  const sendToAi = useCallback(
    async (userText: string) => {
      if (!userText.trim()) return;
      const userMsg: ChatMessage = { role: "user", text: userText.trim() };
      const allMessages = [...messages, userMsg];
      setMessages(allMessages);
      setProcessing(true);
      setEmotion("thinking");

      try {
        const res = await chatWithAi({
          data: { messages: allMessages.map((m) => ({ role: m.role, text: m.text })) },
        });
        const aiMsg: ChatMessage = { role: "model", text: res.text };
        setMessages((prev) => [...prev, aiMsg]);
        setEmotion("speaking");
        await speak(res.text);
        setEmotion("happy");
        setTimeout(() => setEmotion("idle"), 2000);
      } catch {
        toast.error("AI could not respond. Try again.");
        setEmotion("idle");
      } finally {
        setProcessing(false);
      }
    },
    [messages, speak],
  );

  // Speech recognition
  const startRecording = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    // Stop any existing recognition first
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }

    stoppedByUserRef.current = false;

    try {
      const recognition = new Ctor();
      recognitionRef.current = recognition;
      transcriptRef.current = "";
      setInterimText("");

      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event: { results: SpeechRecognitionResultList }) => {
        let interim = "";
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i]!;
          if (result.isFinal) {
            transcriptRef.current += result[0]!.transcript + " ";
          } else {
            interim += result[0]!.transcript;
          }
        }
        setInterimText(interim);
      };

      recognition.onerror = () => {
        // Don't setRecording here — let onend handle it
      };

      recognition.onend = () => {
        recognitionRef.current = null;
        const final = transcriptRef.current.trim();

        if (stoppedByUserRef.current || final) {
          // User stopped or we got text — process normally
          setRecording(false);
          setEmotion("idle");
          if (final) {
            setInterimText("");
            sendToAi(final);
          }
        } else {
          // Recognition ended without user action and without text — restart
          try {
            const retry = new Ctor();
            recognitionRef.current = retry;
            retry.lang = "en-US";
            retry.continuous = false;
            retry.interimResults = true;
            retry.onresult = recognition.onresult;
            retry.onerror = recognition.onerror;
            retry.onend = recognition.onend;
            retry.start();
          } catch {
            setRecording(false);
            setEmotion("idle");
          }
        }
      };

      recognition.start();
      setRecording(true);
      setEmotion("listening");
    } catch (err) {
      console.warn("Failed to start recognition:", err);
      setRecording(false);
      setEmotion("idle");
    }
  }, [sendToAi]);

  const stopRecording = useCallback(() => {
    stoppedByUserRef.current = true;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setRecording(false);
  }, []);

  const handleTypedSend = useCallback(() => {
    if (!typedText.trim()) return;
    sendToAi(typedText);
    setTypedText("");
  }, [typedText, sendToAi]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleTypedSend();
      }
    },
    [handleTypedSend],
  );

  const lastAiMessage = [...messages].reverse().find((m) => m.role === "model");

  return (
    <DashboardShell title="Practice with AI">
      <div className="flex flex-col items-center gap-6 py-4">
        {/* Avatar */}
        <div className="relative">
          <AiAvatar emotion={emotion} size={200} />
          {recording && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse-dot" />
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse-dot [animation-delay:0.2s]" />
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse-dot [animation-delay:0.4s]" />
            </div>
          )}
        </div>

        {/* Interim transcript */}
        {recording && interimText && (
          <div className="w-full max-w-lg rounded-xl bg-secondary/50 p-3">
            <p className="text-sm text-muted-foreground italic">{interimText}...</p>
          </div>
        )}

        {/* Mic button or text input */}
        <div className="w-full max-w-lg">
          {sttSupported ? (
            <div className="flex flex-col items-center gap-3">
              <Button
                variant={recording ? "destructive" : "hero"}
                size="lg"
                className="h-16 w-16 rounded-full shadow-lg"
                onClick={recording ? stopRecording : startRecording}
                disabled={processing || isSpeaking}
              >
                {recording ? (
                  <Square className="h-6 w-6" />
                ) : processing ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Mic className="h-6 w-6" />
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                {recording ? "Tap to stop" : "Hold to speak"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground text-center">
                Voice recording isn't supported in this browser. Type your response instead.
              </p>
              <div className="flex gap-2">
                <Textarea
                  value={typedText}
                  onChange={(e) => setTypedText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type what you would say..."
                  rows={3}
                  className="flex-1"
                  disabled={processing || isSpeaking}
                />
                <Button
                  variant="hero"
                  size="icon"
                  className="shrink-0 self-end"
                  onClick={handleTypedSend}
                  disabled={!typedText.trim() || processing || isSpeaking}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <div ref={messagesEndRef} />
      </div>
    </DashboardShell>
  );
}
