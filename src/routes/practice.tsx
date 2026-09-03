import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Mic,
  Send,
  Square,
  Loader2,
  Clock,
  Volume2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  MessageSquare,
  CreditCard,
  MessagesSquare,
  Bot,
} from "lucide-react";
import { toast } from "sonner";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { AiAvatar, type AvatarEmotion } from "@/components/practice/AiAvatar";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Textarea } from "@/shared/ui/textarea";
import { Progress } from "@/shared/ui/progress";
import { useSpeechSynthesis } from "@/components/mocktest/useSpeechSynthesis";
import { chatWithAi } from "@/lib/aiChat";
import {
  SPEAKING_MODES,
  SpeakingModeSelector,
  FluencyAnalysisPanel,
  analyzeFluency,
  type SpeakingPart,
} from "@/components/practice/SpeakingModes";
import { cn } from "@/shared/lib/utils";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Practice with AI — IEA" },
      { name: "description", content: "Practice IELTS speaking with an AI partner." },
    ],
  }),
  component: PracticePage,
});

type PracticeMode = "freestyle" | "speaking-part" | "pronunciation";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

const PRONUNCIATION_SENTENCES = [
  "The weather has been absolutely beautiful this week.",
  "I would like to book a table for two at seven o'clock.",
  "Could you please repeat that? I didn't quite catch it.",
  "The university offers a wide range of postgraduate courses.",
  "She has been working on her thesis for the past six months.",
  "I believe that education is the key to a better future.",
  "The concert was thoroughly enjoyed by everyone in the audience.",
  "He managed to complete the marathon despite the heavy rain.",
  "The government should invest more in public transportation.",
  "Environmental protection is everyone's responsibility.",
  "I am particularly interested in artificial intelligence and robotics.",
  "The museum houses an impressive collection of modern art.",
  "Globalization has had a significant impact on local cultures.",
  "Technology continues to revolutionize the way we communicate.",
  "Sustainable development is crucial for future generations.",
];

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

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function computeWordAccuracy(
  original: string,
  spoken: string,
): { accuracy: number; matched: string[]; missed: string[] } {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(Boolean);
  const origWords = normalize(original);
  const spokenWords = normalize(spoken);
  const spokenSet = new Set(spokenWords);
  const matched = origWords.filter((w) => spokenSet.has(w));
  const missed = origWords.filter((w) => !spokenSet.has(w));
  const accuracy = origWords.length > 0 ? Math.round((matched.length / origWords.length) * 100) : 0;
  return { accuracy, matched, missed };
}

/* ====== SPEAKING PART PRACTICE ====== */

function SpeakingPartPractice({ onBack }: { onBack: () => void }) {
  const { speak, stop: stopSpeaking, isSpeaking } = useSpeechSynthesis();
  const [emotion, setEmotion] = useState<AvatarEmotion>("idle");
  const [selectedPart, setSelectedPart] = useState<SpeakingPart | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [recording, setRecording] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [transcript, setTranscript] = useState("");
  const [timer, setTimer] = useState(0);
  const [phase, setPhase] = useState<"select" | "prep" | "speak" | "done">("select");
  const [fluencyStats, setFluencyStats] = useState<ReturnType<typeof analyzeFluency> | null>(null);
  const [sttSupported, setSttSupported] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef("");
  const startedByUserRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setSttSupported(getSpeechRecognitionCtor() !== undefined);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const mode = selectedPart ? SPEAKING_MODES.find((m) => m.part === selectedPart) : null;
  const questions = mode?.questions ?? [];
  const question = questions[currentQuestion] ?? "";

  function startTimer(duration: number, onEnd: () => void) {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimer(duration);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          onEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function handleSelectPart(part: SpeakingPart) {
    setSelectedPart(part);
    setCurrentQuestion(0);
    setTranscript("");
    setFluencyStats(null);
    const m = SPEAKING_MODES.find((mo) => mo.part === part);
    if (m && m.prepTime > 0) {
      setPhase("prep");
      startTimer(m.prepTime, () => {
        setPhase("speak");
        speak(question).then(() => {
          startTimer(m.responseTime, () => stopRecording());
        });
      });
    } else {
      setPhase("speak");
    }
  }

  const startRecording = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      toast.error("Speech recognition not supported in this browser.");
      return;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        /* ignore */
      }
      recognitionRef.current = null;
    }
    startedByUserRef.current = true;
    transcriptRef.current = "";
    setInterimText("");
    setTranscript("");

    try {
      const recognition = new Ctor();
      recognitionRef.current = recognition;
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

      recognition.onerror = () => {};

      recognition.onend = () => {
        recognitionRef.current = null;
        const final = transcriptRef.current.trim();
        setRecording(false);
        setEmotion("idle");
        if (final) {
          setInterimText("");
          setTranscript(final);
          if (mode) {
            const stats = analyzeFluency(final, mode.responseTime);
            setFluencyStats(stats);
          }
          setPhase("done");
        }
      };

      recognition.start();
      setRecording(true);
      setEmotion("listening");
    } catch {
      setRecording(false);
      setEmotion("idle");
    }
  }, [mode, speak, question]);

  const stopRecording = useCallback(() => {
    startedByUserRef.current = false;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setRecording(false);
    setEmotion("idle");
    if (timerRef.current) clearInterval(timerRef.current);
    const final = transcriptRef.current.trim();
    if (final) {
      setTranscript(final);
      if (mode) {
        const stats = analyzeFluency(final, mode.responseTime);
        setFluencyStats(stats);
      }
      setPhase("done");
    }
  }, [mode]);

  function handleNextQuestion() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTranscript("");
      setFluencyStats(null);
      setPhase(mode && mode.prepTime > 0 ? "prep" : "speak");
      if (mode && mode.prepTime > 0) {
        startTimer(mode.prepTime, () => {
          setPhase("speak");
          const nextQuestion = questions[currentQuestion + 1];
          if (nextQuestion) {
            speak(nextQuestion).then(() => {
              startTimer(mode.responseTime, () => stopRecording());
            });
          }
        });
      }
    } else {
      setSelectedPart(null);
      setPhase("select");
    }
  }

  if (phase === "select") {
    return (
      <div className="space-y-6">
        <SpeakingModeSelector selectedPart={selectedPart ?? 1} onSelect={handleSelectPart} />
      </div>
    );
  }

  if (!mode) return null;

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="w-full max-w-lg flex items-center justify-between">
        <Badge variant="secondary">{mode.label}</Badge>
        <span className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} / {questions.length}
        </span>
      </div>

      <div className="w-full max-w-lg rounded-2xl bg-card p-5 shadow-card">
        <p className="text-sm font-medium text-foreground whitespace-pre-wrap leading-relaxed">
          {question}
        </p>
      </div>

      {mode.prepTime > 0 && phase === "prep" && (
        <div className="w-full max-w-lg text-center space-y-2">
          <Badge className="bg-amber-500/10 text-amber-500">
            <Clock className="mr-1 h-3 w-3" /> Preparation Time
          </Badge>
          <p className="text-3xl font-extrabold text-foreground">{formatTime(timer)}</p>
          <p className="text-xs text-muted-foreground">Prepare your answer...</p>
        </div>
      )}

      {phase === "speak" && (
        <div className="text-center space-y-2">
          {timer > 0 && (
            <Badge
              className={timer <= 10 ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"}
            >
              <Clock className="mr-1 h-3 w-3" /> {formatTime(timer)}
            </Badge>
          )}
        </div>
      )}

      <div className="relative">
        <AiAvatar emotion={emotion} size={160} />
        {recording && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse-dot" />
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse-dot [animation-delay:0.2s]" />
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse-dot [animation-delay:0.4s]" />
          </div>
        )}
      </div>

      {recording && interimText && (
        <div className="w-full max-w-lg rounded-xl bg-secondary/50 p-3">
          <p className="text-sm text-muted-foreground italic">{interimText}...</p>
        </div>
      )}

      {phase === "done" && transcript && (
        <div className="w-full max-w-lg space-y-4">
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <h4 className="text-xs font-bold text-muted-foreground mb-2">YOUR RESPONSE</h4>
            <p className="text-sm text-foreground leading-relaxed">{transcript}</p>
          </div>
          {fluencyStats && <FluencyAnalysisPanel stats={fluencyStats} />}
          <div className="flex gap-2">
            <Button onClick={handleNextQuestion} variant="hero" size="pill" className="flex-1">
              {currentQuestion < questions.length - 1 ? (
                <>
                  <ArrowRight className="mr-2 h-4 w-4" /> Next Question
                </>
              ) : (
                "Finish"
              )}
            </Button>
            <Button
              onClick={() => {
                setPhase("speak");
                setTranscript("");
                setFluencyStats(null);
              }}
              variant="soft"
              size="pill"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Retry
            </Button>
          </div>
        </div>
      )}

      {phase === "speak" && (
        <div className="flex flex-col items-center gap-3">
          <Button
            variant={recording ? "destructive" : "hero"}
            size="lg"
            className="h-16 w-16 rounded-full shadow-lg"
            onClick={recording ? stopRecording : startRecording}
            disabled={isSpeaking || (!sttSupported && !recording)}
          >
            {recording ? <Square className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </Button>
          <p className="text-xs text-muted-foreground">
            {recording
              ? "Tap to stop"
              : sttSupported
                ? "Tap to start speaking"
                : "Speech recognition not supported"}
          </p>
        </div>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          if (timerRef.current) clearInterval(timerRef.current);
          setSelectedPart(null);
          setPhase("select");
          setTranscript("");
          setFluencyStats(null);
          stopSpeaking();
        }}
      >
        ← Change Part
      </Button>
    </div>
  );
}

/* ====== PRONUNCIATION PRACTICE ====== */

function PronunciationPractice() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [spokenText, setSpokenText] = useState("");
  const [result, setResult] = useState<{
    accuracy: number;
    matched: string[];
    missed: string[];
  } | null>(null);
  const [sttSupported, setSttSupported] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef("");

  const sentence = PRONUNCIATION_SENTENCES[currentIdx]!;

  useEffect(() => {
    setSttSupported(getSpeechRecognitionCtor() !== undefined);
  }, []);

  function startRecording() {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      toast.error("Speech recognition not supported in this browser.");
      return;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        /* ignore */
      }
      recognitionRef.current = null;
    }
    transcriptRef.current = "";
    setInterimText("");
    setSpokenText("");
    setResult(null);

    try {
      const recognition = new Ctor();
      recognitionRef.current = recognition;
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event: { results: SpeechRecognitionResultList }) => {
        let interim = "";
        for (let i = 0; i < event.results.length; i++) {
          const r = event.results[i]!;
          if (r.isFinal) {
            transcriptRef.current += r[0]!.transcript + " ";
          } else {
            interim += r[0]!.transcript;
          }
        }
        setInterimText(interim);
      };

      recognition.onerror = () => {};

      recognition.onend = () => {
        recognitionRef.current = null;
        setRecording(false);
        const final = transcriptRef.current.trim();
        if (final) {
          setInterimText("");
          setSpokenText(final);
          setResult(computeWordAccuracy(sentence, final));
        }
      };

      recognition.start();
      setRecording(true);
    } catch {
      setRecording(false);
    }
  }

  function stopRecording() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setRecording(false);
  }

  function nextSentence() {
    setCurrentIdx((prev) => (prev + 1) % PRONUNCIATION_SENTENCES.length);
    setSpokenText("");
    setResult(null);
    setInterimText("");
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4 max-w-lg mx-auto">
      <div className="w-full flex items-center justify-between">
        <Badge variant="secondary">Pronunciation Practice</Badge>
        <span className="text-sm text-muted-foreground">
          Sentence {currentIdx + 1} / {PRONUNCIATION_SENTENCES.length}
        </span>
      </div>

      <div className="w-full rounded-2xl bg-card p-6 shadow-card text-center">
        <p className="text-xs text-muted-foreground mb-2">Read this sentence aloud:</p>
        <p className="text-lg font-bold text-foreground leading-relaxed">{sentence}</p>
      </div>

      <Button
        variant="soft"
        size="pill"
        onClick={() => {
          toast.info(sentence);
        }}
      >
        <Volume2 className="mr-2 h-4 w-4" /> Listen
      </Button>

      <div className="flex flex-col items-center gap-3">
        <Button
          variant={recording ? "destructive" : "hero"}
          size="lg"
          className="h-16 w-16 rounded-full shadow-lg"
          onClick={recording ? stopRecording : startRecording}
          disabled={!sttSupported}
        >
          {recording ? <Square className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>
        <p className="text-xs text-muted-foreground">
          {recording
            ? "Tap to stop"
            : sttSupported
              ? "Tap to start reading"
              : "Not supported in this browser"}
        </p>
      </div>

      {recording && interimText && (
        <div className="w-full rounded-xl bg-secondary/50 p-3">
          <p className="text-sm text-muted-foreground italic">{interimText}...</p>
        </div>
      )}

      {result && (
        <div className="w-full space-y-4">
          <div
            className={cn(
              "rounded-2xl p-6 shadow-card text-center",
              result.accuracy >= 80
                ? "bg-green-500/10"
                : result.accuracy >= 50
                  ? "bg-amber-500/10"
                  : "bg-red-500/10",
            )}
          >
            <p className="text-4xl font-extrabold text-foreground">{result.accuracy}%</p>
            <p className="text-sm text-muted-foreground mt-1">Accuracy</p>
            {result.accuracy >= 80 ? (
              <Badge className="mt-2 bg-green-500/10 text-green-500">
                <CheckCircle2 className="mr-1 h-3 w-3" /> Great pronunciation!
              </Badge>
            ) : result.accuracy >= 50 ? (
              <Badge className="mt-2 bg-amber-500/10 text-amber-500">Good, keep practicing!</Badge>
            ) : (
              <Badge className="mt-2 bg-red-500/10 text-red-500">
                <XCircle className="mr-1 h-3 w-3" /> Try again
              </Badge>
            )}
          </div>

          <div className="rounded-2xl bg-card p-4 shadow-card">
            <h4 className="text-xs font-bold text-muted-foreground mb-2">WHAT YOU SAID</h4>
            <p className="text-sm text-foreground">{spokenText}</p>
          </div>

          {result.missed.length > 0 && (
            <div className="rounded-2xl bg-card p-4 shadow-card">
              <h4 className="text-xs font-bold text-muted-foreground mb-2">WORDS TO PRACTICE</h4>
              <div className="flex flex-wrap gap-2">
                {result.missed.map((w, i) => (
                  <Badge key={i} variant="secondary" className="text-red-500">
                    {w}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={nextSentence} variant="hero" size="pill" className="flex-1">
              <ArrowRight className="mr-2 h-4 w-4" /> Next Sentence
            </Button>
            <Button
              onClick={() => {
                setSpokenText("");
                setResult(null);
              }}
              variant="soft"
              size="pill"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Retry
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ====== FREESTYLE AI CHAT ====== */

function FreestylePractice() {
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

  useEffect(() => {
    setSttSupported(getSpeechRecognitionCtor() !== undefined);
  }, []);

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

  const startRecording = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        /* ignore */
      }
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

      recognition.onerror = () => {};

      recognition.onend = () => {
        recognitionRef.current = null;
        const final = transcriptRef.current.trim();
        if (stoppedByUserRef.current || final) {
          setRecording(false);
          setEmotion("idle");
          if (final) {
            setInterimText("");
            sendToAi(final);
          }
        } else {
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
    } catch {
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

  return (
    <div className="flex flex-col items-center gap-6 py-4">
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

      {recording && interimText && (
        <div className="w-full max-w-lg rounded-xl bg-secondary/50 p-3">
          <p className="text-sm text-muted-foreground italic">{interimText}...</p>
        </div>
      )}

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
              Voice recording isn't supported. Type your response instead.
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
  );
}

/* ====== MAIN PAGE ====== */

function PracticePage() {
  const [mode, setMode] = useState<PracticeMode | null>(null);

  return (
    <DashboardShell title="Practice with AI">
      {mode === null ? (
        <div className="max-w-2xl mx-auto py-8 space-y-6">
          <p className="text-sm text-muted-foreground text-center">Choose a practice mode:</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <button
              onClick={() => setMode("speaking-part")}
              className="rounded-2xl border-2 border-border p-6 text-left transition-all hover:border-primary/50 hover:shadow-card"
            >
              <MessageSquare className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-bold text-foreground">Speaking Parts</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Practice Part 1, 2, 3 with timers and fluency analysis
              </p>
            </button>
            <button
              onClick={() => setMode("pronunciation")}
              className="rounded-2xl border-2 border-border p-6 text-left transition-all hover:border-primary/50 hover:shadow-card"
            >
              <Volume2 className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-bold text-foreground">Pronunciation</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Read sentences and check your accuracy
              </p>
            </button>
            <button
              onClick={() => setMode("freestyle")}
              className="rounded-2xl border-2 border-border p-6 text-left transition-all hover:border-primary/50 hover:shadow-card"
            >
              <Bot className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-bold text-foreground">Freestyle Chat</h3>
              <p className="mt-1 text-xs text-muted-foreground">Free conversation with AI tutor</p>
            </button>
          </div>
        </div>
      ) : mode === "speaking-part" ? (
        <SpeakingPartPractice onBack={() => setMode(null)} />
      ) : mode === "pronunciation" ? (
        <PronunciationPractice />
      ) : (
        <FreestylePractice />
      )}

      {mode !== null && (
        <div className="flex justify-center mt-6">
          <Button variant="ghost" size="sm" onClick={() => setMode(null)}>
            ← Back to mode selection
          </Button>
        </div>
      )}
    </DashboardShell>
  );
}
