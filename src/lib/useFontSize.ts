import { useCallback, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  applyFontSize,
  setFontSize as setFontSizeAction,
  type FontSize,
} from "@/app/store/slices/settingsSlice";

export function useFontSize() {
  const fontSize = useAppSelector((s) => s.settings.fontSize);
  const dispatch = useAppDispatch();

  useEffect(() => {
    applyFontSize(fontSize);
  }, [fontSize]);

  const setFontSize = useCallback((s: FontSize) => dispatch(setFontSizeAction(s)), [dispatch]);

  return { fontSize, setFontSize };
}
