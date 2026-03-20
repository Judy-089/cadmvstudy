"use client";

import { useState } from "react";
import { useT } from "@/lib/useT";
import { Footer } from "@/components/Footer";
import { useRequireSession } from "@/lib/useRequireSession";
import { useUILanguageStore } from "@/store/useUILanguageStore";

type VisaType = "f1" | "j1" | "h1b" | "l1" | "o1" | "pr" | "citizen" | "h4" | "l2" | "o3" | "j2" | "f2";

const visaOptions: { id: VisaType; label: string }[] = [
  { id: "citizen", label: "U.S. Citizen" },
  { id: "pr", label: "Green Card" },
  { id: "f1", label: "F-1" },
  { id: "j1", label: "J-1" },
  { id: "h1b", label: "H-1B" },
  { id: "l1", label: "L-1" },
  { id: "o1", label: "O-1" },
  { id: "h4", label: "H-4" },
  { id: "l2", label: "L-2" },
  { id: "o3", label: "O-3" },
  { id: "j2", label: "J-2" },
  { id: "f2", label: "F-2" },
];

interface VisaDocItem {
  en: string;
  zhHant: string;
  zhHans: string;
}

interface VisaInfo {
  docs: VisaDocItem[];
  extraDocs: VisaDocItem[];
  validity: string;
}

const visaData: Record<VisaType, VisaInfo> = {
  citizen: {
    docs: [
      { en: "U.S. Passport / Birth Certificate / Naturalization Certificate", zhHant: "美國護照 / 出生證明 / 入籍證書", zhHans: "美国护照 / 出生证明 / 入籍证书" },
      { en: "SSN", zhHant: "SSN 社會安全號碼", zhHans: "SSN 社会安全号码" },
      { en: "2 CA residency documents", zhHant: "2份加州居住證明", zhHans: "2份加州居住证明" },
    ],
    extraDocs: [
      { en: "Name change docs (if applicable)", zhHant: "更名文件（如適用）", zhHans: "更名文件（如适用）" },
    ],
    validity: "~5 years",
  },
  pr: {
    docs: [
      { en: "Valid Green Card", zhHant: "有效綠卡", zhHans: "有效绿卡" },
      { en: "SSN", zhHant: "SSN 社會安全號碼", zhHans: "SSN 社会安全号码" },
      { en: "2 CA residency documents", zhHant: "2份加州居住證明", zhHans: "2份加州居住证明" },
    ],
    extraDocs: [
      { en: "I-797/I-797C (if extension pending)", zhHant: "I-797/I-797C（如延期申請中）", zhHans: "I-797/I-797C（如延期申请中）" },
      { en: "Name change docs (if applicable)", zhHant: "更名文件（如適用）", zhHans: "更名文件（如适用）" },
    ],
    validity: "~5 years",
  },
  f1: {
    docs: [
      { en: "Valid Passport", zhHant: "有效護照", zhHans: "有效护照" },
      { en: "Valid F-1 Visa", zhHant: "有效F-1簽證", zhHans: "有效F-1签证" },
      { en: "I-94 (printed)", zhHant: "I-94（已打印）", zhHans: "I-94（已打印）" },
      { en: "I-20", zhHant: "I-20", zhHans: "I-20" },
      { en: "2 CA residency documents", zhHant: "2份加州居住證明", zhHans: "2份加州居住证明" },
    ],
    extraDocs: [
      { en: "SSN (if you have one)", zhHant: "SSN（如果有）", zhHans: "SSN（如果有）" },
      { en: "Name change docs (if applicable)", zhHant: "更名文件（如適用）", zhHans: "更名文件（如适用）" },
    ],
    validity: "Tied to legal status",
  },
  j1: {
    docs: [
      { en: "Valid Passport", zhHant: "有效護照", zhHans: "有效护照" },
      { en: "Valid J-1 Visa", zhHant: "有效J-1簽證", zhHans: "有效J-1签证" },
      { en: "I-94 (printed)", zhHant: "I-94（已打印）", zhHans: "I-94（已打印）" },
      { en: "DS-2019", zhHant: "DS-2019", zhHans: "DS-2019" },
      { en: "2 CA residency documents", zhHant: "2份加州居住證明", zhHans: "2份加州居住证明" },
    ],
    extraDocs: [
      { en: "SSN (if you have one)", zhHant: "SSN（如果有）", zhHans: "SSN（如果有）" },
      { en: "Name change docs (if applicable)", zhHant: "更名文件（如適用）", zhHans: "更名文件（如适用）" },
    ],
    validity: "Tied to legal status",
  },
  h1b: {
    docs: [
      { en: "Valid Passport", zhHant: "有效護照", zhHans: "有效护照" },
      { en: "Valid H-1B Visa", zhHant: "有效H-1B簽證", zhHans: "有效H-1B签证" },
      { en: "I-94 (printed)", zhHant: "I-94（已打印）", zhHans: "I-94（已打印）" },
      { en: "I-797 Approval Notice", zhHant: "I-797批准通知", zhHans: "I-797批准通知" },
      { en: "SSN", zhHant: "SSN 社會安全號碼", zhHans: "SSN 社会安全号码" },
      { en: "2 CA residency documents", zhHant: "2份加州居住證明", zhHans: "2份加州居住证明" },
    ],
    extraDocs: [
      { en: "Name change docs (if applicable)", zhHant: "更名文件（如適用）", zhHans: "更名文件（如适用）" },
    ],
    validity: "Tied to legal status",
  },
  l1: {
    docs: [
      { en: "Valid Passport", zhHant: "有效護照", zhHans: "有效护照" },
      { en: "Valid L-1 Visa", zhHant: "有效L-1簽證", zhHans: "有效L-1签证" },
      { en: "I-94 (printed)", zhHant: "I-94（已打印）", zhHans: "I-94（已打印）" },
      { en: "I-797 Approval Notice", zhHant: "I-797批准通知", zhHans: "I-797批准通知" },
      { en: "SSN", zhHant: "SSN 社會安全號碼", zhHans: "SSN 社会安全号码" },
      { en: "2 CA residency documents", zhHant: "2份加州居住證明", zhHans: "2份加州居住证明" },
    ],
    extraDocs: [
      { en: "Name change docs (if applicable)", zhHant: "更名文件（如適用）", zhHans: "更名文件（如适用）" },
    ],
    validity: "Tied to legal status",
  },
  o1: {
    docs: [
      { en: "Valid Passport", zhHant: "有效護照", zhHans: "有效护照" },
      { en: "Valid O-1 Visa", zhHant: "有效O-1簽證", zhHans: "有效O-1签证" },
      { en: "I-94 (printed)", zhHant: "I-94（已打印）", zhHans: "I-94（已打印）" },
      { en: "I-797 Approval Notice", zhHant: "I-797批准通知", zhHans: "I-797批准通知" },
      { en: "SSN", zhHant: "SSN 社會安全號碼", zhHans: "SSN 社会安全号码" },
      { en: "2 CA residency documents", zhHant: "2份加州居住證明", zhHans: "2份加州居住证明" },
    ],
    extraDocs: [
      { en: "Name change docs (if applicable)", zhHant: "更名文件（如適用）", zhHans: "更名文件（如适用）" },
    ],
    validity: "Tied to legal status",
  },
  h4: {
    docs: [
      { en: "Valid Passport", zhHant: "有效護照", zhHans: "有效护照" },
      { en: "Valid H-4 Visa", zhHant: "有效H-4簽證", zhHans: "有效H-4签证" },
      { en: "I-94 (printed)", zhHant: "I-94（已打印）", zhHans: "I-94（已打印）" },
      { en: "Spouse's H-1B approval copy", zhHant: "配偶的H-1B批准文件副本", zhHans: "配偶的H-1B批准文件副本" },
      { en: "2 CA residency documents", zhHant: "2份加州居住證明", zhHans: "2份加州居住证明" },
    ],
    extraDocs: [
      { en: "EAD (if you have one)", zhHant: "EAD工作許可（如果有）", zhHans: "EAD工作许可（如果有）" },
      { en: "SSN (if you have one)", zhHant: "SSN（如果有）", zhHans: "SSN（如果有）" },
      { en: "Name change docs (if applicable)", zhHant: "更名文件（如適用）", zhHans: "更名文件（如适用）" },
    ],
    validity: "Tied to legal status",
  },
  l2: {
    docs: [
      { en: "Valid Passport", zhHant: "有效護照", zhHans: "有效护照" },
      { en: "Valid L-2 Visa", zhHant: "有效L-2簽證", zhHans: "有效L-2签证" },
      { en: "I-94 (printed)", zhHant: "I-94（已打印）", zhHans: "I-94（已打印）" },
      { en: "Spouse's L-1 approval copy", zhHant: "配偶的L-1批准文件副本", zhHans: "配偶的L-1批准文件副本" },
      { en: "2 CA residency documents", zhHant: "2份加州居住證明", zhHans: "2份加州居住证明" },
    ],
    extraDocs: [
      { en: "EAD (if you have one)", zhHant: "EAD工作許可（如果有）", zhHans: "EAD工作许可（如果有）" },
      { en: "SSN (if you have one)", zhHant: "SSN（如果有）", zhHans: "SSN（如果有）" },
      { en: "Name change docs (if applicable)", zhHant: "更名文件（如適用）", zhHans: "更名文件（如适用）" },
    ],
    validity: "Tied to legal status",
  },
  o3: {
    docs: [
      { en: "Valid Passport", zhHant: "有效護照", zhHans: "有效护照" },
      { en: "Valid O-3 Visa", zhHant: "有效O-3簽證", zhHans: "有效O-3签证" },
      { en: "I-94 (printed)", zhHant: "I-94（已打印）", zhHans: "I-94（已打印）" },
      { en: "Spouse's O-1 approval copy", zhHant: "配偶的O-1批准文件副本", zhHans: "配偶的O-1批准文件副本" },
      { en: "2 CA residency documents", zhHant: "2份加州居住證明", zhHans: "2份加州居住证明" },
    ],
    extraDocs: [
      { en: "SSN (if you have one)", zhHant: "SSN（如果有）", zhHans: "SSN（如果有）" },
      { en: "Name change docs (if applicable)", zhHant: "更名文件（如適用）", zhHans: "更名文件（如适用）" },
    ],
    validity: "Tied to legal status",
  },
  j2: {
    docs: [
      { en: "Valid Passport", zhHant: "有效護照", zhHans: "有效护照" },
      { en: "Valid J-2 Visa", zhHant: "有效J-2簽證", zhHans: "有效J-2签证" },
      { en: "I-94 (printed)", zhHant: "I-94（已打印）", zhHans: "I-94（已打印）" },
      { en: "Your own DS-2019", zhHant: "您本人的DS-2019", zhHans: "您本人的DS-2019" },
      { en: "2 CA residency documents", zhHant: "2份加州居住證明", zhHans: "2份加州居住证明" },
    ],
    extraDocs: [
      { en: "SSN (if you have one)", zhHant: "SSN（如果有）", zhHans: "SSN（如果有）" },
      { en: "Name change docs (if applicable)", zhHant: "更名文件（如適用）", zhHans: "更名文件（如适用）" },
    ],
    validity: "Tied to legal status",
  },
  f2: {
    docs: [
      { en: "Valid Passport", zhHant: "有效護照", zhHans: "有效护照" },
      { en: "Valid F-2 Visa", zhHant: "有效F-2簽證", zhHans: "有效F-2签证" },
      { en: "I-94 (printed)", zhHant: "I-94（已打印）", zhHans: "I-94（已打印）" },
      { en: "Your own I-20", zhHant: "您本人的I-20", zhHans: "您本人的I-20" },
      { en: "2 CA residency documents", zhHant: "2份加州居住證明", zhHans: "2份加州居住证明" },
    ],
    extraDocs: [
      { en: "Spouse's F-1 docs (if available)", zhHant: "配偶的F-1文件（如有）", zhHans: "配偶的F-1文件（如有）" },
      { en: "SSN (if you have one)", zhHant: "SSN（如果有）", zhHans: "SSN（如果有）" },
      { en: "Name change docs (if applicable)", zhHant: "更名文件（如適用）", zhHans: "更名文件（如适用）" },
    ],
    validity: "Tied to legal status",
  },
};

// Visa types that need the dual-passport tip (everyone except citizen and pr)
const needsPassportTip = (visa: VisaType) => visa !== "citizen" && visa !== "pr";

// Trilingual content helper
type Lang = "en" | "zhHant" | "zhHans";
function tri(en: string, zhHant: string, zhHans: string, lang: Lang) {
  return lang === "zhHant" ? zhHant : lang === "zhHans" ? zhHans : en;
}

function triDoc(doc: VisaDocItem, lang: Lang) {
  return lang === "zhHant" ? doc.zhHant : lang === "zhHans" ? doc.zhHans : doc.en;
}

const stepsData = [
  { num: 1, icon: "💻",
    title: ["Start Application Online", "在線開始申請", "在线开始申请"],
    desc: ["Go to the DMV website to start your DL/ID application. If applying for REAL ID, upload identity and address documents online. Save your confirmation code.", "前往DMV網站開始駕照申請。如申請REAL ID，可在線上傳身份和地址文件。保存確認碼。", "前往DMV网站开始驾照申请。如申请REAL ID，可在线上传身份和地址文件。保存确认码。"],
  },
  { num: 2, icon: "📋",
    title: ["Prepare Documents", "準備材料", "准备材料"],
    desc: ["Gather identity documents, address proofs, and SSN info based on your visa type.", "根據你的簽證類型準備身份文件、地址證明和SSN資料。", "根据你的签证类型准备身份文件、地址证明和SSN资料。"],
  },
  { num: 3, icon: "🏢",
    title: ["Visit DMV Office", "前往DMV辦公室", "前往DMV办公室"],
    desc: ["Schedule an appointment (strongly recommended). At the office: submit documents, photo, fingerprint, vision test, and knowledge test.", "預約辦理（強烈建議）。到場後：提交材料、拍照、指紋、視力測試和筆試。", "预约办理（强烈建议）。到场后：提交材料、拍照、指纹、视力测试和笔试。"],
  },
  { num: 4, icon: "📄",
    title: ["Get Instruction Permit", "獲取學習許可", "获取学习许可"],
    desc: ["Pass the knowledge test to receive your permit. Adults (18+) get a standard instruction permit.", "通過筆試後獲得學習許可證。18歲以上獲得標準學習許可。", "通过笔试后获得学习许可证。18岁以上获得标准学习许可。"],
  },
  { num: 5, icon: "🚗",
    title: ["Practice Driving", "練習駕駛", "练习驾驶"],
    desc: ["Practice with a CA-licensed driver (25+ years old). Under 18: need 50 hours including 10 at night.", "跟持加州駕照的駕駛員（25歲以上）練車。未滿18歲：需50小時（含10小時夜間）。", "跟持加州驾照的驾驶员（25岁以上）练车。未满18岁：需50小时（含10小时夜间）。"],
  },
  { num: 6, icon: "📅",
    title: ["Schedule & Take Road Test", "預約並參加路考", "预约并参加路考"],
    desc: ["Road tests require an appointment. Bring your permit, a safe vehicle, and valid insurance.", "路考必須預約。攜帶許可證、安全車輛和有效保險。", "路考必须预约。携带许可证、安全车辆和有效保险。"],
  },
  { num: 7, icon: "🎉",
    title: ["Get Your License!", "拿到駕照！", "拿到驾照！"],
    desc: ["After passing, you get a temporary paper license (~60 days). Official card arrives by mail in 3-4 weeks.", "通過後獲得臨時紙質駕照（約60天有效）。正式卡3-4週郵寄到家。", "通过后获得临时纸质驾照（约60天有效）。正式卡3-4周邮寄到家。"],
  },
];

const usefulLinks = [
  { label: "DMV Online Application", url: "https://www.dmv.ca.gov/portal/driver-licenses-identification-cards/dl-id-online-app-edl-44/" },
  { label: "REAL ID Checklist", url: "https://www.dmv.ca.gov/portal/driver-licenses-identification-cards/real-id/" },
  { label: "Schedule Appointment", url: "https://www.dmv.ca.gov/portal/appointments/select-appointment-type/" },
  { label: "I-94 Travel Record", url: "https://i94.cbp.dhs.gov/I94/" },
  { label: "Find DMV Office", url: "https://www.dmv.ca.gov/portal/locations/" },
  { label: "Driver Handbook", url: "https://www.dmv.ca.gov/portal/handbook/california-driver-handbook/" },
  { label: "Practice Tests", url: "https://www.dmv.ca.gov/portal/driver-education-and-safety/educational-materials/sample-driver-license-dl-knowledge-tests/" },
  { label: "Fee Schedule", url: "https://www.dmv.ca.gov/portal/how-do-i-702/licensing-fees/" },
];

export default function GuidePage() {
  const [selectedVisa, setSelectedVisa] = useState<VisaType>("f1");
  const [expandedStep, setExpandedStep] = useState<number | null>(2);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const redirecting = useRequireSession();
  const uiLang = useUILanguageStore((s) => s.uiLang);
  const lang = uiLang as Lang;

  if (redirecting) return null;

  const visa = visaData[selectedVisa];
  const visaLabel = visaOptions.find((v) => v.id === selectedVisa)!;

  const toggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      {/* Header */}
      <h1 className="text-2xl font-bold text-text-dark md:text-3xl">
        {tri("CA Driver's License Guide", "加州駕照申請指南", "加州驾照申请指南", lang)}
      </h1>
      <p className="mt-1 text-sm text-text-gray">
        {tri("Step-by-step guide based on 2026 DMV official info", "基於2026年DMV官方信息的分步指南", "基于2026年DMV官方信息的分步指南", lang)}
      </p>

      {/* REAL ID alert */}
      <div className="mt-6 rounded-xl bg-gradient-to-r from-primary to-primary/80 p-5 text-white shadow-md">
        <p className="text-sm font-semibold">
          {tri("Since May 7, 2025: REAL ID required for domestic flights", "2025年5月7日起：搭乘國內航班需REAL ID", "2025年5月7日起：搭乘国内航班需REAL ID", lang)}
        </p>
        <p className="mt-1 text-xs text-white/80">
          {tri("All visa types can apply for REAL ID. We recommend getting it directly.", "所有簽證類型均可申請REAL ID。建議直接辦理。", "所有签证类型均可申请REAL ID。建议直接办理。", lang)}
        </p>
      </div>

      {/* Step-by-step flow */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-text-dark">
          {tri("Step-by-Step Process", "分步流程", "分步流程", lang)}
        </h2>

        <div className="mt-6 relative">
          <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-success" />

          {stepsData.map((step) => {
            const isExpanded = expandedStep === step.num;
            const li = lang === "zhHant" ? 1 : lang === "zhHans" ? 2 : 0;
            return (
              <div key={step.num} className="relative flex gap-4 pb-6 last:pb-0">
                <button
                  onClick={() => setExpandedStep(isExpanded ? null : step.num)}
                  className={`relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg shadow-md transition-all ${
                    isExpanded ? "bg-primary scale-110" : "bg-card border-2 border-primary/30"
                  }`}
                >
                  {step.icon}
                </button>

                <div className="flex-1 pt-0.5">
                  <button onClick={() => setExpandedStep(isExpanded ? null : step.num)} className="w-full text-left">
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                      {tri("STEP", "步驟", "步骤", lang)} {step.num}
                    </span>
                    <h3 className="text-base font-semibold text-text-dark">{step.title[li]}</h3>
                  </button>

                  {isExpanded && (
                    <div className="mt-2 animate-[fadeIn_0.2s_ease-out]">
                      <p className="text-sm text-text-light leading-relaxed">{step.desc[li]}</p>

                      {/* Step 2: Visa selector */}
                      {step.num === 2 && (
                        <div className="mt-4 rounded-xl border border-border bg-white p-4 shadow-sm">
                          <p className="mb-3 text-sm font-semibold text-text-dark">
                            {tri("Your status:", "你的身份：", "你的身份：", lang)}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {visaOptions.map((v) => (
                              <button
                                key={v.id}
                                onClick={() => setSelectedVisa(v.id)}
                                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                                  selectedVisa === v.id ? "bg-primary text-white shadow-sm" : "bg-gray-100 text-text-gray hover:bg-gray-200"
                                }`}
                              >
                                {v.label}
                              </button>
                            ))}
                          </div>

                          <div className="mt-4 rounded-lg bg-primary-light/50 p-4">
                            <p className="text-xs font-bold text-primary uppercase tracking-wider">
                              {visaLabel.label} — {tri("Required Documents", "必帶材料", "必带材料", lang)}
                            </p>
                            <div className="mt-3 space-y-1.5">
                              {visa.docs.map((doc, dIdx) => (
                                <div key={dIdx} className="flex items-start gap-2 text-sm">
                                  <span className="mt-0.5 text-primary">&#10003;</span>
                                  <span className="text-text-dark font-medium">{triDoc(doc, lang)}</span>
                                </div>
                              ))}
                            </div>

                            {visa.extraDocs.length > 0 && (
                              <div className="mt-3 border-t border-primary/10 pt-3">
                                <p className="text-[10px] font-medium text-text-gray uppercase tracking-wider mb-1.5">
                                  {tri("Optional / If Applicable", "可選/如適用", "可选/如适用", lang)}
                                </p>
                                <div className="space-y-1">
                                  {visa.extraDocs.map((doc, dIdx) => (
                                    <div key={dIdx} className="flex items-start gap-2 text-xs">
                                      <span className="mt-0.5 text-text-gray">-</span>
                                      <span className="text-text-gray">{triDoc(doc, lang)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Dual passport tip for non-citizen/non-PR visa types */}
                            {needsPassportTip(selectedVisa) && (
                              <div className="mt-3 border-t border-primary/10 pt-3">
                                <div className="flex items-start gap-2 text-xs">
                                  <span className="text-amber-500 mt-0.5">⚠️</span>
                                  <span className="text-amber-700 font-medium">
                                    {tri(
                                      "If your passport with the U.S. visa has expired and you got a new passport, bring BOTH passports — the old one with the visa stamp and your new valid passport.",
                                      "如果您貼有美國簽證的護照已過期並已換新護照，請攜帶兩本護照 — 含有美國簽證的舊護照和新的有效護照。",
                                      "如果您贴有美国签证的护照已过期并已换新护照，请携带两本护照 — 含有美国签证的旧护照和新的有效护照。",
                                      lang
                                    )}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* I-94 printing instruction */}
                            {needsPassportTip(selectedVisa) && (
                              <div className="mt-3 border-t border-primary/10 pt-3">
                                <div className="flex items-start gap-2 text-xs">
                                  <span className="text-primary mt-0.5">💡</span>
                                  <span className="text-text-dark">
                                    {tri(
                                      "I-94: Go to i94.cbp.dhs.gov, look up your record, then use the \"Print\" button at the bottom-right of the page to print your most recent I-94.",
                                      "I-94：前往 i94.cbp.dhs.gov 查詢您的記錄，然後使用頁面右下角的「Print」按鈕打印您最近一次的I-94。",
                                      "I-94：前往 i94.cbp.dhs.gov 查询您的记录，然后使用页面右下角的「Print」按钮打印您最近一次的I-94。",
                                      lang
                                    )}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Non-REAL ID residency note */}
                            <div className="mt-3 border-t border-primary/10 pt-3">
                              <div className="flex items-start gap-2 text-xs">
                                <span className="text-primary mt-0.5">📌</span>
                                <span className="text-text-dark">
                                  {tri(
                                    "If not applying for REAL ID, only 1 CA residency document is accepted. However, we recommend bringing extras in case any document is rejected.",
                                    "如果不申請REAL ID，只需1份加州居住證明即可。但建議多帶幾份，以防文件不符合要求。",
                                    "如果不申请REAL ID，只需1份加州居住证明即可。但建议多带几份，以防文件不符合要求。",
                                    lang
                                  )}
                                </span>
                              </div>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-3 border-t border-primary/10 pt-3 text-xs">
                              <span className="text-success font-medium">REAL ID: {tri("Eligible", "可申請", "可申请", lang)}</span>
                              <span className="text-text-gray">{tri("Validity", "有效期", "有效期", lang)}: {visa.validity}</span>
                            </div>
                          </div>

                          <div className="mt-3">
                            <p className="text-xs font-medium text-text-dark">
                              {tri("Accepted Address Proofs (need 2 for REAL ID):", "可接受的地址證明（REAL ID需2份）：", "可接受的地址证明（REAL ID需2份）：", lang)}
                            </p>
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {[
                                tri("Lease", "租約", "租约", lang),
                                tri("Bank Statement", "銀行帳單", "银行账单", lang),
                                tri("Phone Bill", "電話帳單", "电话账单", lang),
                                tri("Insurance", "保險", "保险", lang),
                                tri("School Housing", "學校住宿", "学校住宿", lang),
                                tri("Utility Bill", "水電帳單", "水电账单", lang),
                              ].map((item) => (
                                <span key={item} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] text-text-gray">{item}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 3: Visit DMV Office tips — with Get in Line info */}
                      {step.num === 3 && (
                        <div className="mt-3 space-y-3">
                          <div className="rounded-lg bg-warning-light/50 border border-warning/20 px-4 py-3 text-xs">
                            <p className="font-semibold text-warning">{tri("Tips:", "提示：", "提示：", lang)}</p>
                            <ul className="mt-1 space-y-0.5 text-text-light">
                              <li>* {tri("Schedule an appointment — walk-in waits are unpredictable", "預約辦理 — 現場排隊時間不可預測", "预约办理 — 现场排队时间不可预测", lang)}</li>
                              <li>* {tri("Go weekday mornings for shortest wait", "工作日早上去等待最短", "工作日早上去等待最短", lang)}</li>
                              <li>* {tri("Written test closes after 4:30 PM", "筆試下午4:30後停止", "笔试下午4:30后停止", lang)}</li>
                              <li>* {tri("Knowledge test: 36Q (18+) / 46Q (under 18), need 83%", "筆試：36題（18+）/ 46題（未滿18），需83%", "笔试：36题（18+）/ 46题（未满18），需83%", lang)}</li>
                            </ul>
                          </div>

                          {/* Get in Line feature */}
                          <div className="rounded-lg bg-primary-light/40 border border-primary/20 px-4 py-3 text-xs">
                            <p className="font-semibold text-primary">
                              {tri("📱 DMV \"Get in Line\" — Virtual Queuing", "📱 DMV「Get in Line」— 線上虛擬排隊", "📱 DMV「Get in Line」— 线上虚拟排队", lang)}
                            </p>
                            <div className="mt-2 space-y-1.5 text-text-light">
                              <p>
                                {tri(
                                  "Can't get an appointment? No worries! Many DMV offices offer \"Get in Line\" — a virtual queuing system that lets you join the line remotely before arriving.",
                                  "約不到預約？不用擔心！許多DMV辦公室提供「Get in Line」— 線上虛擬排隊系統，讓您在到達前遠程排隊。",
                                  "约不到预约？不用担心！许多DMV办公室提供「Get in Line」— 线上虚拟排队系统，让您在到达前远程排队。",
                                  lang
                                )}
                              </p>
                              <p className="font-medium text-text-dark">
                                {tri("How it works:", "使用方式：", "使用方式：", lang)}
                              </p>
                              <ul className="space-y-0.5 ml-2">
                                <li>1. {tri(
                                  "Visit the DMV appointment page and select \"Get in Line\"",
                                  "前往DMV預約頁面，選擇「Get in Line」",
                                  "前往DMV预约页面，选择「Get in Line」",
                                  lang
                                )}</li>
                                <li>2. {tri(
                                  "Choose your DMV location and service type",
                                  "選擇DMV地點和辦理類型",
                                  "选择DMV地点和办理类型",
                                  lang
                                )}</li>
                                <li>3. {tri(
                                  "You'll get a mobile ticket with estimated wait time",
                                  "您將獲得一個手機電子票，顯示預估等待時間",
                                  "您将获得一个手机电子票，显示预估等待时间",
                                  lang
                                )}</li>
                                <li>4. {tri(
                                  "Receive SMS notifications when it's almost your turn",
                                  "快到您時會收到短信通知",
                                  "快到您时会收到短信通知",
                                  lang
                                )}</li>
                                <li>5. {tri(
                                  "Arrive at the DMV when notified — no need to wait in person!",
                                  "收到通知後再到場 — 不用現場等待！",
                                  "收到通知后再到场 — 不用现场等待！",
                                  lang
                                )}</li>
                              </ul>
                              <div className="mt-2 rounded-md bg-white/60 border border-primary/10 px-3 py-2">
                                <p className="font-medium text-text-dark">
                                  {tri("⚠️ Important notes:", "⚠️ 注意事項：", "⚠️ 注意事项：", lang)}
                                </p>
                                <ul className="mt-1 space-y-0.5">
                                  <li>• {tri("Same-day only — cannot queue for a future date", "僅限當天 — 不能預約未來日期", "仅限当天 — 不能预约未来日期", lang)}</li>
                                  <li>• {tri("Available during specific hours (usually opens at 8 AM)", "在特定時段開放（通常早上8點開始）", "在特定时段开放（通常早上8点开始）", lang)}</li>
                                  <li>• {tri("Not available at all DMV locations", "並非所有DMV地點都提供此服務", "并非所有DMV地点都提供此服务", lang)}</li>
                                  <li>• {tri("Slots fill up quickly — try early in the morning", "名額很快就滿 — 建議一早就排", "名额很快就满 — 建议一早就排", lang)}</li>
                                </ul>
                              </div>
                              <a
                                href="https://www.dmv.ca.gov/portal/appointments/select-appointment-type"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors"
                              >
                                {tri("Go to DMV Get in Line →", "前往DMV線上排隊 →", "前往DMV线上排队 →", lang)}
                              </a>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 5: Practice Driving — behind-the-wheel coming soon */}
                      {step.num === 5 && (
                        <div className="mt-3 rounded-lg bg-primary-light/40 border border-primary/20 px-4 py-3 text-xs">
                          <div className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">🚗</span>
                            <span className="text-text-dark font-medium">
                              {tri(
                                "Behind-the-wheel test preparation feature coming soon! Stay tuned.",
                                "路考（Behind-the-wheel test）預先準備功能即將上線！敬請期待。",
                                "路考（Behind-the-wheel test）预先准备功能即将上线！敬请期待。",
                                lang
                              )}
                            </span>
                          </div>
                        </div>
                      )}

                      {step.num === 6 && (
                        <div className="mt-3 rounded-lg bg-gray-50 border border-border px-4 py-3 text-xs">
                          <p className="font-semibold text-text-dark">{tri("Road Test Day Checklist:", "路考當天清單：", "路考当天清单：", lang)}</p>
                          <div className="mt-1 grid grid-cols-2 gap-1 text-text-light">
                            <span>* {tri("Instruction permit", "學習許可證", "学习许可证", lang)}</span>
                            <span>* {tri("Safe, registered vehicle", "安全、已註冊車輛", "安全、已注册车辆", lang)}</span>
                            <span>* {tri("Valid insurance proof", "有效保險證明", "有效保险证明", lang)}</span>
                            <span>* {tri("Working lights & signals", "車燈和轉向燈正常", "车灯和转向灯正常", lang)}</span>
                          </div>
                        </div>
                      )}

                      {step.num === 7 && (
                        <div className="mt-3 rounded-lg bg-success-light/50 border border-success/20 px-4 py-3 text-xs">
                          <p className="font-semibold text-success">{tri("Fees:", "費用：", "费用：", lang)}</p>
                          <div className="mt-1 space-y-0.5 text-text-light">
                            <p>{tri("Class C application:", "C類申請費：", "C类申请费：", lang)} <strong className="text-text-dark">$46</strong></p>
                            <p>{tri("Road test retest:", "路考重考費：", "路考重考费：", lang)} <strong className="text-text-dark">$9</strong></p>
                            <p>REAL ID: <strong className="text-text-dark">{tri("No extra charge", "無額外費用", "无额外费用", lang)}</strong></p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* REAL ID comparison */}
      <div className="mt-10 rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-base font-bold text-text-dark">REAL ID vs Regular License</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-success/30 bg-success-light/30 p-3">
            <p className="text-xs font-bold text-success">{tri("Get REAL ID", "辦REAL ID", "办REAL ID", lang)}</p>
            <ul className="mt-2 space-y-1 text-[11px] text-text-light">
              <li>* {tri("Fly domestically with just DL", "憑駕照搭國內航班", "凭驾照搭国内航班", lang)}</li>
              <li>* {tri("No need to carry passport", "不需隨身帶護照", "不需随身带护照", lang)}</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-gray-50 p-3">
            <p className="text-xs font-bold text-text-dark">{tri("Regular DL is OK if:", "普通駕照適合：", "普通驾照适合：", lang)}</p>
            <ul className="mt-2 space-y-1 text-[11px] text-text-light">
              <li>* {tri("Fine using passport for flights", "不介意帶護照搭飛機", "不介意带护照搭飞机", lang)}</li>
              <li>* {tri("Want license ASAP", "想盡快拿到駕照", "想尽快拿到驾照", lang)}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="mt-10 rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-base font-bold text-text-dark">
          {tri("Pre-Visit Checklist", "出發前清單", "出发前清单", lang)}
        </h2>
        <p className="mt-1 text-xs text-text-gray">
          {tri("Check off items as you prepare", "準備好後打勾", "准备好后打勾", lang)}
        </p>
        <div className="mt-4 space-y-2">
          {[
            tri("Online application started (save confirmation code)", "已開始在線申請（保存確認碼）", "已开始在线申请（保存确认码）", lang),
            tri("Passport (valid, not expired)", "護照（有效期內）", "护照（有效期内）", lang),
            tri("Visa + I-94 printed (use Print button at bottom-right of I-94 page)", "簽證 + I-94已打印（使用I-94頁面右下角Print按鈕）", "签证 + I-94已打印（使用I-94页面右下角Print按钮）", lang),
            tri("Program document (I-20 / DS-2019 / I-797)", "項目文件（I-20 / DS-2019 / I-797）", "项目文件（I-20 / DS-2019 / I-797）", lang),
            tri("2 address proof documents", "2份地址證明文件", "2份地址证明文件", lang),
            tri("SSN card (if you have one)", "SSN卡（如果有）", "SSN卡（如果有）", lang),
            tri("DMV appointment scheduled", "已預約DMV", "已预约DMV", lang),
            tri("Glasses / contacts (if needed for driving)", "眼鏡/隱形（如開車需要）", "眼镜/隐形（如开车需要）", lang),
            tri("Study for knowledge test (use our app!)", "複習筆試（用我們的app！）", "复习笔试（用我们的app！）", lang),
          ].map((item, idx) => (
            <label key={idx} className="flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={!!checklist[`c${idx}`]}
                onChange={() => toggleCheck(`c${idx}`)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className={`text-sm ${checklist[`c${idx}`] ? "text-text-gray line-through" : "text-text-dark"}`}>
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Useful Links */}
      <div className="mt-10 rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-base font-bold text-text-dark">
          {tri("Useful Links", "實用連結", "实用链接", lang)}
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {usefulLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm text-primary hover:bg-primary-light transition-colors"
            >
              <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
