import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Captions,
  CheckCircle2,
  FileAudio,
  ListMusic,
  Loader2,
  Mic,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Square,
  Volume2,
  XCircle,
  Youtube,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Progress } from "@/shared/ui/progress";
import { cn } from "@/shared/lib/utils";
import { useSpeechSynthesis } from "@/components/mocktest/useSpeechSynthesis";
import type { ShadowingClip, ShadowingSegment } from "@/shared/types/types";
import { listShadowingClips } from "@/lib/db";
import { analyzeShadowing, type ShadowingAnalysis } from "@/lib/shadowing";

const YT_STATES = { ENDED: 0, PLAYING: 1, PAUSED: 2 };

interface YTPlayer {
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  destroy: () => void;
}

let ytApiPromise: Promise<void> | null = null;
function loadYouTubeApi(): Promise<void> {
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    if (win.YT?.Player) {
      resolve();
      return;
    }
    const prev = win.onYouTubeIframeAPIReady;
    win.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.onerror = () => {
      win.onYouTubeIframeAPIReady = prev;
      reject(new Error("Could not load the YouTube player"));
    };
    document.head.appendChild(tag);
  });
  return ytApiPromise;
}

function getSpeechRecognitionCtor() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as any;
  const Ctor = win["SpeechRecognition"] ?? win["webkitSpeechRecognition"];
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
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

interface WordAccuracy {
  accuracy: number;
  matched: string[];
  missed: string[];
}

function computeWordAccuracy(original: string, spoken: string): WordAccuracy {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(Boolean);
  const origWords = normalize(original);
  const spokenSet = new Set(normalize(spoken));
  const matched = origWords.filter((w) => spokenSet.has(w));
  const missed = origWords.filter((w) => !spokenSet.has(w));
  const accuracy = origWords.length > 0 ? Math.round((matched.length / origWords.length) * 100) : 0;
  return { accuracy, matched, missed };
}

interface PhraseRecord {
  transcript: string;
  accuracy: WordAccuracy;
}

/* ====== CLIP SELECTOR ====== */

function ClipSelector({
  clips,
  onSelect,
}: {
  clips: ShadowingClip[];
  onSelect: (c: ShadowingClip) => void;
}) {
  if (clips.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl bg-card p-8 text-center shadow-card">
        <ListMusic className="mx-auto h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 font-bold text-foreground">No shadowing clips yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          The admin has not added any shadowing material yet. Clips can come from a YouTube video
          (subtitles extracted automatically) or an uploaded audio/video file.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-3">
      <p className="text-sm text-muted-foreground text-center">
        Pick a clip to listen, repeat and get AI feedback.
      </p>
      {clips.map((clip) => (
        <button
          key={clip.id}
          onClick={() => onSelect(clip)}
          className="flex w-full items-center gap-4 rounded-2xl border-2 border-border bg-card p-4 text-left transition-all hover:border-primary/50 hover:shadow-card"
        >
          <span
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
              clip.sourceType === "youtube"
                ? "bg-red-500/10 text-red-500"
                : "bg-primary/10 text-primary",
            )}
          >
            {clip.sourceType === "youtube" ? (
              <Youtube className="h-6 w-6" />
            ) : (
              <FileAudio className="h-6 w-6" />
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold text-foreground">{clip.title}</span>
            <span className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
              <Captions className="h-3 w-3" />
              {clip.segments.length} phrases ·{" "}
              {clip.segments.reduce(
                (sum, seg) => sum + seg.text.split(/\s+/).filter(Boolean).length,
                0,
              )}{" "}
              words
            </span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      ))}
    </div>
  );
}

/* ====== MAIN COMPONENT ====== */

export function ShadowingPractice() {
  const { speak, stop: stopSpeaking } = useSpeechSynthesis();
  const [clips, setClips] = useState<ShadowingClip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ShadowingClip | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [records, setRecords] = useState<Record<number, PhraseRecord>>({});
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [sttSupported, setSttSupported] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ShadowingAnalysis | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef("");
  const stoppedByUserRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const ytPlayerRef = useRef<YTPlayer | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ytContainerId = "shadowing-yt-player";
  const highlightPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setSttSupported(getSpeechRecognitionCtor() !== undefined);
    listShadowingClips()
      .then(setClips)
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load clips"))
      .finally(() => setLoading(false));
  }, []);

  const segments = selected?.segments ?? [];
  const segment = segments[currentIndex];
  const hasRecord = segment ? records[currentIndex] !== undefined : false;
  const record = segment ? records[currentIndex] : undefined;

  const syncFromMediaTime = useCallback(() => {
    if (selected?.sourceType === "file" && videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    } else if (selected?.sourceType === "youtube" && ytPlayerRef.current) {
      setCurrentTime(ytPlayerRef.current.getCurrentTime());
    }
  }, [selected]);

  useEffect(() => {
    if (!selected) return;
    setRecords({});
    setAnalysis(null);
    setCurrentIndex(0);
    setCurrentTime(0);
    setInterimText("");
    setRecording(false);
    stopSpeaking();
    if (pollRef.current) clearInterval(pollRef.current);
    if (highlightPollRef.current) clearInterval(highlightPollRef.current);
    ytPlayerRef.current?.destroy();
    ytPlayerRef.current = null;

    if (selected.sourceType === "youtube") {
      let cancelled = false;
      loadYouTubeApi()
        .then(() => {
          if (cancelled) return;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const win = window as any;
          const options = {
            videoId: selected.url.split("/").pop()?.split("?")[0] ?? selected.url,
            width: "100%",
            height: "100%",
            playerVars: { playsinline: 1, rel: 0 },
            events: {
              onReady: (e: { target: YTPlayer }) => {
                ytPlayerRef.current = e.target;
              },
              onStateChange: (e: { data: number }) => {
                setPlaying(e.data === YT_STATES.PLAYING);
                if (e.data === YT_STATES.PLAYING && !highlightPollRef.current) {
                  highlightPollRef.current = setInterval(syncFromMediaTime, 300);
                }
                if (e.data !== YT_STATES.PLAYING && highlightPollRef.current) {
                  clearInterval(highlightPollRef.current);
                  highlightPollRef.current = null;
                }
                if (e.data === YT_STATES.ENDED) {
                  setCurrentTime(ytPlayerRef.current?.getDuration() ?? 0);
                }
              },
            },
          };
          ytPlayerRef.current = new win.YT.Player(ytContainerId, options);
        })
        .catch((err: unknown) =>
          toast.error(err instanceof Error ? err.message : "Could not load YouTube player"),
        );
      return () => {
        cancelled = true;
        if (highlightPollRef.current) clearInterval(highlightPollRef.current);
        ytPlayerRef.current?.destroy();
        ytPlayerRef.current = null;
      };
    }

    // File source: watch the native video element for playback time
    const timer = setInterval(syncFromMediaTime, 300);
    highlightPollRef.current = timer;
    return () => {
      clearInterval(timer);
      if (highlightPollRef.current === timer) highlightPollRef.current = null;
    };
  }, [selected, syncFromMediaTime, stopSpeaking]);

  useEffect(() => {
    return () => {
      stopSpeaking();
      if (pollRef.current) clearInterval(pollRef.current);
      if (highlightPollRef.current) clearInterval(highlightPollRef.current);
      recognitionRef.current?.stop();
    };
  }, [stopSpeaking]);

  function stopRecognition() {
    stoppedByUserRef.current = true;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setRecording(false);
  }

  function beginRecording() {
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
    transcriptRef.current = "";
    setInterimText("");

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
        setRecording(false);
        const final = transcriptRef.current.trim();
        if (final) {
          setInterimText("");
          if (segment) {
            const accuracy = computeWordAccuracy(segment.text, final);
            setRecords((prev) => ({ ...prev, [currentIndex]: { transcript: final, accuracy } }));
            const missCount = accuracy.missed.length;
            if (missCount === 0) toast.success("Perfect shadowing phrase!");
            else if (missCount <= 2) toast.success("Great, a few words to polish.");
            else toast.info("Keep practicing — some words were missed.");
          }
        }
      };

      recognition.start();
      setRecording(true);
    } catch {
      setRecording(false);
    }
  }

  function hasPrerecognized(idx: number): boolean {
    return records[idx] !== undefined;
  }

  function hasUsableTiming(seg: ShadowingSegment): boolean {
    return seg.end > seg.start && seg.end > 0;
  }

  function playPhrase(idx: number) {
    const seg = segments[idx];
    if (!seg) return;
    setCurrentIndex(idx);
    setAnalysis(null);
    const target = selected?.sourceType;

    if (target === "youtube" && ytPlayerRef.current && hasUsableTiming(seg)) {
      ytPlayerRef.current.seekTo(seg.start, true);
      ytPlayerRef.current.playVideo();
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(() => {
        const now = ytPlayerRef.current?.getCurrentTime() ?? 0;
        setCurrentTime(now);
        if (now >= seg.end) {
          if (pollRef.current) clearInterval(pollRef.current);
          ytPlayerRef.current?.pauseVideo();
        }
      }, 200);
      return;
    }

    if (target === "file" && videoRef.current && hasUsableTiming(seg)) {
      videoRef.current.currentTime = seg.start;
      videoRef.current
        .play()
        .then(() => {
          if (pollRef.current) clearInterval(pollRef.current);
          pollRef.current = setInterval(() => {
            const now = videoRef.current?.currentTime ?? 0;
            setCurrentTime(now);
            if (now >= seg.end) {
              if (pollRef.current) clearInterval(pollRef.current);
              videoRef.current?.pause();
            }
          }, 200);
        })
        .catch(() => {
          // Video not playable yet — fall back to TTS so shadowing still works.
          void speak(seg.text);
          toast.info("Playing this phrase with the built-in voice.");
        });
      return;
    }

    // No precise timing available — read the phrase aloud with TTS.
    void speak(seg.text);
  }

  function handleEndedVideo() {
    if (pollRef.current) clearInterval(pollRef.current);
  }

  function goNext() {
    if (currentIndex < segments.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      toast.info("Reached the end of the clip.");
    }
  }

  async function runAnalysis() {
    const spokenEntries = segments
      .map((seg, i) => ({ seg, rec: records[i] }))
      .filter((item): item is { seg: (typeof segments)[number]; rec: PhraseRecord } => !!item.rec);
    if (spokenEntries.length === 0) {
      toast.error("Record at least one phrase before asking for AI analysis.");
      return;
    }
    setAnalyzing(true);
    try {
      const reference = segments
        .map((s) => s.text)
        .join(" ")
        .slice(0, 9000);
      const spoken = spokenEntries
        .map((e) => e.rec.transcript)
        .join(" ")
        .slice(0, 9000);
      const result = await analyzeShadowing({ data: { reference, spoken } });
      setAnalysis(result);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI analysis failed. Try again.");
    } finally {
      setAnalyzing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading shadowing clips...</p>
      </div>
    );
  }

  if (!selected) {
    return (
      <div className="py-4">
        <ClipSelector clips={clips} onSelect={setSelected} />
      </div>
    );
  }

  const doneCount = segments.filter((_, i) => hasPrerecognized(i)).length;

  return (
    <div className="mx-auto max-w-3xl space-y-5 py-2">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            stopSpeaking();
            if (pollRef.current) clearInterval(pollRef.current);
            setSelected(null);
            setAnalysis(null);
            setRecords({});
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> All clips
        </Button>
        <Badge
          variant="secondary"
          className={cn(selected.sourceType === "youtube" ? "text-red-500" : "text-primary")}
        >
          {selected.sourceType === "youtube" ? (
            <>
              <Youtube className="mr-1 h-3 w-3" /> YouTube
            </>
          ) : (
            <>
              <FileAudio className="mr-1 h-3 w-3" /> Video / Audio file
            </>
          )}
        </Badge>
      </div>

      {/* Player */}
      <div className="overflow-hidden rounded-3xl bg-card shadow-card">
        {selected.sourceType === "youtube" ? (
          <div className="aspect-video w-full bg-black">
            <div id={ytContainerId} className="h-full w-full" />
          </div>
        ) : (
          <video
            ref={videoRef}
            src={selected.url}
            controls
            preload="metadata"
            onTimeUpdate={syncFromMediaTime}
            onEnded={handleEndedVideo}
            onPause={() => setPlaying(false)}
            onPlay={() => setPlaying(true)}
            className="aspect-video w-full bg-black"
          />
        )}
        <div className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-3">
          <p className="min-w-0 flex-1 truncate text-sm font-bold text-foreground">
            {selected.title}
          </p>
          <Button
            variant="soft"
            size="pill"
            onClick={() =>
              playing
                ? ytPlayerRef.current
                  ? ytPlayerRef.current.pauseVideo()
                  : videoRef.current?.pause()
                : ytPlayerRef.current
                  ? ytPlayerRef.current.playVideo()
                  : videoRef.current?.play()
            }
          >
            {playing ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {playing ? "Pause" : "Play"}
          </Button>
          <span className="text-xs tabular-nums text-muted-foreground">
            {formatTime(currentTime)}
          </span>
        </div>
      </div>

      {/* Phrases */}
      <div className="rounded-3xl bg-card p-4 shadow-card">
        <div className="flex items-center justify-between px-1 pb-3">
          <h3 className="text-sm font-bold text-foreground">
            Phrases{" "}
            <span className="font-normal text-muted-foreground">
              ({doneCount}/{segments.length} recorded)
            </span>
          </h3>
          {doneCount > 0 && (
            <Progress value={(doneCount / Math.max(1, segments.length)) * 100} className="w-32" />
          )}
        </div>
        <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
          {segments.map((seg, i) => {
            const rec = records[i];
            const isCurrent = i === currentIndex;
            const active =
              seg.end > seg.start && currentTime >= seg.start && currentTime <= seg.end + 0.3;
            return (
              <div
                key={i}
                className={cn(
                  "group flex items-center gap-2 rounded-xl border px-3 py-2 transition-colors",
                  isCurrent ? "border-primary bg-primary/5" : "border-border",
                  active && "bg-primary/10",
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                    rec
                      ? rec.accuracy.accuracy >= 80
                        ? "bg-success/15 text-success"
                        : rec.accuracy.accuracy >= 50
                          ? "bg-warning/15 text-warning"
                          : "bg-destructive/15 text-destructive"
                      : "bg-secondary text-secondary-foreground",
                  )}
                >
                  {i + 1}
                </span>
                <button
                  onClick={() => setCurrentIndex(i)}
                  className="min-w-0 flex-1 text-left"
                  title="Select phrase"
                >
                  <p
                    className={cn(
                      "truncate text-sm",
                      isCurrent ? "font-bold text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {seg.text}
                  </p>
                </button>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => playPhrase(i)}
                    title="Play this phrase"
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                  {rec ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : seg.end > seg.start ? (
                    <span className="text-[11px] text-muted-foreground">
                      {formatTime(seg.start)}
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current phrase practice */}
      {segment && (
        <div className="rounded-3xl bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">
              Phrase {currentIndex + 1} / {segments.length}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {segment.end > segment.start
                ? `${formatTime(segment.start)} – ${formatTime(segment.end)}`
                : "no precise timing — listen with the built-in voice"}
            </span>
          </div>

          <p className="mt-3 text-center text-lg font-bold text-foreground leading-relaxed">
            {segment.text}
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Button variant="soft" size="pill" onClick={() => playPhrase(currentIndex)}>
              <Play className="mr-2 h-4 w-4" /> Listen
            </Button>
            <Button
              variant={recording ? "destructive" : "hero"}
              size="pill"
              onClick={recording ? stopRecognition : beginRecording}
              disabled={!sttSupported && !recording}
            >
              {recording ? (
                <>
                  <Square className="mr-2 h-4 w-4" /> Stop recording
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" /> Repeat phrase
                </>
              )}
            </Button>
            <Button
              variant="soft"
              size="pill"
              onClick={() => {
                stopSpeaking();
                stopRecognition();
                const copy = { ...records };
                delete copy[currentIndex];
                setRecords(copy);
                setInterimText("");
              }}
              disabled={!hasRecord && !recording}
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Retry
            </Button>
          </div>

          {recording && interimText && (
            <div className="mt-4 rounded-xl bg-secondary/50 p-3">
              <p className="text-sm text-muted-foreground italic">{interimText}...</p>
            </div>
          )}

          {record && (
            <div
              className={cn(
                "mt-4 rounded-xl p-3 text-center",
                record.accuracy.accuracy >= 80
                  ? "bg-success/10"
                  : record.accuracy.accuracy >= 50
                    ? "bg-warning/10"
                    : "bg-destructive/10",
              )}
            >
              <p className="text-2xl font-extrabold text-foreground">{record.accuracy.accuracy}%</p>
              <p className="text-xs text-muted-foreground">phrase accuracy</p>
              {record.transcript && (
                <p className="mt-1 text-sm italic text-muted-foreground">"{record.transcript}"</p>
              )}
              {record.accuracy.missed.length > 0 && (
                <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                  {record.accuracy.missed.map((w, i) => (
                    <Badge key={i} variant="secondary" className="text-destructive">
                      {w}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-4 flex justify-between gap-2">
            <Button
              variant="ghost"
              size="pill"
              onClick={() => currentIndex > 0 && setCurrentIndex((prev) => prev - 1)}
              disabled={currentIndex === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button
              variant="ghost"
              size="pill"
              onClick={goNext}
              disabled={currentIndex >= segments.length - 1}
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* AI analysis */}
      <div className="rounded-3xl bg-card p-5 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">AI Shadowing Analysis</h3>
            <p className="text-xs text-muted-foreground">
              Get a score, pronunciation errors and tips on your shadowing.
            </p>
          </div>
          <Button
            variant="hero"
            size="pill"
            onClick={runAnalysis}
            disabled={analyzing || doneCount === 0}
          >
            {analyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Analyze with AI
              </>
            )}
          </Button>
        </div>

        {analysis && (
          <div className="mt-5 space-y-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ScoreBox label="Overall" value={analysis.overallScore} suffix="%" />
              <ScoreBox label="Accuracy" value={analysis.accuracy} suffix="%" />
              <ScoreBox label="Fluency" value={analysis.fluency} suffix="%" />
              <ScoreBox label="Estimated band" value={analysis.band} suffix="" />
            </div>

            {analysis.errors.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Errors to fix
                </h4>
                <div className="mt-2 space-y-2">
                  {analysis.errors.map((err, i) => (
                    <div key={i} className="rounded-xl border border-border p-3">
                      <div className="flex items-center gap-2 text-sm">
                        {err.expected && (
                          <span className="text-xs text-muted-foreground line-through">
                            {err.expected}
                          </span>
                        )}
                        <ArrowRight className="h-3 w-3 text-foreground" />
                        <span className="font-bold text-foreground">
                          {err.spoken || err.correction}
                        </span>
                      </div>
                      {err.note && <p className="mt-1 text-xs text-muted-foreground">{err.note}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.strengths.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Strengths
                </h4>
                <ul className="mt-2 space-y-1.5">
                  {analysis.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.tips.length > 0 && (
              <div className="rounded-xl bg-secondary/40 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Coach's advice
                </h4>
                <ul className="mt-2 space-y-1.5">
                  {analysis.tips.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              variant="soft"
              size="pill"
              className="w-full"
              onClick={() => {
                setAnalysis(null);
                setRecords({});
                setCurrentIndex(0);
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Practice again
            </Button>
          </div>
        )}
      </div>

      {!sttSupported && (
        <p className="text-center text-xs text-muted-foreground">
          Speech recognition isn't supported in this browser, so you cannot record your voice here.
        </p>
      )}
    </div>
  );
}

function ScoreBox({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  const tone = value >= 80 ? "text-success" : value >= 50 ? "text-warning" : "text-destructive";
  return (
    <div className="rounded-2xl bg-muted/50 p-4 text-center">
      <p className={cn("text-3xl font-extrabold", tone)}>
        {value}
        {suffix}
      </p>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
