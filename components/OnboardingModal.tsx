"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { saveLanguagePreference } from "@/lib/firestore";
import { LANGUAGE_MODE_LABELS } from "@/lib/language";
import { useT } from "@/lib/useT";
import type { AgeGroup, LanguageMode } from "@/store/useAppStore";

export function OnboardingModal({ onClose }: { onClose: () => void }) {
  const t = useT();
  const user = useAuthStore((s) => s.user);
  const setAgeGroup = useAppStore((s) => s.setAgeGroup);
  const setLanguageMode = useAppStore((s) => s.setLanguageMode);
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedAge, setSelectedAge] = useState<AgeGroup | null>(null);
  const [selectedLang, setSelectedLang] = useState<LanguageMode>("en_zhHans");

  const handleFinish = async () => {
    if (selectedAge) setAgeGroup(selectedAge);
    setLanguageMode(selectedLang);

    // Save to Firestore
    if (user) {
      try {
        await saveLanguagePreference(user.uid, {
          languageMode: selectedLang,
          examLanguage: selectedLang === "zhHant_zhHans" ? "zhHant" : "en",
        });
      } catch { /* ignore */ }
    }

    // Mark onboarding complete
    if (typeof window !== "undefined") {
      localStorage.setItem("onboarding-done", "true");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
        {/* Step indicators */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className={`h-2 w-8 rounded-full ${step >= 1 ? "bg-primary" : "bg-gray-200"}`} />
          <div className={`h-2 w-8 rounded-full ${step >= 2 ? "bg-primary" : "bg-gray-200"}`} />
        </div>

        {step === 1 && (
          <>
            <h2 className="text-center text-xl font-bold text-text-dark">
              {t("age.title")}
            </h2>
            <p className="mt-1 text-center text-sm text-text-gray">
              {t("age.subtitle")}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedAge("under18")}
                className={`group flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all ${
                  selectedAge === "under18"
                    ? "border-primary bg-primary-light"
                    : "border-border bg-white hover:border-primary/30"
                }`}
              >
                <span className="text-3xl">🎓</span>
                <span className="text-sm font-semibold text-text-dark">{t("age.under18")}</span>
                <span className="text-xs text-text-gray">{t("age.under18exam")}</span>
              </button>

              <button
                onClick={() => setSelectedAge("18plus")}
                className={`group flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all ${
                  selectedAge === "18plus"
                    ? "border-primary bg-primary-light"
                    : "border-border bg-white hover:border-primary/30"
                }`}
              >
                <span className="text-3xl">🚗</span>
                <span className="text-sm font-semibold text-text-dark">{t("age.18plus")}</span>
                <span className="text-xs text-text-gray">{t("age.18plusExam")}</span>
              </button>
            </div>

            <button
              onClick={() => selectedAge && setStep(2)}
              disabled={!selectedAge}
              className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-all hover:bg-primary/90 disabled:opacity-40"
            >
              {t("module.next")} →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-center text-xl font-bold text-text-dark">
              {t("nav.language")}
            </h2>
            <p className="mt-1 text-center text-sm text-text-gray">
              Choose your preferred study language
            </p>

            <div className="mt-6 space-y-3">
              {(Object.keys(LANGUAGE_MODE_LABELS) as LanguageMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSelectedLang(mode)}
                  className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                    selectedLang === mode
                      ? "border-primary bg-primary-light"
                      : "border-border bg-white hover:border-primary/30"
                  }`}
                >
                  <span className="text-2xl">
                    {mode === "zhHant_zhHans" ? "繁" : mode === "en_zhHans" ? "A文" : "EN"}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-text-dark">
                      {LANGUAGE_MODE_LABELS[mode].en}
                    </p>
                    <p className="text-xs text-text-gray">
                      {LANGUAGE_MODE_LABELS[mode].zh}
                    </p>
                  </div>
                  {selectedLang === mode && (
                    <svg className="ml-auto h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 rounded-xl border-2 border-border py-3 text-sm font-medium text-text-gray hover:bg-gray-50"
              >
                ← {t("module.prev")}
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-all hover:bg-primary/90"
              >
                ✓ {t("module.done")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
