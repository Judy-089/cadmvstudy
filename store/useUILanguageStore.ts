"use client";

import { create } from "zustand";

export type UILanguage = "en" | "zhHant" | "zhHans";

interface UILanguageState {
  uiLang: UILanguage;
  hydrated: boolean;
  setUILang: (lang: UILanguage) => void;
  hydrate: () => void;
}

export const useUILanguageStore = create<UILanguageState>((set) => ({
  // Always start with "en" to match server render (prevents hydration mismatch)
  uiLang: "en",
  hydrated: false,
  setUILang: (lang) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ui-lang", lang);
    }
    set({ uiLang: lang });
  },
  hydrate: () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ui-lang");
      if (stored === "zhHant" || stored === "zhHans" || stored === "en") {
        set({ uiLang: stored, hydrated: true });
      } else {
        set({ hydrated: true });
      }
    }
  },
}));
