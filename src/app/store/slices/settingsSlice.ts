import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Theme = "light" | "dark" | "system";
export type FontSize = "small" | "medium" | "large";

const THEME_KEY = "iea_theme";
const FONT_SIZE_KEY = "iea_font_size";

export const SIZE_MAP: Record<FontSize, string> = {
  small: "14px",
  medium: "16px",
  large: "18px",
};

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  return (localStorage.getItem(THEME_KEY) as Theme) || "system";
}

function getStoredFontSize(): FontSize {
  if (typeof window === "undefined") return "small";
  return (localStorage.getItem(FONT_SIZE_KEY) as FontSize) || "small";
}

export function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  const resolved = theme === "system" ? getSystemTheme() : theme;
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

export function applyFontSize(fontSize: FontSize) {
  document.documentElement.style.fontSize = SIZE_MAP[fontSize];
}

interface SettingsState {
  theme: Theme;
  fontSize: FontSize;
}

const initialState: SettingsState = {
  theme: getStoredTheme(),
  fontSize: getStoredFontSize(),
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem(THEME_KEY, action.payload);
        applyTheme(action.payload);
      }
    },
    setFontSize(state, action: PayloadAction<FontSize>) {
      state.fontSize = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem(FONT_SIZE_KEY, action.payload);
        applyFontSize(action.payload);
      }
    },
  },
});

export const { setTheme, setFontSize } = settingsSlice.actions;
export default settingsSlice.reducer;
