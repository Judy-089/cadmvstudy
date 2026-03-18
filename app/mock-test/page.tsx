"use client";

import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { LockedCard } from "@/components/LockedOverlay";
import { signInWithGoogle } from "@/lib/auth";
import { getPassThreshold } from "@/lib/examUtils";
import { useT } from "@/lib/useT";
import { useRequireSession } from "@/lib/useRequireSession";
import { useProgressStore } from "@/store/useProgressStore";

const mockExams = [
  { id: "MOCK-01", title: "Mock Exam 1", titleZh: "模拟考试 1", isNew: false },
  { id: "MOCK-02", title: "Mock Exam 2", titleZh: "模拟考试 2", isNew: false },
  { id: "MOCK-03", title: "Mock Exam 3", titleZh: "模拟考试 3", isNew: false },
  { id: "MOCK-04", title: "Mock Exam 4", titleZh: "模拟考试 4", isNew: false },
  { id: "MOCK-05", title: "Mock Exam 5", titleZh: "模拟考试 5", isNew: false },
  { id: "MOCK-06", title: "Mock Exam 6", titleZh: "模拟考试 6", isNew: true },
  { id: "MOCK-07", title: "Mock Exam 7", titleZh: "模拟考试 7", isNew: true },
  { id: "MOCK-08", title: "Mock Exam 8", titleZh: "模拟考试 8", isNew: true },
  { id: "MOCK-09", title: "Mock Exam 9", titleZh: "模拟考试 9", isNew: true },
  { id: "MOCK-10", title: "Mock Exam 10", titleZh: "模拟考试 10", isNew: true },
];

export default function MockTestPage() {
  const sessionMode = useAppStore((s) => s.sessionMode);
  const ageGroup = useAppStore((s) => s.ageGroup);
  const isExamUnlocked = useAppStore((s) => s.isExamUnlocked);
  const t = useT();
  const redirecting = useRequireSession();
  const testResults = useProgressStore((s) => s.testResults);

  if (redirecting) return null;

  const isAdult = ageGroup !== "under18";
  const questionCount = isAdult ? 36 : 46;
  const passScore = getPassThreshold(questionCount);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <h1 className="text-2xl font-bold text-text-dark md:text-3xl">
        {t("mock.title")}
      </h1>
      <p className="mt-2 text-text-gray">
        {questionCount} {t("mock.questions")} &middot; {t("mock.pass")}: {passScore}/{questionCount} (83%)
      </p>

      {sessionMode === "guest" && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-warning-light px-4 py-2 text-sm text-warning">
          <span>👋 {t("mock.guestBanner")}</span>
          <button onClick={signInWithGoogle} className="font-semibold underline hover:no-underline">
            {t("study.signInUnlockAll")}
          </button>
        </div>
      )}

      {sessionMode === "authenticated" && (
        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm text-text-gray">{t("mock.examType")}:</span>
          <div className="flex gap-1 rounded-lg bg-gray-100 p-0.5">
            <button
              onClick={() => useAppStore.getState().setAgeGroup("18plus")}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                isAdult ? "bg-primary text-white" : "text-text-gray hover:text-text-dark"
              }`}
            >
              18+ (36 Q)
            </button>
            <button
              onClick={() => useAppStore.getState().setAgeGroup("under18")}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                !isAdult ? "bg-primary text-white" : "text-text-gray hover:text-text-dark"
              }`}
            >
              &lt;18 (46 Q)
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockExams.map((exam) => {
          const unlocked = isExamUnlocked(exam.id);
          const result = testResults[exam.id];
          const hasTaken = !!result;
          const examPassed = result ? result.score >= getPassThreshold(result.total) : false;
          const cardContent = (
            <div className={`group relative rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md ${
              exam.isNew ? "border-primary/40 hover:border-primary" : "border-border hover:border-primary/30"
            }`}>
              {/* NEW ribbon */}
              {exam.isNew && !hasTaken && (
                <div className="absolute -top-2.5 -right-2.5 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
                  NEW
                </div>
              )}
              {/* PASS/FAIL badge */}
              {hasTaken && (
                <div className={`absolute -top-2.5 -right-2.5 rounded-full px-2.5 py-1 text-[10px] font-bold text-white shadow-md ${
                  examPassed ? "bg-success" : "bg-error"
                }`}>
                  {examPassed ? "PASS" : "FAIL"}
                </div>
              )}

              <h3 className="text-lg font-semibold text-text-dark group-hover:text-primary">
                {exam.title}
              </h3>
              <p className="text-sm text-text-gray">{exam.titleZh}</p>

              <div className="mt-3 flex items-center justify-between text-xs text-text-gray">
                {hasTaken ? (
                  <>
                    <span className={`font-semibold ${examPassed ? "text-success" : "text-error"}`}>
                      {result.score}/{result.total}
                    </span>
                    <span>{Math.round((result.score / result.total) * 100)}%</span>
                  </>
                ) : (
                  <>
                    <span>{questionCount} {t("mock.questions")}</span>
                    <span>{t("mock.pass")}: {passScore}/{questionCount}</span>
                  </>
                )}
              </div>
            </div>
          );
          if (unlocked) return <Link key={exam.id} href={`/mock-test/${exam.id}`}>{cardContent}</Link>;
          return <LockedCard key={exam.id}>{cardContent}</LockedCard>;
        })}
      </div>

      <div className="mt-8 rounded-xl border-l-4 border-primary bg-primary-light p-5">
        <h3 className="font-semibold text-primary">{t("mock.aboutTitle")}</h3>
        <ul className="mt-2 space-y-1 text-sm text-text-light">
          <li>{t("mock.aboutAdult")}</li>
          <li>{t("mock.aboutMinor")}</li>
          <li>{t("mock.aboutAccuracy")}</li>
          <li>{t("mock.aboutLanguage")}</li>
        </ul>
      </div>
    </div>
  );
}
