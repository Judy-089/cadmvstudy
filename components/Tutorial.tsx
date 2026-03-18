"use client";

import { useState, useEffect } from "react";
import { useT } from "@/lib/useT";
import type { UIStringKey } from "@/lib/ui-strings";

const TUTORIAL_DONE_KEY = "tutorial-done";

interface TutorialStep {
  icon: string;
  titleKey: UIStringKey;
  descKey: UIStringKey;
}

const steps: TutorialStep[] = [
  { icon: "👋", titleKey: "tutorial.welcome.title", descKey: "tutorial.welcome.desc" },
  { icon: "🌐", titleKey: "tutorial.uiLang.title", descKey: "tutorial.uiLang.desc" },
  { icon: "📖", titleKey: "tutorial.studyLang.title", descKey: "tutorial.studyLang.desc" },
  { icon: "📚", titleKey: "tutorial.modules.title", descKey: "tutorial.modules.desc" },
  { icon: "🔤", titleKey: "tutorial.showChinese.title", descKey: "tutorial.showChinese.desc" },
  { icon: "✅", titleKey: "tutorial.quiz.title", descKey: "tutorial.quiz.desc" },
  { icon: "📝", titleKey: "tutorial.mockTest.title", descKey: "tutorial.mockTest.desc" },
  { icon: "🈶", titleKey: "tutorial.examLang.title", descKey: "tutorial.examLang.desc" },
  { icon: "🔓", titleKey: "tutorial.signIn.title", descKey: "tutorial.signIn.desc" },
];

export function Tutorial() {
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const t = useT();

  useEffect(() => {
    // Only show if not already done
    if (typeof window !== "undefined" && !localStorage.getItem(TUTORIAL_DONE_KEY)) {
      // Small delay so page renders first
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(TUTORIAL_DONE_KEY, "true");
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      dismiss();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  if (!visible) return null;

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const isFirst = currentStep === 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-card shadow-2xl">
        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-1 bg-primary transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="px-6 pt-8 pb-6">
          <div className="text-center">
            <span className="text-5xl">{step.icon}</span>
            <h2 className="mt-4 text-xl font-bold text-text-dark">
              {t(step.titleKey)}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-light">
              {t(step.descKey)}
            </p>
          </div>

          {/* Step indicators */}
          <div className="mt-6 flex items-center justify-center gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentStep
                    ? "w-6 bg-primary"
                    : i < currentStep
                    ? "w-2 bg-primary/40"
                    : "w-2 bg-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={dismiss}
              className="text-sm text-text-gray hover:text-text-dark"
            >
              {t("tutorial.skip")}
            </button>

            <div className="flex items-center gap-2">
              {!isFirst && (
                <button
                  onClick={handlePrev}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-primary hover:bg-primary-light"
                >
                  ←
                </button>
              )}
              <button
                onClick={handleNext}
                className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-primary/90"
              >
                {isLast ? t("tutorial.done") : t("tutorial.next")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
