import { useEffect, useRef, useState } from "react";
import { Mic, Square, Volume2 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import type { SpeakingQuestion } from "@/shared/data/mockTest";
import { useSpeechSynthesis } from "./useSpeechSynthesis";

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}
interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

type Phase = "prep" | "answering" | "done";

export function SpeakingRecorder({
  question,
  onDone,
}: {
  question: SpeakingQuestion;
  onDone: (transcript: string) => void;
}) {
  const { speak, isSpeaking, supported: ttsSupported } = useSpeechSynthesis();
  const recognitionSupported = getSpeechRecognitionCtor() !== null;

  const [phase, setPhase] = useState<Phase>(question.prepSeconds > 0 ? "prep" : "answering");
  const [prepLeft, setPrepLeft] = useState(question.prepSeconds);
  const [answerLeft, setAnswerLeft] = useState(question.answerSeconds);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [typedAnswer, setTypedAnswer] = useState("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (ttsSupported) speak(question.prompt);
    finishedRef.current = false;
    setPhase(question.prepSeconds > 0 ? "prep" : "answering");
    setPrepLeft(question.prepSeconds);
    setAnswerLeft(question.answerSeconds);
    setTranscript("");
    setTypedAnswer("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  useEffect(() => {
    if (phase !== "prep") return;
    if (prepLeft <= 0) {
      setPhase("answering");
      if (recognitionSupported) startRecording();
      return;
    }
    const id = setTimeout(() => setPrepLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, prepLeft]);

  function finish(finalText: string) {
    if (finishedRef.current) return;
    finishedRef.current = true;
    stopRecognition();
    setPhase("done");
    onDone(finalText.trim());
  }

  useEffect(() => {
    if (phase !== "answering" || !recording) return;
    if (answerLeft <= 0) {
      finish(recognitionSupported ? transcript : typedAnswer);
      return;
    }
    const id = setTimeout(() => setAnswerLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, recording, answerLeft]);

  function stopRecognition() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setRecording(false);
  }

  function startRecording() {
    if (!recognitionSupported) {
      setRecording(true);
      return;
    }

    // Stop any existing recognition first
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }

    try {
      const Ctor = getSpeechRecognitionCtor();
      if (!Ctor) {
        setRecording(true);
        return;
      }
      const recognition = new Ctor();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = true;
      let finalText = "";
      recognition.onresult = (event) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]!;
          if (result.isFinal) finalText += result[0].transcript + " ";
          else interim += result[0].transcript;
        }
        setTranscript((finalText + interim).trim());
      };
      recognition.onerror = () => {};
      recognition.onend = () => {
        // If no user stop and no text, restart
        if (finalText.trim()) {
          setRecording(false);
        } else {
          try {
            const retry = new Ctor();
            retry.lang = "en-US";
            retry.continuous = false;
            retry.interimResults = true;
            retry.onresult = recognition.onresult;
            retry.onerror = recognition.onerror;
            retry.onend = recognition.onend;
            recognitionRef.current = retry;
            retry.start();
          } catch {
            setRecording(false);
          }
        }
      };
      recognitionRef.current = recognition;
      recognition.start();
      setRecording(true);
    } catch (err) {
      console.warn("Failed to start recognition:", err);
      setRecording(true);
    }
  }

  function stopAndNext() {
    finish(recognitionSupported ? transcript : typedAnswer);
  }

  if (phase === "prep") {
    return (
      <div className="rounded-3xl bg-card p-6 text-center shadow-card sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Part {question.part} · Prepare
        </p>
        <p className="mx-auto mt-3 max-w-lg text-sm text-foreground">{question.prompt}</p>
        <p className="mt-6 text-4xl font-extrabold text-foreground">{prepLeft}s</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Use this time to think. Recording starts automatically when the timer ends.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-card p-6 shadow-card sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Part {question.part}
        </p>
        {ttsSupported && (
          <Button
            type="button"
            variant="soft"
            size="sm"
            onClick={() => speak(question.prompt)}
            disabled={isSpeaking}
          >
            <Volume2 className="h-3.5 w-3.5" /> {isSpeaking ? "Speaking…" : "Replay question"}
          </Button>
        )}
      </div>
      <p className="mt-3 text-base font-bold text-foreground">{question.prompt}</p>

      {recognitionSupported ? (
        <div className="mt-6 text-center">
          {!recording ? (
            <Button variant="hero" size="pill-lg" onClick={startRecording}>
              <Mic className="h-4 w-4" /> Start speaking
            </Button>
          ) : (
            <>
              <p className="text-3xl font-extrabold text-foreground">{answerLeft}s</p>
              <p className="mt-2 flex items-center justify-center gap-2 text-xs font-semibold text-destructive">
                <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" /> Recording…
              </p>
              <p className="mt-4 min-h-16 rounded-2xl bg-secondary p-4 text-left text-sm text-secondary-foreground">
                {transcript || "Listening…"}
              </p>
              <Button variant="soft" size="pill" className="mt-4" onClick={stopAndNext}>
                <Square className="h-4 w-4" /> Stop &amp; continue
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="mt-6">
          <p className="text-xs text-muted-foreground">
            Voice recording isn't supported in this browser — type your answer instead.
          </p>
          <Textarea
            value={typedAnswer}
            onChange={(e) => setTypedAnswer(e.target.value)}
            rows={5}
            placeholder="Type what you would say…"
            className="mt-2"
          />
          <Button variant="hero" size="pill" className="mt-4" onClick={stopAndNext}>
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}
