"use client";

import { useParams } from "next/navigation";
import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { useAppStore, type LanguageMode } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useCrashCourseStore } from "@/store/useCrashCourseStore";
import { useWrongQuestionStore } from "@/store/useWrongQuestionStore";
import { useRequireSession } from "@/lib/useRequireSession";
import { saveWrongQuestion as saveWrongQuestionToFirestore } from "@/lib/firestore";

import phase1Data from "@/data/crashcourse/phase1.json";
import phase2Data from "@/data/crashcourse/phase2.json";
import phase3Data from "@/data/crashcourse/phase3.json";
import phase4Data from "@/data/crashcourse/phase4.json";

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

interface BiText {
  en: string;
  zh: string;
  zhHant?: string;
}

interface P1Card {
  number: string;
  rules: BiText[];
}

interface P1Group {
  id: string;
  title_en: string;
  title_zh: string;
  title_zhHant: string;
  estimatedMinutes: number;
  cards: P1Card[];
  mnemonic_en: string;
  mnemonic_zh: string;
  mnemonic_zhHant: string;
  questions: QuizQuestion[];
}

interface P2Card {
  id: string;
  title_en: string;
  title_zh: string;
  title_zhHant: string;
  isHighFreq?: boolean;
  isEasyMistake?: boolean;
  content_en: string;
  content_zh: string;
  content_zhHant: string;
  mistakeNote_en?: string;
  mistakeNote_zh?: string;
  mistakeNote_zhHant?: string;
}

interface P2SummaryTable {
  headers_en: string[];
  headers_zh: string[];
  headers_zhHant: string[];
  rows: Record<string, string>[];
}

interface P2Topic {
  id: string;
  title_en: string;
  title_zh: string;
  title_zhHant: string;
  estimatedMinutes: number;
  coreRule?: {
    content_en: string;
    content_zh: string;
    content_zhHant: string;
    isHighFreq?: boolean;
  };
  cards: P2Card[];
  summaryTable?: P2SummaryTable;
  questions: QuizQuestion[];
}

interface P3TableCell {
  en: string;
  zh: string;
  zhHant?: string;
}

interface P3Comparison {
  id: string;
  title_en: string;
  title_zh: string;
  title_zhHant: string;
  table: {
    headers: P3TableCell[];
    rows: { cells: P3TableCell[] }[];
  };
  questions: QuizQuestion[];
}

interface QuizOption {
  key: string;
  text_en: string;
  text_zh?: string;
  text_zhHant?: string;
}

interface QuizQuestion {
  id: string;
  stem_en: string;
  stem_zh?: string;
  stem_zhHant?: string;
  options: QuizOption[];
  answer: string;
  explanation_en: string;
  explanation_zh?: string;
  explanation_zhHant?: string;
  tags?: string[];
}

// ────────────────────────────────────────────────────────────
// Language helpers
// ────────────────────────────────────────────────────────────

function bi(
  en: string,
  zh: string,
  zhHant: string | undefined,
  mode: LanguageMode
): { main: string; secondary: string | null } {
  switch (mode) {
    case "en_only":
      return { main: en, secondary: null };
    case "en_zhHans":
      return { main: en, secondary: zh };
    case "zhHant_zhHans":
      return { main: zhHant || zh, secondary: zh };
  }
}

function biText(t: BiText, mode: LanguageMode) {
  return bi(t.en, t.zh, t.zhHant, mode);
}

function BilingualText({
  en,
  zh,
  zhHant,
  mode,
  mainClassName = "text-text-dark",
  secondaryClassName = "text-base text-text-gray mt-0.5",
}: {
  en: string;
  zh: string;
  zhHant?: string;
  mode: LanguageMode;
  mainClassName?: string;
  secondaryClassName?: string;
}) {
  const { main, secondary } = bi(en, zh, zhHant, mode);
  return (
    <>
      <span className={mainClassName}>{main}</span>
      {secondary && <span className={`block ${secondaryClassName}`}>{secondary}</span>}
    </>
  );
}

// ────────────────────────────────────────────────────────────
// Phase metadata
// ────────────────────────────────────────────────────────────

const PHASE_META: Record<
  string,
  { title_en: string; title_zh: string; title_zhHant: string; estimatedMinutes: number }
> = {
  "1": {
    title_en: phase1Data.title_en,
    title_zh: phase1Data.title_zh,
    title_zhHant: phase1Data.title_zhHant,
    estimatedMinutes: phase1Data.estimatedMinutes,
  },
  "2": {
    title_en: phase2Data.title_en,
    title_zh: phase2Data.title_zh,
    title_zhHant: phase2Data.title_zhHant,
    estimatedMinutes: phase2Data.estimatedMinutes,
  },
  "3": {
    title_en: phase3Data.title_en,
    title_zh: phase3Data.title_zh,
    title_zhHant: phase3Data.title_zhHant,
    estimatedMinutes: phase3Data.estimatedMinutes,
  },
  "4": {
    title_en: phase4Data.title_en,
    title_zh: phase4Data.title_zh,
    title_zhHant: phase4Data.title_zhHant,
    estimatedMinutes: phase4Data.estimatedMinutes,
  },
};

// ────────────────────────────────────────────────────────────
// InlineQuiz component (Phases 1-3)
// ────────────────────────────────────────────────────────────

function InlineQuiz({
  questions,
  groupId,
  phase,
  languageMode,
  onComplete,
}: {
  questions: QuizQuestion[];
  groupId: string;
  phase: 1 | 2 | 3;
  languageMode: LanguageMode;
  onComplete: () => void;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const completeGroup = useCrashCourseStore((s) => s.completeGroup);
  const syncToFirestore = useCrashCourseStore((s) => s.syncToFirestore);
  const addWrongQuestion = useWrongQuestionStore((s) => s.addWrongQuestion);
  const flagQuestion = useWrongQuestionStore((s) => s.flagQuestion);
  const storeQuestions = useWrongQuestionStore((s) => s.questions);
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());

  const useZhHant = languageMode === "zhHant_zhHans";

  const getStem = (q: QuizQuestion) =>
    useZhHant ? q.stem_zhHant || q.stem_en : q.stem_en;

  const getOptionText = (opt: QuizOption) =>
    useZhHant ? opt.text_zhHant || opt.text_en : opt.text_en;

  const getExplanation = (q: QuizQuestion) => {
    const main = useZhHant
      ? q.explanation_zhHant || q.explanation_en
      : q.explanation_en;
    const secondary =
      languageMode === "en_zhHans"
        ? q.explanation_zh
        : languageMode === "zhHant_zhHans"
        ? q.explanation_zh
        : null;
    return { main, secondary };
  };

  const totalQ = questions.length;
  const currentQ = questions[currentIdx];
  const isAnswered = answers[currentIdx] !== undefined;
  const isCorrect = answers[currentIdx] === currentQ?.answer;

  const calcScore = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
    });
    return correct;
  };

  const handleAnswer = (key: string) => {
    if (isAnswered) return;
    setAnswers((prev) => ({ ...prev, [currentIdx]: key }));
    setShowResult(true);
  };

  const handleFlag = (q: QuizQuestion) => {
    const flagInput = {
      questionId: q.id,
      source: "crash" as const,
      sourceId: `CC-P${phase}-${groupId}`,
      moduleId: `CC-P${phase}`,
      correctAnswer: q.answer,
    };
    flagQuestion(flagInput);
    setFlaggedIds((prev) => new Set(prev).add(q.id));
    const user = useAuthStore.getState().user;
    if (user) {
      const storeQ = useWrongQuestionStore.getState().questions[q.id];
      if (storeQ) saveWrongQuestionToFirestore(user.uid, storeQ).catch(() => {});
    }
  };

  const handleNext = () => {
    setShowResult(false);
    if (currentIdx < totalQ - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      const score = calcScore();
      completeGroup(phase, groupId, score);
      // Record wrong answers to mistake store
      const user = useAuthStore.getState().user;
      questions.forEach((q, i) => {
        if (answers[i] !== undefined && answers[i] !== q.answer) {
          const wrongEntry = {
            questionId: q.id,
            source: "crash" as const,
            sourceId: `CC-P${phase}-${groupId}`,
            moduleId: `CC-P${phase}`,
            wrongAnswer: answers[i],
            correctAnswer: q.answer,
          };
          addWrongQuestion(wrongEntry);
          if (user) {
            const storeQ = useWrongQuestionStore.getState().questions[q.id];
            if (storeQ) saveWrongQuestionToFirestore(user.uid, storeQ).catch(() => {});
          }
        }
      });
      if (user) {
        syncToFirestore(user.uid);
      }
      setFinished(true);
    }
  };

  if (finished) {
    const score = calcScore();
    const percentage = Math.round((score / totalQ) * 100);
    const isPerfect = percentage === 100;
    const isGood = percentage >= 80;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 rounded-xl border border-border bg-card p-6 text-center"
      >
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl ${
            isPerfect
              ? "bg-green-100"
              : isGood
              ? "bg-yellow-100"
              : "bg-red-100"
          }`}
        >
          {isPerfect ? "🎉" : isGood ? "👍" : "📚"}
        </div>
        <p className="mt-3 text-2xl font-bold text-text-dark">
          {score}/{totalQ}
        </p>
        <p
          className={`text-sm font-semibold ${
            isPerfect
              ? "text-green-600"
              : isGood
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {percentage}%
        </p>
        <p className="mt-1 text-sm text-text-gray">
          {isPerfect
            ? useZhHant
              ? "完美！全部答對！"
              : "Perfect! All correct!"
            : isGood
            ? useZhHant
              ? "做得好！繼續加油！"
              : "Good job! Keep it up!"
            : useZhHant
            ? "再複習一下吧！"
            : "Review and try again!"}
        </p>
        <button
          onClick={onComplete}
          className="mt-4 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
        >
          {useZhHant ? "繼續" : "Continue"}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 rounded-xl border border-border bg-card"
    >
      {/* Progress bar */}
      <div className="h-1 overflow-hidden rounded-t-xl bg-gray-100">
        <div
          className="h-1 bg-primary transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / totalQ) * 100}%` }}
        />
      </div>

      <div className="p-5">
        {/* Question counter */}
        <p className="mb-2 text-xs font-semibold text-primary">
          {currentIdx + 1}/{totalQ}
        </p>

        {/* Stem */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-lg font-medium leading-relaxed text-text-dark">
              {getStem(currentQ)}
            </p>

            {/* Options */}
            <div className="mt-4 space-y-2.5">
              {currentQ.options.map((opt) => {
                const selected = answers[currentIdx] === opt.key;
                const isCorrectOpt = opt.key === currentQ.answer;
                const revealed = isAnswered;

                let borderClass = "border-border hover:border-primary/30";
                let bgClass = "bg-white";
                if (revealed && isCorrectOpt) {
                  borderClass = "border-green-500";
                  bgClass = "bg-green-50";
                } else if (revealed && selected && !isCorrectOpt) {
                  borderClass = "border-red-500";
                  bgClass = "bg-red-50";
                } else if (selected) {
                  borderClass = "border-primary";
                  bgClass = "bg-blue-50";
                }

                return (
                  <button
                    key={opt.key}
                    onClick={() => handleAnswer(opt.key)}
                    disabled={isAnswered}
                    className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all ${borderClass} ${bgClass}`}
                  >
                    <span
                      className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        revealed && isCorrectOpt
                          ? "bg-green-500 text-white"
                          : revealed && selected
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-text-gray"
                      }`}
                    >
                      {revealed && isCorrectOpt
                        ? "✓"
                        : revealed && selected
                        ? "✗"
                        : opt.key}
                    </span>
                    <span className="text-base text-text-dark">
                      {getOptionText(opt)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className={`mt-4 overflow-hidden rounded-xl border-l-4 p-4 ${
                  isCorrect
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                }`}
              >
                <p className="text-sm font-medium text-text-dark">
                  {isCorrect
                    ? useZhHant
                      ? "✓ 正確！"
                      : "✓ Correct!"
                    : useZhHant
                    ? "✗ 錯誤"
                    : "✗ Incorrect"}
                </p>
                {(() => {
                  const expl = getExplanation(currentQ);
                  return (
                    <>
                      <p className="mt-1 text-base text-text-gray">
                        {expl.main}
                      </p>
                      {expl.secondary && (
                        <p className="mt-1 text-base text-text-gray">
                          {expl.secondary}
                        </p>
                      )}
                    </>
                  );
                })()}
                {/* Flag as Uncertain button */}
                <div className="mt-3 border-t border-gray-200 pt-3">
                  {flaggedIds.has(currentQ.id) || storeQuestions[currentQ.id]?.flaggedUnknown ? (
                    <span className="text-xs font-medium text-text-gray">✓ {useZhHant ? "已標記" : "Flagged"}</span>
                  ) : (
                    <button
                      onClick={() => handleFlag(currentQ)}
                      className="text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
                    >
                      🚩 {useZhHant ? "標記為不確定" : "Flag as Uncertain"}
                    </button>
                  )}
                  <p className="mt-0.5 text-[10px] text-text-gray">
                    {useZhHant
                      ? "即使答對，此題也會加入錯題本以加強練習"
                      : "Even if correct, this will be added to Mistake Review"}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Next button */}
        {isAnswered && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleNext}
            className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90"
          >
            {currentIdx < totalQ - 1
              ? useZhHant
                ? "下一題 →"
                : "Next Question →"
              : useZhHant
              ? "查看結果"
              : "See Results"}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────
// Group header with completion badge
// ────────────────────────────────────────────────────────────

function GroupHeader({
  title_en,
  title_zh,
  title_zhHant,
  estimatedMinutes,
  isCompleted,
  score,
  questionsCount,
  mode,
}: {
  title_en: string;
  title_zh: string;
  title_zhHant: string;
  estimatedMinutes?: number;
  isCompleted: boolean;
  score?: number;
  questionsCount?: number;
  mode: LanguageMode;
}) {
  const { main, secondary } = bi(title_en, title_zh, title_zhHant, mode);
  return (
    <div className="flex items-center gap-3">
      {isCompleted && (
        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 text-xs">
          ✓
        </span>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-text-dark">{main}</h3>
        {secondary && (
          <p className="text-sm text-text-gray">{secondary}</p>
        )}
      </div>
      <div className="flex items-center gap-2 text-xs text-text-gray flex-shrink-0">
        {estimatedMinutes && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5">
            ~{estimatedMinutes} min
          </span>
        )}
        {isCompleted && score !== undefined && questionsCount !== undefined && (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-700">
            {score}/{questionsCount}
          </span>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Phase 1 Renderer
// ────────────────────────────────────────────────────────────

function Phase1Content({ languageMode }: { languageMode: LanguageMode }) {
  const groups = phase1Data.groups as P1Group[];
  const phase1 = useCrashCourseStore((s) => s.phase1);
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
  const quizRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeQuiz && quizRef.current) {
      quizRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeQuiz]);

  return (
    <div className="space-y-8">
      {groups.map((group) => {
        const isCompleted = phase1.completedGroups.includes(group.id);
        const score = phase1.scores[group.id];

        return (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
          >
            <div className="p-5 md:p-6">
              <GroupHeader
                title_en={group.title_en}
                title_zh={group.title_zh}
                title_zhHant={group.title_zhHant}
                estimatedMinutes={group.estimatedMinutes}
                isCompleted={isCompleted}
                score={score}
                questionsCount={group.questions.length}
                mode={languageMode}
              />

              {/* Number cards */}
              <div className="mt-5 space-y-3">
                {group.cards.map((card, ci) => (
                  <motion.div
                    key={ci}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: ci * 0.05 }}
                    className="flex gap-4 rounded-xl border border-border bg-white p-4"
                  >
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center rounded-lg bg-primary/10 px-3 py-2 text-lg font-bold text-primary tabular-nums">
                        {card.number}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      {card.rules.map((rule, ri) => (
                        <div key={ri}>
                          <BilingualText
                            en={rule.en}
                            zh={rule.zh}
                            zhHant={rule.zhHant}
                            mode={languageMode}
                            mainClassName="text-base text-text-dark leading-relaxed"
                            secondaryClassName="text-base text-text-gray mt-0.5"
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Mnemonic */}
              <div className="mt-4 rounded-xl bg-yellow-50 border border-yellow-200 p-4">
                <p className="text-base">
                  <span className="mr-1.5">💡</span>
                  <BilingualText
                    en={group.mnemonic_en}
                    zh={group.mnemonic_zh}
                    zhHant={group.mnemonic_zhHant}
                    mode={languageMode}
                    mainClassName="font-medium text-yellow-900"
                    secondaryClassName="text-base text-yellow-700 mt-0.5"
                  />
                </p>
              </div>

              {/* Quiz button / inline quiz */}
              {activeQuiz === group.id ? (
                <div ref={quizRef}>
                  <InlineQuiz
                    questions={group.questions}
                    groupId={group.id}
                    phase={1}
                    languageMode={languageMode}
                    onComplete={() => setActiveQuiz(null)}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setActiveQuiz(group.id)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary/20 bg-primary/5 py-3 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
                >
                  {languageMode === "zhHant_zhHans"
                    ? `開始練習 (${group.questions.length} 題)`
                    : `Start Practice (${group.questions.length} Q)`}
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Phase 2 Renderer
// ────────────────────────────────────────────────────────────

function Phase2SummaryTable({
  table,
  languageMode,
}: {
  table: P2SummaryTable;
  languageMode: LanguageMode;
}) {
  const headers =
    languageMode === "zhHant_zhHans"
      ? table.headers_zhHant
      : languageMode === "en_only"
      ? table.headers_en
      : table.headers_en;
  const headersSecondary =
    languageMode === "en_zhHans"
      ? table.headers_zh
      : languageMode === "zhHant_zhHans"
      ? table.headers_zh
      : null;

  // Build row cells by matching keys based on the header pattern
  const getRowCells = (row: Record<string, string>): string[][] => {
    const keys = Object.keys(row);
    const cellGroups: string[][] = [];

    // Group keys by suffix: _en, _zh, _zhHant or bare
    const seen = new Set<string>();
    for (const key of keys) {
      const base = key
        .replace(/_en$/, "")
        .replace(/_zh$/, "")
        .replace(/_zhHant$/, "");
      if (seen.has(base)) continue;
      seen.add(base);

      const enVal = row[`${base}_en`] ?? row[base] ?? "";
      const zhVal = row[`${base}_zh`] ?? row[base] ?? "";
      const zhHantVal = row[`${base}_zhHant`] ?? row[base] ?? "";

      let main = "";
      let secondary = "";
      switch (languageMode) {
        case "en_only":
          main = enVal;
          break;
        case "en_zhHans":
          main = enVal;
          secondary = zhVal !== enVal ? zhVal : "";
          break;
        case "zhHant_zhHans":
          main = zhHantVal || zhVal;
          secondary = zhVal !== main ? zhVal : "";
          break;
      }
      cellGroups.push([main, secondary]);
    }
    return cellGroups;
  };

  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            {headers.map((h, i) => (
              <th
                key={i}
                className="whitespace-nowrap px-4 py-2.5 text-left font-semibold text-text-dark"
              >
                {h}
                {headersSecondary?.[i] && (
                  <span className="block text-xs font-normal text-text-gray">
                    {headersSecondary[i]}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => {
            const cells = getRowCells(row);
            return (
              <tr
                key={ri}
                className={ri % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
              >
                {cells.map((cell, ci) => (
                  <td key={ci} className="px-4 py-2.5 text-text-dark">
                    <span>{cell[0]}</span>
                    {cell[1] && (
                      <span className="block text-xs text-text-gray">
                        {cell[1]}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Phase2Content({ languageMode }: { languageMode: LanguageMode }) {
  const topics = phase2Data.topics as P2Topic[];
  const phase2 = useCrashCourseStore((s) => s.phase2);
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
  const quizRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeQuiz && quizRef.current) {
      quizRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeQuiz]);

  return (
    <div className="space-y-8">
      {topics.map((topic) => {
        const isCompleted = phase2.completedGroups.includes(topic.id);
        const score = phase2.scores[topic.id];

        return (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
          >
            <div className="p-5 md:p-6">
              <GroupHeader
                title_en={topic.title_en}
                title_zh={topic.title_zh}
                title_zhHant={topic.title_zhHant}
                estimatedMinutes={topic.estimatedMinutes}
                isCompleted={isCompleted}
                score={score}
                questionsCount={topic.questions.length}
                mode={languageMode}
              />

              {/* Core rule highlight */}
              {topic.coreRule && (
                <div className="mt-4 rounded-xl border-2 border-red-200 bg-red-50 p-4">
                  <div className="flex items-start gap-2">
                    {topic.coreRule.isHighFreq && (
                      <span className="mt-0.5 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white whitespace-nowrap">
                        🔥 HIGH FREQ
                      </span>
                    )}
                    <BilingualText
                      en={topic.coreRule.content_en}
                      zh={topic.coreRule.content_zh}
                      zhHant={topic.coreRule.content_zhHant}
                      mode={languageMode}
                      mainClassName="text-base font-semibold text-red-900 leading-relaxed"
                      secondaryClassName="text-base text-red-700 mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Knowledge cards */}
              <div className="mt-5 space-y-3">
                {topic.cards.map((card, ci) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: ci * 0.04 }}
                    className="rounded-xl border border-border bg-white p-4"
                  >
                    <div className="flex items-start gap-2 flex-wrap">
                      {/* Title */}
                      <h4 className="font-semibold text-text-dark text-sm">
                        {(() => {
                          const { main } = bi(
                            card.title_en,
                            card.title_zh,
                            card.title_zhHant,
                            languageMode
                          );
                          return main;
                        })()}
                      </h4>
                      {card.isHighFreq && (
                        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700 whitespace-nowrap">
                          🔥 High Freq
                        </span>
                      )}
                      {card.isEasyMistake && (
                        <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-bold text-yellow-700 whitespace-nowrap">
                          ⚠️ Easy Mistake
                        </span>
                      )}
                    </div>

                    <div className="mt-2">
                      <BilingualText
                        en={card.content_en}
                        zh={card.content_zh}
                        zhHant={card.content_zhHant}
                        mode={languageMode}
                        mainClassName="text-base text-text-dark leading-relaxed"
                        secondaryClassName="text-base text-text-gray mt-1"
                      />
                    </div>

                    {card.isEasyMistake &&
                      card.mistakeNote_en && (
                        <div className="mt-2 rounded-lg bg-yellow-50 border border-yellow-200 px-3 py-2">
                          <p className="text-base">
                            <span className="mr-1">⚠️</span>
                            <BilingualText
                              en={card.mistakeNote_en}
                              zh={card.mistakeNote_zh || ""}
                              zhHant={card.mistakeNote_zhHant}
                              mode={languageMode}
                              mainClassName="font-medium text-yellow-900"
                              secondaryClassName="text-base text-yellow-700 mt-0.5"
                            />
                          </p>
                        </div>
                      )}
                  </motion.div>
                ))}
              </div>

              {/* Summary table */}
              {topic.summaryTable && (
                <Phase2SummaryTable
                  table={topic.summaryTable}
                  languageMode={languageMode}
                />
              )}

              {/* Quiz button / inline quiz */}
              {activeQuiz === topic.id ? (
                <div ref={quizRef}>
                  <InlineQuiz
                    questions={topic.questions}
                    groupId={topic.id}
                    phase={2}
                    languageMode={languageMode}
                    onComplete={() => setActiveQuiz(null)}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setActiveQuiz(topic.id)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary/20 bg-primary/5 py-3 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
                >
                  {languageMode === "zhHant_zhHans"
                    ? `開始練習 (${topic.questions.length} 題)`
                    : `Start Practice (${topic.questions.length} Q)`}
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Phase 3 Renderer
// ────────────────────────────────────────────────────────────

function Phase3Content({ languageMode }: { languageMode: LanguageMode }) {
  const comparisons = phase3Data.comparisons as P3Comparison[];
  const phase3 = useCrashCourseStore((s) => s.phase3);
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
  const quizRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeQuiz && quizRef.current) {
      quizRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeQuiz]);

  const getCellText = (cell: P3TableCell): { main: string; secondary: string | null } =>
    bi(cell.en, cell.zh, cell.zhHant, languageMode);

  return (
    <div className="space-y-8">
      {comparisons.map((comp) => {
        const isCompleted = phase3.completedGroups.includes(comp.id);
        const score = phase3.scores[comp.id];

        return (
          <motion.div
            key={comp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
          >
            <div className="p-5 md:p-6">
              <GroupHeader
                title_en={comp.title_en}
                title_zh={comp.title_zh}
                title_zhHant={comp.title_zhHant}
                isCompleted={isCompleted}
                score={score}
                questionsCount={comp.questions.length}
                mode={languageMode}
              />

              {/* Comparison table */}
              <div className="mt-4 overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      {comp.table.headers.map((h, i) => {
                        const { main, secondary } = getCellText(h);
                        return (
                          <th
                            key={i}
                            className="whitespace-nowrap px-4 py-2.5 text-left font-semibold text-text-dark"
                          >
                            {main}
                            {secondary && (
                              <span className="block text-xs font-normal text-text-gray">
                                {secondary}
                              </span>
                            )}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {comp.table.rows.map((row, ri) => (
                      <tr
                        key={ri}
                        className={
                          ri % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }
                      >
                        {row.cells.map((cell, ci) => {
                          const { main, secondary } = getCellText(cell);
                          // Color code for check/cross
                          const hasGreen =
                            main.includes("✅") || main.includes("✓");
                          const hasRed =
                            main.includes("❌") || main.includes("✗");
                          return (
                            <td
                              key={ci}
                              className={`px-4 py-2.5 ${
                                hasGreen
                                  ? "text-green-700"
                                  : hasRed
                                  ? "text-red-600"
                                  : "text-text-dark"
                              }`}
                            >
                              <span>{main}</span>
                              {secondary && (
                                <span className="block text-xs text-text-gray">
                                  {secondary}
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Quiz button / inline quiz */}
              {activeQuiz === comp.id ? (
                <div ref={quizRef}>
                  <InlineQuiz
                    questions={comp.questions}
                    groupId={comp.id}
                    phase={3}
                    languageMode={languageMode}
                    onComplete={() => setActiveQuiz(null)}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setActiveQuiz(comp.id)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary/20 bg-primary/5 py-3 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
                >
                  {languageMode === "zhHant_zhHans"
                    ? `練習題目 (${comp.questions.length} 題)`
                    : `Practice Questions (${comp.questions.length} Q)`}
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Phase 4 Renderer
// ────────────────────────────────────────────────────────────

function Phase4Content({ languageMode }: { languageMode: LanguageMode }) {
  const questions = (phase4Data.questions ?? []) as QuizQuestion[];
  const phase4Result = useCrashCourseStore((s) => s.phase4);
  const submitPhase4 = useCrashCourseStore((s) => s.submitPhase4);
  const syncToFirestore = useCrashCourseStore((s) => s.syncToFirestore);

  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const useZhHant = languageMode === "zhHant_zhHans";
  const passThreshold = phase4Data.passThreshold;
  const totalQ = phase4Data.totalQuestions;

  // Timer
  useEffect(() => {
    if (started && !submitted) {
      timerRef.current = setInterval(() => {
        setElapsedSec((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, submitted]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Coming soon
  if (questions.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
          🚧
        </div>
        <h3 className="mt-4 text-xl font-bold text-text-dark">Coming Soon</h3>
        <p className="mt-1 text-sm text-text-gray">即将推出</p>
        <p className="mt-4 text-sm text-text-gray">
          {useZhHant
            ? "模擬考試正在準備中，請稍候回來查看。"
            : "The mock exam is being prepared. Please check back later."}
        </p>
      </div>
    );
  }

  // Results after submit
  if (submitted) {
    let correct = 0;
    const wrongIds: string[] = [];
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) {
        correct++;
      } else {
        wrongIds.push(q.id);
      }
    });
    const passed = correct >= passThreshold;

    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl ${
            passed ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {passed ? "🎉" : "📚"}
        </div>
        <h3 className="mt-4 text-3xl font-bold text-text-dark">
          {correct}/{totalQ}
        </h3>
        <p
          className={`text-lg font-semibold ${
            passed ? "text-green-600" : "text-red-600"
          }`}
        >
          {passed
            ? useZhHant
              ? "通過！"
              : "PASSED!"
            : useZhHant
            ? "未通過"
            : "NOT PASSED"}
        </p>
        <p className="mt-1 text-sm text-text-gray">
          {useZhHant
            ? `及格線：${passThreshold}/${totalQ} | 用時：${formatTime(elapsedSec)}`
            : `Pass: ${passThreshold}/${totalQ} | Time: ${formatTime(elapsedSec)}`}
        </p>
        <div className="mt-6 flex flex-col items-center gap-2">
          <button
            onClick={() => {
              setAnswers({});
              setCurrentIdx(0);
              setSubmitted(false);
              setElapsedSec(0);
              setStarted(true);
            }}
            className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white hover:bg-primary/90"
          >
            {useZhHant ? "重新考試" : "Retake Exam"}
          </button>
          <Link
            href="/crash-course"
            className="text-sm text-text-gray hover:text-primary"
          >
            {useZhHant ? "返回課程" : "Back to Course"}
          </Link>
        </div>
      </div>
    );
  }

  // Not started yet
  if (!started) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
          📝
        </div>
        <h3 className="mt-4 text-xl font-bold text-text-dark">
          {useZhHant ? "模擬考試" : "Mock Exam"}
        </h3>
        <p className="mt-2 text-sm text-text-gray">
          {useZhHant
            ? `${totalQ} 題 | 及格 ${passThreshold} 題 (${phase4Data.passPercentage}%)`
            : `${totalQ} Questions | Pass: ${passThreshold} (${phase4Data.passPercentage}%)`}
        </p>
        {phase4Result && (
          <p className="mt-2 text-xs text-text-gray">
            {useZhHant
              ? `上次成績：${phase4Result.score}/${phase4Result.total} ${phase4Result.passed ? "✓ 通過" : "✗ 未通過"}`
              : `Previous: ${phase4Result.score}/${phase4Result.total} ${phase4Result.passed ? "✓ Passed" : "✗ Failed"}`}
          </p>
        )}
        <button
          onClick={() => setStarted(true)}
          className="mt-6 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white hover:bg-primary/90"
        >
          {useZhHant ? "開始考試" : "Start Exam"}
        </button>
      </div>
    );
  }

  // Active exam
  const currentQ = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;

  const handleSubmit = () => {
    let correct = 0;
    const wrongIds: string[] = [];
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) {
        correct++;
      } else {
        wrongIds.push(q.id);
      }
    });
    submitPhase4(correct, totalQ, wrongIds);
    // Record wrong answers to mistake store
    const user = useAuthStore.getState().user;
    const addWrong = useWrongQuestionStore.getState().addWrongQuestion;
    questions.forEach((q, i) => {
      if (answers[i] !== undefined && answers[i] !== q.answer) {
        const wrongEntry = {
          questionId: q.id,
          source: "crash" as const,
          sourceId: "CC-P4",
          moduleId: "CC-P4",
          wrongAnswer: answers[i],
          correctAnswer: q.answer,
        };
        addWrong(wrongEntry);
        if (user) {
          const storeQ = useWrongQuestionStore.getState().questions[q.id];
          if (storeQ) saveWrongQuestionToFirestore(user.uid, storeQ).catch(() => {});
        }
      }
    });
    if (user) {
      syncToFirestore(user.uid);
    }
    setSubmitted(true);
  };

  const getStem = (q: QuizQuestion) =>
    useZhHant ? q.stem_zhHant || q.stem_en : q.stem_en;

  const getOptionText = (opt: QuizOption) =>
    useZhHant ? opt.text_zhHant || opt.text_en : opt.text_en;

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="sticky top-16 z-20 -mx-4 rounded-b-xl border-b border-border bg-card px-4 py-3 shadow-sm md:-mx-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-primary">
            {currentIdx + 1}/{totalQ}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-mono text-text-gray">
            {formatTime(elapsedSec)}
          </span>
          <span className="text-xs text-text-gray">
            {answeredCount}/{totalQ}{" "}
            {useZhHant ? "已答" : "answered"}
          </span>
        </div>
        {/* Progress */}
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-1 bg-primary transition-all"
            style={{
              width: `${(answeredCount / totalQ) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question navigator (compact) */}
      <div className="flex flex-wrap gap-1.5">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIdx(i)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
              i === currentIdx
                ? "bg-primary text-white"
                : answers[i] !== undefined
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-text-gray hover:bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.15 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <p className="text-lg font-medium leading-relaxed text-text-dark">
            {getStem(currentQ)}
          </p>
          <div className="mt-4 space-y-2.5">
            {currentQ.options.map((opt) => {
              const selected = answers[currentIdx] === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, [currentIdx]: opt.key }))
                  }
                  className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all ${
                    selected
                      ? "border-primary bg-blue-50"
                      : "border-border bg-white hover:border-primary/30"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      selected
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-text-gray"
                    }`}
                  >
                    {opt.key}
                  </span>
                  <span className="text-base text-text-dark">
                    {getOptionText(opt)}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx((i) => i - 1)}
          className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-dark hover:bg-gray-50 disabled:opacity-30"
        >
          {useZhHant ? "← 上一題" : "← Prev"}
        </button>

        {currentIdx < totalQ - 1 ? (
          <button
            onClick={() => setCurrentIdx((i) => i + 1)}
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
          >
            {useZhHant ? "下一題 →" : "Next →"}
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={answeredCount < totalQ}
            className="rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          >
            {useZhHant
              ? `提交 (${answeredCount}/${totalQ})`
              : `Submit (${answeredCount}/${totalQ})`}
          </button>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Main Page
// ────────────────────────────────────────────────────────────

export default function CrashCoursePhaseDetailPage() {
  const params = useParams();
  const phaseId = params.phaseId as string;
  const phaseNum = parseInt(phaseId, 10);

  const redirecting = useRequireSession();
  const languageMode = useAppStore((s) => s.languageMode);
  const getPhaseProgress = useCrashCourseStore((s) => s.getPhaseProgress);

  const meta = PHASE_META[phaseId];
  const useZhHant = languageMode === "zhHant_zhHans";

  if (redirecting) return null;

  // Invalid phase
  if (!meta || phaseNum < 1 || phaseNum > 4) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-text-dark">Phase not found</h1>
        <Link
          href="/crash-course"
          className="mt-4 inline-block text-primary hover:underline"
        >
          Back to Crash Course
        </Link>
      </div>
    );
  }

  const progress = getPhaseProgress(phaseNum);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 pb-24">
      {/* Back link */}
      <Link
        href="/crash-course"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-text-gray hover:text-primary transition-colors"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {useZhHant ? "返回課程" : "Back to Crash Course"}
      </Link>

      {/* Phase header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
            {phaseId}
          </span>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-text-dark md:text-2xl">
              <BilingualText
                en={meta.title_en}
                zh={meta.title_zh}
                zhHant={meta.title_zhHant}
                mode={languageMode}
                mainClassName="text-xl font-bold text-text-dark md:text-2xl"
                secondaryClassName="text-sm text-text-gray mt-0.5"
              />
            </h1>
          </div>
        </div>

        {/* Progress + estimated time */}
        <div className="mt-3 flex items-center gap-4 text-sm text-text-gray">
          <span className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            ~{meta.estimatedMinutes} min
          </span>
          <span className="flex items-center gap-1.5">
            {progress.completed}/{progress.total}{" "}
            {useZhHant ? "已完成" : "completed"}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-500"
            style={{
              width: `${
                progress.total > 0
                  ? (progress.completed / progress.total) * 100
                  : 0
              }%`,
            }}
          />
        </div>
      </div>

      {/* Phase content */}
      {phaseNum === 1 && <Phase1Content languageMode={languageMode} />}
      {phaseNum === 2 && <Phase2Content languageMode={languageMode} />}
      {phaseNum === 3 && <Phase3Content languageMode={languageMode} />}
      {phaseNum === 4 && <Phase4Content languageMode={languageMode} />}
    </div>
  );
}
