"use client";

import { create } from "zustand";

export type SessionMode = "none" | "guest" | "authenticated";
export type AgeGroup = "under18" | "18plus";
export type LanguageMode = "zhHant_zhHans" | "en_zhHans" | "en_only";
export type ExamLanguage = "zhHant" | "en";

const GUEST_MODULES = new Set(["M01", "M02"]);
const GUEST_EXAMS = new Set(["MOCK-01"]);

interface AppState {
  sessionMode: SessionMode;
  ageGroup: AgeGroup | null;
  languageMode: LanguageMode;
  examLanguage: ExamLanguage;

  enterGuestMode: (age: AgeGroup) => void;
  enterAuthMode: (prefs?: { languageMode?: LanguageMode; examLanguage?: ExamLanguage }) => void;
  exitSession: () => void;
  setLanguageMode: (mode: LanguageMode) => void;
  setExamLanguage: (lang: ExamLanguage) => void;
  setAgeGroup: (age: AgeGroup) => void;

  isModuleUnlocked: (moduleId: string) => boolean;
  isExamUnlocked: (examId: string) => boolean;
}

export const useAppStore = create<AppState>((set, get) => ({
  sessionMode: "none",
  ageGroup: null,
  languageMode: "en_zhHans",
  examLanguage: "en",

  enterGuestMode: (age) =>
    set({
      sessionMode: "guest",
      ageGroup: age,
      languageMode: "en_zhHans",
      examLanguage: "en",
    }),

  enterAuthMode: (prefs) =>
    set({
      sessionMode: "authenticated",
      ageGroup: null,
      languageMode: prefs?.languageMode ?? "en_zhHans",
      examLanguage: prefs?.examLanguage ?? "en",
    }),

  exitSession: () =>
    set({
      sessionMode: "none",
      ageGroup: null,
      languageMode: "en_zhHans",
      examLanguage: "en",
    }),

  setLanguageMode: (mode) => set({ languageMode: mode }),
  setExamLanguage: (lang) => set({ examLanguage: lang }),
  setAgeGroup: (age) => set({ ageGroup: age }),

  isModuleUnlocked: (moduleId) => {
    const { sessionMode } = get();
    if (sessionMode === "authenticated") return true;
    if (sessionMode === "guest") return GUEST_MODULES.has(moduleId);
    return false;
  },

  isExamUnlocked: (examId) => {
    const { sessionMode } = get();
    if (sessionMode === "authenticated") return true;
    if (sessionMode === "guest") return GUEST_EXAMS.has(examId);
    return false;
  },
}));
