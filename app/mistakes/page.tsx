"use client";

import { useState, useEffect, useCallback } from "react";
import { useWrongQuestionStore, WrongQuestion } from "@/store/useWrongQuestionStore";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRequireSession } from "@/lib/useRequireSession";
import { useT } from "@/lib/useT";
import { resolveWrongQuestion } from "@/lib/firestore";
import { tagImages, type ImageMapping } from "@/data/imageMap";
import { signInWithGoogle } from "@/lib/auth";
import { modules } from "@/data/modules";

interface QuestionData {
  id: string;
  stem_en: string;
  stem_zhHant?: string;
  options: { key: string; text_en: string; text_zhHant?: string }[];
  answer: string;
  explanation_en: string;
  explanation_zh?: string;
  explanation_zhHant?: string;
  tags?: string[];
  module?: string;
}

type ReviewPhase = "list" | "active" | "results";

export default function MistakesPage() {
  const redirecting = useRequireSession();
  const sessionMode = useAppStore((s) => s.sessionMode);
  const user = useAuthStore((s) => s.user);
  const t = useT();
  const languageMode = useAppStore((s) => s.languageMode);
  const useZhHant = languageMode === "zhHant_zhHans";

  const allQuestions = useWrongQuestionStore((s) => s.getAll)();
  const unresolvedQuestions = useWrongQuestionStore((s) => s.getUnresolved)();
  const totalCount = useWrongQuestionStore((s) => s.totalCount)();
  const unresolvedCount = useWrongQuestionStore((s) => s.unresolvedCount)();
  const resolvedCount = useWrongQuestionStore((s) => s.resolvedCount)();
  const resolveQ = useWrongQuestionStore((s) => s.resolveQuestion);

  const [phase, setPhase] = useState<ReviewPhase>("list");
  const [reviewQuestions, setReviewQuestions] = useState<QuestionData[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [filterModule, setFilterModule] = useState<string>("all");
  const [reviewScore, setReviewScore] = useState({ correct: 0, total: 0 });

  if (redirecting) return null;

  if (!user || sessionMode === "guest") {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="text-4xl">✏️</div>
        <h1 className="mt-4 text-xl font-bold text-text-dark">Mistake Review</h1>
        <p className="mt-2 text-text-gray">Sign in to track and review your wrong answers.</p>
        <button onClick={signInWithGoogle} className="mt-6 rounded-xl bg-primary px-8 py-3 font-semibold text-white hover:bg-primary/90">
          Sign In with Google
        </button>
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="text-4xl">🎉</div>
        <h1 className="mt-4 text-xl font-bold text-text-dark">No Mistakes Yet!</h1>
        <p className="mt-2 text-text-gray">Complete some quizzes or mock exams to start tracking your mistakes.</p>
      </div>
    );
  }

  // Load actual question data for review
  const startReview = async () => {
    const toReview = unresolvedQuestions.slice(0, 10);
    const loaded: QuestionData[] = [];

    for (const wq of toReview) {
      try {
        let questionData: QuestionData | null = null;

        if (wq.source === "mock") {
          const mod = await import(`@/data/exams/${wq.sourceId}.json`);
          const data = mod.default || mod;
          questionData = data.questions.find((q: QuestionData) => q.id === wq.questionId) || null;
        } else {
          // Quiz source: sourceId is like "M02-S01"
          const parts = wq.sourceId.split("-");
          const modId = parts.slice(0, -1).join("-"); // Handle M01-5-S01
          const mod = await import(`@/data/quizzes/${modId}.json`);
          const data = mod.default || mod;
          for (const sec of data.sections) {
            const found = sec.questions.find((q: QuestionData) => q.id === wq.questionId);
            if (found) { questionData = found; break; }
          }
        }

        if (questionData) loaded.push(questionData);
      } catch { /* skip if can't load */ }
    }

    if (loaded.length > 0) {
      setReviewQuestions(loaded);
      setCurrentIdx(0);
      setAnswers({});
      setShowExplanation(false);
      setPhase("active");
    }
  };

  // Filtered questions for list view
  const filteredQuestions = filterModule === "all"
    ? allQuestions
    : allQuestions.filter((q) => q.moduleId === filterModule);

  // Active review
  if (phase === "active" && reviewQuestions.length > 0) {
    const q = reviewQuestions[currentIdx];
    const isAnswered = answers[currentIdx] !== undefined;
    const isCorrect = answers[currentIdx] === q.answer;
    const getText = (en: string, zhHant?: string) => useZhHant && zhHant ? zhHant : en;

    const handleAnswer = (key: string) => {
      if (isAnswered) return;
      setAnswers((prev) => ({ ...prev, [currentIdx]: key }));
      setShowExplanation(true);

      // If correct, resolve it
      if (key === q.answer) {
        resolveQ(q.id);
        if (user) resolveWrongQuestion(user.uid, q.id).catch(() => {});
      }
    };

    const handleNext = () => {
      setShowExplanation(false);
      if (currentIdx < reviewQuestions.length - 1) {
        setCurrentIdx(currentIdx + 1);
      } else {
        // Calculate score
        let correct = 0;
        reviewQuestions.forEach((rq, i) => {
          if (answers[i] === rq.answer) correct++;
        });
        setReviewScore({ correct, total: reviewQuestions.length });
        setPhase("results");
      }
    };

    // Sign images
    const imgs: ImageMapping[] = [];
    if (q.tags) {
      const seen = new Set<string>();
      for (const tag of q.tags) {
        const matches = tagImages[tag];
        if (matches) {
          for (const img of matches) {
            const src = img.srcExam || img.src;
            if (!seen.has(src)) { seen.add(src); imgs.push({ ...img, src }); }
          }
        }
      }
    }

    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-bg">
        <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
          <span className="text-sm font-semibold text-primary">{currentIdx + 1}/{reviewQuestions.length}</span>
          <span className="text-xs text-text-gray">Mistake Review</span>
          <button onClick={() => setPhase("list")} className="rounded-lg p-1.5 text-text-gray hover:bg-gray-100">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="h-1 bg-gray-100">
          <div className="h-1 bg-primary transition-all" style={{ width: `${((currentIdx + 1) / reviewQuestions.length) * 100}%` }} />
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="text-lg font-medium leading-relaxed text-text-dark">{getText(q.stem_en, q.stem_zhHant)}</p>

          {imgs.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              {imgs.slice(0, 2).map((img) => (
                <figure key={img.src} className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                  <img src={img.src} alt={img.alt} className="h-28 w-auto object-contain p-3" />
                </figure>
              ))}
            </div>
          )}

          <div className="mt-6 space-y-3">
            {q.options.map((opt) => {
              const selected = answers[currentIdx] === opt.key;
              const isCorrectOpt = opt.key === q.answer;
              const showResult = isAnswered;
              let borderClass = "border-border hover:border-primary/30";
              let bgClass = "";
              if (showResult && isCorrectOpt) { borderClass = "border-success"; bgClass = "bg-success-light/50"; }
              else if (showResult && selected && !isCorrectOpt) { borderClass = "border-error"; bgClass = "bg-error-light/50"; }
              else if (selected) { borderClass = "border-primary"; bgClass = "bg-primary-light"; }

              return (
                <button key={opt.key} onClick={() => handleAnswer(opt.key)} disabled={isAnswered}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${borderClass} ${bgClass}`}>
                  <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    showResult && isCorrectOpt ? "bg-success text-white"
                    : showResult && selected ? "bg-error text-white"
                    : selected ? "bg-primary text-white"
                    : "bg-gray-100 text-text-gray"
                  }`}>
                    {showResult && isCorrectOpt ? "✓" : showResult && selected ? "✗" : opt.key}
                  </span>
                  <span className="text-text-dark">{getText(opt.text_en, opt.text_zhHant)}</span>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className={`mt-4 rounded-xl border-l-4 p-4 ${isCorrect ? "border-success bg-success-light/30" : "border-error bg-error-light/30"}`}>
              <p className="text-sm font-medium text-text-dark">{isCorrect ? "✓ Correct! Resolved!" : "✗ Still incorrect"}</p>
              <p className="mt-1 text-sm text-text-light">{q.explanation_en}</p>
            </div>
          )}
        </div>

        {isAnswered && (
          <div className="border-t border-border bg-card px-4 py-3">
            <button onClick={handleNext} className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90">
              {currentIdx < reviewQuestions.length - 1 ? "Next Question" : "See Results"}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Results phase
  if (phase === "results") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="text-4xl">{reviewScore.correct === reviewScore.total ? "🎉" : "📚"}</div>
        <h1 className="mt-4 text-2xl font-bold text-text-dark">{reviewScore.correct}/{reviewScore.total}</h1>
        <p className="mt-1 text-text-gray">
          {reviewScore.correct === reviewScore.total
            ? "All resolved! Great job!"
            : `${reviewScore.correct} resolved, ${reviewScore.total - reviewScore.correct} still need practice`}
        </p>
        <p className="mt-2 text-xs text-text-gray">Remaining unresolved: {unresolvedCount}</p>
        <div className="mt-6 flex flex-col gap-2">
          {unresolvedCount > 0 && (
            <button onClick={() => { setPhase("list"); }} className="rounded-xl bg-primary py-3 font-semibold text-white hover:bg-primary/90">
              Back to Mistakes
            </button>
          )}
          <button onClick={() => setPhase("list")} className="rounded-xl border border-border py-3 font-medium text-text-dark hover:bg-gray-50">
            Done
          </button>
        </div>
      </div>
    );
  }

  // List phase
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <h1 className="text-2xl font-bold text-text-dark md:text-3xl">Mistake Review</h1>
      <p className="mt-1 text-sm text-text-gray">Review and practice questions you got wrong</p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-card p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-error">{unresolvedCount}</p>
          <p className="mt-0.5 text-xs text-text-gray">To Review</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-success">{resolvedCount}</p>
          <p className="mt-0.5 text-xs text-text-gray">Resolved</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-text-dark">{totalCount}</p>
          <p className="mt-0.5 text-xs text-text-gray">Total</p>
        </div>
      </div>

      {/* Start review button */}
      {unresolvedCount > 0 && (
        <button
          onClick={startReview}
          className="mt-6 w-full rounded-xl bg-primary py-4 text-lg font-semibold text-white shadow-md hover:bg-primary/90"
        >
          Start Review ({Math.min(unresolvedCount, 10)} questions)
        </button>
      )}

      {/* Filter */}
      <div className="mt-6 flex flex-wrap gap-1.5">
        <button
          onClick={() => setFilterModule("all")}
          className={`rounded-full px-3 py-1.5 text-xs font-medium ${filterModule === "all" ? "bg-primary text-white" : "bg-gray-100 text-text-gray hover:bg-gray-200"}`}
        >
          All ({totalCount})
        </button>
        {modules.filter((m) => allQuestions.some((q) => q.moduleId === m.id)).map((m) => (
          <button
            key={m.id}
            onClick={() => setFilterModule(m.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${filterModule === m.id ? "bg-primary text-white" : "bg-gray-100 text-text-gray hover:bg-gray-200"}`}
          >
            {m.id} ({allQuestions.filter((q) => q.moduleId === m.id).length})
          </button>
        ))}
      </div>

      {/* Question list */}
      <div className="mt-4 space-y-2">
        {filteredQuestions.map((wq) => (
          <div
            key={wq.questionId}
            className={`flex items-center gap-3 rounded-xl border p-4 ${
              wq.resolved ? "border-success/30 bg-success-light/20" : "border-border bg-card"
            }`}
          >
            <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              wq.resolved ? "bg-success text-white" : "bg-error-light text-error"
            }`}>
              {wq.resolved ? "✓" : wq.wrongCount}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-dark truncate">{wq.questionId}</p>
              <p className="text-xs text-text-gray">
                {wq.source === "mock" ? wq.sourceId : wq.sourceId} &middot; {wq.moduleId}
                {wq.wrongCount > 1 && ` &middot; wrong ${wq.wrongCount}x`}
              </p>
            </div>
            <span className={`text-xs font-medium ${wq.resolved ? "text-success" : "text-error"}`}>
              {wq.resolved ? "Resolved" : "Pending"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
