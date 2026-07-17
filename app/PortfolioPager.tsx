"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { EChartsOption, EChartsType } from "echarts";
import ResearchVisuals from "./ResearchVisuals";
import ProjectNarratives from "./ProjectNarratives";
import { applyLanguage, detectInitialLanguage, type Language } from "./i18n";

const en = {
  langSwitchAria: "Language",
  skipToPage: "Skip to current page",
  wordmarkAria: "Kexin Zhang, home",
  primaryNavAria: "Primary pages",
  nav: {
    home: "Home",
    profile: "Profile",
    contact: "Contact",
  },
  liveRegion: (page: number, total: number, label: string) =>
    `Page ${page} of ${total}: ${label}`,
  home: {
    eyebrow: "Game design · Player experience · Human-centered HCI",
    titleA: "Kexin",
    titleB: "Zhang",
    statementPre: "I explore how ",
    statementStrong: "rules, stories, and consequential choices",
    statementPost: " shape the way people experience memory, care, and identity.",
    cta: "Explore selected work",
  },
  portrait: {
    ariaLabel: "Compare the Character Attachment word cloud with Kexin's portrait",
    valueText: (reveal: number) => `${reveal}% portrait, ${100 - reveal}% word cloud`,
    prompt: "Slide to reveal",
    caption:
      "Move horizontally to reveal the portrait. Use the left and right arrow keys when focused.",
  },
  projects: {
    anchor: {
      subtitle: "A first-person narrative puzzle game",
      role: "Narrative design · Player experience",
      status: "In progress",
      stat: "Playable prototype",
      description:
        "A playable inquiry into fragmented memory, caregiver pressure, and the effort to preserve a sense of home.",
      tags: ["Game mechanics", "Narrative choices", "Prototype"],
      details: [
        {
          label: "Design premise",
          text: "The game alternates between a daughter’s present and her mother’s fragmented memories across a home, metro station, and hospital psychiatric department.",
        },
        {
          label: "Core mechanics",
          text: "Object investigation, combination locks, route choices, photo puzzles, and narrative decisions. Retained memory anchors shape what resurfaces and which ending unfolds.",
        },
        {
          label: "My contribution",
          text: "Narrative and player-experience design, supported by lightweight AI-assisted prototyping of the core flow.",
        },
      ],
    },
    attachment: {
      subtitle: "How Nijigen characters begin to feel alive",
      role: "MA dissertation · Qualitative game research",
      status: "Game research",
      stat: "10 players · 6 games",
      description:
        "A qualitative study of how character appeal, interaction mechanics, narrative, and real-world objects turn fictional characters into felt relationships.",
      tags: ["Thematic analysis", "Player interviews", "Game psychology"],
      details: [
        {
          label: "Question",
          text: "How do players form attachment to non-customisable characters—and how does that attachment move between the game and everyday life?",
        },
        {
          label: "Method",
          text: "Ten semi-structured interviews with dedicated players across six Nijigen games, followed by thematic analysis.",
        },
        {
          label: "Finding",
          text: "Three overlapping modes emerged: symbiotic, observance, and actualisation. All centred on perceived mutual care and response.",
        },
      ],
    },
    genshin: {
      subtitle: "How a Chinese open-world RPG turns difference into shared meaning",
      role: "Dissertation · Cross-cultural game research",
      status: "Game & media study",
      stat: "4 connected systems",
      description:
        "A qualitative study of how values, narrative, audiovisual language, and character networks make cultural specificity globally legible.",
      tags: ["Textual analysis", "Cross-cultural communication", "Game worlds"],
      details: [
        {
          label: "Question",
          text: "How can a game remain culturally specific while inviting players from different backgrounds into the same world?",
        },
        {
          label: "Method",
          text: "Literature review and comparative textual analysis across values, plot, audiovisual symbols, ritual, and character architecture.",
        },
        {
          label: "Finding",
          text: "Genshin builds shared cultural ground first, then lets difference return through places, characters, music, translation, and play.",
        },
      ],
    },
    fps: {
      subtitle: "Factors associated with online playtime",
      role: "Project lead · Quantitative research",
      status: "Research study",
      stat: "97 valid responses",
      description:
        "A survey-led study of how game experience, perceived usability, and social interaction relate to FPS session length.",
      tags: ["Ordinal regression", "SPSS", "Survey design"],
      details: [
        {
          label: "Question",
          text: "Which experience factors are associated with Chinese FPS players entering longer single-session playtime categories?",
        },
        {
          label: "Methods",
          text: "WeChat survey, data cleaning and recoding, reliability assessment, and ordinal logistic regression in SPSS.",
        },
        {
          label: "Finding",
          text: "Social interaction had the strongest significant association with longer categories; game experience was significant, while usability was not.",
        },
      ],
    },
    "ai-library": {
      subtitle: "Rethinking Library Live Chat",
      role: "Project lead · User research",
      status: "HCI study",
      stat: "55 survey · 6 interviews",
      description:
        "A mixed-method study with KCL Library exploring student AI use, trust, privacy, guidance, and service opportunities.",
      tags: ["HCI", "Data visualisation", "Service research"],
      details: [
        {
          label: "Context",
          text: "The study explored student AI use and the potential integration of AI into King’s College London Library Live Chat.",
        },
        {
          label: "Methods",
          text: "Fifty-five survey responses, six semi-structured interviews, question-level analysis, and evidence visualisation.",
        },
        {
          label: "Insight",
          text: "Students wanted the speed of AI, the traceability of search, and the empathy of human support.",
        },
      ],
    },
  },
  slideLabels: {
    overview: "Overview",
    prototype: "Prototype",
    "relationships-a": "Portraits I",
    "relationships-b": "Portraits II",
    formation: "Formation",
    evidence: "Evidence",
    "shared-world": "Shared world",
    "living-culture": "Living culture",
    "cultural-orrery": "Cultural orrery",
    method: "Method",
    sessions: "Sessions",
    drivers: "Drivers",
    service: "Service opportunity",
    adoption: "Adoption",
    trust: "Trust",
  },
  slideAria: {
    overview: (title: string) => `${title} overview`,
    evidence: (title: string) => `${title} evidence`,
  },
  projectPagerAria: "Project pages",
  prevProjectAria: "Previous project page",
  nextProjectAria: "Next project page",
  attachmentOverview: {
    statPlayers: "10 players",
    statGames: "6 games",
    summary:
      "Ten dedicated players each introduced one non-customisable character—and described when attraction began to feel reciprocal.",
    caseStageAria: "Three featured character attachment cases",
    caseAlt: (name: string, game: string) => `${name} from ${game}`,
    cases: [
      {
        name: "Kaveh",
        game: "Genshin Impact",
        mode: "Symbiotic attachment",
        short: "Resonance / shared ideals",
        text: "Shared ideals and struggle created a sense of kinship. As Kaveh grew, his choices began to guide the player’s own.",
        image: "/attachment-kaveh-cutout.webp",
      },
      {
        name: "Ningguang",
        game: "Genshin Impact",
        mode: "Observance attachment",
        short: "Small rituals / a continuing world",
        text: "A nightly ritual—leaving her seated in Liyue—made her world feel as if it continued after the screen went dark.",
        image: "/attachment-ningguang-cutout.webp",
      },
      {
        name: "Necrologist",
        game: "Reverse: 1999",
        mode: "Actualisation attachment",
        short: "Emotional support / memory",
        text: "Voice and story offered comfort around grief. The bond crossed into daily life as friendship, memory and a permanent tattoo.",
        image: "/attachment-necrologist-cutout.webp",
      },
    ],
  },
  anchorOverview: {
    roleLabel: "Role",
    showcaseLabel: "Showcase",
    demoCaption: "Real-device gameplay demo of Anchor",
  },
  practice: {
    eyebrow: "03 / Practice",
    heading: "Design as a way of asking.",
    lede: "A practice that moves between close observation, system design, and tangible prototypes.",
    areas: [
      {
        number: "01",
        title: "Narrative systems",
        text: "Themes become rules, routes, puzzles, and choices.",
      },
      {
        number: "02",
        title: "Player research",
        text: "Surveys, interviews, and quantitative analysis.",
      },
      {
        number: "03",
        title: "Playable inquiry",
        text: "Prototype core interaction flows early.",
      },
    ],
    processAria: "Creative research process",
    processSteps: [
      { title: "Observe", text: "behaviour, context, tension" },
      { title: "Translate", text: "insight into mechanics" },
      { title: "Prototype", text: "play, test, refine" },
    ],
    storyButton: "Storytelling foundations",
    storyEvidence: [
      { value: "17", label: "published works" },
      { value: "1K+", label: "reads" },
      { value: "1.267M", label: "livestream traffic" },
    ],
  },
  profile: {
    eyebrow: "04 / Profile",
    heading: "Researcher’s rigour, maker’s curiosity.",
    lede: "Trained across digital media, communication, user research, and hands-on production.",
    educationLabel: "Education",
    experienceLabel: "Experience",
    education: [
      {
        time: "2023—25",
        school: "King’s College London",
        degree: "MA, Digital Asset & Media Management",
      },
      {
        time: "2019—23",
        school: "East China University of Political Science and Law",
        degree: "BA, Journalism and Communication · GPA 3.8 / 4.0",
      },
    ],
    experience: [
      {
        time: "2022",
        company: "Sichuan Newspaper Group · Cover News",
        job: "Media Intern, Automotive Desk",
      },
      {
        time: "2021",
        company: "Zigong Daily",
        job: "New Media Editorial Intern",
      },
    ],
    tablistAria: "Profile details",
    tabs: ["Methods", "Tools", "Recognition"],
    methods: [
      "User research",
      "Questionnaire design",
      "Data cleaning & recoding",
      "Reliability analysis",
      "Ordinal regression",
      "Data visualisation",
      "Interview design",
      "Narrative prototyping",
    ],
    recognition: [
      "Two Second Prizes at the 7th Hongfeng College Student Journalists Festival—for writing and video.",
      "ECUPL Comprehensive Scholarship, 2019—20 and 2020—21.",
    ],
  },
  contact: {
    headingA: "Let’s make systems",
    headingB: "people can feel.",
    body: "For research conversations, game collaborations, or portfolio enquiries, send me a note.",
    signature: "Questions · Evidence · Play",
    copyright: "© 2026 Kexin Zhang",
  },
  dialog: {
    topbar: "Storytelling",
    close: "Close",
    eyebrow: "Media & communication",
    title: "Before systems, stories.",
    intro:
      "Reporting and media production taught me to listen closely, frame a human question, and make complexity legible.",
    metrics: [
      { value: "17", label: "published videos & articles" },
      { value: "1K+", label: "reads on a reported feature" },
      { value: "1.267M", label: "aggregate livestream traffic" },
    ],
    projects: [
      {
        tag: "Interview-led feature · 2020",
        title: "A Dialogue Across Seventeen Years",
        text: "Interviewed healthcare workers who had lived through both SARS and COVID-19, then wrote the resulting feature.",
      },
      {
        tag: "Documentary video · 2020",
        title: "A Restaurant During the Pandemic",
        text: "Wrote the script for a video following a Shanghai restaurant’s two-month recovery through owner and customer interviews.",
      },
    ],
  },
};

type Copy = typeof en;

const zh: Copy = {
  langSwitchAria: "语言",
  skipToPage: "跳到当前页面",
  wordmarkAria: "张可欣，首页",
  primaryNavAria: "主要页面",
  nav: {
    home: "首页",
    profile: "简介",
    contact: "联系",
  },
  liveRegion: (page, total, label) => `第 ${page} 页，共 ${total} 页：${label}`,
  home: {
    eyebrow: "游戏设计 · 玩家体验 · 以人为本的 HCI",
    titleA: "张",
    titleB: "可欣",
    statementPre: "我探索",
    statementStrong: "规则、故事与关键选择",
    statementPost: "如何塑造人们体验记忆、关怀与身份的方式。",
    cta: "探索精选作品",
  },
  portrait: {
    ariaLabel: "对比「角色依恋」词云与可欣的肖像",
    valueText: (reveal) => `${reveal}% 肖像，${100 - reveal}% 词云`,
    prompt: "滑动揭示",
    caption: "水平移动以揭示肖像。聚焦时可使用左右方向键。",
  },
  projects: {
    anchor: {
      subtitle: "第一人称叙事解谜游戏",
      role: "叙事设计 · 玩家体验",
      status: "进行中",
      stat: "可玩原型",
      description:
        "一场可玩的探索：关于破碎的记忆、照护者的压力，以及努力留住「家」的感觉。",
      tags: ["游戏机制", "叙事选择", "原型"],
      details: [
        {
          label: "设计前提",
          text: "游戏在女儿的当下与母亲支离破碎的记忆之间交替，场景横跨家、地铁站与医院精神科。",
        },
        {
          label: "核心机制",
          text: "物件调查、组合密码锁、路线选择、照片解谜与叙事抉择。保留下来的记忆锚点决定哪些回忆会浮现、走向哪个结局。",
        },
        {
          label: "我的贡献",
          text: "负责叙事与玩家体验设计，并以轻量级的 AI 辅助原型搭建核心流程。",
        },
      ],
    },
    attachment: {
      subtitle: "二次元角色如何开始显得「活着」",
      role: "硕士毕业论文 · 质性游戏研究",
      status: "游戏研究",
      stat: "10 位玩家 · 6 款游戏",
      description:
        "一项质性研究，探讨角色魅力、互动机制、叙事与现实物件如何把虚构角色变成真实可感的关系。",
      tags: ["主题分析", "玩家访谈", "游戏心理学"],
      details: [
        {
          label: "问题",
          text: "玩家如何对不可自定义的角色产生依恋？这种依恋又如何在游戏与日常生活之间流动？",
        },
        {
          label: "方法",
          text: "对来自六款二次元游戏的十位核心玩家进行半结构化访谈，随后进行主题分析。",
        },
        {
          label: "发现",
          text: "呈现出三种交叠的模式：共生、守望与实现，核心都是被感知到的相互关怀与回应。",
        },
      ],
    },
    genshin: {
      subtitle: "一款中国开放世界 RPG 如何把差异转化为共享的意义",
      role: "毕业论文 · 跨文化游戏研究",
      status: "游戏与媒介研究",
      stat: "4 个相互关联的系统",
      description:
        "一项质性研究，探讨价值观、叙事、视听语言与角色网络如何让文化特异性在全球范围内可被理解。",
      tags: ["文本分析", "跨文化传播", "游戏世界"],
      details: [
        {
          label: "问题",
          text: "一款游戏如何在保持文化特异性的同时，邀请不同背景的玩家进入同一个世界？",
        },
        {
          label: "方法",
          text: "通过文献综述与比较文本分析，考察价值观、剧情、视听符号、仪式与角色架构。",
        },
        {
          label: "发现",
          text: "《原神》先建立共享的文化地基，再让差异通过地点、角色、音乐、翻译与玩法回归。",
        },
      ],
    },
    fps: {
      subtitle: "与在线游戏时长相关的因素",
      role: "项目负责人 · 量化研究",
      status: "实证研究",
      stat: "97 份有效问卷",
      description:
        "一项以问卷为主的研究，考察游戏体验、感知易用性与社交互动和 FPS 单局时长的关系。",
      tags: ["有序回归", "SPSS", "问卷设计"],
      details: [
        {
          label: "问题",
          text: "哪些体验因素与中国 FPS 玩家进入更长的单局时长类别相关？",
        },
        {
          label: "方法",
          text: "微信问卷投放、数据清洗与重编码、信度检验，并在 SPSS 中进行有序 Logistic 回归。",
        },
        {
          label: "发现",
          text: "社交互动与更长时长类别的关联最强且显著；游戏体验显著，而易用性不显著。",
        },
      ],
    },
    "ai-library": {
      subtitle: "重新思考图书馆在线实时咨询",
      role: "项目负责人 · 用户研究",
      status: "人机交互研究",
      stat: "55 份问卷 · 6 场访谈",
      description:
        "与 KCL 图书馆合作的混合方法研究，探讨学生的 AI 使用、信任、隐私、指引与服务机会。",
      tags: ["HCI", "数据可视化", "服务研究"],
      details: [
        {
          label: "背景",
          text: "研究探讨了学生的 AI 使用现状，以及将 AI 引入伦敦国王学院图书馆 Live Chat 的可能性。",
        },
        {
          label: "方法",
          text: "55 份问卷、6 场半结构化访谈、逐题分析与证据可视化。",
        },
        {
          label: "洞察",
          text: "学生想要 AI 的速度、检索的可追溯性，以及人工服务的同理心。",
        },
      ],
    },
  },
  slideLabels: {
    overview: "概览",
    prototype: "原型",
    "relationships-a": "角色侧写 I",
    "relationships-b": "角色侧写 II",
    formation: "形成机制",
    evidence: "证据",
    "shared-world": "共享世界",
    "living-culture": "活的文化",
    "cultural-orrery": "文化星盘",
    method: "方法",
    sessions: "会话",
    drivers: "驱动因素",
    service: "服务机会",
    adoption: "采纳",
    trust: "信任",
  },
  slideAria: {
    overview: (title) => `${title} · 概览`,
    evidence: (title) => `${title} · 证据`,
  },
  projectPagerAria: "项目分页",
  prevProjectAria: "上一页项目内容",
  nextProjectAria: "下一页项目内容",
  attachmentOverview: {
    statPlayers: "10 位玩家",
    statGames: "6 款游戏",
    summary:
      "十位核心玩家各自介绍了一位不可自定义的角色——并讲述了吸引何时开始变成一种相互的回应。",
    caseStageAria: "三个精选角色依恋案例",
    caseAlt: (name, game) => `《${game}》角色${name}`,
    cases: [
      {
        name: "卡维",
        game: "原神",
        mode: "共生式依恋",
        short: "共鸣 / 共同理想",
        text: "共同的理想与挣扎带来了同路人的亲近感。随着卡维的成长，他的选择开始指引玩家自己的选择。",
        image: "/attachment-kaveh-cutout.webp",
      },
      {
        name: "凝光",
        game: "原神",
        mode: "守望式依恋",
        short: "小小的仪式 / 延续运转的世界",
        text: "每晚的仪式——让她安坐在璃月——让她的世界仿佛在屏幕熄灭之后依然继续运转。",
        image: "/attachment-ningguang-cutout.webp",
      },
      {
        name: "讣告人",
        game: "重返未来：1999",
        mode: "实现式依恋",
        short: "情感支持 / 记忆",
        text: "声音与故事在悲伤时给予了安慰。这段羁绊走进了日常生活，成为友谊、记忆与一枚永久的纹身。",
        image: "/attachment-necrologist-cutout.webp",
      },
    ],
  },
  anchorOverview: {
    roleLabel: "职责",
    showcaseLabel: "展示",
    demoCaption: "Anchor 实机游玩演示",
  },
  practice: {
    eyebrow: "03 / 实践",
    heading: "设计是一种提问的方式。",
    lede: "一种在细致观察、系统设计与可触摸的原型之间来回移动的实践。",
    areas: [
      {
        number: "01",
        title: "叙事系统",
        text: "主题化为规则、路线、谜题与选择。",
      },
      {
        number: "02",
        title: "玩家研究",
        text: "问卷、访谈与量化分析。",
      },
      {
        number: "03",
        title: "可玩探索",
        text: "尽早做出核心交互流程的原型。",
      },
    ],
    processAria: "创作研究流程",
    processSteps: [
      { title: "观察", text: "行为、语境与张力" },
      { title: "转译", text: "把洞察转化为机制" },
      { title: "原型", text: "试玩、测试、打磨" },
    ],
    storyButton: "叙事功底",
    storyEvidence: [
      { value: "17", label: "发表作品" },
      { value: "1K+", label: "阅读量" },
      { value: "1.267M", label: "直播流量" },
    ],
  },
  profile: {
    eyebrow: "04 / 简介",
    heading: "研究者的严谨，创造者的好奇。",
    lede: "受过数字媒体、传播、用户研究与动手制作的交叉训练。",
    educationLabel: "教育经历",
    experienceLabel: "实习经历",
    education: [
      {
        time: "2023—25",
        school: "伦敦国王学院",
        degree: "数字资产与媒体管理硕士（MA）",
      },
      {
        time: "2019—23",
        school: "华东政法大学",
        degree: "新闻学学士 · GPA 3.8 / 4.0",
      },
    ],
    experience: [
      {
        time: "2022",
        company: "四川日报报业集团 · 封面新闻",
        job: "汽车频道媒体实习生",
      },
      {
        time: "2021",
        company: "自贡日报",
        job: "新媒体编辑实习生",
      },
    ],
    tablistAria: "个人资料详情",
    tabs: ["研究方法", "工具", "荣誉"],
    methods: [
      "用户研究",
      "问卷设计",
      "数据清洗与重编码",
      "信度分析",
      "有序回归",
      "数据可视化",
      "访谈设计",
      "叙事原型设计",
    ],
    recognition: [
      "第七届红枫大学生记者节二等奖两项——文字类与视频类。",
      "华东政法大学综合奖学金（2019—20、2020—21 学年）。",
    ],
  },
  contact: {
    headingA: "让我们做出",
    headingB: "能被人感知的系统。",
    body: "无论是研究交流、游戏合作，还是作品集相关咨询，都欢迎给我写信。",
    signature: "问题 · 证据 · 游戏",
    copyright: "© 2026 张可欣",
  },
  dialog: {
    topbar: "叙事经历",
    close: "关闭",
    eyebrow: "媒体与传播",
    title: "在系统之前，是故事。",
    intro: "报道与媒体制作教会我贴近地倾听、提出有人味的问题，并把复杂的事情讲清楚。",
    metrics: [
      { value: "17", label: "已发表视频与文章" },
      { value: "1K+", label: "单篇报道阅读量" },
      { value: "1.267M", label: "直播累计流量" },
    ],
    projects: [
      {
        tag: "人物访谈特稿 · 2020",
        title: "一场跨越十七年的对话",
        text: "采访了同时经历过非典与新冠的医护人员，并据此撰写特稿。",
      },
      {
        tag: "纪录短片 · 2020",
        title: "疫情下的一家餐厅",
        text: "为一部纪录短片撰写脚本：通过店主与顾客的访谈，记录一家上海餐厅两个月的复工历程。",
      },
    ],
  },
};

const copy: Record<Language, Copy> = { en, zh };

const projects = [
  {
    id: "anchor",
    navLabel: "Anchor",
    kind: "anchor",
    number: "01",
    title: "Anchor",
    period: "2026—Present",
    external: "https://tch.cloud.tencent.com/contest/40",
  },
  {
    id: "attachment",
    navLabel: "Attachment",
    kind: "character",
    number: "02",
    title: "Character Attachment",
    period: "2024",
  },
  {
    id: "genshin",
    navLabel: "Genshin",
    kind: "genshin",
    number: "03",
    title: "Genshin Across Cultures",
    period: "2023",
  },
  {
    id: "fps",
    navLabel: "FPS Study",
    kind: "fps",
    number: "04",
    title: "FPS Playtime Study",
    period: "2024",
  },
  {
    id: "ai-library",
    navLabel: "AI × Library",
    kind: "ai",
    number: "05",
    title: "AI × King’s Library",
    period: "2023—24",
  },
] as const;

type ProjectKind = (typeof projects)[number]["kind"];
type ProjectId = (typeof projects)[number]["id"];

const pages = [
  { id: "home", label: "Home" },
  ...projects.map((project) => ({ id: project.id, label: project.navLabel })),
  { id: "profile", label: "Profile" },
  { id: "contact", label: "Contact" },
] as const;

const PROJECT_PAGE_START = 1;
const PROJECT_PAGE_END = PROJECT_PAGE_START + projects.length - 1;
const PROFILE_PAGE_INDEX = pages.findIndex((page) => page.id === "profile");
const CONTACT_PAGE_INDEX = pages.findIndex((page) => page.id === "contact");

const projectSlides: Record<
  ProjectKind,
  ReadonlyArray<{ id: string; label: string; type: "overview" | "story" | "method" | "evidence" }>
> = {
  anchor: [
    { id: "overview", label: "Overview", type: "overview" },
    { id: "prototype", label: "Prototype", type: "evidence" },
  ],
  character: [
    { id: "overview", label: "Overview", type: "overview" },
    { id: "relationships-a", label: "Portraits I", type: "story" },
    { id: "relationships-b", label: "Portraits II", type: "story" },
    { id: "formation", label: "Formation", type: "method" },
    { id: "evidence", label: "Evidence", type: "evidence" },
  ],
  genshin: [
    { id: "overview", label: "Overview", type: "overview" },
    { id: "shared-world", label: "Shared world", type: "story" },
    { id: "living-culture", label: "Living culture", type: "method" },
    { id: "cultural-orrery", label: "Cultural orrery", type: "evidence" },
  ],
  fps: [
    { id: "overview", label: "Overview", type: "overview" },
    { id: "method", label: "Method", type: "method" },
    { id: "sessions", label: "Sessions", type: "evidence" },
    { id: "drivers", label: "Drivers", type: "evidence" },
  ],
  ai: [
    { id: "overview", label: "Overview", type: "overview" },
    { id: "service", label: "Service opportunity", type: "story" },
    { id: "adoption", label: "Adoption", type: "evidence" },
    { id: "trust", label: "Trust", type: "evidence" },
  ],
};

const researchWordCloudTerms = [
  ["CHARACTER ATTACHMENT", 100, "#E96545"],
  ["NIJIGEN GAMES", 92, "#E96545"],
  ["GACHA", 82, "#E96545"],
  ["GAME MECHANICS", 70, "#A9D1C0"],
  ["CHARACTER'S PERSONALITY", 68, "#F5F1E8"],
  ["VIRTUAL CHARACTERS", 66, "#B3C2F6"],
  ["STORYLINE", 64, "#F5F1E8"],
  ["EMOTIONAL SUPPORT", 62, "#F5F1E8"],
  ["REAL-WORLD FACTORS", 60, "#A9D1C0"],
  ["INTERACTION MECHANISMS", 58, "#A9D1C0"],
  ["CHARACTER ATTRACTION", 56, "#E96545"],
  ["SOCIAL ATTRACTIVENESS", 54, "#F5F1E8"],
  ["SYMBIOTIC ATTACHMENT", 52, "#B3C2F6"],
  ["OBSERVANCE ATTACHMENT", 50, "#B3C2F6"],
  ["ACTUALIZATION ATTACHMENT", 48, "#B3C2F6"],
  ["CHARACTER COLLECTION", 46, "#F5F1E8"],
  ["VOICE LINES", 44, "#A9D1C0"],
  ["GAMING BEHAVIOR", 42, "#F5F1E8"],
  ["GAME MOTIVATION", 40, "#E96545"],
  ["PARA-SOCIAL INTERACTION", 38, "#B3C2F6"],
  ["EMOTIONAL CONNECTIONS", 36, "#F5F1E8"],
  ["TASK-BASED ATTRACTION", 34, "#F5F1E8"],
  ["CHARACTER IDENTIFICATION THEORY", 32, "#B3C2F6"],
  ["PLAYER-CHARACTER INTERACTION", 30, "#B3C2F6"],
  ["SENSE OF IMMERSION", 28, "#F5F1E8"],
  ["SENSE OF COMPANIONSHIP", 27, "#F5F1E8"],
  ["FAN CREATIONS", 26, "#A9D1C0"],
  ["PHYSICAL ATTRACTIVENESS", 25, "#F5F1E8"],
  ["CHARACTER DEVELOPMENT", 24, "#F5F1E8"],
  ["EMOTIONAL INVESTMENT", 23, "#F5F1E8"],
  ["SELF-PROJECTION", 22, "#B3C2F6"],
  ["IDEAL SELF", 21, "#F5F1E8"],
  ["MUTUAL CARE", 20, "#E96545"],
  ["RESOURCE ALLOCATION", 19, "#A9D1C0"],
  ["CHARACTER MERCHANDISE", 18, "#F5F1E8"],
  ["CONSUMER BEHAVIOR", 17, "#F5F1E8"],
  ["GACHA SYSTEM", 16, "#E96545"],
  ["RANDOMNESS", 15, "#F5F1E8"],
  ["AFFINITY SYSTEM", 14, "#A9D1C0"],
  ["SENSE OF PRESENCE", 13, "#F5F1E8"],
  ["EMOTIONAL BOND", 12, "#F5F1E8"],
  ["THEMATIC ANALYSIS", 11, "#A9D1C0"],
  ["SEMI-STRUCTURED INTERVIEWS", 10, "#A9D1C0"],
] as const;

function ResearchWordCloud() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<EChartsType | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let resizeObserver: ResizeObserver | null = null;
    let resizeFrame = 0;
    const maskImage = new Image();

    const optionForSize = (): EChartsOption => {
      const scale = Math.max(0.44, Math.min(1, container.clientWidth / 420));
      const fontFamily = window.getComputedStyle(container).fontFamily;

      return {
        animation: false,
        tooltip: { show: false },
        series: [
          {
            type: "wordCloud",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            keepAspect: true,
            shape: "square",
            maskImage,
            sizeRange: [Math.round(11 * scale), Math.round(76 * scale)],
            rotationRange: [0, 0],
            rotationStep: 90,
            gridSize: Math.max(5, Math.round(9 * scale)),
            drawOutOfBound: false,
            shrinkToFit: true,
            layoutAnimation: false,
            silent: true,
            textStyle: {
              fontFamily,
              fontWeight: 800,
            },
            data: researchWordCloudTerms.map(([name, value, color]) => ({
              name,
              value,
              textStyle: { color },
            })),
          },
        ],
      } as EChartsOption;
    };

    const initialise = async () => {
      try {
        maskImage.src = "/research-scan-mask.png";
        await maskImage.decode();
        const echarts = await import("echarts");
        await import("echarts-wordcloud");
        if (disposed || !containerRef.current) return;

        const chart = echarts.init(containerRef.current, undefined, {
          renderer: "canvas",
        });
        chartRef.current = chart;
        chart.setOption(optionForSize(), true);
        setIsReady(true);

        resizeObserver = new ResizeObserver(() => {
          window.cancelAnimationFrame(resizeFrame);
          resizeFrame = window.requestAnimationFrame(() => {
            if (!chartRef.current || disposed) return;
            chartRef.current.resize();
            chartRef.current.setOption(optionForSize(), true);
          });
        });
        resizeObserver.observe(containerRef.current);
      } catch (error) {
        console.error("Unable to initialise the research word cloud", error);
      }
    };

    void initialise();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(resizeFrame);
      resizeObserver?.disconnect();
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, []);

  return (
    <div
      className="research-scan-layer research-scan-wordcloud"
      data-ready={isReady ? "true" : "false"}
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="research-wordcloud-fallback"
        src="/research-scan-wordcloud.webp"
        alt=""
        width={1200}
        height={1500}
        decoding="async"
        draggable={false}
      />
      <div className="research-wordcloud-chart" ref={containerRef} />
    </div>
  );
}

function ResearchPortrait({ lang }: { lang: Language }) {
  const portraitCopy = copy[lang].portrait;
  const [reveal, setReveal] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const portraitRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const resetOutsidePointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !portraitRef.current) return;
      const bounds = portraitRef.current.getBoundingClientRect();
      const isOutside =
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom;
      if (isOutside) {
        setIsInteracting(false);
        setReveal(0);
      }
    };

    window.addEventListener("pointermove", resetOutsidePointer, { passive: true });
    return () => window.removeEventListener("pointermove", resetOutsidePointer);
  }, []);

  const updateReveal = useCallback((element: HTMLElement, clientX: number) => {
    const bounds = element.getBoundingClientRect();
    const next = ((clientX - bounds.left) / bounds.width) * 100;
    setReveal(Math.round(Math.max(0, Math.min(100, next))));
  }, []);

  const handleScanKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    let next = reveal;
    if (event.key === "ArrowRight") next += 8;
    else if (event.key === "ArrowLeft") next -= 8;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 100;
    else return;

    event.preventDefault();
    event.stopPropagation();
    setReveal(Math.max(0, Math.min(100, next)));
  };

  return (
    <figure
      ref={portraitRef}
      className="research-portrait"
      data-active={isInteracting || reveal > 0 ? "true" : "false"}
      role="slider"
      aria-label={portraitCopy.ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={reveal}
      aria-valuetext={portraitCopy.valueText(reveal)}
      tabIndex={0}
      style={{ "--portrait-reveal": `${reveal}%` } as CSSProperties}
      onKeyDown={handleScanKeyDown}
      onFocus={() => setIsInteracting(true)}
      onBlur={() => setIsInteracting(false)}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") {
          setIsInteracting(true);
          updateReveal(event.currentTarget, event.clientX);
        }
      }}
      onPointerMove={(event) => {
        if (event.pointerType === "mouse" || isInteracting) {
          updateReveal(event.currentTarget, event.clientX);
        }
      }}
      onPointerLeave={(event) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
          setIsInteracting(false);
          setReveal(0);
        }
      }}
      onPointerDown={(event) => {
        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);
        setIsInteracting(true);
        updateReveal(event.currentTarget, event.clientX);
      }}
      onPointerUp={(event) => {
        event.stopPropagation();
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        setIsInteracting(false);
      }}
      onPointerCancel={(event) => {
        event.stopPropagation();
        setIsInteracting(false);
      }}
    >
      <ResearchWordCloud />
      <div className="research-scan-layer research-scan-outline" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/research-scan-outline.png"
          alt=""
          width={1200}
          height={1500}
          decoding="async"
          draggable={false}
        />
      </div>
      <div className="research-scan-layer research-scan-photo" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/research-scan-portrait.webp"
          alt=""
          width={1200}
          height={1500}
          decoding="async"
          draggable={false}
        />
      </div>
      <span className="research-scan-line" aria-hidden="true" />
      <span className="research-scan-prompt" aria-hidden="true">
        {portraitCopy.prompt}
      </span>
      <figcaption className="research-portrait-caption">
        {portraitCopy.caption}
      </figcaption>
    </figure>
  );
}

const tools = [
  "SPSS",
  "R",
  "Premiere Pro",
  "After Effects",
  "Audition",
  "Photoshop",
  "Lightroom",
] as const;

type Detail = number | "story" | null;
type HistoryMode = "push" | "replace" | "none";

function pageIndexFromHash() {
  if (typeof window === "undefined") return 0;
  const id = window.location.hash.replace("#", "");
  const index = pages.findIndex((page) => page.id === id);
  return index >= 0 ? index : 0;
}

export default function PortfolioPager() {
  const [lang, setLang] = useState<Language>("en");
  const [currentPage, setCurrentPage] = useState(0);
  const [projectSlide, setProjectSlide] = useState(0);
  const [activeDetail, setActiveDetail] = useState<Detail>(null);
  const [profileTab, setProfileTab] = useState(0);
  const currentPageRef = useRef(0);
  const focusAfterNavigation = useRef(false);
  const headingRefs = useRef<Array<HTMLHeadingElement | null>>([]);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);

  const t = copy[lang];

  const switchLanguage = useCallback((nextLanguage: Language) => {
    applyLanguage(nextLanguage);
    setLang(nextLanguage);
  }, []);

  const labelForPage = useCallback(
    (index: number) => {
      const page = pages[index];
      if (page.id === "home") return t.nav.home;
      if (page.id === "profile") return t.nav.profile;
      if (page.id === "contact") return t.nav.contact;
      return page.label;
    },
    [t],
  );

  useEffect(() => {
    const initialLanguage = detectInitialLanguage();
    applyLanguage(initialLanguage);
    // Hydrate the stored/preferred language once the client owns window/document.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLang(initialLanguage);
  }, []);

  const navigateTo = useCallback(
    (
      requestedPage: number,
      options: { focus?: boolean; history?: HistoryMode } = {},
    ) => {
      const nextPage = Math.max(0, Math.min(pages.length - 1, requestedPage));
      const historyMode = options.history ?? "push";

      if (nextPage === currentPageRef.current) return;

      currentPageRef.current = nextPage;
      focusAfterNavigation.current = options.focus ?? true;
      setProjectSlide(0);
      setCurrentPage(nextPage);
      setActiveDetail(null);

      if (historyMode !== "none") {
        const url = `#${pages[nextPage].id}`;
        if (historyMode === "replace") {
          window.history.replaceState({ page: nextPage }, "", url);
        } else {
          window.history.pushState({ page: nextPage }, "", url);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const initialPage = pageIndexFromHash();
    currentPageRef.current = initialPage;
    // Hydrate the initial hash after the client owns window.location.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(initialPage);

    if (!window.location.hash || window.location.hash !== `#${pages[initialPage].id}`) {
      window.history.replaceState({ page: initialPage }, "", `#${pages[initialPage].id}`);
    }

    const handleHistory = () => {
      const nextPage = pageIndexFromHash();
      currentPageRef.current = nextPage;
      focusAfterNavigation.current = true;
      setProjectSlide(0);
      setCurrentPage(nextPage);
      setActiveDetail(null);
    };

    window.addEventListener("popstate", handleHistory);
    window.addEventListener("hashchange", handleHistory);

    return () => {
      window.removeEventListener("popstate", handleHistory);
      window.removeEventListener("hashchange", handleHistory);
    };
  }, []);

  useEffect(() => {
    if (!focusAfterNavigation.current) return;

    const timer = window.setTimeout(() => {
      headingRefs.current[currentPage]?.focus({ preventScroll: true });
      focusAfterNavigation.current = false;
    }, 430);

    return () => window.clearTimeout(timer);
  }, [currentPage]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (activeDetail !== null && !dialog.open) {
      dialog.showModal();
    } else if (activeDetail === null && dialog.open) {
      dialog.close();
    }
  }, [activeDetail]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.defaultPrevented) return;
      const isEditing = target?.closest(
        "input, textarea, select, button, a, summary, [contenteditable='true'], [role='slider'], [role='tab'], [data-key-scope='inner'], dialog",
      );

      if (isEditing || event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        navigateTo(currentPageRef.current + 1);
      } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        navigateTo(currentPageRef.current - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        navigateTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        navigateTo(pages.length - 1);
      } else if (
        event.key === " " &&
        !target?.closest("button, a, summary, [role='tab']")
      ) {
        event.preventDefault();
        navigateTo(currentPageRef.current + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateTo]);

  useEffect(() => {
    const clearGesture = () => {
      touchStart.current = null;
    };

    window.addEventListener("orientationchange", clearGesture);
    window.addEventListener("resize", clearGesture);

    return () => {
      window.removeEventListener("orientationchange", clearGesture);
      window.removeEventListener("resize", clearGesture);
    };
  }, []);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") return;
    if (event.clientX < 24 || event.clientX > window.innerWidth - 24) return;
    if ((event.target as HTMLElement | null)?.closest(
      "input, button, a, [role='slider'], [data-gesture-scope='inner-x']",
    )) return;

    touchStart.current = {
      x: event.clientX,
      y: event.clientY,
      time: performance.now(),
    };
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = touchStart.current;
    touchStart.current = null;

    if (!start || event.pointerType !== "touch") return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    const elapsed = Math.max(1, performance.now() - start.time);
    const velocity = Math.abs(deltaX) / elapsed;
    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY) * 1.2;
    const crossesThreshold = Math.abs(deltaX) >= 48 || velocity > 0.45;

    if (!isHorizontal || !crossesThreshold) return;

    navigateTo(currentPageRef.current + (deltaX < 0 ? 1 : -1), {
      focus: false,
    });
  };

  const handleTabKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();

    const delta = event.key === "ArrowRight" ? 1 : -1;
    const nextTab = (profileTab + delta + t.profile.tabs.length) % t.profile.tabs.length;
    setProfileTab(nextTab);
    tabRefs.current[nextTab]?.focus();
  };

  const closeDetail = () => setActiveDetail(null);
  const isProjectPage = currentPage >= PROJECT_PAGE_START && currentPage <= PROJECT_PAGE_END;
  const activeProjectIndex = isProjectPage ? currentPage - PROJECT_PAGE_START : 0;
  const activeProject = projects[activeProjectIndex];
  const activeProjectText = t.projects[activeProject.id as ProjectId];
  const activeProjectSlides = projectSlides[activeProject.kind];
  const safeProjectSlide = Math.min(projectSlide, activeProjectSlides.length - 1);
  const activeProjectSlide = activeProjectSlides[safeProjectSlide];
  const activeSlideLabel =
    t.slideLabels[activeProjectSlide.id as keyof Copy["slideLabels"]] ??
    activeProjectSlide.label;

  return (
    <div className="pager-app" data-page={currentPage}>
      <a className="pager-skip" href={`#${pages[currentPage].id}`}>
        {t.skipToPage}
      </a>

      <div className="pager-ambient" aria-hidden="true">
        <span className="ambient-orb ambient-orb-one" />
        <span className="ambient-orb ambient-orb-two" />
        <span className="ambient-grain" />
      </div>

      <header className="pager-header pager-glass">
        <a
          className="pager-wordmark"
          href="#home"
          aria-label={t.wordmarkAria}
          onClick={(event) => {
            event.preventDefault();
            navigateTo(0);
          }}
        >
          KZ<span aria-hidden="true">.</span>
        </a>

        <nav className="pager-main-nav" aria-label={t.primaryNavAria}>
          {pages.map((page, index) => (
            <a
              key={page.id}
              href={`#${page.id}`}
              aria-current={currentPage === index ? "page" : undefined}
              onClick={(event) => {
                event.preventDefault();
                navigateTo(index);
              }}
            >
              {labelForPage(index)}
            </a>
          ))}
        </nav>

        <span className="pager-mobile-title" aria-hidden="true">
          {labelForPage(currentPage)}
        </span>

        <div className="pager-header-actions">
          <div className="pager-lang-switch" role="group" aria-label={t.langSwitchAria}>
            <button
              type="button"
              aria-pressed={lang === "en"}
              onClick={() => switchLanguage("en")}
            >
              EN
            </button>
            <button
              type="button"
              aria-pressed={lang === "zh"}
              onClick={() => switchLanguage("zh")}
            >
              中文
            </button>
          </div>

          <a className="pager-email" href="mailto:Ruihi.zhang@outlook.com">
            Email <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <main
        className="pager-stage"
        id="main-content"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          touchStart.current = null;
        }}
      >
        <section
          className={`pager-screen pager-home ${currentPage === 0 ? "is-active" : "is-before"}`}
          id="home"
          aria-hidden={currentPage !== 0}
          inert={currentPage !== 0}
          aria-labelledby="home-title"
        >
          <div className="pager-screen-scroll">
            <div className="pager-shell home-layout">
              <div className="home-copy page-enter">
                <p className="pager-eyebrow">
                  {t.home.eyebrow}
                </p>
                <h1
                  id="home-title"
                  tabIndex={-1}
                  ref={(element) => {
                    headingRefs.current[0] = element;
                  }}
                >
                  {t.home.titleA} <span>{t.home.titleB}</span>
                </h1>
                <p className="home-statement">
                  {t.home.statementPre}<strong>{t.home.statementStrong}</strong>{t.home.statementPost}
                </p>
                <div className="home-actions">
                  <button className="pager-primary-action" onClick={() => navigateTo(PROJECT_PAGE_START)}>
                    {t.home.cta} <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>

              <div
                className="focus-card research-graph-card page-enter"
              >
                <ResearchPortrait lang={lang} />
              </div>
            </div>
          </div>
        </section>

        <section
          className={`pager-screen pager-work ${
            isProjectPage
              ? "is-active"
              : currentPage < PROJECT_PAGE_START
                ? "is-after"
                : "is-before"
          }`}
          id={isProjectPage ? pages[currentPage].id : "projects"}
          aria-hidden={!isProjectPage}
          inert={!isProjectPage}
          aria-labelledby="work-title"
        >
          <div className="pager-screen-scroll">
            <div className="pager-shell project-page-layout">
              <article
                className="project-page page-enter"
                data-tone={activeProjectIndex}
                data-project-kind={activeProject.kind}
                data-slide={safeProjectSlide}
              >
                <h2
                  className="project-focus-heading"
                  id="work-title"
                  tabIndex={-1}
                  ref={(element) => {
                    if (isProjectPage) headingRefs.current[currentPage] = element;
                  }}
                >
                  {activeProject.title}
                </h2>
                <div className="project-internal-stage" key={`${activeProject.id}-${activeProjectSlide.id}`}>
                  {activeProjectSlide.type === "overview" && activeProject.kind === "character" ? (
                          <section className="attachment-overview-v2" aria-label={t.slideAria.overview(activeProject.title)}>
                            <header className="attachment-overview-header">
                              <div className="attachment-heading-copy">
                                <h2>
                                  Character <span>Attachment</span>
                                </h2>
                                <p>{activeProjectText.subtitle}</p>
                              </div>
                              <div className="attachment-study-summary">
                                <strong>{t.attachmentOverview.statPlayers} <i>·</i> {t.attachmentOverview.statGames}</strong>
                                <p>
                                  {t.attachmentOverview.summary}
                                </p>
                              </div>
                            </header>

                            <div
                              className="attachment-case-stage"
                              data-gesture-scope="inner-x"
                              aria-label={t.attachmentOverview.caseStageAria}
                            >
                              {t.attachmentOverview.cases.map((caseStudy, index) => (
                                <article className={`attachment-case attachment-case-${index + 1}`} key={caseStudy.name}>
                                  <div className="attachment-case-bubble">
                                    <span>{caseStudy.short}</span>
                                    <p>{caseStudy.text}</p>
                                  </div>
                                  <figure>
                                    <img src={caseStudy.image} alt={t.attachmentOverview.caseAlt(caseStudy.name, caseStudy.game)} />
                                    <figcaption>
                                      <strong>{caseStudy.name}</strong>
                                      <span>{caseStudy.game} · {caseStudy.mode}</span>
                                    </figcaption>
                                  </figure>
                                </article>
                              ))}
                            </div>
                          </section>
                  ) : activeProject.kind === "anchor" && activeProjectSlide.type === "overview" ? (
                          <section className="project-overview-slide anchor-overview-slide" aria-label={t.slideAria.overview(activeProject.title)}>
                            <header className="anchor-overview-header">
                              <div className="anchor-title-block">
                                <h2>{activeProject.title}</h2>
                                <p className="project-subtitle">{activeProjectText.subtitle}</p>
                              </div>
                              <dl className="anchor-title-meta">
                                <div><dt>{t.anchorOverview.roleLabel}</dt><dd>{activeProjectText.role}</dd></div>
                                <div>
                                  <dt>{t.anchorOverview.showcaseLabel}</dt>
                                  <dd><a href={activeProject.external} target="_blank" rel="noreferrer">Tencent Cloud hackathon ↗</a></dd>
                                </div>
                              </dl>
                            </header>
                            <figure className="anchor-demo-video">
                              <video
                                controls
                                playsInline
                                preload="metadata"
                                poster="/anchor-demo-poster.jpg"
                                src="/anchor-demo.mp4"
                              />
                              <figcaption>{t.anchorOverview.demoCaption}</figcaption>
                            </figure>
                          </section>
                  ) : activeProjectSlide.type === "evidence" ? (
                        <section className="project-evidence-slide" aria-label={t.slideAria.evidence(activeProject.title)}>
                          {activeProject.kind === "anchor" ? (
                            <div className="anchor-prototype-page">
                              <header className="anchor-prototype-intro">
                                <strong>{activeProjectText.stat}</strong>
                                <p>{activeProjectText.description}</p>
                              </header>
                              <div className="anchor-evidence-grid">
                                {activeProjectText.details.map((detail) => (
                                  <article key={detail.label}><span>{detail.label}</span><h3>{detail.text}</h3></article>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <ResearchVisuals kind={activeProject.kind} view={activeProjectSlide.id} lang={lang} />
                          )}
                        </section>
                  ) : activeProject.kind !== "anchor" ? (
                    <ProjectNarratives kind={activeProject.kind} slideId={activeProjectSlide.id} lang={lang} />
                  ) : null}
                </div>
                <div className="project-internal-controls" aria-label={`${t.projectPagerAria} · ${activeSlideLabel}`}>
                  <button
                    type="button"
                    onClick={() => setProjectSlide((value) => Math.max(0, value - 1))}
                    disabled={safeProjectSlide === 0}
                    aria-label={t.prevProjectAria}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectSlide((value) => Math.min(activeProjectSlides.length - 1, value + 1))}
                    disabled={safeProjectSlide === activeProjectSlides.length - 1}
                    aria-label={t.nextProjectAria}
                  >
                    →
                  </button>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section
          className="pager-screen pager-practice is-before"
          id="practice"
          aria-hidden={true}
          inert={true}
          aria-labelledby="practice-title"
        >
          <div className="pager-screen-scroll">
            <div className="pager-shell practice-layout">
              <div className="pager-page-heading page-enter">
                <div>
                  <p className="pager-eyebrow">{t.practice.eyebrow}</p>
                  <h2
                    id="practice-title"
                    tabIndex={-1}
                    ref={(element) => {
                      headingRefs.current[2] = element;
                    }}
                  >
                    {t.practice.heading}
                  </h2>
                </div>
                <p>
                  {t.practice.lede}
                </p>
              </div>

              <div className="practice-cards page-enter">
                {t.practice.areas.map((area) => (
                  <article className="practice-card" key={area.number}>
                    <span>{area.number}</span>
                    <h3>{area.title}</h3>
                    <p>{area.text}</p>
                  </article>
                ))}
              </div>

              <div className="practice-footer page-enter">
                <div className="process-strip" aria-label={t.practice.processAria}>
                  <div>
                    <strong>{t.practice.processSteps[0].title}</strong>
                    <span>{t.practice.processSteps[0].text}</span>
                  </div>
                  <span aria-hidden="true">→</span>
                  <div>
                    <strong>{t.practice.processSteps[1].title}</strong>
                    <span>{t.practice.processSteps[1].text}</span>
                  </div>
                  <span aria-hidden="true">→</span>
                  <div>
                    <strong>{t.practice.processSteps[2].title}</strong>
                    <span>{t.practice.processSteps[2].text}</span>
                  </div>
                </div>

                <button
                  className="story-button"
                  onClick={() => setActiveDetail("story")}
                  aria-haspopup="dialog"
                >
                  <span>{t.practice.storyButton}</span>
                  <span className="story-evidence">
                    <strong>{t.practice.storyEvidence[0].value}</strong>{" "}
                    {t.practice.storyEvidence[0].label}
                    <strong>{t.practice.storyEvidence[1].value}</strong>{" "}
                    {t.practice.storyEvidence[1].label}
                    <strong>{t.practice.storyEvidence[2].value}</strong>{" "}
                    {t.practice.storyEvidence[2].label}
                  </span>
                  <span aria-hidden="true">↗</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section
          className={`pager-screen pager-profile ${
            currentPage === PROFILE_PAGE_INDEX
              ? "is-active"
              : currentPage < PROFILE_PAGE_INDEX
                ? "is-after"
                : "is-before"
          }`}
          id="profile"
          aria-hidden={currentPage !== PROFILE_PAGE_INDEX}
          inert={currentPage !== PROFILE_PAGE_INDEX}
          aria-labelledby="profile-title"
        >
          <div className="pager-screen-scroll">
            <div className="pager-shell profile-layout">
              <div className="pager-page-heading page-enter">
                <div>
                  <p className="pager-eyebrow">{t.profile.eyebrow}</p>
                  <h2
                    id="profile-title"
                    tabIndex={-1}
                    ref={(element) => {
                      headingRefs.current[PROFILE_PAGE_INDEX] = element;
                    }}
                  >
                    {t.profile.heading}
                  </h2>
                </div>
                <p>
                  {t.profile.lede}
                </p>
              </div>

              <div className="profile-content page-enter">
                <div className="profile-timeline">
                  <div className="timeline-group">
                    <span className="timeline-group-title">{t.profile.educationLabel}</span>
                    {t.profile.education.map((entry) => (
                      <article key={entry.time}>
                        <time>{entry.time}</time>
                        <div>
                          <h3>{entry.school}</h3>
                          <p>{entry.degree}</p>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="timeline-group">
                    <span className="timeline-group-title">{t.profile.experienceLabel}</span>
                    {t.profile.experience.map((entry) => (
                      <article key={entry.time}>
                        <time>{entry.time}</time>
                        <div>
                          <h3>{entry.company}</h3>
                          <p>{entry.job}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="profile-tabs">
                  <div className="profile-tab-list" role="tablist" aria-label={t.profile.tablistAria}>
                    {t.profile.tabs.map((tab, index) => (
                      <button
                        key={tab}
                        id={`profile-tab-${index}`}
                        role="tab"
                        aria-selected={profileTab === index}
                        aria-controls="profile-tab-panel"
                        tabIndex={profileTab === index ? 0 : -1}
                        ref={(element) => {
                          tabRefs.current[index] = element;
                        }}
                        onClick={() => setProfileTab(index)}
                        onKeyDown={handleTabKeyDown}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div
                    className="profile-tab-panel"
                    id="profile-tab-panel"
                    role="tabpanel"
                    aria-labelledby={`profile-tab-${profileTab}`}
                  >
                    {profileTab === 0 && (
                      <ul className="profile-chip-list">
                        {t.profile.methods.map((method) => (
                          <li key={method}>{method}</li>
                        ))}
                      </ul>
                    )}

                    {profileTab === 1 && (
                      <ul className="profile-chip-list">
                        {tools.map((tool) => (
                          <li key={tool}>{tool}</li>
                        ))}
                      </ul>
                    )}

                    {profileTab === 2 && (
                      <div className="recognition-list">
                        {t.profile.recognition.map((item) => (
                          <p key={item}>{item}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className={`pager-screen pager-contact ${
            currentPage === CONTACT_PAGE_INDEX ? "is-active" : "is-after"
          }`}
          id="contact"
          aria-hidden={currentPage !== CONTACT_PAGE_INDEX}
          inert={currentPage !== CONTACT_PAGE_INDEX}
          aria-labelledby="contact-title"
        >
          <div className="pager-screen-scroll">
            <div className="pager-shell contact-layout">
              <div className="contact-copy page-enter">
                <h2
                  id="contact-title"
                  tabIndex={-1}
                  ref={(element) => {
                    headingRefs.current[CONTACT_PAGE_INDEX] = element;
                  }}
                >
                  {t.contact.headingA} <span>{t.contact.headingB}</span>
                </h2>
                <p>
                  {t.contact.body}
                </p>
                <a className="contact-email" href="mailto:Ruihi.zhang@outlook.com">
                  Ruihi.zhang@outlook.com <span aria-hidden="true">↗</span>
                </a>
              </div>

              <div className="contact-signature page-enter" aria-hidden="true">
                <span>KZ</span>
                <p>{t.contact.signature}</p>
              </div>

              <p className="contact-copyright">{t.contact.copyright}</p>
            </div>
          </div>
        </section>
      </main>

      <div className="pager-live-region" aria-live="polite" aria-atomic="true">
        {t.liveRegion(currentPage + 1, pages.length, labelForPage(currentPage))}
      </div>

      <dialog
        className="detail-dialog"
        ref={dialogRef}
        onClose={() => setActiveDetail(null)}
        onCancel={() => setActiveDetail(null)}
        onClick={(event) => {
          if (event.target === dialogRef.current) closeDetail();
        }}
        aria-labelledby="detail-title"
      >
        <div className="detail-card">
          <div className="detail-topbar">
            <span>{t.dialog.topbar}</span>
            <button onClick={closeDetail}>{t.dialog.close}</button>
          </div>

          {activeDetail === "story" && (
            <div className="detail-content story-detail">
              <div className="detail-heading">
                <p>{t.dialog.eyebrow}</p>
                <h2 id="detail-title">{t.dialog.title}</h2>
                <span>
                  {t.dialog.intro}
                </span>
              </div>
              <div className="story-detail-metrics">
                {t.dialog.metrics.map((metric) => (
                  <div key={metric.label}>
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                  </div>
                ))}
              </div>
              <div className="detail-grid story-projects">
                {t.dialog.projects.map((storyProject) => (
                  <article key={storyProject.title}>
                    <span>{storyProject.tag}</span>
                    <h3>{storyProject.title}</h3>
                    <p>
                      {storyProject.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
}
