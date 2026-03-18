import type { UILanguage } from "@/store/useUILanguageStore";

const strings = {
  // ── Navbar ──
  "nav.home": { en: "Home", zhHant: "首頁", zhHans: "首页" },
  "nav.study": { en: "Study", zhHant: "學習", zhHans: "学习" },
  "nav.mockTest": { en: "Mock Test", zhHant: "模擬考試", zhHans: "模拟考试" },
  "nav.progress": { en: "About", zhHant: "關於", zhHans: "关于" },
  "nav.guide": { en: "Guide", zhHant: "指南", zhHans: "指南" },
  "nav.signIn": { en: "Sign In", zhHant: "登入", zhHans: "登录" },
  "nav.signOut": { en: "Sign Out", zhHant: "登出", zhHans: "退出" },
  "nav.guest": { en: "Guest", zhHant: "訪客", zhHans: "访客" },
  "nav.language": { en: "Language", zhHant: "語言", zhHans: "语言" },

  // ── Landing Page ──
  "landing.subtitle": {
    en: "Master the California DMV written test with bilingual content, official images, and realistic mock exams.",
    zhHant: "透過雙語內容、官方圖片和擬真模擬考試，掌握加州DMV筆試。",
    zhHans: "通过双语内容、官方图片和仿真模拟考试，掌握加州DMV笔试。",
  },
  "landing.guestBtn": { en: "Start as Guest", zhHant: "訪客模式", zhHans: "访客模式" },
  "landing.guestDesc": {
    en: "Free preview \u00b7 2 modules + 1 mock test",
    zhHant: "免費預覽 \u00b7 2個模組 + 1套模擬題",
    zhHans: "免费预览 \u00b7 2个模块 + 1套模拟题",
  },
  "landing.signInBtn": { en: "Sign In", zhHant: "登入", zhHans: "登录" },
  "landing.signInDesc": {
    en: "Unlock everything \u00b7 Multi-language",
    zhHant: "解鎖全部內容 \u00b7 多語言",
    zhHans: "解锁全部内容 \u00b7 多语言",
  },
  "landing.questions": { en: "Questions", zhHant: "題目", zhHans: "题目" },
  "landing.modules": { en: "Modules", zhHant: "模組", zhHans: "模块" },
  "landing.mockExams": { en: "Mock Exams", zhHant: "模擬考試", zhHans: "模拟考试" },
  "landing.passRate": { en: "Pass Rate", zhHant: "通過率", zhHans: "通过率" },
  "landing.basedOn": {
    en: "Based on the official California Driver Handbook",
    zhHant: "基於官方加州駕駛員手冊",
    zhHans: "基于官方加州驾驶员手册",
  },
  "landing.trusted": {
    en: "Trusted by test-takers across California",
    zhHant: "深受加州考生信賴",
    zhHans: "深受加州考生信赖",
  },
  "landing.disclaimer": {
    en: "Not affiliated with the California DMV",
    zhHant: "與加州DMV無關聯",
    zhHans: "与加州DMV无关联",
  },

  // ── Age Selection ──
  "age.title": { en: "How old are you?", zhHant: "你幾歲？", zhHans: "你几岁？" },
  "age.subtitle": {
    en: "This determines your mock exam format",
    zhHant: "這將決定你的模擬考試格式",
    zhHans: "这将决定你的模拟考试格式",
  },
  "age.under18": { en: "Under 18", zhHant: "未滿18歲", zhHans: "未满18岁" },
  "age.under18exam": { en: "46-question exam", zhHant: "46題考試", zhHans: "46题考试" },
  "age.18plus": { en: "18 or older", zhHant: "18歲及以上", zhHans: "18岁及以上" },
  "age.18plusExam": { en: "36-question exam", zhHant: "36題考試", zhHans: "36题考试" },
  "age.cancel": { en: "Cancel", zhHant: "取消", zhHans: "取消" },

  // ── Home Dashboard ──
  "home.learningModules": { en: "Learning Modules", zhHant: "學習模組", zhHans: "学习模块" },
  "home.mistakeReview": { en: "Mistake Review", zhHant: "錯題重做", zhHans: "错题重做" },
  "home.reviewWrong": { en: "Review Wrong Answers", zhHant: "回顧錯題", zhHans: "回顾错题" },
  "home.reviewDesc": {
    en: "Revisit questions you got wrong and strengthen weak areas.",
    zhHant: "重新練習答錯的題目，加強薄弱環節。",
    zhHans: "重新练习答错的题目，加强薄弱环节。",
  },
  "home.reviewDescGuest": {
    en: "Sign in to track and review your mistakes.",
    zhHant: "登入以追蹤和回顧你的錯題。",
    zhHans: "登录以追踪和回顾你的错题。",
  },
  "home.comingSoon": { en: "Coming Soon", zhHant: "即將推出", zhHans: "即将推出" },
  "home.guidePrompt": {
    en: "Not sure how to prepare? Check our step-by-step Guide",
    zhHant: "不知道如何準備？查看我們的分步指南",
    zhHans: "不知道如何准备？查看我们的分步指南",
  },
  "home.guestBanner": { en: "Guest mode — limited access", zhHant: "訪客模式 — 有限存取", zhHans: "访客模式 — 有限访问" },
  "home.signInUnlock": { en: "Sign In to Unlock", zhHant: "登入解鎖", zhHans: "登录解锁" },
  "home.progress": { en: "Progress", zhHant: "進度", zhHans: "进度" },
  "home.lastModule": { en: "Last Module", zhHant: "上次學到", zhHans: "上次学到" },
  "home.testScore": { en: "Test Score", zhHant: "測試成績", zhHans: "测试成绩" },

  // ── Study Center ──
  "study.title": { en: "Study Center", zhHant: "學習中心", zhHans: "学习中心" },
  "study.subtitle": {
    en: "12 modules based on the California Driver Handbook. Study at your own pace.",
    zhHant: "基於加州駕駛員手冊的12個模組。按自己的節奏學習。",
    zhHans: "基于加州驾驶员手册的12个模块。按自己的节奏学习。",
  },
  "study.repeatNote": {
    en: "Some key concepts are repeated across modules to reinforce learning. Feel free to skip sections you've already mastered.",
    zhHant: "部分重要內容會在不同模組中重複出現以加深記憶，您可根據自身情況跳過已掌握的部分。",
    zhHans: "部分重要内容会在不同模块中重复出现以加深记忆，您可根据自身情况跳过已掌握的部分。",
  },
  "study.guestBanner": {
    en: "Guest: M01 & M02 available",
    zhHant: "訪客：可使用 M01 和 M02",
    zhHans: "访客：可使用 M01 和 M02",
  },
  "study.signInUnlockAll": { en: "Sign In to Unlock All", zhHant: "登入解鎖全部", zhHans: "登录解锁全部" },
  "study.notStarted": { en: "Not Started", zhHant: "未開始", zhHans: "未开始" },

  // ── Study Module Page ──
  "module.allModules": { en: "All Modules", zhHant: "所有模組", zhHans: "所有模块" },
  "module.showCollapsible": { en: "Show Chinese", zhHant: "顯示簡體", zhHans: "显示中文" },
  "module.hideCollapsible": { en: "Hide Chinese", zhHant: "隱藏簡體", zhHans: "隐藏中文" },
  "module.showAll": { en: "Show All", zhHant: "全部顯示", zhHans: "全部显示" },
  "module.prev": { en: "Prev", zhHant: "上一節", zhHans: "上一节" },
  "module.next": { en: "Next", zhHant: "下一節", zhHans: "下一节" },
  "module.done": { en: "Done", zhHant: "完成", zhHans: "完成" },
  "module.moduleComplete": { en: "Module Complete", zhHant: "模組完成", zhHans: "模块完成" },
  "module.highFreq": { en: "High Freq", zhHant: "高頻考點", zhHans: "高频考点" },
  "module.showChinese": { en: "Show Chinese 查看中文 ▼", zhHant: "查看簡體 ▼", zhHans: "查看中文 ▼" },
  "module.hide": { en: "Hide ▲", zhHant: "隱藏 ▲", zhHans: "隐藏 ▲" },

  // ── Mock Test List ──
  "mock.title": { en: "Mock Test", zhHant: "模擬考試", zhHans: "模拟考试" },
  "mock.notTaken": { en: "Not Taken", zhHant: "未考", zhHans: "未考" },
  "mock.questions": { en: "questions", zhHant: "題", zhHans: "题" },
  "mock.pass": { en: "Pass", zhHant: "通過", zhHans: "通过" },
  "mock.examType": { en: "Exam type", zhHant: "考試類型", zhHans: "考试类型" },
  "mock.guestBanner": {
    en: "Guest: Mock Exam 1 available",
    zhHant: "訪客：可使用模擬考試 1",
    zhHans: "访客：可使用模拟考试 1",
  },
  "mock.aboutTitle": { en: "About the DMV Written Test", zhHant: "關於DMV筆試", zhHans: "关于DMV笔试" },
  "mock.aboutAdult": {
    en: "Adults (18+): 36 multiple-choice questions, need 31 correct to pass",
    zhHant: "成人（18歲以上）：36道選擇題，需答對31題通過",
    zhHans: "成人（18岁以上）：36道选择题，需答对31题通过",
  },
  "mock.aboutMinor": {
    en: "Under 18: 46 multiple-choice questions, need 38 correct to pass",
    zhHant: "未滿18歲：46道選擇題，需答對38題通過",
    zhHans: "未满18岁：46道选择题，需答对38题通过",
  },
  "mock.aboutAccuracy": {
    en: "Both require 83% accuracy to pass",
    zhHant: "均需83%正確率通過",
    zhHans: "均需83%正确率通过",
  },
  "mock.aboutLanguage": {
    en: "Available in English or Traditional Chinese (\u7e41\u9ad4\u4e2d\u6587) at the DMV",
    zhHant: "DMV提供英文或繁體中文考試",
    zhHans: "DMV提供英文或繁体中文考试",
  },

  // ── Exam Page (follows exam language, not UI language) ──
  // These are used with exam language toggle, kept simple
  "exam.submit": { en: "Submit", zhHant: "提交" },
  "exam.previous": { en: "Previous", zhHant: "上一題" },
  "exam.next": { en: "Next", zhHant: "下一題" },
  "exam.flag": { en: "Flag", zhHant: "標記" },
  "exam.flagged": { en: "Flagged", zhHant: "已標記" },
  "exam.answered": { en: "Answered", zhHant: "已答" },
  "exam.navigator": { en: "Question Navigator", zhHant: "題目導航" },
  "exam.passInfo": { en: "Pass", zhHant: "通過" },
  "exam.confirmSubmit": {
    en: "questions. Submit anyway?",
    zhHant: "題。仍然提交？",
  },

  // ── Result Page (follows exam language) ──
  "result.pass": { en: "PASS", zhHant: "通過" },
  "result.fail": { en: "FAIL", zhHant: "未通過" },
  "result.congrats": { en: "Congratulations!", zhHant: "恭喜通過！" },
  "result.keepPracticing": { en: "Keep practicing!", zhHant: "繼續加油！" },
  "result.score": { en: "Score", zhHant: "得分" },
  "result.accuracy": { en: "Accuracy", zhHant: "正確率" },
  "result.time": { en: "Time", zhHant: "用時" },
  "result.passingScore": { en: "Passing score", zhHant: "及格分數" },
  "result.backToExams": { en: "Back to Exams", zhHant: "返回考試列表" },
  "result.reviewAnswers": { en: "Review Answers", zhHant: "回顧答案" },
  "result.hideAnswers": { en: "Hide Answers", zhHant: "隱藏答案" },
  "result.questionReview": { en: "Question Review", zhHant: "逐題回顧" },
  "result.correct": { en: "Correct", zhHant: "正確" },
  "result.wrong": { en: "Wrong", zhHant: "錯誤" },
  "result.yourAnswer": { en: "your answer", zhHant: "你的答案" },

  // ── Progress Page ──
  "progress.title": { en: "My Progress", zhHant: "我的進度", zhHans: "我的进度" },
  "progress.studyTab": { en: "Study Progress", zhHant: "學習進度", zhHans: "学习进度" },
  "progress.testsTab": { en: "Test Scores", zhHant: "測試成績", zhHans: "测试成绩" },
  "progress.overall": { en: "Overall Completion", zhHant: "總體完成度", zhHans: "总体完成度" },
  "progress.noResults": { en: "No test results yet.", zhHant: "暫無測試結果。", zhHans: "暂无测试结果。" },
  "progress.completeExam": {
    en: "Complete a mock exam to see your results here.",
    zhHant: "完成一套模擬考試即可在此查看結果。",
    zhHans: "完成一套模拟考试即可在此查看结果。",
  },
  "progress.unlockTitle": {
    en: "Unlock Your Full Study Experience",
    zhHant: "解鎖完整學習體驗",
    zhHans: "解锁完整学习体验",
  },
  "progress.unlockDesc": {
    en: "Sign in to access all 11 modules, 5 mock exams, and multi-language support.",
    zhHant: "登入即可使用全部11個模組、5套模擬考試和多語言支持。",
    zhHans: "登录即可使用全部11个模块、5套模拟考试和多语言支持。",
  },
  "progress.limitedFree": {
    en: "Limited-time free \u2014 unlock all materials",
    zhHant: "限時免費 \u2014 解鎖全部內容",
    zhHans: "限时免费 \u2014 解锁全部内容",
  },
  "progress.signInGoogle": { en: "Sign In with Google", zhHant: "用 Google 登入", zhHans: "用 Google 登录" },
  "progress.freeLaunch": { en: "Free during launch period", zhHant: "上線期間免費", zhHans: "上线期间免费" },
  "progress.whatUsersSay": { en: "What our users say", zhHant: "用戶評價", zhHans: "用户评价" },
  "progress.signInUnlock": { en: "Sign In to Unlock", zhHant: "登入解鎖", zhHans: "登录解锁" },

  // ── Locked Overlay ──
  "lock.signInToUnlock": { en: "Sign In to Unlock", zhHant: "登入解鎖", zhHans: "登录解锁" },
  "lock.limitedFree": { en: "Limited-time free", zhHant: "限時免費", zhHans: "限时免费" },
  "lock.signInDesc": {
    en: "Sign in with Google to unlock all modules and mock tests.",
    zhHant: "用 Google 登入以解鎖全部模組和模擬考試。",
    zhHans: "用 Google 登录以解锁全部模块和模拟考试。",
  },
  "lock.freeDuring": {
    en: "Free during limited-time launch period",
    zhHant: "限時上線期間免費",
    zhHans: "限时上线期间免费",
  },

  // ── Tutorial ──
  "tutorial.welcome.title": { en: "Welcome to AceDriveGo!", zhHant: "歡迎使用AceDriveGo！", zhHans: "欢迎使用AceDriveGo！" },
  "tutorial.welcome.desc": {
    en: "Your bilingual companion for passing the California DMV written test. Let us show you around!",
    zhHant: "你的雙語加州DMV筆試備考助手。讓我們為你導覽！",
    zhHans: "你的双语加州DMV笔试备考助手。让我们为你导览！",
  },
  "tutorial.uiLang.title": { en: "Interface Language", zhHant: "界面語言", zhHans: "界面语言" },
  "tutorial.uiLang.desc": {
    en: "Switch the app interface between English, 繁體中文, and 简体中文. This changes buttons, labels, and navigation text.",
    zhHant: "切換應用界面語言：English、繁體中文、简体中文。這會改變按鈕、標籤和導航文字。",
    zhHans: "切换应用界面语言：English、繁體中文、简体中文。这会改变按钮、标签和导航文字。",
  },
  "tutorial.studyLang.title": { en: "Study Content Language", zhHant: "學習內容語言", zhHans: "学习内容语言" },
  "tutorial.studyLang.desc": {
    en: "Choose how learning content is displayed: 繁體中文 (Traditional Chinese primary), English + 中文 (English with Chinese notes), or English Only.",
    zhHant: "選擇學習內容的顯示方式：繁體中文為主、English + 中文（英文為主搭配中文注釋）、或純英文。",
    zhHans: "选择学习内容的显示方式：繁体中文为主、English + 中文（英文为主搭配中文注释）、或纯英文。",
  },
  "tutorial.modules.title": { en: "Learning Modules", zhHant: "學習模組", zhHans: "学习模块" },
  "tutorial.modules.desc": {
    en: "12 modules covering every topic in the CA Driver Handbook. Study at your own pace, in any order.",
    zhHant: "12個模組涵蓋加州駕駛員手冊的所有主題。按自己的節奏學習，不限順序。",
    zhHans: "12个模块涵盖加州驾驶员手册的所有主题。按自己的节奏学习，不限顺序。",
  },
  "tutorial.showChinese.title": { en: "Show All Chinese", zhHant: "展開全部中文", zhHans: "展开全部中文" },
  "tutorial.showChinese.desc": {
    en: "While studying, tap the language toggle button to expand all Chinese translations at once, or tap each knowledge point individually.",
    zhHant: "學習時，點擊語言切換按鈕可一次展開所有中文翻譯，或逐條點擊展開。",
    zhHans: "学习时，点击语言切换按钮可一次展开所有中文翻译，或逐条点击展开。",
  },
  "tutorial.quiz.title": { en: "Section Quizzes", zhHant: "章節小測", zhHans: "章节小测" },
  "tutorial.quiz.desc": {
    en: "After each section, take a quick quiz to test your knowledge. Colored circles on the Study Center show your scores: green = 100%, orange = 80%+, red = below 80%.",
    zhHant: "每個章節結束後可進行小測驗。學習中心的彩色圓圈顯示成績：綠色=100%、橙色=80%以上、紅色=80%以下。",
    zhHans: "每个章节结束后可进行小测验。学习中心的彩色圆圈显示成绩：绿色=100%、橙色=80%以上、红色=80%以下。",
  },
  "tutorial.mockTest.title": { en: "Mock Exams", zhHant: "模擬考試", zhHans: "模拟考试" },
  "tutorial.mockTest.desc": {
    en: "10 full mock exams simulate the real DMV test. Adults: 36 questions (pass: 31). Under 18: 46 questions (pass: 38).",
    zhHant: "10套全真模擬考試。成人：36題（及格31題）。未滿18歲：46題（及格38題）。",
    zhHans: "10套全真模拟考试。成人：36题（及格31题）。未满18岁：46题（及格38题）。",
  },
  "tutorial.examLang.title": { en: "Exam Language", zhHant: "考試語言", zhHans: "考试语言" },
  "tutorial.examLang.desc": {
    en: "Mock exams and section quizzes can be taken in 繁體中文 or English \u2014 just like the real CA DMV test. Choose before you start each exam.",
    zhHant: "模擬考試和章節測驗可選繁體中文或英文作答，和真實DMV考試一樣。開始前選擇語言。",
    zhHans: "模拟考试和章节测验可选繁体中文或英文作答，和真实DMV考试一样。开始前选择语言。",
  },
  "tutorial.signIn.title": { en: "Sign In to Unlock", zhHant: "登入解鎖", zhHans: "登录解锁" },
  "tutorial.signIn.desc": {
    en: "Sign in with Google to unlock all 12 modules, 10 mock exams, and save your progress across devices.",
    zhHant: "用Google登入即可解鎖全部12個模組、10套模擬考試，並跨設備保存學習進度。",
    zhHans: "用Google登录即可解锁全部12个模块、10套模拟考试，并跨设备保存学习进度。",
  },
  "tutorial.skip": { en: "Skip", zhHant: "跳過", zhHans: "跳过" },
  "tutorial.next": { en: "Next", zhHant: "下一步", zhHans: "下一步" },
  "tutorial.done": { en: "Get Started!", zhHant: "開始使用！", zhHans: "开始使用！" },
} as const;

export type UIStringKey = keyof typeof strings;

export function getUIString(key: UIStringKey, lang: UILanguage): string {
  const entry = strings[key];
  if (!entry) return key;
  // Exam strings only have en/zhHant — fall back
  const val = (entry as Record<string, string>)[lang];
  if (val) return val;
  // Fallback: zhHans → zhHant → en
  if (lang === "zhHans" && "zhHant" in entry) return (entry as Record<string, string>).zhHant;
  return (entry as Record<string, string>).en;
}
