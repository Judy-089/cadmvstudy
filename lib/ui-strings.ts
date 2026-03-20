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
  "landing.heroTitle": {
    en: "Ace Your California DMV Test",
    zhHant: "最懂華人的",
    zhHans: "最懂华人的",
  },
  "landing.heroHighlight": {
    en: "in Hours, Not Days.",
    zhHant: "駕考速成神器",
    zhHans: "驾考速成神器",
  },
  "landing.subtitle": {
    en: "Skip the boring handbook. Pass on your first try with our 2-Hour Crash Course, smart study modules, and realistic mock exams. Free during beta.",
    zhHant: "專為加州華語社群打造的雙語學習平台。結構化課程、擬真模擬考試、中英無縫切換——試運行期間完全免費。",
    zhHans: "专为加州华语社群打造的双语学习平台。结构化课程、仿真模拟考试、中英无缝切换——试运行期间完全免费。",
  },
  "landing.getStarted": {
    en: "Get Started — Free During Beta",
    zhHant: "免費開始學習 — 試運行中",
    zhHans: "免费开始学习 — 试运行中",
  },
  "landing.tryFree": {
    en: "Try Without Account",
    zhHant: "免登入試用",
    zhHans: "免登录试用",
  },
  "landing.tryFreeDesc": {
    en: "3 modules + 1 mock test",
    zhHant: "3 個模組 + 1 套模擬題",
    zhHans: "3 个模块 + 1 套模拟题",
  },
  "landing.alreadyHaveAccount": {
    en: "Already have an account?",
    zhHant: "已有帳號？",
    zhHans: "已有账号？",
  },
  "landing.guestBtn": { en: "Start as Guest", zhHant: "訪客模式", zhHans: "访客模式" },
  "landing.guestDesc": {
    en: "Free preview \u00b7 3 modules + 1 mock test",
    zhHant: "免費預覽 \u00b7 3個模組 + 1套模擬題",
    zhHans: "免费预览 \u00b7 3个模块 + 1套模拟题",
  },
  "landing.signInBtn": { en: "Sign In", zhHant: "登入", zhHans: "登录" },
  "landing.signInDesc": {
    en: "Unlock everything \u00b7 Multi-language",
    zhHant: "解鎖全部內容 \u00b7 多語言",
    zhHans: "解锁全部内容 \u00b7 多语言",
  },
  "landing.questions": { en: "Questions", zhHant: "題目", zhHans: "题目" },
  "landing.modules": { en: "Study Modules", zhHant: "學習模組", zhHans: "学习模块" },
  "landing.mockExams": { en: "Mock Exams", zhHant: "模擬考試", zhHans: "模拟考试" },
  "landing.passRate": { en: "Pass Rate", zhHant: "通過率", zhHans: "通过率" },
  "landing.passRateNote": { en: "among our users", zhHant: "用戶通過率", zhHans: "用户通过率" },
  "landing.crashCourse": { en: "Crash Course", zhHant: "速成課程", zhHans: "速成课程" },
  "landing.avgStudyTime": { en: "Avg. Study Time", zhHant: "平均備考時長", zhHans: "平均备考时长" },
  "landing.basedOn": {
    en: "Based on the 2025 official California Driver Handbook \u00b7 Free during beta",
    zhHant: "基於 2025 官方加州駕駛員手冊 \u00b7 試運行期間免費",
    zhHans: "基于 2025 官方加州驾驶员手册 \u00b7 试运行期间免费",
  },
  "landing.trusted": {
    en: "Trusted by test-takers across California",
    zhHant: "深受加州考生信賴",
    zhHans: "深受加州考生信赖",
  },
  // ── EN feature cards ──
  "landing.featureCrashCourse": { en: "2-Hour Crash Course", zhHant: "", zhHans: "" },
  "landing.featureCrashCourseDesc": {
    en: "We condensed the 100+ page DMV handbook into exactly what you need to pass. Four focused phases, zero fluff. Study smarter, not harder.",
    zhHant: "", zhHans: "",
  },
  "landing.featureQuestions": { en: "870+ Practice Questions", zhHant: "", zhHans: "" },
  "landing.featureQuestionsDesc": {
    en: "Covers every topic on the real exam. Each question comes with detailed explanations so you understand the why, not just the answer.",
    zhHant: "", zhHans: "",
  },
  "landing.featureModules": { en: "12 Structured Modules", zhHant: "", zhHans: "" },
  "landing.featureModulesDesc": {
    en: "No more guessing what to study. Each module targets the most tested topics, organized from basics to advanced.",
    zhHant: "", zhHans: "",
  },
  "landing.featureFreeEn": { en: "Free, Ad-Free, Modern", zhHant: "", zhHans: "" },
  "landing.featureFreeEnDesc": {
    en: "No pop-ups, no paywalls, no clutter. Built for learning, not for ad revenue. Also available in Chinese.",
    zhHant: "", zhHans: "",
  },
  // ── ZH Crash Course hero card ──
  "landing.featureCrashCourseZh": {
    en: "",
    zhHant: "2小時速成衝刺課程",
    zhHans: "2小时速成冲刺课程",
  },
  "landing.featureCrashCourseZhDesc": {
    en: "",
    zhHant: "我們把 100 多頁的 DMV 手冊濃縮成考試必考重點。四個階段、零廢話，高效備考，省時省力。",
    zhHans: "我们把 100 多页的 DMV 手册浓缩成考试必考重点。四个阶段、零废话，高效备考，省时省力。",
  },
  "landing.mostPopular": { en: "Most Popular", zhHant: "最受歡迎", zhHans: "最受欢迎" },
  "landing.mustPractice": { en: "", zhHant: "考前必練", zhHans: "考前必练" },
  // ── ZH Mock Exam hero card (zhHant only) ──
  "landing.featureMockHero": {
    en: "",
    zhHant: "11套全真模擬考試",
    zhHans: "11套全真模拟考试",
  },
  "landing.featureMockHeroDesc": {
    en: "",
    zhHant: "完全模擬 DMV 真實考試格式——計時、評分，並為每道題提供詳細解析。考前反覆練習，上考場不緊張。",
    zhHans: "完全模拟 DMV 真实考试格式——计时、评分，并为每道题提供详细解析。考前反复练习，上考场不紧张。",
  },
  // ── zhHans-only: Bilingual learning hero card ──
  "landing.featureBilingual": {
    en: "Seamless Bilingual Experience",
    zhHant: "",
    zhHans: "英中双语对照学习",
  },
  "landing.featureBilingualDesc": {
    en: "",
    zhHant: "",
    zhHans: "每个知识点、每道题目都提供英文与简体中文并排显示。不用自己翻译，直接看懂原版交通规则。",
  },
  "landing.featureHantHans": {
    en: "",
    zhHant: "",
    zhHans: "繁简对照学习",
  },
  "landing.featureHantHansDesc": {
    en: "",
    zhHant: "",
    zhHans: "加州 DMV 考试只提供英文和繁体中文。繁体+简体对照模式帮你提前熟悉真实考试用语，上考场不再看不懂题目。",
  },
  // ── ZH shared feature cards ──
  "landing.featureStructured": {
    en: "Structured, Not Scattered",
    zhHant: "系統化，不零散",
    zhHans: "系统化，不零散",
  },
  "landing.featureStructuredDesc": {
    en: "12 carefully organized modules break down the DMV handbook into clear, test-relevant topics. No more reading 100+ pages of dense text.",
    zhHant: "12 個精心組織的模組，將 DMV 手冊拆解為清晰且考試重點的主題。不用再閱讀 100 多頁的密集文字。",
    zhHans: "12 个精心组织的模块，将 DMV 手册拆解为清晰且紧扣考点的主题。不用再啃 100 多页的枯燥手册。",
  },
  "landing.featureMock": {
    en: "Realistic Mock Exams",
    zhHant: "擬真模擬考試",
    zhHans: "仿真模拟考试",
  },
  "landing.featureMockDesc": {
    en: "11 full-length mock exams that mirror the real DMV test format — timed, scored, with detailed bilingual explanations for every question.",
    zhHant: "11 套全真模擬考試，完全模擬 DMV 真實考試格式——計時、評分，並為每道題提供詳細的雙語解析。",
    zhHans: "11 套全真模拟考试，完全模拟 DMV 真实考试格式——计时、评分，并为每道题提供详细的双语解析。",
  },
  "landing.featureFreeZh": {
    en: "", zhHant: "免費、無廣告、現代化", zhHans: "免费、无广告、现代化",
  },
  "landing.featureFreeZhDesc": {
    en: "",
    zhHant: "告別彈窗廣告和過時的備考網站。AceDriveGo 提供乾淨、直覺的學習體驗——試運行期間完全免費。",
    zhHans: "告别弹窗广告和过时的备考网站。AceDriveGo 提供干净、直觉的学习体验——试运行期间完全免费。",
  },
  // ── Disclaimers & recommendations ──
  "landing.studyModulesRecommend": {
    en: "If time allows, we recommend completing the full Study Modules for comprehensive coverage — equivalent to reading the DMV handbook.",
    zhHant: "如時間允許，建議完整學習所有模組以獲得最全面的備考效果。",
    zhHans: "如时间允许，建议完整学习所有模块以获得最全面的备考效果。",
  },
  "landing.crashCourseDisclaimer": {
    en: "* Estimated completion time; may vary by individual.",
    zhHant: "* 2小時為預估時長，因個人情況而異。",
    zhHans: "* 2小时为预估时长，因个人情况而异。",
  },
  "landing.statsDisclaimer": {
    en: "* Results based on beta user data. Individual results may vary.",
    zhHant: "* 數據基於試運行用戶，個人情況可能不同。",
    zhHans: "* 数据基于试运行用户，个人情况可能不同。",
  },
  "landing.whyTitle": {
    en: "Why AceDriveGo?",
    zhHant: "為什麼選擇 AceDriveGo？",
    zhHans: "为什么选择 AceDriveGo？",
  },
  "landing.ctaBottom": {
    en: "Ready to pass your DMV test?",
    zhHant: "準備好通過 DMV 考試了嗎？",
    zhHans: "准备好通过 DMV 考试了吗？",
  },
  "landing.ctaBottomDesc": {
    en: "Join thousands of California test-takers who passed on their first try.",
    zhHant: "加入數千名一次就通過的加州考生。試運行期間完全免費。",
    zhHans: "加入数千名一次就通过的加州考生。试运行期间完全免费。",
  },
  "landing.expansionHook": {
    en: "Not in California? Need another language?",
    zhHant: "不在加州？需要其他語言？",
    zhHans: "不在加州？需要其他语言？",
  },
  "landing.expansionLink": {
    en: "Let us know",
    zhHant: "告訴我們",
    zhHans: "告诉我们",
  },
  "footer.copyright": {
    en: "© 2026 AceDriveGo. All rights reserved.",
    zhHant: "© 2026 AceDriveGo. All rights reserved.",
    zhHans: "© 2026 AceDriveGo. All rights reserved.",
  },
  "footer.ip": {
    en: "All original content on this platform, including practice questions, explanations, translations, and content structure, is the intellectual property of AceDriveGo and is protected by copyright law. No part of this platform may be reproduced, distributed, or used for commercial purposes without prior written permission.",
    zhHant: "本平台所有原創內容，包括練習題目、解析、翻譯及內容架構，均為AceDriveGo的知識產權，受著作權法保護。未經書面許可，不得複製、分發或用於商業用途。",
    zhHans: "本平台所有原创内容，包括练习题目、解析、翻译及内容架构，均为AceDriveGo的知识产权，受著作权法保护。未经书面许可，不得复制、分发或用于商业用途。",
  },
  "footer.disclaimer": {
    en: "This product is an independent study tool and is not affiliated with, endorsed by, or sponsored by the California Department of Motor Vehicles (DMV). All traffic laws and regulations referenced are based on publicly available information.",
    zhHant: "本產品為獨立學習工具，與加州車輛管理局（DMV）無關聯、未獲其認可或贊助。所引用的交通法規均基於公開資訊。",
    zhHans: "本产品为独立学习工具，与加州车辆管理局（DMV）无关联、未获其认可或赞助。所引用的交通法规均基于公开信息。",
  },

  // ── Exam Exit Guard ──
  "exam.exitTitle": {
    en: "Leave Exam?",
    zhHant: "離開考試？",
    zhHans: "离开考试？",
  },
  "exam.exitDesc": {
    en: "You have an exam in progress. Would you like to save your progress and come back later, or discard it?",
    zhHant: "你正在進行考試。要保存進度稍後繼續，還是直接放棄？",
    zhHans: "你正在进行考试。要保存进度稍后继续，还是直接放弃？",
  },
  "exam.exitProgress": {
    en: "Current Progress",
    zhHant: "當前進度",
    zhHans: "当前进度",
  },
  "exam.exitSave": {
    en: "Save & Exit",
    zhHant: "保存並退出",
    zhHans: "保存并退出",
  },
  "exam.exitDiscard": {
    en: "Discard & Exit",
    zhHant: "放棄並退出",
    zhHans: "放弃并退出",
  },
  "exam.exitCancel": {
    en: "Continue Exam",
    zhHant: "繼續考試",
    zhHans: "继续考试",
  },
  "exam.exitBtn": {
    en: "Exit",
    zhHant: "退出",
    zhHans: "退出",
  },
  "exam.resumeBanner": {
    en: "You have a saved exam in progress. Resume?",
    zhHant: "你有一場未完成的考試，要繼續嗎？",
    zhHans: "你有一场未完成的考试，要继续吗？",
  },
  "exam.resumeBtn": {
    en: "Resume Exam",
    zhHant: "繼續考試",
    zhHans: "继续考试",
  },
  "exam.resumeDiscard": {
    en: "Start Fresh",
    zhHant: "重新開始",
    zhHans: "重新开始",
  },

  // ── Age Selection ──
  "age.title": { en: "How old are you?", zhHant: "你幾歲？", zhHans: "你几岁？" },
  "age.subtitle": {
    en: "This determines your mock exam format",
    zhHant: "這會決定你的模擬考試題數",
    zhHans: "这将决定你的模拟考试题数",
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
    zhHant: "不知道怎麼準備？看看我們的考照指南",
    zhHans: "不知道如何准备？查看我们的考照指南",
  },
  "home.guestBanner": { en: "Guest mode — limited access", zhHant: "訪客模式 — 僅開放部分功能", zhHans: "访客模式 — 仅开放部分功能" },
  "home.signInUnlock": { en: "Sign In to Unlock", zhHant: "登入解鎖", zhHans: "登录解锁" },
  "home.progress": { en: "Progress", zhHant: "進度", zhHans: "进度" },
  "home.lastModule": { en: "Last Module", zhHant: "上次學到", zhHans: "上次学到" },
  "home.testScore": { en: "Test Score", zhHant: "測試成績", zhHans: "测试成绩" },

  // ── Study Center ──
  "study.title": { en: "Study Center", zhHant: "學習中心", zhHans: "学习中心" },
  "study.subtitle": {
    en: "13 modules based on the California Driver Handbook. Study at your own pace.",
    zhHant: "根據加州駕駛員手冊編排的13個模組，按自己的步調學習。",
    zhHans: "基于加州驾驶员手册的13个模块。按自己的节奏学习。",
  },
  "study.repeatNote": {
    en: "Some key concepts are repeated across modules to reinforce learning. Feel free to skip sections you've already mastered.",
    zhHant: "部分重要內容會在不同模組中重複出現，以加深印象。你可以跳過已經熟悉的部分。",
    zhHans: "部分重要内容会在不同模块中重复出现以加深记忆，你可以跳过已经掌握的部分。",
  },
  "study.guestBanner": {
    en: "Guest mode: first 3 modules available",
    zhHant: "訪客模式：前3個模組可用",
    zhHans: "访客模式：前3个模块可用",
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
  "mock.pass": { en: "Pass", zhHant: "及格", zhHans: "及格" },
  "mock.examType": { en: "Exam type", zhHant: "考試類型", zhHans: "考试类型" },
  "mock.guestBanner": {
    en: "Guest: Mock Exam 1 available",
    zhHant: "訪客：可使用模擬考試 1",
    zhHans: "访客：可使用模拟考试 1",
  },
  "mock.aboutTitle": { en: "About the DMV Written Test", zhHant: "關於DMV筆試", zhHans: "关于DMV笔试" },
  "mock.aboutAdult": {
    en: "Adults (18+): 36 multiple-choice questions, need 31 correct to pass",
    zhHant: "成人（18歲以上）：36道選擇題，答對31題及格",
    zhHans: "成人（18岁以上）：36道选择题，答对31题及格",
  },
  "mock.aboutMinor": {
    en: "Under 18: 46 multiple-choice questions, need 38 correct to pass",
    zhHant: "未滿18歲：46道選擇題，答對38題及格",
    zhHans: "未满18岁：46道选择题，答对38题及格",
  },
  "mock.aboutAccuracy": {
    en: "Both require 83% accuracy to pass",
    zhHant: "兩者皆需達到83%正確率才算及格",
    zhHans: "两者均需达到83%正确率才算及格",
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
  "exam.navigator": { en: "Question Navigator", zhHant: "題目導覽" },
  "exam.passInfo": { en: "Pass", zhHant: "及格" },
  "exam.confirmSubmit": {
    en: "questions. Submit anyway?",
    zhHant: "題。仍然提交？",
  },

  // ── Result Page (follows exam language) ──
  "result.pass": { en: "PASS", zhHant: "及格" },
  "result.fail": { en: "FAIL", zhHant: "不及格" },
  "result.congrats": { en: "Congratulations!", zhHant: "恭喜過關！" },
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
  "progress.whatUsersSay": { en: "What our users say", zhHant: "使用者評價", zhHans: "用户评价" },
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
    zhHans: "你的双语加州DMV笔试备考助手。让我们带你看看！",
  },
  "tutorial.uiLang.title": { en: "Interface Language", zhHant: "介面語言", zhHans: "界面语言" },
  "tutorial.uiLang.desc": {
    en: "Switch the app interface between English, 繁體中文, and 简体中文. This changes buttons, labels, and navigation text.",
    zhHant: "切換介面語言：English、繁體中文、简体中文。這會改變按鈕、標籤和導覽列文字。",
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
    en: "13 modules covering every topic in the CA Driver Handbook. Study at your own pace, in any order.",
    zhHant: "13個模組涵蓋加州駕駛員手冊的所有主題。按自己的步調學習，順序不限。",
    zhHans: "13个模块涵盖加州驾驶员手册的所有主题。按自己的节奏学习，不限顺序。",
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
    en: "11 full mock exams simulate the real DMV test. Adults: 36 questions (pass: 31). Under 18: 46 questions (pass: 38).",
    zhHant: "11套全真模擬考試。成人：36題（及格31題）。未滿18歲：46題（及格38題）。",
    zhHans: "11套全真模拟考试。成人：36题（及格31题）。未满18岁：46题（及格38题）。",
  },
  "tutorial.examLang.title": { en: "Exam Language", zhHant: "考試語言", zhHans: "考试语言" },
  "tutorial.examLang.desc": {
    en: "Mock exams and section quizzes can be taken in 繁體中文 or English \u2014 just like the real CA DMV test. Choose before you start each exam.",
    zhHant: "模擬考試和章節測驗可選繁體中文或英文作答，和真實DMV考試一樣。開始前選擇語言。",
    zhHans: "模拟考试和章节测验可选繁体中文或英文作答，和真实DMV考试一样。开始前选择语言。",
  },
  "tutorial.signIn.title": { en: "Sign In to Unlock", zhHant: "登入解鎖", zhHans: "登录解锁" },
  "tutorial.signIn.desc": {
    en: "Sign in with Google to unlock all 13 modules, 11 mock exams, and save your progress across devices.",
    zhHant: "用Google登入即可解鎖全部13個模組、11套模擬考試，並跨設備保存學習進度。",
    zhHans: "用Google登录即可解锁全部13个模块、11套模拟考试，并跨设备保存学习进度。",
  },
  "tutorial.skip": { en: "Skip", zhHant: "跳過", zhHans: "跳过" },
  "tutorial.next": { en: "Next", zhHant: "下一步", zhHans: "下一步" },
  "tutorial.done": { en: "Get Started!", zhHant: "開始使用！", zhHans: "开始使用！" },

  // ── Crash Course ──
  "cc.title": { en: "Crash Course", zhHant: "速成衝刺", zhHans: "速成冲刺" },
  "cc.banner": { en: "Exam Tomorrow? 2-Hour Crash Course", zhHant: "考試就在明天？2小時速成衝刺", zhHans: "考试就在明天？2小时速成冲刺" },
  "cc.disclaimer": { en: "This Crash Course covers key points only. If you have time, we recommend completing the full Study modules.", zhHant: "本速成衝刺僅覆蓋重難點。如有時間，建議完成完整學習模組。", zhHans: "本速成冲刺仅覆盖重难点。如有时间，建议完成完整学习模块。" },
  "cc.numbersBtn": { en: "📊 Quick Reference Numbers", zhHant: "📊 數字速查表", zhHans: "📊 数字速查表" },
  "cc.numbersTitle": { en: "Quick Reference Numbers", zhHant: "數字速查表", zhHans: "数字速查表" },
  "cc.phase": { en: "Phase", zhHant: "階段", zhHans: "阶段" },
  "cc.minutes": { en: "min", zhHant: "分鐘", zhHans: "分钟" },
  "cc.locked": { en: "Complete previous phase to unlock", zhHant: "完成上一階段以解鎖", zhHans: "完成上一阶段以解锁" },
  "cc.completed": { en: "Completed", zhHant: "已完成", zhHans: "已完成" },
  "cc.startPractice": { en: "Start Practice", zhHant: "開始練習", zhHans: "开始练习" },
  "cc.search": { en: "Search numbers or rules...", zhHant: "搜索數字或規則...", zhHans: "搜索数字或规则..." },
  "cc.mnemonic": { en: "Memory Aid", zhHant: "記憶口訣", zhHans: "记忆口诀" },
  "cc.back": { en: "← Back to Crash Course", zhHant: "← 返回速成衝刺", zhHans: "← 返回速成冲刺" },
  "cc.signInRequired": { en: "Sign in to access Crash Course", zhHant: "登入以使用速成衝刺", zhHans: "登录以使用速成冲刺" },
  "cc.overallProgress": { en: "Overall Progress", zhHant: "總體進度", zhHans: "总体进度" },
  "cc.phase1": { en: "Number Memory Training", zhHant: "數字速記訓練", zhHans: "数字速记训练" },
  "cc.phase2": { en: "Six Core Topics", zhHant: "六大核心專題", zhHans: "六大核心专题" },
  "cc.phase3": { en: "Confusion Comparison", zhHant: "易混淆對比訓練", zhHans: "易混淆对比训练" },
  "cc.phase4": { en: "Pre-Exam Sprint", zhHant: "考前衝刺模擬", zhHans: "考前冲刺模拟" },
  "cc.bannerTitle": { en: "Crash Course — 2hr Sprint Review", zhHant: "速成衝刺 — 2小時考前衝刺複習", zhHans: "速成冲刺 — 2小时考前冲刺复习" },
  "cc.bannerSubtitle": { en: "Cover all key points before your exam", zhHant: "考前覆蓋所有重難點", zhHans: "考前覆盖所有重难点" },
  "cc.bannerStart": { en: "Start →", zhHant: "開始 →", zhHans: "开始 →" },

  // ── Mistake Review (错题本) ──
  "mistakes.title": { en: "Mistake Review", zhHant: "錯題重做", zhHans: "错题重做" },
  "mistakes.subtitle": { en: "Review and master your weak points", zhHant: "回顧並掌握你的薄弱環節", zhHans: "回顾并掌握你的薄弱环节" },
  "mistakes.tabAll": { en: "All", zhHant: "全部", zhHans: "全部" },
  "mistakes.tabToday": { en: "Today", zhHant: "今日", zhHans: "今日" },
  "mistakes.tabFlagged": { en: "Flagged", zhHant: "標記", zhHans: "标记" },
  "mistakes.tabByModule": { en: "By Module", zhHant: "分類", zhHans: "分类" },
  "mistakes.toReview": { en: "To Review", zhHant: "待複習", zhHans: "待复习" },
  "mistakes.mastered": { en: "Mastered", zhHant: "已掌握", zhHans: "已掌握" },
  "mistakes.total": { en: "Total", zhHant: "總計", zhHans: "总计" },
  "mistakes.quickReview": { en: "Quick Review", zhHant: "快速複習", zhHans: "快速复习" },
  "mistakes.todayReview": { en: "Today's Mistakes", zhHant: "今日錯題", zhHans: "今日错题" },
  "mistakes.flaggedReview": { en: "Flagged Questions", zhHant: "標記題目", zhHans: "标记题目" },
  "mistakes.moduleReview": { en: "Module Focus", zhHant: "模組重點", zhHans: "模块重点" },
  "mistakes.hardest": { en: "Hardest Questions", zhHant: "最難題目", zhHans: "最难题目" },
  "mistakes.streakProgress": { en: "toward mastery", zhHant: "邁向掌握", zhHans: "迈向掌握" },
  "mistakes.streakReset": { en: "Streak reset", zhHant: "連續正確歸零", zhHans: "连续正确归零" },
  "mistakes.correctStreak": { en: "Correct!", zhHant: "正確！", zhHans: "正确！" },
  "mistakes.stillWrong": { en: "Still incorrect", zhHant: "仍然錯誤", zhHans: "仍然错误" },
  "mistakes.flagBtn": { en: "🚩 Flag as Uncertain", zhHant: "🚩 標記為不確定", zhHans: "🚩 标记为不确定" },
  "mistakes.flagged": { en: "✓ Flagged", zhHant: "✓ 已標記", zhHans: "✓ 已标记" },
  "mistakes.flagTip": {
    en: "Even if correct, this question will be added to your Mistake Review for extra practice.",
    zhHant: "即使答對，此題也會加入錯題本以加強練習。",
    zhHans: "即使答对，此题也会加入错题本以加强练习。",
  },
  "mistakes.noMistakes": { en: "No Mistakes Yet!", zhHant: "還沒有錯題！", zhHans: "还没有错题！" },
  "mistakes.noMistakesDesc": {
    en: "Complete some quizzes or mock exams to start tracking your mistakes.",
    zhHant: "完成一些測驗或模擬考試，開始追蹤你的錯題。",
    zhHans: "完成一些测验或模拟考试，开始追踪你的错题。",
  },
  "mistakes.signInPrompt": {
    en: "Sign in to track and review your mistakes.",
    zhHant: "登入以追蹤和回顧你的錯題。",
    zhHans: "登录以追踪和回顾你的错题。",
  },
  "mistakes.sourceMock": { en: "Mock Exam", zhHant: "模擬考試", zhHans: "模拟考试" },
  "mistakes.sourceQuiz": { en: "Study Quiz", zhHant: "學習測驗", zhHans: "学习测验" },
  "mistakes.sourceCrash": { en: "Crash Course", zhHant: "速成課程", zhHans: "速成课程" },
  "mistakes.questions": { en: "questions", zhHant: "題", zhHans: "题" },
  "mistakes.startReview": { en: "Start Review", zhHant: "開始複習", zhHans: "开始复习" },
  "mistakes.seeResults": { en: "See Results", zhHant: "查看結果", zhHans: "查看结果" },
  "mistakes.nextQuestion": { en: "Next Question", zhHant: "下一題", zhHans: "下一题" },
  "mistakes.back": { en: "Back to Mistakes", zhHant: "返回錯題本", zhHans: "返回错题本" },
  "mistakes.done": { en: "Done", zhHant: "完成", zhHans: "完成" },
  "mistakes.resolved": { en: "Mastered! ✓", zhHant: "已掌握！✓", zhHans: "已掌握！✓" },
  "mistakes.wrongCount": { en: "wrong", zhHant: "次錯", zhHans: "次错" },
  "mistakes.noResults": { en: "No questions in this category", zhHant: "此分類暫無題目", zhHans: "此分类暂无题目" },
  "mistakes.yourAnswer": { en: "Your answer", zhHant: "你的答案", zhHans: "你的答案" },
  "mistakes.correctAnswer": { en: "Correct answer", zhHant: "正確答案", zhHans: "正确答案" },
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
