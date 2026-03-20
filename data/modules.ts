export interface Module {
  id: string;
  titleEn: string;
  titleZh: string;
  titleZhHant: string;
  estimatedMinutes: number;
  icon: string;
  isNew?: boolean;
  sectionCount: number;
}

export const modules: Module[] = [
  { id: "M00", titleEn: "Licensing Requirements", titleZh: "驾照申请要求", titleZhHant: "駕照申請要求", estimatedMinutes: 15, icon: "📋", sectionCount: 6 },
  { id: "M01", titleEn: "Driving Basics", titleZh: "驾驶基础入门", titleZhHant: "駕駛基礎入門", estimatedMinutes: 20, icon: "🚗", sectionCount: 5 },
  { id: "M02", titleEn: "Traffic Signs & Signals", titleZh: "交通标志与信号灯", titleZhHant: "交通標誌與號誌燈", estimatedMinutes: 25, icon: "🚦", sectionCount: 5 },
  { id: "M03", titleEn: "Right-of-Way Rules", titleZh: "路权规则", titleZhHant: "路權規則", estimatedMinutes: 20, icon: "🔀", sectionCount: 5 },
  { id: "M04", titleEn: "Speed Laws", titleZh: "速度法规", titleZhHant: "速度法規", estimatedMinutes: 15, icon: "⚡", sectionCount: 3 },
  { id: "M05", titleEn: "Lane Control & Turns", titleZh: "车道控制与转弯", titleZhHant: "車道控制與轉彎", estimatedMinutes: 25, icon: "↩️", sectionCount: 6 },
  { id: "M06", titleEn: "Parking Rules", titleZh: "停车法规", titleZhHant: "停車法規", estimatedMinutes: 15, icon: "🅿️", sectionCount: 4 },
  { id: "M07", titleEn: "Driving in Special Conditions", titleZh: "特殊路况驾驶", titleZhHant: "特殊路況駕駛", estimatedMinutes: 20, icon: "🌧️", sectionCount: 5 },
  { id: "M08", titleEn: "Sharing the Road", titleZh: "与他人共享道路", titleZhHant: "與他人共享道路", estimatedMinutes: 25, icon: "🚴", sectionCount: 6 },
  { id: "M09", titleEn: "Safe Driving Practices", titleZh: "安全驾驶实践", titleZhHant: "安全駕駛實踐", estimatedMinutes: 20, icon: "🛡️", sectionCount: 5 },
  { id: "M10", titleEn: "Alcohol & Drugs", titleZh: "酒精与药物", titleZhHant: "酒精與藥物", estimatedMinutes: 15, icon: "🚫", sectionCount: 5 },
  { id: "M11", titleEn: "Financial Responsibility & Insurance", titleZh: "经济责任与保险", titleZhHant: "經濟責任與保險", estimatedMinutes: 10, icon: "💰", sectionCount: 4 },
];
