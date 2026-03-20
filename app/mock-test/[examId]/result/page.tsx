"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense, useMemo } from "react";
import Link from "next/link";
import { tagImages, ImageMapping } from "@/data/imageMap";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useWrongQuestionStore } from "@/store/useWrongQuestionStore";
import { saveWrongQuestion } from "@/lib/firestore";
import { getExamText } from "@/lib/language";
import { getPassThreshold, getAdultExamQuestions } from "@/lib/examUtils";
import type { ExamLanguage } from "@/store/useAppStore";

interface Question {
  id: string;
  stem_en: string;
  stem_zhHant?: string;
  options: { key: string; text_en: string; text_zhHant?: string }[];
  answer: string;
  explanation_en: string;
  explanation_zh: string;
  explanation_zhHant?: string;
  module: string;
  tags: string[];
  driverEd?: boolean;
}

interface ExamData {
  examId: string;
  questions: Question[];
}

function ResultContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const examId = params.examId as string;

  const score = parseInt(searchParams.get("score") || "0");
  const total = parseInt(searchParams.get("total") || "46");
  const time = parseInt(searchParams.get("time") || "0");
  const examLang = (searchParams.get("lang") || "en") as ExamLanguage;
  const answersStr = searchParams.get("answers") || "{}";
  const answers: Record<number, string> = JSON.parse(decodeURIComponent(answersStr));

  const sessionMode = useAppStore((s) => s.sessionMode);
  const ageGroup = useAppStore((s) => s.ageGroup);

  const [rawExam, setRawExam] = useState<ExamData | null>(null);
  const [showExplanations, setShowExplanations] = useState(false);
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());
  const storeQuestions = useWrongQuestionStore((s) => s.questions);

  useEffect(() => {
    import(`@/data/exams/${examId}.json`)
      .then((mod) => setRawExam(mod.default || mod))
      .catch(() => setRawExam(null));
  }, [examId]);

  // Filter questions same way as the exam page
  const exam = useMemo(() => {
    if (!rawExam) return null;
    const isAdult = ageGroup !== "under18";
    const questions = isAdult ? getAdultExamQuestions(rawExam.questions) : rawExam.questions;
    return { ...rawExam, questions };
  }, [rawExam, ageGroup, sessionMode]);

  // Collect wrong answers
  const addWrongQuestion = useWrongQuestionStore((s) => s.addWrongQuestion);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!exam) return;
    const wrongs: { questionId: string; source: "mock"; sourceId: string; moduleId: string; wrongAnswer: string; correctAnswer: string }[] = [];
    exam.questions.forEach((q, i) => {
      const userAnswer = answers[i];
      if (userAnswer && userAnswer !== q.answer) {
        wrongs.push({
          questionId: q.id,
          source: "mock",
          sourceId: examId,
          moduleId: q.module,
          wrongAnswer: userAnswer,
          correctAnswer: q.answer,
        });
      }
    });
    // Batch add to store
    wrongs.forEach((w) => addWrongQuestion(w));
    // Save to Firestore after store is updated
    if (user && wrongs.length > 0) {
      setTimeout(() => {
        const store = useWrongQuestionStore.getState();
        wrongs.forEach((w) => {
          const full = store.questions[w.questionId];
          if (full) saveWrongQuestion(user.uid, full).catch(() => {});
        });
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam]);

  const passThreshold = getPassThreshold(total);
  const passed = score >= passThreshold;
  const percentage = Math.round((score / total) * 100);
  const minutes = Math.floor(time / 60);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      {/* Score Card */}
      <div className={`rounded-2xl border-2 p-8 text-center shadow-sm ${
        passed ? "border-success bg-success-light" : "border-error bg-error-light"
      }`}>
        <p className="text-6xl font-bold">
          {passed ? <span className="text-success">PASS</span> : <span className="text-error">FAIL</span>}
        </p>
        <p className="mt-2 text-lg text-text-gray">
          {passed ? "Congratulations! 恭喜通过!" : "Keep practicing! 继续加油!"}
        </p>

        <div className="mt-6 flex items-center justify-center gap-8">
          <div>
            <p className="text-3xl font-bold text-text-dark">{score}/{total}</p>
            <p className="text-sm text-text-gray">Score</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-text-dark">{percentage}%</p>
            <p className="text-sm text-text-gray">Accuracy</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-text-dark">{minutes}m</p>
            <p className="text-sm text-text-gray">Time</p>
          </div>
        </div>

        <p className="mt-4 text-sm text-text-gray">
          Passing score: {passThreshold}/{total} (83%)
        </p>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <Link href="/mock-test" className="rounded-xl border-2 border-primary px-6 py-3 font-medium text-primary transition-all hover:bg-primary-light">
          Back to Exams
        </Link>
        <button
          onClick={() => setShowExplanations(!showExplanations)}
          className="rounded-xl bg-primary px-6 py-3 font-medium text-white transition-all hover:bg-primary/90"
        >
          {showExplanations ? "Hide" : "Review"} Answers
        </button>
      </div>

      {/* Question Review */}
      {showExplanations && exam && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-bold text-text-dark">
            Question Review <span className="text-sm font-normal text-text-gray">逐题回顾</span>
          </h2>
          {exam.questions.map((q, i) => {
            const userAnswer = answers[i];
            const isCorrect = userAnswer === q.answer;
            const qt = getExamText(q, examLang);

            return (
              <div
                key={q.id}
                className={`rounded-xl border-2 p-5 ${
                  isCorrect ? "border-success/30 bg-success-light/50" : "border-error/30 bg-error-light/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${isCorrect ? "text-success" : "text-error"}`}>
                    {isCorrect ? "✓ Correct" : "✗ Wrong"}
                  </span>
                  <span className="text-xs text-text-gray">Q{i + 1}</span>
                  <span className="text-xs text-text-gray">({q.module})</span>
                </div>

                <p className="mt-2 font-medium text-text-dark">{qt.stem}</p>

                <div className="mt-3 space-y-1">
                  {q.options.map((opt) => {
                    const isAnswer = opt.key === q.answer;
                    const isUserWrong = opt.key === userAnswer && !isCorrect;
                    return (
                      <div
                        key={opt.key}
                        className={`rounded-lg px-3 py-2 text-sm ${
                          isAnswer ? "bg-success/10 font-medium text-success"
                            : isUserWrong ? "bg-error/10 text-error line-through"
                            : "text-text-gray"
                        }`}
                      >
                        <span className="font-semibold">{opt.key}.</span>{" "}
                        {qt.getOptionText(opt)}
                        {isAnswer && " ✓"}
                        {isUserWrong && " (your answer)"}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 border-t border-border pt-3">
                  <p className="text-sm text-text-dark">{qt.explanation}</p>
                  {qt.explanationSecondary && (
                    <p className="text-zh mt-1">{qt.explanationSecondary}</p>
                  )}
                  {/* Related images */}
                  {q.tags && (() => {
                    const imgs: ImageMapping[] = [];
                    const seen = new Set<string>();
                    for (const tag of q.tags) {
                      const matches = tagImages[tag];
                      if (matches) {
                        for (const img of matches) {
                          if (!seen.has(img.src)) { seen.add(img.src); imgs.push(img); }
                        }
                      }
                    }
                    if (imgs.length === 0) return null;
                    return (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {imgs.slice(0, 3).map((img) => (
                          <figure key={img.src} className="overflow-hidden rounded-lg border border-border bg-gray-50">
                            <img src={img.src} alt={img.alt} className="max-h-24 w-auto object-contain p-1" loading="lazy" />
                            {img.caption && <figcaption className="px-2 py-0.5 text-center text-xs text-text-gray">{img.caption}</figcaption>}
                          </figure>
                        ))}
                      </div>
                    );
                  })()}
                  {/* Flag as Uncertain button */}
                  <div className="mt-3 border-t border-border pt-2">
                    {flaggedIds.has(q.id) || storeQuestions[q.id]?.flaggedUnknown ? (
                      <span className="text-xs font-medium text-text-gray">✓ Flagged 已標記</span>
                    ) : (
                      <button
                        onClick={() => {
                          const flagQ = useWrongQuestionStore.getState().flagQuestion;
                          flagQ({
                            questionId: q.id,
                            source: "mock" as const,
                            sourceId: examId,
                            moduleId: q.module,
                            correctAnswer: q.answer,
                          });
                          setFlaggedIds((prev) => new Set(prev).add(q.id));
                          if (user) {
                            const storeQ = useWrongQuestionStore.getState().questions[q.id];
                            if (storeQ) saveWrongQuestion(user.uid, storeQ).catch(() => {});
                          }
                        }}
                        className="text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
                      >
                        🚩 Flag as Uncertain 標記為不確定
                      </button>
                    )}
                    <p className="mt-0.5 text-[10px] text-text-gray">
                      Even if correct, this will be added to Mistake Review 即使答對也會加入錯題本
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-4xl px-4 py-16 text-center"><p className="text-text-gray">Loading results...</p></div>}>
      <ResultContent />
    </Suspense>
  );
}
