"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { WrongQuestion } from "@/store/useWrongQuestionStore";

export interface QuestionData {
  id: string;
  stem_en: string;
  stem_zh?: string;
  stem_zhHant?: string;
  options: { key: string; text_en: string; text_zh?: string; text_zhHant?: string }[];
  answer: string;
  explanation_en: string;
  explanation_zh?: string;
  explanation_zhHant?: string;
  tags?: string[];
  module?: string;
}

// Cache loaded question data across re-renders
const questionCache = new Map<string, QuestionData>();

/**
 * Groups wrong questions by their source file for batch loading.
 * Returns a map: sourceFile -> questionIds[]
 */
function groupBySourceFile(wrongs: WrongQuestion[]) {
  const groups = new Map<string, { type: "quiz" | "mock" | "crash"; file: string; ids: string[] }>();

  for (const wq of wrongs) {
    if (questionCache.has(wq.questionId)) continue; // already cached

    let key: string;
    let type: "quiz" | "mock" | "crash";
    let file: string;

    if (wq.source === "mock") {
      type = "mock";
      file = wq.sourceId; // e.g. "MOCK-01"
      key = `mock:${file}`;
    } else if (wq.source === "crash") {
      type = "crash";
      // sourceId like "CC-P1-bac" or "CC-P4"
      const phaseMatch = wq.sourceId.match(/CC-P(\d)/);
      const phaseNum = phaseMatch ? phaseMatch[1] : "1";
      file = `phase${phaseNum}`;
      key = `crash:${file}`;
    } else {
      // quiz — sourceId like "M02-S01", moduleId like "M02"
      type = "quiz";
      file = wq.moduleId; // e.g. "M02"
      key = `quiz:${file}`;
    }

    if (!groups.has(key)) {
      groups.set(key, { type, file, ids: [] });
    }
    groups.get(key)!.ids.push(wq.questionId);
  }

  return groups;
}

async function loadQuestionsFromSource(
  type: "quiz" | "mock" | "crash",
  file: string,
  targetIds: string[]
): Promise<void> {
  try {
    let allQuestions: QuestionData[] = [];

    if (type === "mock") {
      const mod = await import(`@/data/exams/${file}.json`);
      const data = mod.default || mod;
      allQuestions = data.questions || [];
    } else if (type === "quiz") {
      const mod = await import(`@/data/quizzes/${file}.json`);
      const data = mod.default || mod;
      for (const sec of data.sections || []) {
        allQuestions.push(...(sec.questions || []));
      }
    } else if (type === "crash") {
      const mod = await import(`@/data/crashcourse/${file}.json`);
      const data = mod.default || mod;
      if (data.groups) {
        // Phases 1-3: groups[].questions[]
        for (const group of data.groups) {
          allQuestions.push(...(group.questions || []));
        }
      }
      if (data.questions) {
        // Phase 4: questions[]
        allQuestions.push(...data.questions);
      }
    }

    // Index by id
    const idSet = new Set(targetIds);
    for (const q of allQuestions) {
      if (idSet.has(q.id)) {
        questionCache.set(q.id, q);
      }
    }
  } catch {
    // Skip if file can't be loaded
  }
}

/**
 * Hook that batch-loads question data for a list of WrongQuestion entries.
 * Returns a Map<questionId, QuestionData> and a loading flag.
 */
export function useQuestionLoader(wrongs: WrongQuestion[]) {
  const [questionMap, setQuestionMap] = useState<Map<string, QuestionData>>(new Map());
  const [loading, setLoading] = useState(false);
  const loadedRef = useRef(new Set<string>());

  const loadQuestions = useCallback(async (wrongList: WrongQuestion[]) => {
    const groups = groupBySourceFile(wrongList);
    if (groups.size === 0) {
      // All from cache
      const map = new Map<string, QuestionData>();
      for (const wq of wrongList) {
        const cached = questionCache.get(wq.questionId);
        if (cached) map.set(wq.questionId, cached);
      }
      setQuestionMap(map);
      return;
    }

    setLoading(true);

    // Load all source files in parallel
    await Promise.all(
      Array.from(groups.values()).map((g) =>
        loadQuestionsFromSource(g.type, g.file, g.ids)
      )
    );

    // Build result map from cache
    const map = new Map<string, QuestionData>();
    for (const wq of wrongList) {
      const cached = questionCache.get(wq.questionId);
      if (cached) map.set(wq.questionId, cached);
    }

    setQuestionMap(map);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Check if the set of question IDs has changed
    const ids = wrongs.map((w) => w.questionId).sort().join(",");
    if (loadedRef.current.has(ids) && questionMap.size > 0) return;
    loadedRef.current.add(ids);
    loadQuestions(wrongs);
  }, [wrongs, loadQuestions, questionMap.size]);

  return { questionMap, loading };
}

/**
 * Load question data for specific wrong questions (imperative, for review sessions).
 */
export async function loadQuestionDataForReview(
  wrongs: WrongQuestion[]
): Promise<QuestionData[]> {
  const groups = groupBySourceFile(wrongs);

  await Promise.all(
    Array.from(groups.values()).map((g) =>
      loadQuestionsFromSource(g.type, g.file, g.ids)
    )
  );

  const result: QuestionData[] = [];
  for (const wq of wrongs) {
    const cached = questionCache.get(wq.questionId);
    if (cached) result.push(cached);
  }
  return result;
}
