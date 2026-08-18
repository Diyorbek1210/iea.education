import { useState, useEffect, useCallback } from "react";

type FontSize = "small" | "medium" | "large";

const FONT_SIZE_KEY = "iea_font_size";

const SIZE_MAP: Record<FontSize, string> = {
  small: "14px",
  medium: "16px",
  large: "18px",
};

function getStored(): FontSize {
  if (typeof window === "undefined") return "medium";
  return (localStorage.getItem(FONT_SIZE_KEY) as FontSize) || "medium";
}

export function useFontSize() {
  const [fontSize, setFontSizeState] = useState<FontSize>(getStored);

  useEffect(() => {
    document.documentElement.style.fontSize = SIZE_MAP[fontSize];
    localStorage.setItem(FONT_SIZE_KEY, fontSize);
    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [fontSize]);

  const setFontSize = useCallback((s: FontSize) => setFontSizeState(s), []);

  return { fontSize, setFontSize };
}
