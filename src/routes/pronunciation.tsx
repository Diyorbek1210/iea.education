import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  Play,
  RotateCcw,
  Check,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pronunciation")({
  head: () => ({
    meta: [
      { title: "Pronunciation — IEA" },
      { name: "description", content: "Practice pronunciation with speech recognition and feedback." },
    ],
  }),
  component: PronunciationPage,
});

interface PronunciationWord {
  word: string;
  ipa: string;
  meaning: string;
  tip: string;
}

const PRONUNCIATION_SETS: { topic: string; words: PronunciationWord[] }[] = [
  {
    topic: "Difficult Vowels",
    words: [
      { word: "think", ipa: "/θɪŋk/", meaning: "To use the mind", tip: "Place tongue between teeth for 'th'" },
      { word: "this", ipa: "/ðɪs/", meaning: "Used to identify something", tip: "Voiced 'th' — vibrate vocal cords" },
      { word: "ship", ipa: "/ʃɪp/", meaning: "A boat", tip: "Lips rounded and pushed forward" },
      { word: "sheep", ipa: "/ʃiːp/", meaning: "A farm animal", tip: "Long 'ee' sound, stretch it" },
      { word: "cat", ipa: "/kæt/", meaning: "A pet animal", tip: "Open mouth wide for 'a'" },
      { word: "cut", ipa: "/kʌt/", meaning: "To divide with a blade", tip: "Short 'u' — like a quick 'ah'" },
      { word: "bird", ipa: "/bɜːd/", meaning: "A flying animal", tip: "Tongue flat, not curled" },
      { word: "bed", ipa: "/bed/", meaning: "A piece of furniture", tip: "Short 'e', mouth slightly open" },
    ],
  },
  {
    topic: "Consonant Clusters",
    words: [
      { word: "strength", ipa: "/strɛŋθ/", meaning: "Power", tip: "Practice 'str' and 'ngth' slowly" },
      { word: "world", ipa: "/wɜːld/", meaning: "The earth", tip: "Combine 'r' and 'l' smoothly" },
      { word: "texts", ipa: "/tɛksts/", meaning: "Written messages", tip: "Four consonants together — slow down" },
      { word: "asks", ipa: "/ɑːsks/", meaning: "Requests information", tip: "'sks' cluster — space them" },
      { word: "months", ipa: "/mʌnθs/", meaning: "Periods of time", tip: "'nths' — tongue between teeth at end" },
      { word: "sixths", ipa: "/sɪksθs/", meaning: "Ordinal number 6th", tip: "One of the hardest English sounds" },
    ],
  },
  {
    topic: "Word Stress Patterns",
    words: [
      { word: "DEvelop", ipa: "/dɪˈvɛləp/", meaning: "To grow or progress", tip: "Stress on 2nd syllable" },
      { word: "POpuIar", ipa: "/ˈpɒpjʊlə/", meaning: "Liked by many", tip: "Stress on 1st syllable" },
      { word: "phoTOGraphy", ipa: "/fəˈtɒɡrəfi/", meaning: "Taking photos", tip: "Stress on 2nd syllable" },
      { word: "REcorD", ipa: "/ˈrɛkɔːd/", meaning: "A vinyl or achievement", tip: "Noun = stress on 1st, Verb = stress on 2nd" },
      { word: "inFORmation", ipa: "/ɪnfəˈmeɪʃən/", meaning: "Knowledge", tip: "Stress on 3rd syllable" },
      { word: "environment", ipa: "/ɪnˈvaɪrənmənt/", meaning: "Nature around us", tip: "4 syllables, stress on 2nd" },
    ],
  },
  {
    topic: "Commonly Mispronounced",
    words: [
      { word: "vegetable", ipa: "/ˈvɛdʒtəbəl/", meaning: "Plant food", tip: "Don't say 've-ge-ta-ble' — it's 'vejt-bul'" },
      { word: "comfortable", ipa: "/ˈkʌmftəbəl/", meaning: "Pleasant, cozy", tip: "3 syllables: 'kumf-tuh-bul'" },
      { word: "Wednesday", ipa: "/ˈwɛnzdeɪ/", meaning: "Day of the week", tip: "Silent 'd' — 'Wenz-day'" },
      { word: "colonel", ipa: "/ˈkɜːnəl/", meaning: "Military rank", tip: "Pronounced 'kernel'" },
      { word: "pronunciation", ipa: "/prəˌnʌnsɪˈeɪʃən/", meaning: "How words are said", tip: "Not 'pro-nun-ciation' — 'pruh-nun-see-AY-shun'" },
      { word: "entrepreneur", ipa: "/ˌɒntrəprəˈnɜː/", meaning: "Business owner", tip: "French origin — 'on-truh-pruh-NUR'" },
    ],
  },
];

function PronunciationPage() {
  const [selectedSet, setSelectedSet] = useState(0);
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);
  const [history, setHistory] = useState<{ word: string; match: boolean }[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const currentSet = PRONUNCIATION_SETS[selectedSet];
  const currentWord = currentSet?.words[currentWordIdx];

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startRecording = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setTranscript("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionCtor();
    recognitionRef.current = recognition;

    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1];
      const text = result[0].transcript;
      setTranscript(text);

      if (result.isFinal) {
        const target = currentWord?.word.toLowerCase() || "";
        const spoken = text.toLowerCase().trim();
        const match = spoken.includes(target) || target.includes(spoken);
        setConfidence(match ? 90 : 30);
        setHistory((prev) => [...prev, { word: currentWord?.word || "", match }]);
        setIsRecording(false);
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    setIsRecording(true);
    setTranscript("");
    setConfidence(null);
  }, [currentWord]);

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  const speakWord = () => {
    if (!currentWord) return;
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const nextWord = () => {
    if (currentWordIdx < currentSet.words.length - 1) {
      setCurrentWordIdx((i) => i + 1);
    } else {
      setCurrentWordIdx(0);
    }
    setTranscript("");
    setConfidence(null);
  };

  const prevWord = () => {
    setCurrentWordIdx((i) => (i > 0 ? i - 1 : currentSet.words.length - 1));
    setTranscript("");
    setConfidence(null);
  };

  const correctCount = history.filter((h) => h.match).length;

  return (
    <DashboardShell title="Pronunciation Practice" subtitle="Improve your pronunciation with speech recognition">
      <div className="space-y-6">
        {/* Set Selector */}
        <div className="flex flex-wrap gap-2">
          {PRONUNCIATION_SETS.map((set, idx) => (
            <Button
              key={idx}
              variant={selectedSet === idx ? "hero" : "soft"}
              size="pill"
              onClick={() => { setSelectedSet(idx); setCurrentWordIdx(0); setTranscript(""); setConfidence(null); }}
            >
              {set.topic}
            </Button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Words Practiced</p>
            <p className="mt-1 text-2xl font-extrabold text-foreground">{history.length}</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Correct</p>
            <p className="mt-1 text-2xl font-extrabold text-success">{correctCount}</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Accuracy</p>
            <p className="mt-1 text-2xl font-extrabold text-foreground">
              {history.length > 0 ? Math.round((correctCount / history.length) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Word Card */}
        {currentWord && (
          <div className="rounded-3xl bg-card p-8 shadow-card text-center">
            <p className="text-sm text-muted-foreground">Word {currentWordIdx + 1} of {currentSet.words.length}</p>
            <p className="mt-3 text-4xl font-extrabold text-foreground">{currentWord.word}</p>
            <p className="mt-2 text-xl text-primary font-mono">{currentWord.ipa}</p>
            <p className="mt-1 text-sm text-muted-foreground">{currentWord.meaning}</p>
            <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-secondary p-3">
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
              <p className="text-sm text-foreground">{currentWord.tip}</p>
            </div>

            {/* Audio controls */}
            <div className="mt-6 flex justify-center gap-3">
              <Button onClick={speakWord} variant="soft" size="pill">
                <Volume2 className="mr-2 h-4 w-4" /> Listen
              </Button>
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "hero"}
                size="pill"
              >
                {isRecording ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                {isRecording ? "Stop" : "Record"}
              </Button>
              <Button onClick={nextWord} variant="soft" size="pill">
                Skip →
              </Button>
            </div>

            {/* Transcript */}
            {transcript && (
              <div className="mt-4 rounded-xl bg-secondary p-4">
                <p className="text-sm text-muted-foreground">You said:</p>
                <p className="text-lg font-bold text-foreground">"{transcript}"</p>
                {confidence !== null && (
                  <div className="mt-2 flex items-center justify-center gap-2">
                    {confidence >= 70 ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    )}
                    <span className={cn("text-sm font-semibold", confidence >= 70 ? "text-success" : "text-warning")}>
                      {confidence >= 70 ? "Good pronunciation!" : "Try again — listen and repeat"}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="rounded-3xl bg-card p-6 shadow-card">
            <h3 className="text-lg font-extrabold text-foreground mb-3">Practice History</h3>
            <div className="flex flex-wrap gap-2">
              {history.map((h, i) => (
                <Badge
                  key={i}
                  className={cn(h.match ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}
                >
                  {h.match ? "✓" : "✗"} {h.word}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
