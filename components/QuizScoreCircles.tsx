"use client";

import { useQuizStore } from "@/store/useQuizStore";
import { useState, useEffect } from "react";

interface Props {
  moduleId: string;
}

interface SectionInfo {
  sectionId: string;
}

export function QuizScoreCircles({ moduleId }: Props) {
  const getSectionColor = useQuizStore((s) => s.getSectionColor);
  const [sections, setSections] = useState<SectionInfo[]>([]);

  useEffect(() => {
    import(`@/data/quizzes/${moduleId}.json`)
      .then((mod) => {
        const data = mod.default || mod;
        if (data.sections) {
          setSections(data.sections.map((s: { sectionId: string }) => ({
            sectionId: s.sectionId,
          })));
        }
      })
      .catch(() => setSections([]));
  }, [moduleId]);

  if (sections.length === 0) return null;

  const colorMap: Record<string, string> = {
    gray: "bg-gray-200 text-gray-400",
    green: "bg-success text-white",
    orange: "bg-warning text-white",
    red: "bg-error text-white",
  };

  return (
    <div className="flex items-center gap-1">
      {sections.map((sec, idx) => {
        const color = getSectionColor(moduleId, sec.sectionId);
        return (
          <div
            key={sec.sectionId}
            className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${colorMap[color]}`}
            title={`Section ${idx + 1}: ${color === "gray" ? "Not tested" : color}`}
          >
            {idx + 1}
          </div>
        );
      })}
    </div>
  );
}
