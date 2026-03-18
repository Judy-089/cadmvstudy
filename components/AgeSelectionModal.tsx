"use client";

import { useAppStore, AgeGroup } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/useT";

interface Props {
  onClose: () => void;
}

export function AgeSelectionModal({ onClose }: Props) {
  const enterGuestMode = useAppStore((s) => s.enterGuestMode);
  const router = useRouter();
  const t = useT();

  const handleSelect = (age: AgeGroup) => {
    enterGuestMode(age);
    router.push("/study");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
        <h2 className="text-xl font-bold text-text-dark text-center">{t("age.title")}</h2>
        <p className="mt-1 text-sm text-text-gray text-center">{t("age.subtitle")}</p>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSelect("under18")}
            className="group flex flex-col items-center gap-3 rounded-xl border-2 border-border bg-white p-6 transition-all hover:border-primary hover:shadow-md"
          >
            <span className="text-4xl">🎓</span>
            <div className="text-center">
              <p className="text-lg font-semibold text-text-dark group-hover:text-primary">{t("age.under18")}</p>
              <p className="mt-1 text-xs text-text-gray">{t("age.under18exam")}</p>
            </div>
          </button>

          <button
            onClick={() => handleSelect("18plus")}
            className="group flex flex-col items-center gap-3 rounded-xl border-2 border-border bg-white p-6 transition-all hover:border-primary hover:shadow-md"
          >
            <span className="text-4xl">🚗</span>
            <div className="text-center">
              <p className="text-lg font-semibold text-text-dark group-hover:text-primary">{t("age.18plus")}</p>
              <p className="mt-1 text-xs text-text-gray">{t("age.18plusExam")}</p>
            </div>
          </button>
        </div>

        <button onClick={onClose} className="mt-4 w-full text-center text-sm text-text-gray hover:text-text-dark">
          {t("age.cancel")}
        </button>
      </div>
    </div>
  );
}
