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
  MicOff,
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
import { analyzeShadowing, extractYouTubeVideoId, type ShadowingAnalysis } from "@/lib/shadowing";

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

/* ====== KARAOKE TEXT ====== */

function HighlightedText({
  text,
  startTime,
  endTime,
  currentTime,
  isPlaying,
}: {
  text: string;
  startTime: number;
  endTime: number;
  currentTime: number;
  isPlaying: boolean;
}) {
  const words = text.split(/\s+/);
  const duration = endTime - startTime;
  const active = isPlaying && duration > 0 && currentTime >= startTime && currentTime <= endTime;
  const progress = active ? Math.max(0, Math.min(1, (currentTime - startTime) / duration)) : 0;
  const activeIdx = Math.floor(progress * words.length);

  return (
    <span className="inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5">
      {words.map((word, i) => {
        const completed = active && i < activeIdx;
        const current = active && i === activeIdx;
        return (
          <span
            key={`${i}-${word}`}
            className={cn(
              "inline-block whitespace-nowrap rounded-md px-1 py-0.5 transition-all duration-150",
              completed && "bg-primary/15 text-primary font-semibold",
              current && "bg-primary text-primary-foreground font-semibold shadow-sm",
              !active && "text-foreground/75",
              active && i > activeIdx && "text-muted-foreground/70",
            )}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
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
          className="group flex w-full items-center gap-4 rounded-2xl border-2 border-border bg-card p-4 text-left transition-all duration-200 hover:border-primary/40 hover:shadow-card hover:scale-[1.01] active:scale-[0.99]"
        >
          <span
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110",
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
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1" />
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
  const phraseListRef = useRef<HTMLDivElement>(null);

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

  /* Auto-scroll to current phrase */
  useEffect(() => {
    if (!phraseListRef.current) return;
    const el = phraseListRef.current.querySelector(`[data-phrase-index="${currentIndex}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentIndex]);

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
            videoId: extractYouTubeVideoId(selected.url) ?? selected.url,
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
          void speak(seg.text);
          toast.info("Playing this phrase with the built-in voice.");
        });
      return;
    }

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
  const isPhraseActive =
    segment &&
    hasUsableTiming(segment) &&
    currentTime >= segment.start &&
    currentTime <= segment.end;

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-col gap-2 px-1 py-1 lg:h-[calc(100dvh-148px)] sm:px-2">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
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
        <div className="flex items-center gap-2">
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
                <FileAudio className="mr-1 h-3 w-3" /> File
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* Two-column layout: Video + Subtitles side-by-side on desktop */}
      <div className="grid min-h-0 flex-1 gap-2 lg:min-h-[340px] lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        {/* Left: Video Player */}
        <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl bg-card shadow-card">
          {selected.sourceType === "youtube" ? (
            <div className="min-h-0 flex-1 bg-black">
              <div id={ytContainerId} className="h-full w-full" />
            </div>
          ) : (
            <div className="min-h-0 flex-1 bg-black">
              <video
                ref={videoRef}
                src={selected.url}
                controls
                preload="metadata"
                onTimeUpdate={syncFromMediaTime}
                onEnded={handleEndedVideo}
                onPause={() => setPlaying(false)}
                onPlay={() => setPlaying(true)}
                className="h-full w-full bg-black object-contain"
              />
            </div>
          )}
          <div className="flex items-center gap-2 border-t border-border px-3 py-1.5 sm:px-4">
            <p className="min-w-0 flex-1 truncate text-sm font-bold text-foreground">
              {selected.title}
            </p>
            <Button
              variant="soft"
              size="sm"
              className="rounded-full px-3.5"
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
              {playing ? (
                <Pause className="mr-1.5 h-3.5 w-3.5" />
              ) : (
                <Play className="mr-1.5 h-3.5 w-3.5" />
              )}
              {playing ? "Pause" : "Play"}
            </Button>
            <span className="text-xs tabular-nums text-muted-foreground">
              {formatTime(currentTime)}
            </span>
          </div>
        </div>

        {/* Right: Subtitles / Phrases list */}
        <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl bg-card shadow-card">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <h3 className="text-xs font-bold text-foreground">
              Subtitles
              <span className="ml-1.5 font-normal text-muted-foreground">
                {doneCount}/{segments.length}
              </span>
            </h3>
            {doneCount > 0 && (
              <Progress value={(doneCount / Math.max(1, segments.length)) * 100} className="w-20" />
            )}
          </div>
          <div
            ref={phraseListRef}
            className="min-h-0 flex-1 space-y-0.5 overflow-y-auto scroll-smooth p-1.5"
          >
            {segments.map((seg, i) => {
              const rec = records[i];
              const isCurrent = i === currentIndex;
              const active =
                seg.end > seg.start && currentTime >= seg.start && currentTime <= seg.end + 0.3;
              return (
                <button
                  key={i}
                  data-phrase-index={i}
                  onClick={() => setCurrentIndex(i)}
                  className={cn(
                    "group flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left transition-all duration-200",
                    isCurrent
                      ? "bg-primary/10 shadow-sm"
                      : active
                        ? "bg-primary/5"
                        : "hover:bg-muted/50",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors mt-0.5",
                      rec
                        ? rec.accuracy.accuracy >= 80
                          ? "bg-success/20 text-success"
                          : rec.accuracy.accuracy >= 50
                            ? "bg-warning/20 text-warning"
                            : "bg-destructive/20 text-destructive"
                        : isCurrent
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground",
                    )}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-[13px] leading-snug transition-all",
                        isCurrent
                          ? "font-bold text-foreground"
                          : "text-muted-foreground group-hover:text-foreground",
                      )}
                    >
                      {seg.text}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 pt-0.5">
                    {rec ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                    ) : seg.end > seg.start ? (
                      <span className="text-[10px] text-muted-foreground">
                        {formatTime(seg.start)}
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">TTS</span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playPhrase(i);
                      }}
                      title="Play this phrase"
                      className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <Volume2 className="h-3 w-3" />
                    </button>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Practice panel: phrase card + AI analysis, below the subtitles */}
      <div className="grid gap-2 lg:grid-cols-2">
        {segment && (
          <div className="flex min-h-0 flex-col rounded-2xl bg-card p-3 shadow-card">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Previous phrase"
                  disabled={currentIndex === 0}
                  onClick={() => currentIndex > 0 && setCurrentIndex((prev) => prev - 1)}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
                <Badge variant="secondary">
                  Phrase {currentIndex + 1} / {segments.length}
                </Badge>
                <button
                  type="button"
                  aria-label="Next phrase"
                  disabled={currentIndex >= segments.length - 1}
                  onClick={goNext}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                {recording && (
                  <span className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-0.5 text-[11px] font-bold text-destructive">
                    <span className="h-2 w-2 rounded-full bg-destructive animate-pulse-dot" />
                    Recording
                  </span>
                )}
                <span className="text-[11px] text-muted-foreground">
                  {segment.end > segment.start
                    ? `${formatTime(segment.start)} – ${formatTime(segment.end)}`
                    : "TTS playback"}
                </span>
              </div>
            </div>

            {/* Karaoke highlighted phrase */}
            <div className="my-2 px-1 text-center text-sm font-bold sm:text-base md:text-lg">
              <HighlightedText
                text={segment.text}
                startTime={segment.start}
                endTime={segment.end}
                currentTime={currentTime}
                isPlaying={!!isPhraseActive}
              />
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant="soft"
                size="sm"
                className="rounded-full px-4"
                onClick={() => playPhrase(currentIndex)}
              >
                <Play className="mr-1.5 h-3.5 w-3.5" /> Listen
              </Button>
              <Button
                variant={recording ? "destructive" : "hero"}
                size="sm"
                className={cn("rounded-full px-4", recording && "animate-pulse")}
                onClick={recording ? stopRecognition : beginRecording}
                disabled={!sttSupported && !recording}
              >
                {recording ? (
                  <>
                    <Square className="mr-1.5 h-3.5 w-3.5" /> Stop
                  </>
                ) : (
                  <>
                    <Mic className="mr-1.5 h-3.5 w-3.5" /> Repeat phrase
                  </>
                )}
              </Button>
              <Button
                variant="soft"
                size="sm"
                className="rounded-full px-4"
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
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Retry
              </Button>
            </div>

            {/* Interim transcript */}
            {recording && interimText && (
              <div className="mt-2 max-h-[18vh] overflow-y-auto rounded-xl border border-dashed border-primary/30 bg-primary/5 p-2">
                <p className="text-center text-[13px] text-muted-foreground italic">
                  {interimText}
                  <span className="animate-pulse">|</span>
                </p>
              </div>
            )}

            {/* Result */}
            {record && (
              <div
                className={cn(
                  "mt-2 rounded-xl p-3 text-center transition-colors",
                  record.accuracy.accuracy >= 80
                    ? "bg-success/10"
                    : record.accuracy.accuracy >= 50
                      ? "bg-warning/10"
                      : "bg-destructive/10",
                )}
              >
                <p
                  className={cn(
                    "text-2xl font-extrabold",
                    record.accuracy.accuracy >= 80
                      ? "text-success"
                      : record.accuracy.accuracy >= 50
                        ? "text-warning"
                        : "text-destructive",
                  )}
                >
                  {record.accuracy.accuracy}%
                </p>
                <p className="text-[11px] text-muted-foreground">phrase accuracy</p>
                {record.transcript && (
                  <p className="mt-1 max-h-[12vh] overflow-y-auto text-[13px] italic text-muted-foreground">
                    "{record.transcript}"
                  </p>
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
          </div>
        )}

        {/* AI analysis */}
        <div className="flex min-h-0 flex-col rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-foreground">AI Shadowing Analysis</h3>
              <p className="text-xs text-muted-foreground">
                Get pronunciation errors, scores and tips.
              </p>
            </div>
            <Button
              variant="hero"
              size="sm"
              className="rounded-full px-4"
              onClick={runAnalysis}
              disabled={analyzing || doneCount === 0}
            >
              {analyzing ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Analyze
                </>
              )}
            </Button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col justify-center">
            {analysis ? (
              <div className="mx-auto w-full max-h-[36vh] space-y-3 overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <ScoreBox label="Overall" value={analysis.overallScore} suffix="%" />
                  <ScoreBox label="Accuracy" value={analysis.accuracy} suffix="%" />
                  <ScoreBox label="Fluency" value={analysis.fluency} suffix="%" />
                  <ScoreBox label="Band" value={analysis.band} suffix="" />
                </div>

                {analysis.errors.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      Errors to fix
                    </h4>
                    <div className="mt-2 space-y-1.5">
                      {analysis.errors.map((err, i) => (
                        <div key={i} className="rounded-xl border border-border p-2">
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
                          {err.note && (
                            <p className="mt-1 text-xs text-muted-foreground">{err.note}</p>
                          )}
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
                    <ul className="mt-1.5 space-y-1">
                      {analysis.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px] text-foreground">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.tips.length > 0 && (
                  <div className="rounded-xl bg-secondary/40 p-3">
                    <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      Coach's advice
                    </h4>
                    <ul className="mt-1.5 space-y-1">
                      {analysis.tips.map((t, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px] text-foreground">
                          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button
                  variant="soft"
                  size="sm"
                  className="w-full rounded-full"
                  onClick={() => {
                    setAnalysis(null);
                    setRecords({});
                    setCurrentIndex(0);
                  }}
                >
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Practice again
                </Button>
              </div>
            ) : (
              <div className="py-3 text-center">
                <Sparkles className="mx-auto h-5 w-5 text-primary/60" />
                <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">
                  Repeat a phrase, then tap{" "}
                  <span className="font-semibold text-foreground">Analyze</span> to get your score,
                  errors and tips.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {!sttSupported && (
        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <MicOff className="h-3 w-3" /> Speech recognition is not supported in this browser.
        </p>
      )}
    </div>
  );
}

function ScoreBox({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  const tone = value >= 80 ? "text-success" : value >= 50 ? "text-warning" : "text-destructive";
  return (
    <div className="rounded-xl bg-muted/50 p-2.5 text-center">
      <p className={cn("text-xl font-extrabold", tone)}>
        {value}
        {suffix}
      </p>
      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
