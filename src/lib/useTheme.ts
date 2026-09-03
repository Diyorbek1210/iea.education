import { useCallback, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { applyTheme, setTheme as setThemeAction, type Theme } from "@/app/store/slices/settingsSlice";

export function useTheme() {
  const theme = useAppSelector((s) => s.settings.theme);
  const dispatch = useAppDispatch();

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => dispatch(setThemeAction(t)), [dispatch]);

  return { theme, setTheme };
}
