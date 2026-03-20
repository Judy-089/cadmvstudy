"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  useWrongQuestionStore,
  WrongQuestion,
  RESOLVE_STREAK,
} from "@/store/useWrongQuestionStore";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRequireSession } from "@/lib/useRequireSession";
import { useT } from "@/lib/useT";
import {
  saveWrongQuestion,
  updateWrongQuestionReview,
} from "@/lib/firestore";
import { tagImages, type ImageMapping } from "@/data/imageMap";
import { signInWithGoogle } from "@/lib/auth";
import { modules } from "@/data/modules";
import {
  useQuestionLoader,
  loadQuestionDataForReview,
  type QuestionData,
} from "@/lib/useQuestionLoader";

type Tab = "all" | "today" | "flagged" | "byModule";
type ReviewPhase = "list" | "active" | "results";

// Module categories for crash course
const CRASH_MODULES = [
  { id: "CC-P1", label: "CC Phase 1" },
  { id: "CC-P2", label: "CC Phase 2" },
  { id: "CC-P3", label: "CC Phase 3" },
  { id: "CC-P4", label: "CC Phase 4" },
];

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
  const flaggedCount = useWrongQuestionStore((s) => s.flaggedCount)();
  const todayCount = useWrongQuestionStore((s) => s.todayCount)();
  const getTodaysMistakes = useWrongQuestionStore((s) => s.getTodaysMistakes);
  const getFlagged = useWrongQuestionStore((s) => s.getFlagged);
  const getByModule = useWrongQuestionStore((s) => s.getByModule);
  const recordReviewResult = useWrongQuestionStore(
    (s) => s.recordReviewResult
  );
  const flagQuestion = useWrongQuestionStore((s) => s.flagQuestion);
  const storeQuestions = useWrongQuestionStore((s) => s.questions);

  const [tab, setTab] = useState<Tab>("all");
  const [phase, setPhase] = useState<ReviewPhase>("list");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterModule, setFilterModule] = useState<string>("all");

  // Review session state
  const [reviewQuestions, setReviewQuestions] = useState<QuestionData[]>([]);
  const [reviewWrongs, setReviewWrongs] = useState<WrongQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [reviewScore, setReviewScore] = useState({ correct: 0, total: 0 });
  const [reviewFlagged, setReviewFlagged] = useState<Set<string>>(new Set());

  // Load question data for list display
  const { questionMap, loading: qLoading } = useQuestionLoader(allQuestions);

  if (redirecting) return null;

  if (!user || sessionMode === "guest") {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="text-4xl">✏️</div>
        <h1 className="mt-4 text-xl font-bold text-text-dark">
          {t("mistakes.title")}
        </h1>
        <p className="mt-2 text-text-gray">{t("mistakes.signInPrompt")}</p>
        <button
          onClick={signInWithGoogle}
          className="mt-6 rounded-xl bg-primary px-8 py-3 font-semibold text-white hover:bg-primary/90"
        >
          Sign In with Google
        </button>
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="text-4xl">🎉</div>
        <h1 className="mt-4 text-xl font-bold text-text-dark">
          {t("mistakes.noMistakes")}
        </h1>
        <p className="mt-2 text-text-gray">{t("mistakes.noMistakesDesc")}</p>
      </div>
    );
  }

  // ── Helpers ──

  const getText = (en: string, zhHant?: string, zh?: string) => {
    if (languageMode === "zhHant_zhHans") return zhHant || en;
    if (languageMode === "en_zhHans") return en;
    return en;
  };

  const getSecondaryText = (en: string, zh?: string) => {
    if (languageMode === "en_only") return null;
    return zh || null;
  };

  const getSourceLabel = (source: string) => {
    if (source === "mock") return t("mistakes.sourceMock");
    if (source === "crash") return t("mistakes.sourceCrash");
    return t("mistakes.sourceQuiz");
  };

  // ── Filtered questions by tab ──

  const getFilteredQuestions = (): WrongQuestion[] => {
    switch (tab) {
      case "today":
        return getTodaysMistakes();
      case "flagged":
        return getFlagged();
      case "byModule":
        return filterModule === "all"
          ? allQuestions
          : getByModule(filterModule);
      default:
        return allQuestions;
    }
  };

  const filteredQuestions = getFilteredQuestions();

  // ── All unique module IDs in mistakes ──
  const moduleIds = useMemo(() => {
    const ids = new Set(allQuestions.map((q) => q.moduleId));
    return Array.from(ids).sort();
  }, [allQuestions]);

  // ── Start review ──
  const startReview = async (questionsToReview: WrongQuestion[]) => {
    const toReview = questionsToReview
      .filter((q) => !q.resolved)
      .slice(0, 10);
    if (toReview.length === 0) return;

    const loaded = await loadQuestionDataForReview(toReview);
    if (loaded.length > 0) {
      setReviewQuestions(loaded);
      setReviewWrongs(toReview);
      setCurrentIdx(0);
      setAnswers({});
      setShowExplanation(false);
      setReviewFlagged(new Set());
      setPhase("active");
    }
  };

  // ── Active Review Phase ──
  if (phase === "active" && reviewQuestions.length > 0) {
    const q = reviewQuestions[currentIdx];
    const wq = reviewWrongs[currentIdx];
    const isAnswered = answers[currentIdx] !== undefined;
    const isCorrect = answers[currentIdx] === q.answer;
    const currentStreak = storeQuestions[q.id]?.correctStreak ?? 0;

    const handleAnswer = (key: string) => {
      if (isAnswered) return;
      setAnswers((prev) => ({ ...prev, [currentIdx]: key }));
      setShowExplanation(true);

      const correct = key === q.answer;
      recordReviewResult(q.id, correct);
      if (user) {
        const updated = useWrongQuestionStore.getState().questions[q.id];
        if (updated) {
          updateWrongQuestionReview(user.uid, q.id, {
            correctStreak: updated.correctStreak,
            resolved: updated.resolved,
            lastReviewedAt: updated.lastReviewedAt!,
            ...(correct ? {} : { wrongCount: updated.wrongCount, lastWrongAt: updated.lastWrongAt }),
          }).catch(() => {});
        }
      }
    };

    const handleFlagInReview = () => {
      flagQuestion({
        questionId: q.id,
        source: wq?.source ?? "quiz",
        sourceId: wq?.sourceId ?? "",
        moduleId: wq?.moduleId ?? "",
        correctAnswer: q.answer,
      });
      setReviewFlagged((prev) => new Set(prev).add(q.id));
      if (user) {
        const storeQ = useWrongQuestionStore.getState().questions[q.id];
        if (storeQ) saveWrongQuestion(user.uid, storeQ).catch(() => {});
      }
    };

    const handleNext = () => {
      setShowExplanation(false);
      if (currentIdx < reviewQuestions.length - 1) {
        setCurrentIdx(currentIdx + 1);
      } else {
        let correct = 0;
        reviewQuestions.forEach((rq, i) => {
          if (answers[i] === rq.answer) correct++;
        });
        setReviewScore({ correct, total: reviewQuestions.length });
        setPhase("results");
      }
    };

    // Images
    const imgs: ImageMapping[] = [];
    if (q.tags) {
      const seen = new Set<string>();
      for (const tag of q.tags) {
        const matches = tagImages[tag];
        if (matches) {
          for (const img of matches) {
            const src = img.srcExam || img.src;
            if (!seen.has(src)) {
              seen.add(src);
              imgs.push({ ...img, src });
            }
          }
        }
      }
    }

    const updatedStreak = storeQuestions[q.id]?.correctStreak ?? 0;
    const justResolved = storeQuestions[q.id]?.resolved ?? false;

    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-bg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
          <span className="text-sm font-semibold text-primary">
            {currentIdx + 1}/{reviewQuestions.length}
          </span>
          <span className="text-xs text-text-gray">{t("mistakes.title")}</span>
          <button
            onClick={() => setPhase("list")}
            className="rounded-lg p-1.5 text-text-gray hover:bg-gray-100"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="h-1 bg-gray-100">
          <div
            className="h-1 bg-primary transition-all"
            style={{
              width: `${((currentIdx + 1) / reviewQuestions.length) * 100}%`,
            }}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="text-lg font-medium leading-relaxed text-text-dark">
            {getText(q.stem_en, q.stem_zhHant, q.stem_zh)}
          </p>
          {getSecondaryText(q.stem_en, q.stem_zh) && languageMode !== "en_only" && q.stem_zh && (
            <p className="mt-1 text-base text-text-gray">{q.stem_zh}</p>
          )}

          {imgs.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              {imgs.slice(0, 2).map((img) => (
                <figure
                  key={img.src}
                  className="overflow-hidden rounded-xl border border-border bg-white shadow-sm"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-28 w-auto object-contain p-3"
                  />
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
                  <span
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                      showResult && isCorrectOpt
                        ? "bg-success text-white"
                        : showResult && selected
                        ? "bg-error text-white"
                        : selected
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-text-gray"
                    }`}
                  >
                    {showResult && isCorrectOpt
                      ? "✓"
                      : showResult && selected
                      ? "✗"
                      : opt.key}
                  </span>
                  <span className="text-text-dark">
                    {getText(opt.text_en, opt.text_zhHant, opt.text_zh)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div
              className={`mt-4 rounded-xl border-l-4 p-4 ${
                isCorrect
                  ? "border-success bg-success-light/30"
                  : "border-error bg-error-light/30"
              }`}
            >
              <p className="text-sm font-medium text-text-dark">
                {isCorrect ? (
                  justResolved ? (
                    <span>✓ {t("mistakes.resolved")}</span>
                  ) : (
                    <span>
                      ✓ {t("mistakes.correctStreak")} ({updatedStreak}/{RESOLVE_STREAK}{" "}
                      {t("mistakes.streakProgress")})
                    </span>
                  )
                ) : (
                  <span>✗ {t("mistakes.stillWrong")} — {t("mistakes.streakReset")}</span>
                )}
              </p>
              <p className="mt-1 text-sm text-text-light">
                {getText(q.explanation_en, q.explanation_zhHant, q.explanation_zh)}
              </p>
              {languageMode !== "en_only" && q.explanation_zh && (
                <p className="mt-1 text-sm text-text-gray">
                  {q.explanation_zh}
                </p>
              )}

              {/* Flag button in review */}
              <div className="mt-3 border-t border-gray-200 pt-3">
                {reviewFlagged.has(q.id) ||
                storeQuestions[q.id]?.flaggedUnknown ? (
                  <span className="text-xs font-medium text-text-gray">
                    ✓ {t("mistakes.flagged")}
                  </span>
                ) : (
                  <button
                    onClick={handleFlagInReview}
                    className="text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    {t("mistakes.flagBtn")}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {isAnswered && (
          <div className="border-t border-border bg-card px-4 py-3">
            <button
              onClick={handleNext}
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90"
            >
              {currentIdx < reviewQuestions.length - 1
                ? t("mistakes.nextQuestion")
                : t("mistakes.seeResults")}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Results Phase ──
  if (phase === "results") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="text-4xl">
          {reviewScore.correct === reviewScore.total ? "🎉" : "📚"}
        </div>
        <h1 className="mt-4 text-2xl font-bold text-text-dark">
          {reviewScore.correct}/{reviewScore.total}
        </h1>
        <p className="mt-1 text-text-gray">
          {reviewScore.correct === reviewScore.total
            ? useZhHant
              ? "全部答對！太棒了！"
              : "All correct! Great job!"
            : useZhHant
            ? `${reviewScore.correct} 題正確，${reviewScore.total - reviewScore.correct} 題仍需練習`
            : `${reviewScore.correct} correct, ${reviewScore.total - reviewScore.correct} still need practice`}
        </p>
        <p className="mt-2 text-xs text-text-gray">
          {t("mistakes.toReview")}: {unresolvedCount}
        </p>
        <div className="mt-6 flex flex-col gap-2">
          {unresolvedCount > 0 && (
            <button
              onClick={() => setPhase("list")}
              className="rounded-xl bg-primary py-3 font-semibold text-white hover:bg-primary/90"
            >
              {t("mistakes.back")}
            </button>
          )}
          <button
            onClick={() => setPhase("list")}
            className="rounded-xl border border-border py-3 font-medium text-text-dark hover:bg-gray-50"
          >
            {t("mistakes.done")}
          </button>
        </div>
      </div>
    );
  }

  // ── List Phase ──
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <h1 className="text-2xl font-bold text-text-dark md:text-3xl">
        {t("mistakes.title")}
      </h1>
      <p className="mt-1 text-sm text-text-gray">{t("mistakes.subtitle")}</p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-card p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-error">{unresolvedCount}</p>
          <p className="mt-0.5 text-xs text-text-gray">
            {t("mistakes.toReview")}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-success">{resolvedCount}</p>
          <p className="mt-0.5 text-xs text-text-gray">
            {t("mistakes.mastered")}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-text-dark">{totalCount}</p>
          <p className="mt-0.5 text-xs text-text-gray">
            {t("mistakes.total")}
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="mt-6 flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {(
          [
            { key: "all" as Tab, label: t("mistakes.tabAll"), count: totalCount },
            { key: "today" as Tab, label: t("mistakes.tabToday"), count: todayCount },
            { key: "flagged" as Tab, label: t("mistakes.tabFlagged"), count: flaggedCount },
            { key: "byModule" as Tab, label: t("mistakes.tabByModule"), count: null },
          ] as const
        ).map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => {
              setTab(key);
              setExpandedId(null);
            }}
            className={`flex-shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              tab === key
                ? "bg-primary text-white shadow-sm"
                : "bg-gray-100 text-text-gray hover:bg-gray-200"
            }`}
          >
            {label}
            {count !== null && count > 0 && (
              <span className="ml-1.5 rounded-full bg-white/20 px-1.5 text-xs">
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* By Module filter chips */}
      {tab === "byModule" && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilterModule("all")}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              filterModule === "all"
                ? "bg-primary text-white"
                : "bg-gray-100 text-text-gray hover:bg-gray-200"
            }`}
          >
            {t("mistakes.tabAll")} ({totalCount})
          </button>
          {moduleIds.map((mid) => {
            const count = allQuestions.filter(
              (q) => q.moduleId === mid
            ).length;
            const mod = modules.find((m) => m.id === mid);
            const crashMod = CRASH_MODULES.find((c) => c.id === mid);
            const label = mod
              ? `${mod.icon} ${mod.id}`
              : crashMod
              ? crashMod.label
              : mid;
            return (
              <button
                key={mid}
                onClick={() => setFilterModule(mid)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  filterModule === mid
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-text-gray hover:bg-gray-200"
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Training mode buttons */}
      {filteredQuestions.some((q) => !q.resolved) && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => startReview(filteredQuestions)}
            className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-primary/90"
          >
            {t("mistakes.startReview")} (
            {Math.min(
              filteredQuestions.filter((q) => !q.resolved).length,
              10
            )}{" "}
            {t("mistakes.questions")})
          </button>
        </div>
      )}

      {/* Question list — expandable cards */}
      <div className="mt-6 space-y-2">
        {filteredQuestions.length === 0 ? (
          <p className="py-8 text-center text-sm text-text-gray">
            {t("mistakes.noResults")}
          </p>
        ) : (
          filteredQuestions.map((wq) => {
            const qData = questionMap.get(wq.questionId);
            const isExpanded = expandedId === wq.questionId;

            return (
              <div
                key={wq.questionId}
                className={`rounded-xl border transition-all ${
                  wq.resolved
                    ? "border-success/30 bg-success-light/20"
                    : "border-border bg-card"
                }`}
              >
                {/* Collapsed row */}
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : wq.questionId)
                  }
                  className="flex w-full items-center gap-3 p-4 text-left"
                >
                  {/* Wrong count / resolved badge */}
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      wq.resolved
                        ? "bg-success text-white"
                        : "bg-error-light text-error"
                    }`}
                  >
                    {wq.resolved ? "✓" : wq.wrongCount || "?"}
                  </div>

                  {/* Question preview */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-dark truncate">
                      {qData
                        ? getText(
                            qData.stem_en,
                            qData.stem_zhHant,
                            qData.stem_zh
                          )
                        : wq.questionId}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                          wq.source === "mock"
                            ? "bg-blue-100 text-blue-700"
                            : wq.source === "crash"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-text-gray"
                        }`}
                      >
                        {getSourceLabel(wq.source)}
                      </span>
                      <span className="text-[10px] text-text-gray">
                        {wq.moduleId}
                      </span>
                      {wq.flaggedUnknown && (
                        <span className="text-[10px] text-amber-600">🚩</span>
                      )}
                      {wq.wrongCount > 1 && (
                        <span className="text-[10px] text-text-gray">
                          {wq.wrongCount}x {t("mistakes.wrongCount")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Streak indicator */}
                  <div className="flex flex-shrink-0 items-center gap-0.5">
                    {Array.from({ length: RESOLVE_STREAK }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 w-2 rounded-full ${
                          i < (wq.correctStreak ?? 0)
                            ? "bg-success"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Expand arrow */}
                  <svg
                    className={`h-4 w-4 flex-shrink-0 text-text-gray transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Expanded detail */}
                {isExpanded && qData && (
                  <div className="border-t border-border px-4 pb-4 pt-3">
                    {/* Full stem */}
                    <p className="text-base font-medium text-text-dark">
                      {getText(
                        qData.stem_en,
                        qData.stem_zhHant,
                        qData.stem_zh
                      )}
                    </p>
                    {languageMode !== "en_only" && qData.stem_zh && (
                      <p className="mt-0.5 text-sm text-text-gray">
                        {qData.stem_zh}
                      </p>
                    )}

                    {/* Options */}
                    <div className="mt-3 space-y-1.5">
                      {qData.options.map((opt) => {
                        const isAnswer = opt.key === qData.answer;
                        const isUserWrong =
                          opt.key === wq.wrongAnswer && wq.wrongAnswer !== "";
                        return (
                          <div
                            key={opt.key}
                            className={`rounded-lg px-3 py-2 text-sm ${
                              isAnswer
                                ? "bg-success/10 font-medium text-success"
                                : isUserWrong
                                ? "bg-error/10 text-error line-through"
                                : "text-text-gray"
                            }`}
                          >
                            <span className="font-semibold">{opt.key}.</span>{" "}
                            {getText(
                              opt.text_en,
                              opt.text_zhHant,
                              opt.text_zh
                            )}
                            {isAnswer && " ✓"}
                            {isUserWrong &&
                              ` (${t("mistakes.yourAnswer")})`}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-sm text-text-light">
                      {getText(
                        qData.explanation_en,
                        qData.explanation_zhHant,
                        qData.explanation_zh
                      )}
                      {languageMode !== "en_only" &&
                        qData.explanation_zh && (
                          <p className="mt-1 text-text-gray">
                            {qData.explanation_zh}
                          </p>
                        )}
                    </div>

                    {/* Meta */}
                    <div className="mt-2 flex items-center gap-3 text-[10px] text-text-gray">
                      <span>
                        {t("mistakes.streakProgress")}:{" "}
                        {wq.correctStreak ?? 0}/{RESOLVE_STREAK}
                      </span>
                      {wq.flaggedUnknown && (
                        <span className="text-amber-600">
                          🚩 {t("mistakes.tabFlagged")}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Loading placeholder for expanded but not loaded */}
                {isExpanded && !qData && qLoading && (
                  <div className="border-t border-border px-4 py-6 text-center text-sm text-text-gray">
                    Loading...
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
