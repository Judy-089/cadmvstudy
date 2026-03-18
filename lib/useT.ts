"use client";

import { useUILanguageStore } from "@/store/useUILanguageStore";
import { getUIString, type UIStringKey } from "@/lib/ui-strings";
import { useCallback } from "react";

/**
 * Hook that returns a translation function for the current UI language.
 * Usage: const t = useT(); t("nav.home") → "Home" | "首頁" | "首页"
 */
export function useT() {
  const uiLang = useUILanguageStore((s) => s.uiLang);
  return useCallback(
    (key: UIStringKey) => getUIString(key, uiLang),
    [uiLang]
  );
}
