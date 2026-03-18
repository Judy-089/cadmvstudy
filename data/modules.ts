export interface Module {
  id: string;
  titleEn: string;
  titleZh: string;
  estimatedMinutes: number;
  icon: string;
  isNew?: boolean;
  sectionCount: number;
}

export const modules: Module[] = [
  { id: "M01", titleEn: "Licensing Requirements", titleZh: "驾照申请要求", estimatedMinutes: 15, icon: "📋", sectionCount: 5 },
  { id: "M01-5", titleEn: "2025 Updates", titleZh: "2025年更新内容", estimatedMinutes: 15, icon: "📌", isNew: true, sectionCount: 5 },
  { id: "M02", titleEn: "Traffic Signs & Signals", titleZh: "交通标志与信号灯", estimatedMinutes: 25, icon: "🚦", sectionCount: 5 },
  { id: "M03", titleEn: "Right-of-Way Rules", titleZh: "路权规则", estimatedMinutes: 20, icon: "🔀", sectionCount: 4 },
  { id: "M04", titleEn: "Speed Laws", titleZh: "速度法规", estimatedMinutes: 15, icon: "⚡", sectionCount: 5 },
  { id: "M05", titleEn: "Lane Control & Turns", titleZh: "车道控制与转弯", estimatedMinutes: 20, icon: "↩️", sectionCount: 5 },
  { id: "M06", titleEn: "Parking Rules", titleZh: "停车法规", estimatedMinutes: 15, icon: "🅿️", sectionCount: 4 },
  { id: "M07", titleEn: "Driving in Special Conditions", titleZh: "特殊路况驾驶", estimatedMinutes: 20, icon: "🌧️", sectionCount: 5 },
  { id: "M08", titleEn: "Sharing the Road", titleZh: "与他人共享道路", estimatedMinutes: 20, icon: "🚴", sectionCount: 6 },
  { id: "M09", titleEn: "Safe Driving Practices", titleZh: "安全驾驶实践", estimatedMinutes: 20, icon: "🛡️", sectionCount: 5 },
  { id: "M10", titleEn: "Alcohol & Drugs", titleZh: "酒精与药物", estimatedMinutes: 15, icon: "🚫", sectionCount: 5 },
  { id: "M11", titleEn: "Financial Responsibility & Insurance", titleZh: "经济责任与保险", estimatedMinutes: 10, icon: "💰", sectionCount: 4 },
];
