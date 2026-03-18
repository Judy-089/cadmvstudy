import type { LanguageMode, ExamLanguage } from "@/store/useAppStore";

interface KnowledgePointLike {
  en: string;
  zh: string;
  zhHant?: string;
}

interface QuestionLike {
  stem_en: string;
  stem_zhHant?: string;
  options: { key: string; text_en: string; text_zhHant?: string }[];
  explanation_en: string;
  explanation_zh: string;
  explanation_zhHant?: string;
}

export function getStudyText(
  point: KnowledgePointLike,
  mode: LanguageMode
): { main: string; collapsible: string | null; collapsibleLabel: string } {
  switch (mode) {
    case "zhHant_zhHans":
      return {
        main: point.zhHant || point.zh,
        collapsible: point.zh,
        collapsibleLabel: "查看简体 ▼",
      };
    case "en_zhHans":
      return {
        main: point.en,
        collapsible: point.zh,
        collapsibleLabel: "Show Chinese 查看中文 ▼",
      };
    case "en_only":
      return {
        main: point.en,
        collapsible: null,
        collapsibleLabel: "",
      };
  }
}

export function getExamText(question: QuestionLike, lang: ExamLanguage) {
  switch (lang) {
    case "zhHant":
      return {
        stem: question.stem_zhHant || question.stem_en,
        getOptionText: (opt: { text_en: string; text_zhHant?: string }) =>
          opt.text_zhHant || opt.text_en,
        explanation: question.explanation_zhHant || question.explanation_en,
        explanationSecondary: question.explanation_en,
      };
    case "en":
      return {
        stem: question.stem_en,
        getOptionText: (opt: { text_en: string; text_zhHant?: string }) =>
          opt.text_en,
        explanation: question.explanation_en,
        explanationSecondary: question.explanation_zh,
      };
  }
}

export const LANGUAGE_MODE_LABELS: Record<LanguageMode, { en: string; zh: string }> = {
  zhHant_zhHans: { en: "繁體中文", zh: "繁体为主 + 简体辅助" },
  en_zhHans: { en: "English + 中文", zh: "英文为主 + 简体辅助" },
  en_only: { en: "English Only", zh: "纯英文" },
};

export const EXAM_LANGUAGE_LABELS: Record<ExamLanguage, string> = {
  zhHant: "繁體中文",
  en: "English",
};
