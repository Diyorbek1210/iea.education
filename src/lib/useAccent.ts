import { useState, useEffect, useCallback } from "react";

export type Accent = "american" | "british" | "australian";

const ACCENT_KEY = "iea_accent";

const ACCENT_CONFIG: Record<Accent, { lang: string; label: string; flag: string }> = {
  american: { lang: "en-US", label: "American English", flag: "🇺🇸" },
  british: { lang: "en-GB", label: "British English", flag: "🇬🇧" },
  australian: { lang: "en-AU", label: "Australian English", flag: "🇦🇺" },
};

function getStored(): Accent {
  if (typeof window === "undefined") return "british";
  return (localStorage.getItem(ACCENT_KEY) as Accent) || "british";
}

export function useAccent() {
  const [accent, setAccentState] = useState<Accent>(getStored);

  useEffect(() => {
    localStorage.setItem(ACCENT_KEY, accent);
  }, [accent]);

  const setAccent = useCallback((a: Accent) => setAccentState(a), []);

  return {
    accent,
    setAccent,
    config: ACCENT_CONFIG[accent],
    allAccents: Object.entries(ACCENT_CONFIG).map(([key, val]) => ({
      id: key as Accent,
      ...val,
    })),
  };
}
