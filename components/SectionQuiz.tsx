"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuizStore } from "@/store/useQuizStore";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useProgressStore } from "@/store/useProgressStore";
import { useWrongQuestionStore } from "@/store/useWrongQuestionStore";
import { saveWrongQuestion } from "@/lib/firestore";
import { useT } from "@/lib/useT";
import { tagImages, type ImageMapping } from "@/data/imageMap";

interface QuizQuestion {
  id: string;
  stem_en: string;
  stem_zhHant?: string;
  options: { key: string; text_en: string; text_zhHant?: string }[];
  answer: string;
  explanation_en: string;
  explanation_zhHant?: string;
  tags?: string[];
}

interface SectionQuizData {
  sectionId: string;
  questions: QuizQuestion[];
}

type QuizPhase = "prompt" | "active" | "results";

interface Props {
  moduleId: string;
  sectionId: string;
  sectionTitle: string;
  onClose: () => void;
}

export function SectionQuiz({ moduleId, sectionId, sectionTitle, onClose }: Props) {
  const [quizData, setQuizData] = useState<SectionQuizData | null>(null);
  const [phase, setPhase] = useState<QuizPhase>("prompt");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);

  const setResult = useQuizStore((s) => s.setResult);
  const existingResult = useQuizStore((s) => s.getResult)(moduleId, sectionId);
  const languageMode = useAppStore((s) => s.languageMode);
  const t = useT();

  // Determine quiz language: zhHant mode → zhHant, else → en
  const useZhHant = languageMode === "zhHant_zhHans";

  // Load quiz data
  useEffect(() => {
    import(`@/data/quizzes/${moduleId}.json`)
      .then((mod) => {
        const data = mod.default || mod;
        const section = data.sections?.find((s: SectionQuizData) => s.sectionId === sectionId);
        if (section) setQuizData(section);
      })
      .catch(() => setQuizData(null));
  }, [moduleId, sectionId]);

  const getText = useCallback(
    (en: string, zhHant?: string) => (useZhHant && zhHant ? zhHant : en),
    [useZhHant]
  );

  if (!quizData || quizData.questions.length === 0) return null;

  const questions = quizData.questions;
  const totalQ = questions.length;
  const currentQ = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const isAnswered = answers[currentIdx] !== undefined;
  const isCorrect = answers[currentIdx] === currentQ?.answer;

  // Calculate score
  const calcScore = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
    });
    return correct;
  };

  const handleAnswer = (key: string) => {
    if (isAnswered) return; // Can't change answer
    setAnswers((prev) => ({ ...prev, [currentIdx]: key }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentIdx < totalQ - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // All answered → show results
      const score = calcScore();
      const percentage = Math.round((score / totalQ) * 100);
      setResult({
        moduleId,
        sectionId,
        score,
        total: totalQ,
        percentage,
        completedAt: Date.now(),
      });
      // Save to Firestore for signed-in users
      const user = useAuthStore.getState().user;
      if (user) {
        useProgressStore.getState().saveQuiz(user.uid, moduleId, sectionId, score, totalQ);
      }
      // Collect wrong answers
      const addWrong = useWrongQuestionStore.getState().addWrongQuestion;
      questions.forEach((q, i) => {
        if (answers[i] && answers[i] !== q.answer) {
          const wrongQ = {
            questionId: q.id,
            source: "quiz" as const,
            sourceId: `${moduleId}-${sectionId}`,
            moduleId,
            wrongAnswer: answers[i],
            correctAnswer: q.answer,
          };
          addWrong(wrongQ);
          if (user) {
            const full = useWrongQuestionStore.getState().questions[q.id];
            if (full) saveWrongQuestion(user.uid, full).catch(() => {});
          }
        }
      });
      setPhase("results");
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentIdx(0);
    setShowExplanation(false);
    setPhase("active");
  };

  // ── Prompt Phase ──
  if (phase === "prompt") {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center">
        <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-xl">
              📝
            </div>
            <h3 className="mt-3 text-lg font-bold text-text-dark">
              {useZhHant ? "檢測學習成果" : "Test Your Knowledge"}
            </h3>
            <p className="mt-1 text-sm text-text-gray">
              {getText(
                `${totalQ} questions about "${sectionTitle}"`,
                `${totalQ} 道關於「${sectionTitle}」的題目`
              )}
            </p>
            {existingResult && (
              <p className="mt-2 text-xs text-text-gray">
                {useZhHant
                  ? `上次成績：${existingResult.percentage}%`
                  : `Previous score: ${existingResult.percentage}%`}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={() => setPhase("active")}
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90"
            >
              {existingResult
                ? (useZhHant ? "重新測驗" : "Retake Quiz")
                : (useZhHant ? "開始測驗" : "Start Quiz")}
            </button>
            <button
              onClick={onClose}
              className="w-full rounded-xl py-3 text-sm font-medium text-text-gray hover:bg-gray-50"
            >
              {useZhHant ? "稍後再說" : "Maybe Later"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Results Phase ──
  if (phase === "results") {
    const score = calcScore();
    const percentage = Math.round((score / totalQ) * 100);
    const isPerfect = percentage === 100;
    const isGood = percentage >= 80;

    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center">
        <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
          <div className="text-center">
            <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-2xl ${
              isPerfect ? "bg-success-light" : isGood ? "bg-warning-light" : "bg-error-light"
            }`}>
              {isPerfect ? "🎉" : isGood ? "👍" : "📚"}
            </div>
            <h3 className="mt-3 text-2xl font-bold text-text-dark">
              {score}/{totalQ}
            </h3>
            <p className={`text-lg font-semibold ${
              isPerfect ? "text-success" : isGood ? "text-warning" : "text-error"
            }`}>
              {percentage}%
            </p>
            <p className="mt-1 text-sm text-text-gray">
              {isPerfect
                ? (useZhHant ? "完美！全部答對！" : "Perfect! All correct!")
                : isGood
                ? (useZhHant ? "做得好！繼續加油！" : "Good job! Keep it up!")
                : (useZhHant ? "再複習一下吧！" : "Review and try again!")}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            {!isPerfect && (
              <button
                onClick={handleRetry}
                className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90"
              >
                {useZhHant ? "重新測驗" : "Retry Quiz"}
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full rounded-xl border border-border py-3 text-sm font-medium text-text-dark hover:bg-gray-50"
            >
              {useZhHant ? "繼續學習" : "Continue Studying"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Active Quiz Phase ──
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-primary">
            {currentIdx + 1}/{totalQ}
          </span>
          <span className="text-xs text-text-gray">{sectionTitle}</span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-text-gray hover:bg-gray-100"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-1 bg-primary transition-all"
          style={{ width: `${((currentIdx + 1) / totalQ) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="text-lg font-medium leading-relaxed text-text-dark">
          {getText(currentQ.stem_en, currentQ.stem_zhHant)}
        </p>

        {/* Sign images for tagged questions */}
        {currentQ.tags && currentQ.tags.length > 0 && (() => {
          const imgs: ImageMapping[] = [];
          const seen = new Set<string>();
          for (const tag of currentQ.tags) {
            const matches = tagImages[tag];
            if (matches) {
              for (const img of matches) {
                // Use srcExam (B variant, no text) if available for quiz context
                const src = img.srcExam || img.src;
                if (!seen.has(src)) {
                  seen.add(src);
                  imgs.push({ ...img, src });
                }
              }
            }
          }
          if (imgs.length === 0) return null;
          return (
            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              {imgs.slice(0, 2).map((img) => (
                <figure key={img.src} className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                  <img src={img.src} alt={img.alt} className="h-28 w-auto object-contain p-3" />
                </figure>
              ))}
            </div>
          );
        })()}

        <div className="mt-6 space-y-3">
          {currentQ.options.map((opt) => {
            const selected = answers[currentIdx] === opt.key;
            const isCorrectOpt = opt.key === currentQ.answer;
            const showResult = isAnswered;

            let borderClass = "border-border hover:border-primary/30";
            let bgClass = "";
            if (showResult && isCorrectOpt) {
              borderClass = "border-success";
              bgClass = "bg-success-light/50";
            } else if (showResult && selected && !isCorrectOpt) {
              borderClass = "border-error";
              bgClass = "bg-error-light/50";
            } else if (selected) {
              borderClass = "border-primary";
              bgClass = "bg-primary-light";
            }

            return (
              <button
                key={opt.key}
                onClick={() => handleAnswer(opt.key)}
                disabled={isAnswered}
                className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${borderClass} ${bgClass}`}
              >
                <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  showResult && isCorrectOpt
                    ? "bg-success text-white"
                    : showResult && selected
                    ? "bg-error text-white"
                    : selected
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-text-gray"
                }`}>
                  {showResult && isCorrectOpt ? "✓" : showResult && selected ? "✗" : opt.key}
                </span>
                <span className="text-text-dark">
                  {getText(opt.text_en, opt.text_zhHant)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className={`mt-4 rounded-xl border-l-4 p-4 ${
            isCorrect ? "border-success bg-success-light/30" : "border-error bg-error-light/30"
          }`}>
            <p className="text-sm font-medium text-text-dark">
              {isCorrect
                ? (useZhHant ? "✓ 正確！" : "✓ Correct!")
                : (useZhHant ? "✗ 錯誤" : "✗ Incorrect")}
            </p>
            <p className="mt-1 text-sm text-text-light">
              {getText(currentQ.explanation_en, currentQ.explanation_zhHant)}
            </p>
          </div>
        )}
      </div>

      {/* Bottom action */}
      {isAnswered && (
        <div className="border-t border-border bg-card px-4 py-3">
          <button
            onClick={handleNext}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90"
          >
            {currentIdx < totalQ - 1
              ? (useZhHant ? "下一題" : "Next Question")
              : (useZhHant ? "查看結果" : "See Results")}
          </button>
        </div>
      )}
    </div>
  );
}
