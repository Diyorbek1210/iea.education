import { useCallback, useEffect, useRef, useState } from "react";

import { synthesizeSpeech } from "@/lib/tts";

function pickEnglishVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => /^en/i.test(v.lang) && /google|natural|online/i.test(v.name)) ??
    voices.find((v) => /^en-US/i.test(v.lang)) ??
    voices.find((v) => /^en/i.test(v.lang))
  );
}

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const browserSupported = typeof window !== "undefined" && "speechSynthesis" in window;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!browserSupported) return;
    // Voice list loads asynchronously — priming it here means the browser fallback
    // can already pick a good voice on its very first use.
    window.speechSynthesis.getVoices();
    const onVoicesChanged = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
  }, [browserSupported]);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      clearInterval(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const speakWithBrowser = useCallback(
    (text: string) => {
      if (!browserSupported) return;
      window.speechSynthesis.cancel();
      clearResumeTimer();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;
      const voice = pickEnglishVoice();
      if (voice) utterance.voice = voice;

      utterance.onstart = () => {
        setIsSpeaking(true);
        // Chrome silently pauses speechSynthesis after ~15s on longer utterances
        // unless nudged with resume() — this keeps long listening passages playing.
        resumeTimerRef.current = setInterval(() => {
          if (window.speechSynthesis.speaking) window.speechSynthesis.resume();
        }, 4000);
      };
      const end = () => {
        setIsSpeaking(false);
        clearResumeTimer();
      };
      utterance.onend = end;
      utterance.onerror = end;

      utteranceRef.current = utterance;
      // A short delay avoids a Chrome race where speak() called immediately after
      // cancel() is silently dropped.
      setTimeout(() => window.speechSynthesis.speak(utterance), 50);
    },
    [browserSupported, clearResumeTimer],
  );

  const speak = useCallback(
    async (text: string) => {
      const requestId = ++requestIdRef.current;
      audioRef.current?.pause();
      if (browserSupported) window.speechSynthesis.cancel();
      clearResumeTimer();

      try {
        const { audioContent } = await synthesizeSpeech({ data: { text } });
        if (requestId !== requestIdRef.current) return; // superseded by a newer speak() call

        const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
        audioRef.current = audio;
        audio.onplay = () => setIsSpeaking(true);
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => setIsSpeaking(false);
        await audio.play();
      } catch {
        // No API key configured, quota exceeded, or a network error — fall back to
        // the browser's built-in voice so listening/speaking still works.
        if (requestId !== requestIdRef.current) return;
        speakWithBrowser(text);
      }
    },
    [browserSupported, clearResumeTimer, speakWithBrowser],
  );

  const stop = useCallback(() => {
    requestIdRef.current++; // invalidate any in-flight cloud request
    audioRef.current?.pause();
    if (browserSupported) window.speechSynthesis.cancel();
    clearResumeTimer();
    setIsSpeaking(false);
  }, [browserSupported, clearResumeTimer]);

  useEffect(() => stop, [stop]);

  return { speak, stop, isSpeaking, supported: true };
}
