"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode, type WheelEvent } from "react";
import type { Language } from "./i18n";

type ResearchKind = "character" | "genshin" | "fps" | "ai";

type ResearchVisualsProps = {
  kind: ResearchKind;
  view?: string;
  lang?: Language;
};

const fill = (template: string, values: Record<string, string>) =>
  Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template,
  );

const sessionDurations = [
  { label: "<1h", count: 7, width: "22.6%" },
  { label: "1–2h", count: 31, width: "100%" },
  { label: "2–3h", count: 29, width: "93.5%" },
  { label: "3–4h", count: 18, width: "58.1%" },
  { label: ">4h", count: 12, width: "38.7%" },
] as const;

const en = {
  lane: {
    ariaLabel: "Scrollable evidence charts. Use the arrow keys or controls to explore.",
    explore: "Explore evidence",
    prevAria: "Previous evidence chart",
    nextAria: "Next evidence chart",
  },
  character: {
    aria: "Character attachment research evidence",
    kicker: "Evidence map",
    heading: "How a character begins to feel alive.",
    sub: "Interview themes translated into a player–character relationship framework.",
    metricsAria: "Study overview",
    metrics: [
      { value: "10", label: "dedicated players" },
      { value: "6", label: "Nijigen games" },
      { value: "10–15h", label: "interview material" },
      { value: "3", label: "attachment modes" },
    ],
    model: {
      aria: "Three overlapping attachment modes: symbiotic, observance and actualisation, sharing mutual care and interaction",
      kicker: "Relationship model",
      title: "Three modes, one shared centre",
      symbiotic: { name: "Symbiotic", tag: "co-growth" },
      observance: { name: "Observance", tag: "witnessing" },
      actualisation: { name: "Actualisation", tag: "“we” in daily life" },
      centreA: "mutual care",
      centreB: "interaction",
      caption: "The modes overlap; they are not fixed player types.",
    },
    mentions: {
      aria: "Theme mentions among ten interviewees: gacha ten, character personality eight, merchandise eight, functional strength two",
      kicker: "Theme mentions",
      title: "Emotion outweighed utility",
      rows: [
        { label: "Gacha motivation", value: 10, width: "100%" },
        { label: "Character personality", value: 8, width: "80%" },
        { label: "Merchandise", value: 8, width: "80%" },
        { label: "Functional strength", value: 2, width: "20%" },
      ],
      caption: "Counts are interview mentions, not population estimates.",
    },
    formation: {
      aria: "Character attraction leads to attachment, strengthened by interaction mechanics and real-world factors",
      kicker: "Formation path",
      title: "Attachment is designed across worlds",
      attraction: { title: "Attraction", tag: "personality · story · form" },
      attachment: { title: "Attachment", tag: "character as social other" },
      game: { title: "Game", tag: "feedback · resources · photos" },
      life: { title: "Life", tag: "merch · media · daily choices" },
      caption: "Responsive feedback can strengthen—or weaken—the bond.",
    },
  },
  fpsResearch: {
    aria: "FPS playtime study evidence",
    kicker: "Evidence map",
    heading: "Shared play mattered most.",
    sub: "Social interaction showed the strongest association with longer session categories.",
    metricsAria: "Study overview",
    metrics: [
      { value: "115", label: "responses collected" },
      { value: "97", label: "valid responses" },
      { value: "84.3%", label: "sample retained" },
      { value: "p<.001", label: "overall model" },
    ],
    sample: {
      aria: "Sample flow: 115 responses collected, seven outliers treated as missing, eleven invalid responses excluded, 97 retained",
      kicker: "Sample pipeline",
      title: "From collection to analysis",
      collected: "collected",
      outliers: "outliers",
      invalid: "invalid",
      retained: "retained",
      caption: "Outliers were treated as missing; invalid logic paths were excluded.",
    },
    session: {
      aria: "Single-session duration among 97 players: under one hour 7, one to two hours 31, two to three hours 29, three to four hours 18, over four hours 12",
      kicker: "Session distribution",
      title: "61.9% played 1–3 hours",
      caption: "Percentages recalculated from source frequencies, n=97.",
    },
    forest: {
      aria: "Odds ratios and 95 percent confidence intervals: experience value 1.13 from 1.00 to 1.26, perceived usability 1.18 from 0.89 to 1.56, social interaction 1.23 from 1.04 to 1.45",
      kicker: "Ordinal regression",
      title: "Odds of a longer category",
      rows: [
        {
          label: "Experience value",
          short: "EV",
          value: "1.13",
          ci: "1.00–1.26",
          left: "25%",
          width: "32.5%",
          point: "41.25%",
          significant: true,
        },
        {
          label: "Perceived usability",
          short: "PU",
          value: "1.18",
          ci: "0.89–1.56",
          left: "11.25%",
          width: "83.75%",
          point: "47.5%",
          significant: false,
        },
        {
          label: "Social interaction",
          short: "SI",
          value: "1.23",
          ci: "1.04–1.45",
          left: "30%",
          width: "51.25%",
          point: "53.75%",
          significant: true,
        },
      ],
      caption: "PU crosses the OR=1 reference; EV and SI were significant.",
    },
    reliability: {
      aria: "Reliability before and after item removal: experience value point five zero to point five six, perceived usability point six nine to point seven seven, social interaction point four nine to point eight one",
      kicker: "Scale audit",
      title: "Reliability before → after",
      threshold: "α .70",
      rows: [
        {
          label: "EV",
          before: ".50",
          after: ".56",
          start: "20%",
          end: "32%",
          itemChange: "6→4 items",
        },
        {
          label: "PU",
          before: ".69",
          after: ".77",
          start: "58%",
          end: "74%",
          itemChange: "3→2 items",
        },
        {
          label: "SI",
          before: ".49",
          after: ".81",
          start: "18%",
          end: "82%",
          itemChange: "4→2 items",
        },
      ],
      caption: "EV remained weak after item removal, so the limitation stays visible.",
    },
    note: "Associations, not causation. An OR of 1.23 describes odds of entering a longer category—not 23% more playtime.",
  },
  aiResearch: {
    aria: "Student AI use study evidence",
    kicker: "Evidence map",
    heading: "High adoption. Conditional trust.",
    sub: "Students wanted AI speed with search traceability and human empathy.",
    metricsAria: "Study overview",
    metrics: [
      { value: "55", label: "survey responses" },
      { value: "6", label: "interviews completed" },
      { value: "98.2%", label: "had used AI" },
      { value: "77.8%", label: "wanted official guidance" },
    ],
    adoption: {
      aria: "AI adoption was 98.2 percent. Among 54 AI users, 40.7 percent used it daily, 55.6 percent weekly, and 3.7 percent monthly",
      kicker: "Adoption pulse",
      title: "AI was already routine",
      ringLabel: "used AI",
      frequencies: [
        { label: "Daily", pct: "40.7%", width: "40.7%" },
        { label: "Weekly", pct: "55.6%", width: "55.6%" },
        { label: "Monthly", pct: "3.7%", width: "3.7%" },
      ],
      caption: "Frequency uses the 54 respondents who had used AI.",
    },
    purpose: {
      aria: "Share of selected AI functions: text and writing 36.2 percent, translation 30.5 percent, efficiency tools 11.3 percent, drawing and design 11.3 percent, social assistance 10.6 percent",
      kicker: "Purpose constellation",
      title: "Writing + translation led",
      bubbles: [
        { className: "bubble-writing", pct: "36.2%", label: "Writing" },
        { className: "bubble-translate", pct: "30.5%", label: "Translate" },
        { className: "bubble-efficiency", pct: "11.3%", label: "Efficiency" },
        { className: "bubble-design", pct: "11.3%", label: "Design" },
        { className: "bubble-social", pct: "10.6%", label: "Social" },
      ],
      caption: "Share of selected functions, not share of students.",
    },
    tension: {
      aria: "Trust and privacy tension: 83.3 percent somewhat trust AI; 81.5 percent had some or high concern about data breaches; 98.1 percent would share personal data only with reservations or not at all",
      kicker: "Trust–privacy tension",
      title: "Usage did not remove caution",
      rows: [
        {
          barClass: "trust-bar",
          label: "Trust",
          n: "n=54",
          bars: [
            { basis: "13%", text: "13.0" },
            { basis: "83.3%", text: "83.3 somewhat" },
            { basis: "3.7%", text: "3.7" },
          ],
        },
        {
          barClass: "concern-bar",
          label: "Data breach concern",
          n: "n=54",
          bars: [
            { basis: "18.5%", text: "18.5 none" },
            { basis: "63%", text: "63.0 some" },
            { basis: "18.5%", text: "18.5 high" },
          ],
        },
        {
          barClass: "sharing-bar",
          label: "Personal-data sharing",
          n: "n=54",
          bars: [
            { basis: "1.9%", text: "1.9" },
            { basis: "61.1%", text: "61.1 reserved" },
            { basis: "37%", text: "37.0 unwilling" },
          ],
        },
      ],
      caption: "Direct labels preserve the different meanings of each scale.",
    },
    guidance: {
      aria: "77.8 percent wanted official anti-plagiarism guidance. Preferred guidance formats were workshop 45.7 percent, handbook 35.8 percent, and one-to-one tutorial 18.5 percent",
      kicker: "Guidance preference",
      title: "Learning should be hands-on",
      core: { pct: "77.8%", label: "wanted official guidance" },
      petals: [
        { className: "petal-workshop", pct: "45.7%", label: "Workshop" },
        { className: "petal-handbook", pct: "35.8%", label: "Handbook" },
        { className: "petal-tutorial", pct: "18.5%", label: "1-to-1" },
      ],
      caption: "Format values are shares of selections.",
    },
    library: {
      aria: "Interview ideas for library AI services: data or book retrieval five of six, AI service desk one of six, topic collections one of six, reading lists one of six",
      kicker: "Library opportunity",
      title: "Retrieval before replacement",
      core: { count: "5/6", label: "data + book retrieval" },
      satellites: [
        { className: "satellite-desk", count: "1/6", label: "service desk" },
        { className: "satellite-collections", count: "1/6", label: "collections" },
        { className: "satellite-reading", count: "1/6", label: "reading lists" },
      ],
      caption: "Interview mentions; participants could suggest more than one idea.",
    },
    note: "Survey bases vary by question (n=55, 54 or 50). Every visual keeps its original denominator or labels selection shares.",
  },
  fpsSessions: {
    aria: "FPS response flow and session distribution",
    heading: "From 115 responses to 97 sessions.",
    sub: "The same cases move from cleaning into five single-session bands.",
    switchAria: "Evidence view",
    tabCleaning: "Sample flow",
    tabSessions: "Session bands",
    validLabel: "valid responses",
    cleaningNote: "7 outliers · 11 invalid logic paths",
    percentTemplate: "{percent}% of valid responses",
    bandsAria: "Session duration bands",
    note: "Source frequencies recalculated against n=97; the printed source percentages were inconsistent.",
  },
  fpsDrivers: {
    aria: "FPS regression model and reliability audit",
    heading: "What moved the odds?",
    sub: "Social interaction showed the strongest significant association with a longer category.",
    switchAria: "Model or scale audit",
    tabModel: "Model",
    tabScale: "Scale audit",
    driversAria: "Model drivers",
    drivers: [
      { id: "ev", short: "EV", label: "Experience value", beta: ".12", p: ".045", odds: 1.13, ci: [1.0, 1.26], alpha: [0.5, 0.56], items: "6→4", significant: true },
      { id: "pu", short: "PU", label: "Perceived usability", beta: ".16", p: ".252", odds: 1.18, ci: [0.89, 1.56], alpha: [0.69, 0.77], items: "3→2", significant: false },
      { id: "si", short: "SI", label: "Social interaction", beta: ".21", p: ".014", odds: 1.23, ci: [1.04, 1.45], alpha: [0.49, 0.81], items: "4→2", significant: true },
    ],
    itemsTemplate: "{items} items after removal",
    note: "Associations, not causation. Odds ratios describe movement between ordinal categories—not percent more playtime.",
  },
  aiAdoption: {
    aria: "AI adoption and use frequency",
    heading: "AI was already routine.",
    sub: "Fifty-five survey responses resolve into 54 users, then into a weekly rhythm.",
    switchAria: "Adoption evidence view",
    tabAdoption: "Adoption",
    tabFrequency: "Frequency",
    adoptionReadout: "54 of 55 had used AI",
    usersTemplate: "{label} users",
    groups: [
      { id: "daily", label: "Daily", count: 22 },
      { id: "weekly", label: "Weekly", count: 30 },
      { id: "monthly", label: "Monthly", count: 2 },
    ],
    freqAria: "AI use frequency",
    note: "Frequency base: AI users, n=54.",
  },
  aiTrust: {
    aria: "AI trust, privacy concern, and guidance expectations",
    switchAria: "Survey question",
    views: {
      trust: {
        tab: "Trust",
        title: "Conditional trust",
        lead: "Most students trusted AI somewhat, while complete trust remained rare.",
        groups: [
          { label: "Do not trust", count: 7 },
          { label: "Somewhat", count: 45 },
          { label: "Completely", count: 2 },
        ],
      },
      concern: {
        tab: "Data concern",
        title: "Concern remained high",
        lead: "Adoption did not remove anxiety about a data breach.",
        groups: [
          { label: "None", count: 10 },
          { label: "Some", count: 34 },
          { label: "Very", count: 10 },
        ],
      },
      guidance: {
        tab: "Guidance",
        title: "Guidance was expected",
        lead: "Most students wanted clearer official guidance on responsible use.",
        groups: [
          { label: "Yes", count: 42 },
          { label: "No", count: 12 },
        ],
      },
    },
    note: "Question base: n=54. Guidance counts are inferred from the report’s 77.78% / 22.22% split.",
  },
  genshin: {
    aria: "Qualitative cultural value orrery",
    heading: "A world designed for translation.",
    sub: "Six qualitative lenses orbit one shared cultural space—without inventing scores for Teyvat.",
    coreLabel: "shared cultural ground",
    dimensionsAria: "Cultural dimensions",
    dimensions: [
      { label: "Power", statement: "Hierarchy is repeatedly opened to civic participation.", focus: "Liyue" },
      { label: "Self + collective", statement: "Personal conscience and collective action coexist rather than cancel one another.", focus: "Inazuma" },
      { label: "Gender roles", statement: "Authority and care move across flexible character roles.", focus: "Liyue" },
      { label: "Uncertainty", statement: "Change becomes a narrative resource instead of a threat to be removed.", focus: "Mondstadt" },
      { label: "Long-term", statement: "Sacrifice and stewardship orient societies toward a shared future.", focus: "Sumeru" },
      { label: "Freedom + restraint", statement: "Pleasure, responsibility, ritual, and governance stay in productive tension.", focus: "Teyvat" },
    ],
    takeaway: "Shared ground + visible difference → lower cultural discount",
    kazuhaAlt: "Kaedehara Kazuha",
    nahidaAlt: "Nahida",
    note: "Qualitative analytical scaffold from the dissertation—not a numeric score or causal model.",
  },
};

const zh: typeof en = {
  lane: {
    ariaLabel: "可滚动的证据图表。使用方向键或按钮浏览。",
    explore: "浏览证据",
    prevAria: "上一张证据图表",
    nextAria: "下一张证据图表",
  },
  character: {
    aria: "角色依恋研究证据",
    kicker: "证据地图",
    heading: "一个角色如何开始显得鲜活。",
    sub: "访谈主题被提炼为玩家—角色关系框架。",
    metricsAria: "研究概览",
    metrics: [
      { value: "10", label: "深度玩家" },
      { value: "6", label: "二次元游戏" },
      { value: "10–15h", label: "访谈素材" },
      { value: "3", label: "依恋模式" },
    ],
    model: {
      aria: "三种相互重叠的依恋模式：共生型、守望型与实现型，共享着相互关怀与互动",
      kicker: "关系模型",
      title: "三种模式，一个共同核心",
      symbiotic: { name: "共生型", tag: "共同成长" },
      observance: { name: "守望型", tag: "静静见证" },
      actualisation: { name: "实现型", tag: "日常中的“我们”" },
      centreA: "相互关怀",
      centreB: "互动",
      caption: "三种模式相互重叠，并非固定的玩家类型。",
    },
    mentions: {
      aria: "十位受访者的主题提及：抽卡动机 10 次，角色个性 8 次，周边商品 8 次，功能强度 2 次",
      kicker: "主题提及",
      title: "情感压过功用",
      rows: [
        { label: "抽卡动机", value: 10, width: "100%" },
        { label: "角色个性", value: 8, width: "80%" },
        { label: "周边商品", value: 8, width: "80%" },
        { label: "功能强度", value: 2, width: "20%" },
      ],
      caption: "计数为访谈提及次数，并非总体估计。",
    },
    formation: {
      aria: "角色吸引发展为依恋，并由游戏互动机制与现实世界因素强化",
      kicker: "形成路径",
      title: "依恋在游戏内外被共同设计",
      attraction: { title: "吸引", tag: "个性 · 故事 · 形象" },
      attachment: { title: "依恋", tag: "角色成为社会性他者" },
      game: { title: "游戏", tag: "反馈 · 资源 · 拍照" },
      life: { title: "生活", tag: "周边 · 媒介 · 日常选择" },
      caption: "回应式反馈可以加深——也可能削弱——这种联结。",
    },
  },
  fpsResearch: {
    aria: "FPS 游戏时长研究证据",
    kicker: "证据地图",
    heading: "共同游戏最为关键。",
    sub: "社交互动与更长时长类别的关联最强。",
    metricsAria: "研究概览",
    metrics: [
      { value: "115", label: "收集回复" },
      { value: "97", label: "有效回复" },
      { value: "84.3%", label: "样本保留率" },
      { value: "p<.001", label: "整体模型" },
    ],
    sample: {
      aria: "样本流转：收集 115 份回复，7 个离群值按缺失处理，11 份无效回复被剔除，保留 97 份",
      kicker: "样本流转",
      title: "从收集到分析",
      collected: "已收集",
      outliers: "离群值",
      invalid: "无效",
      retained: "保留",
      caption: "离群值按缺失处理；逻辑路径无效的问卷被剔除。",
    },
    session: {
      aria: "97 名玩家的单次游戏时长：不足 1 小时 7 人，1–2 小时 31 人，2–3 小时 29 人，3–4 小时 18 人，超过 4 小时 12 人",
      kicker: "时长分布",
      title: "61.9% 的玩家单次游戏 1–3 小时",
      caption: "百分比根据原始频数重新计算，n=97。",
    },
    forest: {
      aria: "优势比与 95% 置信区间：体验价值 1.13（1.00–1.26），感知易用性 1.18（0.89–1.56），社交互动 1.23（1.04–1.45）",
      kicker: "有序逻辑回归",
      title: "进入更长时长类别的优势比",
      rows: [
        {
          label: "体验价值",
          short: "EV",
          value: "1.13",
          ci: "1.00–1.26",
          left: "25%",
          width: "32.5%",
          point: "41.25%",
          significant: true,
        },
        {
          label: "感知易用性",
          short: "PU",
          value: "1.18",
          ci: "0.89–1.56",
          left: "11.25%",
          width: "83.75%",
          point: "47.5%",
          significant: false,
        },
        {
          label: "社交互动",
          short: "SI",
          value: "1.23",
          ci: "1.04–1.45",
          left: "30%",
          width: "51.25%",
          point: "53.75%",
          significant: true,
        },
      ],
      caption: "PU 跨过 OR=1 参考线；EV 与 SI 显著。",
    },
    reliability: {
      aria: "删除题项前后的信度：体验价值 .50 升至 .56，感知易用性 .69 升至 .77，社交互动 .49 升至 .81",
      kicker: "量表检验",
      title: "信度：删题前 → 后",
      threshold: "α .70",
      rows: [
        {
          label: "EV",
          before: ".50",
          after: ".56",
          start: "20%",
          end: "32%",
          itemChange: "6→4 题",
        },
        {
          label: "PU",
          before: ".69",
          after: ".77",
          start: "58%",
          end: "74%",
          itemChange: "3→2 题",
        },
        {
          label: "SI",
          before: ".49",
          after: ".81",
          start: "18%",
          end: "82%",
          itemChange: "4→2 题",
        },
      ],
      caption: "EV 在删除题项后仍然偏弱，因此保留这一局限提示。",
    },
    note: "这是相关关系，而非因果关系。OR=1.23 描述的是进入更长时长类别的优势比——而非游戏时间多出 23%。",
  },
  aiResearch: {
    aria: "学生 AI 使用研究证据",
    kicker: "证据地图",
    heading: "高使用率。有条件的信任。",
    sub: "学生们既想要 AI 的速度，也想要可溯源的检索和人的共情。",
    metricsAria: "研究概览",
    metrics: [
      { value: "55", label: "问卷回复" },
      { value: "6", label: "完成访谈" },
      { value: "98.2%", label: "使用过 AI" },
      { value: "77.8%", label: "希望获得官方指导" },
    ],
    adoption: {
      aria: "AI 使用率为 98.2%。在 54 名 AI 使用者中，40.7% 每天使用，55.6% 每周使用，3.7% 每月使用",
      kicker: "使用率速览",
      title: "AI 已成日常",
      ringLabel: "使用过 AI",
      frequencies: [
        { label: "每天", pct: "40.7%", width: "40.7%" },
        { label: "每周", pct: "55.6%", width: "55.6%" },
        { label: "每月", pct: "3.7%", width: "3.7%" },
      ],
      caption: "频率以 54 名使用过 AI 的受访者为基数。",
    },
    purpose: {
      aria: "所选 AI 功能的占比：文本与写作 36.2%，翻译 30.5%，效率工具 11.3%，绘画与设计 11.3%，社交辅助 10.6%",
      kicker: "用途分布",
      title: "写作与翻译领先",
      bubbles: [
        { className: "bubble-writing", pct: "36.2%", label: "写作" },
        { className: "bubble-translate", pct: "30.5%", label: "翻译" },
        { className: "bubble-efficiency", pct: "11.3%", label: "效率" },
        { className: "bubble-design", pct: "11.3%", label: "设计" },
        { className: "bubble-social", pct: "10.6%", label: "社交" },
      ],
      caption: "为所选功能的占比，而非学生人数的占比。",
    },
    tension: {
      aria: "信任与隐私的张力：83.3% 的学生对 AI 抱有部分信任；81.5% 对数据泄露有一定或高度担忧；98.1% 只会有保留地分享个人数据或完全不愿分享",
      kicker: "信任—隐私的张力",
      title: "使用并未消除顾虑",
      rows: [
        {
          barClass: "trust-bar",
          label: "信任",
          n: "n=54",
          bars: [
            { basis: "13%", text: "13.0" },
            { basis: "83.3%", text: "83.3 部分信任" },
            { basis: "3.7%", text: "3.7" },
          ],
        },
        {
          barClass: "concern-bar",
          label: "数据泄露担忧",
          n: "n=54",
          bars: [
            { basis: "18.5%", text: "18.5 无" },
            { basis: "63%", text: "63.0 有些" },
            { basis: "18.5%", text: "18.5 高" },
          ],
        },
        {
          barClass: "sharing-bar",
          label: "个人数据分享",
          n: "n=54",
          bars: [
            { basis: "1.9%", text: "1.9" },
            { basis: "61.1%", text: "61.1 有保留" },
            { basis: "37%", text: "37.0 不愿" },
          ],
        },
      ],
      caption: "直接标注保留了各量表的不同含义。",
    },
    guidance: {
      aria: "77.8% 的学生希望获得官方防抄袭指导。偏好的指导形式为工作坊 45.7%、手册 35.8%、一对一辅导 18.5%",
      kicker: "指导形式偏好",
      title: "学习应当动手实践",
      core: { pct: "77.8%", label: "希望获得官方指导" },
      petals: [
        { className: "petal-workshop", pct: "45.7%", label: "工作坊" },
        { className: "petal-handbook", pct: "35.8%", label: "手册" },
        { className: "petal-tutorial", pct: "18.5%", label: "一对一" },
      ],
      caption: "数值为各形式被选择的占比。",
    },
    library: {
      aria: "访谈中关于图书馆 AI 服务的想法：数据或图书检索 6 人中 5 人，AI 服务台 6 人中 1 人，专题馆藏 6 人中 1 人，阅读清单 6 人中 1 人",
      kicker: "图书馆服务机会",
      title: "先检索，再谈替代",
      core: { count: "5/6", label: "数据与图书检索" },
      satellites: [
        { className: "satellite-desk", count: "1/6", label: "服务台" },
        { className: "satellite-collections", count: "1/6", label: "专题馆藏" },
        { className: "satellite-reading", count: "1/6", label: "阅读清单" },
      ],
      caption: "访谈提及次数；受访者可以提出多个想法。",
    },
    note: "各题基数不同（n=55、54 或 50）。每张图都保留了原始分母，或标注了选择占比。",
  },
  fpsSessions: {
    aria: "FPS 回复流转与时长分布",
    heading: "从 115 份回复到 97 个有效样本。",
    sub: "同一批样本从数据清洗进入五个单次时长分组。",
    switchAria: "证据视图",
    tabCleaning: "样本流转",
    tabSessions: "时长分布",
    validLabel: "有效回复",
    cleaningNote: "7 个离群值 · 11 条无效逻辑路径",
    percentTemplate: "占有效样本的 {percent}%",
    bandsAria: "单次时长分组",
    note: "百分比按 n=97 由原始频数重新计算；原文报告的百分比存在不一致。",
  },
  fpsDrivers: {
    aria: "FPS 回归模型与信度检验",
    heading: "什么推动了优势比？",
    sub: "社交互动与更长时长类别的关联最强且显著。",
    switchAria: "模型或信度检验",
    tabModel: "模型",
    tabScale: "信度检验",
    driversAria: "模型驱动因素",
    drivers: [
      { id: "ev", short: "EV", label: "体验价值", beta: ".12", p: ".045", odds: 1.13, ci: [1.0, 1.26], alpha: [0.5, 0.56], items: "6→4", significant: true },
      { id: "pu", short: "PU", label: "感知易用性", beta: ".16", p: ".252", odds: 1.18, ci: [0.89, 1.56], alpha: [0.69, 0.77], items: "3→2", significant: false },
      { id: "si", short: "SI", label: "社交互动", beta: ".21", p: ".014", odds: 1.23, ci: [1.04, 1.45], alpha: [0.49, 0.81], items: "4→2", significant: true },
    ],
    itemsTemplate: "删题后 {items} 题",
    note: "这是相关关系，而非因果关系。优势比描述的是在有序类别之间的移动——而非游戏时间多出的百分比。",
  },
  aiAdoption: {
    aria: "AI 使用情况与使用频率",
    heading: "AI 早已成为日常。",
    sub: "55 份问卷回复析出 54 名使用者，进而呈现出以周为单位的使用节奏。",
    switchAria: "使用证据视图",
    tabAdoption: "使用情况",
    tabFrequency: "使用频率",
    adoptionReadout: "55 人中有 54 人使用过 AI",
    usersTemplate: "{label}用户",
    groups: [
      { id: "daily", label: "每日", count: 22 },
      { id: "weekly", label: "每周", count: 30 },
      { id: "monthly", label: "每月", count: 2 },
    ],
    freqAria: "AI 使用频率",
    note: "频率基数：AI 使用者，n=54。",
  },
  aiTrust: {
    aria: "AI 信任、隐私担忧与指导期待",
    switchAria: "问卷题目",
    views: {
      trust: {
        tab: "信任",
        title: "有条件的信任",
        lead: "多数学生对 AI 抱有部分信任，完全信任仍然少见。",
        groups: [
          { label: "不信任", count: 7 },
          { label: "部分信任", count: 45 },
          { label: "完全信任", count: 2 },
        ],
      },
      concern: {
        tab: "数据担忧",
        title: "担忧仍然偏高",
        lead: "高使用率并未消除对数据泄露的焦虑。",
        groups: [
          { label: "无", count: 10 },
          { label: "有一些", count: 34 },
          { label: "非常", count: 10 },
        ],
      },
      guidance: {
        tab: "指导",
        title: "期待官方指导",
        lead: "多数学生希望获得更明确的负责任使用官方指导。",
        groups: [
          { label: "是", count: 42 },
          { label: "否", count: 12 },
        ],
      },
    },
    note: "题目基数：n=54。指导意愿人数由报告的 77.78% / 22.22% 比例推算。",
  },
  genshin: {
    aria: "定性文化价值星盘",
    heading: "一个为跨文化转译而设计的世界。",
    sub: "六个定性视角围绕同一片共享文化空间运转——而不为提瓦特虚构分数。",
    coreLabel: "共享文化基底",
    dimensionsAria: "文化维度",
    dimensions: [
      { label: "权力", statement: "等级秩序反复向公民参与敞开。", focus: "璃月" },
      { label: "个人与集体", statement: "个人良知与集体行动共存，而非相互抵消。", focus: "稻妻" },
      { label: "性别角色", statement: "权威与关怀在灵活的角色设定之间流动。", focus: "璃月" },
      { label: "不确定性", statement: "变化成为叙事资源，而非必须消除的威胁。", focus: "蒙德" },
      { label: "长期导向", statement: "牺牲与守护将社会引向共同的未来。", focus: "须弥" },
      { label: "自由与约束", statement: "享乐、责任、仪式与治理保持着富有建设性的张力。", focus: "提瓦特" },
    ],
    takeaway: "共同基底 + 可见差异 → 更低的文化折扣",
    kazuhaAlt: "枫原万叶",
    nahidaAlt: "纳西妲",
    note: "这是来自学位论文的定性分析框架——并非数值评分或因果模型。",
  },
};

const copy: Record<Language, typeof en> = { en, zh };

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="research-metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function VizLane({ children, className = "", lang }: { children: ReactNode; className?: string; lang: Language }) {
  const l = copy[lang].lane;
  const laneRef = useRef<HTMLDivElement>(null);

  const move = (direction: -1 | 1) => {
    const lane = laneRef.current;
    if (!lane) return;
    lane.scrollBy({ left: lane.clientWidth * 0.82 * direction, behavior: "smooth" });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      event.stopPropagation();
      move(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      event.stopPropagation();
      move(1);
    }
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    event.preventDefault();
    event.currentTarget.scrollLeft += event.deltaY;
  };

  return (
    <div className="research-lane-shell">
      <div
        className={`research-viz-grid ${className}`.trim()}
        ref={laneRef}
        tabIndex={0}
        data-key-scope="inner"
        data-gesture-scope="inner-x"
        onKeyDown={handleKeyDown}
        onWheel={handleWheel}
        aria-label={l.ariaLabel}
      >
        {children}
      </div>
      <div className="research-lane-controls">
        <span>{l.explore}</span>
        <button type="button" onClick={() => move(-1)} aria-label={l.prevAria}>←</button>
        <button type="button" onClick={() => move(1)} aria-label={l.nextAria}>→</button>
      </div>
    </div>
  );
}

function CharacterResearch({ lang }: { lang: Language }) {
  const c = copy[lang].character;
  return (
    <section className="research-evidence evidence-character" aria-label={c.aria}>
      <div className="research-section-heading">
        <span>{c.kicker}</span>
        <h3>{c.heading}</h3>
        <p>{c.sub}</p>
      </div>

      <div className="research-metrics" aria-label={c.metricsAria}>
        {c.metrics.map((metric) => (
          <Metric key={metric.label} value={metric.value} label={metric.label} />
        ))}
      </div>

      <VizLane className="character-viz-grid" lang={lang}>
        <figure
          className="research-viz research-viz-wide attachment-figure"
          role="img"
          aria-label={c.model.aria}
        >
          <div className="viz-kicker">
            <span>{c.model.kicker}</span>
            <strong>{c.model.title}</strong>
          </div>
          <div className="attachment-diagram" aria-hidden="true">
            <div className="attachment-circle attachment-symbiotic">
              <strong>{c.model.symbiotic.name}</strong>
              <span>{c.model.symbiotic.tag}</span>
            </div>
            <div className="attachment-circle attachment-observance">
              <strong>{c.model.observance.name}</strong>
              <span>{c.model.observance.tag}</span>
            </div>
            <div className="attachment-circle attachment-actualisation">
              <strong>{c.model.actualisation.name}</strong>
              <span>{c.model.actualisation.tag}</span>
            </div>
            <div className="attachment-centre">
              <span>{c.model.centreA}</span>
              <strong>↔</strong>
              <span>{c.model.centreB}</span>
            </div>
          </div>
          <figcaption>{c.model.caption}</figcaption>
        </figure>

        <figure
          className="research-viz mention-figure"
          role="img"
          aria-label={c.mentions.aria}
        >
          <div className="viz-kicker">
            <span>{c.mentions.kicker}</span>
            <strong>{c.mentions.title}</strong>
          </div>
          <div className="mention-plot" aria-hidden="true">
            {c.mentions.rows.map((item) => (
              <div className="mention-row" key={item.label}>
                <span>{item.label}</span>
                <div>
                  <i style={{ width: item.width }} />
                  <b style={{ left: item.width }} />
                </div>
                <strong>{item.value}/10</strong>
              </div>
            ))}
          </div>
          <figcaption>{c.mentions.caption}</figcaption>
        </figure>

        <figure
          className="research-viz formation-figure"
          role="img"
          aria-label={c.formation.aria}
        >
          <div className="viz-kicker">
            <span>{c.formation.kicker}</span>
            <strong>{c.formation.title}</strong>
          </div>
          <div className="formation-map" aria-hidden="true">
            <div className="formation-node node-attraction">
              <span>01</span>
              <strong>{c.formation.attraction.title}</strong>
              <small>{c.formation.attraction.tag}</small>
            </div>
            <span className="formation-arrow">→</span>
            <div className="formation-node node-attachment">
              <span>02</span>
              <strong>{c.formation.attachment.title}</strong>
              <small>{c.formation.attachment.tag}</small>
            </div>
            <div className="formation-support support-game">
              <strong>{c.formation.game.title}</strong>
              <span>{c.formation.game.tag}</span>
            </div>
            <div className="formation-support support-life">
              <strong>{c.formation.life.title}</strong>
              <span>{c.formation.life.tag}</span>
            </div>
          </div>
          <figcaption>{c.formation.caption}</figcaption>
        </figure>
      </VizLane>
    </section>
  );
}

function FpsResearch({ lang }: { lang: Language }) {
  const c = copy[lang].fpsResearch;
  return (
    <section className="research-evidence evidence-fps" aria-label={c.aria}>
      <div className="research-section-heading">
        <span>{c.kicker}</span>
        <h3>{c.heading}</h3>
        <p>{c.sub}</p>
      </div>

      <div className="research-metrics" aria-label={c.metricsAria}>
        {c.metrics.map((metric) => (
          <Metric key={metric.label} value={metric.value} label={metric.label} />
        ))}
      </div>

      <VizLane lang={lang}>
        <figure
          className="research-viz research-viz-wide sample-flow-figure"
          role="img"
          aria-label={c.sample.aria}
        >
          <div className="viz-kicker">
            <span>{c.sample.kicker}</span>
            <strong>{c.sample.title}</strong>
          </div>
          <div className="sample-flow" aria-hidden="true">
            <div className="flow-stage flow-start"><strong>115</strong><span>{c.sample.collected}</span></div>
            <div className="flow-loss"><strong>−7</strong><span>{c.sample.outliers}</span></div>
            <div className="flow-loss"><strong>−11</strong><span>{c.sample.invalid}</span></div>
            <div className="flow-stage flow-end"><strong>97</strong><span>{c.sample.retained}</span></div>
          </div>
          <figcaption>{c.sample.caption}</figcaption>
        </figure>

        <figure
          className="research-viz session-figure"
          role="img"
          aria-label={c.session.aria}
        >
          <div className="viz-kicker">
            <span>{c.session.kicker}</span>
            <strong>{c.session.title}</strong>
          </div>
          <div className="session-plot" aria-hidden="true">
            {sessionDurations.map((item) => (
              <div className="session-row" key={item.label}>
                <span>{item.label}</span>
                <div><i style={{ width: item.width }} /></div>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
          <figcaption>{c.session.caption}</figcaption>
        </figure>

        <figure
          className="research-viz forest-figure"
          role="img"
          aria-label={c.forest.aria}
        >
          <div className="viz-kicker">
            <span>{c.forest.kicker}</span>
            <strong>{c.forest.title}</strong>
          </div>
          <div className="forest-axis" aria-hidden="true">
            <div className="forest-reference" />
            {c.forest.rows.map((row) => (
              <div className={`forest-row ${row.significant ? "is-significant" : ""}`} key={row.short}>
                <div className="forest-label"><strong>{row.short}</strong><span>{row.label}</span></div>
                <div className="forest-track">
                  <i style={{ left: row.left, width: row.width }} />
                  <b style={{ left: row.point }} />
                </div>
                <div className="forest-value"><strong>{row.value}</strong><span>{row.ci}</span></div>
              </div>
            ))}
            <div className="forest-ticks"><span>0.8</span><span>1.0</span><span>1.2</span><span>1.4</span><span>1.6</span></div>
          </div>
          <figcaption>{c.forest.caption}</figcaption>
        </figure>

        <figure
          className="research-viz reliability-figure"
          role="img"
          aria-label={c.reliability.aria}
        >
          <div className="viz-kicker">
            <span>{c.reliability.kicker}</span>
            <strong>{c.reliability.title}</strong>
          </div>
          <div className="reliability-plot" aria-hidden="true">
            <div className="reliability-threshold"><span>{c.reliability.threshold}</span></div>
            {c.reliability.rows.map((row) => (
              <div className="reliability-row" key={row.label}>
                <strong>{row.label}</strong>
                <div className="reliability-track">
                  <i style={{ left: row.start, width: `calc(${row.end} - ${row.start})` }} />
                  <b className="reliability-before" style={{ left: row.start }}>{row.before}</b>
                  <b className="reliability-after" style={{ left: row.end }}>{row.after}</b>
                </div>
                <span>{row.itemChange}</span>
              </div>
            ))}
          </div>
          <figcaption>{c.reliability.caption}</figcaption>
        </figure>
      </VizLane>
      <p className="research-data-note">
        {c.note}
      </p>
    </section>
  );
}

function AiResearch({ lang }: { lang: Language }) {
  const c = copy[lang].aiResearch;
  return (
    <section className="research-evidence evidence-ai" aria-label={c.aria}>
      <div className="research-section-heading">
        <span>{c.kicker}</span>
        <h3>{c.heading}</h3>
        <p>{c.sub}</p>
      </div>

      <div className="research-metrics" aria-label={c.metricsAria}>
        {c.metrics.map((metric) => (
          <Metric key={metric.label} value={metric.value} label={metric.label} />
        ))}
      </div>

      <VizLane className="ai-viz-grid" lang={lang}>
        <figure
          className="research-viz adoption-figure"
          role="img"
          aria-label={c.adoption.aria}
        >
          <div className="viz-kicker">
            <span>{c.adoption.kicker}</span>
            <strong>{c.adoption.title}</strong>
          </div>
          <div className="adoption-layout" aria-hidden="true">
            <div className="adoption-ring"><strong>98.2%</strong><span>{c.adoption.ringLabel}</span></div>
            <div className="frequency-stack">
              {c.adoption.frequencies.map((item) => (
                <div key={item.label}><span>{item.label}</span><strong>{item.pct}</strong><i style={{ width: item.width }} /></div>
              ))}
            </div>
          </div>
          <figcaption>{c.adoption.caption}</figcaption>
        </figure>

        <figure
          className="research-viz purpose-figure"
          role="img"
          aria-label={c.purpose.aria}
        >
          <div className="viz-kicker">
            <span>{c.purpose.kicker}</span>
            <strong>{c.purpose.title}</strong>
          </div>
          <div className="purpose-constellation" aria-hidden="true">
            {c.purpose.bubbles.map((bubble) => (
              <div key={bubble.className} className={`purpose-bubble ${bubble.className}`}><strong>{bubble.pct}</strong><span>{bubble.label}</span></div>
            ))}
          </div>
          <figcaption>{c.purpose.caption}</figcaption>
        </figure>

        <figure
          className="research-viz research-viz-wide tension-figure"
          role="img"
          aria-label={c.tension.aria}
        >
          <div className="viz-kicker">
            <span>{c.tension.kicker}</span>
            <strong>{c.tension.title}</strong>
          </div>
          <div className="tension-plot" aria-hidden="true">
            {c.tension.rows.map((row) => (
              <div className="tension-row" key={row.label}>
                <div><strong>{row.label}</strong><span>{row.n}</span></div>
                <div className={`tension-bar ${row.barClass}`}>
                  {row.bars.map((bar) => (
                    <i key={bar.basis} style={{ flexBasis: bar.basis }}><span>{bar.text}</span></i>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <figcaption>{c.tension.caption}</figcaption>
        </figure>

        <figure
          className="research-viz guidance-figure"
          role="img"
          aria-label={c.guidance.aria}
        >
          <div className="viz-kicker">
            <span>{c.guidance.kicker}</span>
            <strong>{c.guidance.title}</strong>
          </div>
          <div className="guidance-flower" aria-hidden="true">
            <div className="guidance-core"><strong>{c.guidance.core.pct}</strong><span>{c.guidance.core.label}</span></div>
            {c.guidance.petals.map((petal) => (
              <div key={petal.className} className={`guidance-petal ${petal.className}`}><strong>{petal.pct}</strong><span>{petal.label}</span></div>
            ))}
          </div>
          <figcaption>{c.guidance.caption}</figcaption>
        </figure>

        <figure
          className="research-viz library-figure"
          role="img"
          aria-label={c.library.aria}
        >
          <div className="viz-kicker">
            <span>{c.library.kicker}</span>
            <strong>{c.library.title}</strong>
          </div>
          <div className="library-orbit" aria-hidden="true">
            <div className="library-core"><strong>{c.library.core.count}</strong><span>{c.library.core.label}</span></div>
            {c.library.satellites.map((satellite) => (
              <div key={satellite.className} className={`library-satellite ${satellite.className}`}><strong>{satellite.count}</strong><span>{satellite.label}</span></div>
            ))}
          </div>
          <figcaption>{c.library.caption}</figcaption>
        </figure>
      </VizLane>
      <p className="research-data-note">
        {c.note}
      </p>
    </section>
  );
}

function FpsSessionsEvidence({ lang }: { lang: Language }) {
  const c = copy[lang].fpsSessions;
  const [mode, setMode] = useState<"cleaning" | "sessions">("sessions");
  const [activeBin, setActiveBin] = useState(1);
  const bins = [
    { label: "<1h", count: 7 },
    { label: "1–2h", count: 31 },
    { label: "2–3h", count: 29 },
    { label: "3–4h", count: 18 },
    { label: ">4h", count: 12 },
  ] as const;
  const dots = (() => {
    return Array.from({ length: 115 }, (_, index) => {
      if (index >= 104) return { status: "invalid", bin: -1 };
      if (index >= 97) return { status: "outlier", bin: -1 };
      let bin = 0;
      let running = bins[0].count;
      while (index >= running && bin < bins.length - 1) {
        bin += 1;
        running += bins[bin].count;
      }
      return { status: "valid", bin };
    });
  })();
  const selected = bins[activeBin];
  const percent = ((selected.count / 97) * 100).toFixed(1);

  return (
    <section className="single-evidence-page fps-sessions-evidence" aria-label={c.aria}>
      <header className="single-evidence-heading">
        <div><h3>{c.heading}</h3><p>{c.sub}</p></div>
        <div className="evidence-mode-switch" role="group" aria-label={c.switchAria}>
          <button type="button" aria-pressed={mode === "cleaning"} onClick={() => setMode("cleaning")}>{c.tabCleaning}</button>
          <button type="button" aria-pressed={mode === "sessions"} onClick={() => setMode("sessions")}>{c.tabSessions}</button>
        </div>
      </header>
      <div className="sample-chamber" data-mode={mode}>
        <div className="sample-dot-field" aria-hidden="true">
          {dots.map((dot, index) => (
            <i
              key={index}
              data-status={dot.status}
              data-bin={dot.bin}
              className={mode === "sessions" && dot.status === "valid" && dot.bin !== activeBin ? "is-muted" : undefined}
            />
          ))}
        </div>
        <div className="sample-readout" aria-live="polite">
          {mode === "cleaning" ? (
            <><strong>97</strong><span>{c.validLabel}</span><p>{c.cleaningNote}</p></>
          ) : (
            <><strong>{selected.count}</strong><span>{selected.label}</span><p>{fill(c.percentTemplate, { percent })}</p></>
          )}
        </div>
        {mode === "sessions" && (
          <div className="session-band-controls" role="tablist" aria-label={c.bandsAria}>
            {bins.map((bin, index) => (
              <button key={bin.label} type="button" role="tab" aria-selected={index === activeBin} onClick={() => setActiveBin(index)}>
                <span>{bin.label}</span><strong>{bin.count}</strong>
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="single-evidence-note">{c.note}</p>
    </section>
  );
}

function FpsDriversEvidence({ lang }: { lang: Language }) {
  const c = copy[lang].fpsDrivers;
  const [mode, setMode] = useState<"model" | "scale">("model");
  const [active, setActive] = useState(2);
  const driver = c.drivers[active];
  const axisMin = 0.8;
  const axisMax = 1.6;
  const position = (value: number) => `${((value - axisMin) / (axisMax - axisMin)) * 100}%`;

  return (
    <section className="single-evidence-page fps-drivers-evidence" aria-label={c.aria}>
      <header className="single-evidence-heading">
        <div><h3>{c.heading}</h3><p>{c.sub}</p></div>
        <div className="evidence-mode-switch" role="group" aria-label={c.switchAria}>
          <button type="button" aria-pressed={mode === "model"} onClick={() => setMode("model")}>{c.tabModel}</button>
          <button type="button" aria-pressed={mode === "scale"} onClick={() => setMode("scale")}>{c.tabScale}</button>
        </div>
      </header>
      <div className="driver-canvas" data-mode={mode}>
        <div className="driver-axis" aria-hidden="true"><i style={{ left: position(1) }} /><span>OR 1.0</span></div>
        <div className="driver-lines" role="tablist" aria-label={c.driversAria}>
          {c.drivers.map((item, index) => (
            <button key={item.id} type="button" role="tab" aria-selected={index === active} onClick={() => setActive(index)}>
              <span><strong>{item.short}</strong><small>{item.label}</small></span>
              {mode === "model" ? (
                <i className={item.significant ? "is-significant" : undefined} style={{ left: position(item.ci[0]), width: `calc(${position(item.ci[1])} - ${position(item.ci[0])})` }}>
                  <b style={{ left: `calc(${position(item.odds)} - ${position(item.ci[0])})` }} />
                </i>
              ) : (
                <i className="alpha-line" style={{ left: `${item.alpha[0] * 100}%`, width: `${(item.alpha[1] - item.alpha[0]) * 100}%` }}><b /></i>
              )}
            </button>
          ))}
        </div>
        <article aria-live="polite">
          <span>{driver.label}</span>
          {mode === "model" ? (
            <><strong>OR {driver.odds.toFixed(2)}</strong><p>β {driver.beta} · p {driver.p} · 95% CI {driver.ci[0].toFixed(2)}–{driver.ci[1].toFixed(2)}</p></>
          ) : (
            <><strong>α {driver.alpha[0].toFixed(2)} → {driver.alpha[1].toFixed(2)}</strong><p>{fill(c.itemsTemplate, { items: driver.items })}</p></>
          )}
        </article>
      </div>
      <p className="single-evidence-note">{c.note}</p>
    </section>
  );
}

function AiAdoptionEvidence({ lang }: { lang: Language }) {
  const c = copy[lang].aiAdoption;
  const [mode, setMode] = useState<"adoption" | "frequency">("frequency");
  const groups = c.groups;
  const [active, setActive] = useState(1);
  const selected = groups[active];

  return (
    <section className="single-evidence-page ai-adoption-evidence" aria-label={c.aria}>
      <header className="single-evidence-heading">
        <div><h3>{c.heading}</h3><p>{c.sub}</p></div>
        <div className="evidence-mode-switch" role="group" aria-label={c.switchAria}>
          <button type="button" aria-pressed={mode === "adoption"} onClick={() => setMode("adoption")}>{c.tabAdoption}</button>
          <button type="button" aria-pressed={mode === "frequency"} onClick={() => setMode("frequency")}>{c.tabFrequency}</button>
        </div>
      </header>
      <div className="ai-dot-stage" data-mode={mode}>
        <div className="ai-dot-matrix" aria-hidden="true">
          {Array.from({ length: 55 }, (_, index) => {
            const group = index === 54 ? "never" : index < 22 ? "daily" : index < 52 ? "weekly" : "monthly";
            const muted = mode === "frequency" && group !== groups[active].id;
            return <i key={index} data-group={group} className={muted ? "is-muted" : undefined} />;
          })}
        </div>
        <div className="ai-adoption-readout" aria-live="polite">
          {mode === "adoption" ? <><strong>98.2%</strong><span>{c.adoptionReadout}</span></> : <><strong>{selected.count}</strong><span>{fill(c.usersTemplate, { label: selected.label })}</span></>}
        </div>
        {mode === "frequency" && (
          <div className="ai-frequency-tabs" role="tablist" aria-label={c.freqAria}>
            {groups.map((group, index) => (
              <button key={group.id} type="button" role="tab" aria-selected={index === active} onClick={() => setActive(index)}>{group.label}<strong>{group.count}</strong></button>
            ))}
          </div>
        )}
      </div>
      <p className="single-evidence-note">{c.note}</p>
    </section>
  );
}

function AiTrustEvidence({ lang }: { lang: Language }) {
  const c = copy[lang].aiTrust;
  const [view, setView] = useState<keyof typeof c.views>("trust");
  const question = c.views[view];
  const boundaries = question.groups.reduce<number[]>((values, group) => {
    values.push((values.at(-1) ?? 0) + group.count);
    return values;
  }, []);

  return (
    <section className="single-evidence-page ai-trust-evidence" aria-label={c.aria}>
      <header className="single-evidence-heading">
        <div><h3>{question.title}</h3><p>{question.lead}</p></div>
        <div className="evidence-mode-switch" role="tablist" aria-label={c.switchAria}>
          {(Object.keys(c.views) as Array<keyof typeof c.views>).map((key) => (
            <button key={key} type="button" role="tab" aria-selected={view === key} onClick={() => setView(key)}>{c.views[key].tab}</button>
          ))}
        </div>
      </header>
      <div className="trust-matrix-stage">
        <div className="trust-dot-matrix" aria-hidden="true">
          {Array.from({ length: 54 }, (_, index) => {
            const groupIndex = boundaries.findIndex((boundary) => index < boundary);
            return <i key={index} data-group={groupIndex} />;
          })}
        </div>
        <div className="trust-legend">
          {question.groups.map((group, index) => (
            <div key={group.label} data-group={index}><i /><strong>{group.count}</strong><span>{group.label}</span></div>
          ))}
        </div>
      </div>
      <p className="single-evidence-note">{c.note}</p>
    </section>
  );
}

function GenshinCulturalOrrery({ lang }: { lang: Language }) {
  const c = copy[lang].genshin;
  const [active, setActive] = useState(0);
  const dimension = c.dimensions[active];
  return (
    <section className="single-evidence-page genshin-orrery-page" aria-label={c.aria}>
      <header className="single-evidence-heading">
        <div><h3>{c.heading}</h3><p>{c.sub}</p></div>
      </header>
      <div className="cultural-orrery">
        <svg viewBox="0 0 760 520" aria-hidden="true">
          <ellipse cx="380" cy="260" rx="292" ry="190" />
          <ellipse cx="380" cy="260" rx="218" ry="142" />
          <ellipse cx="380" cy="260" rx="132" ry="88" />
        </svg>
        <div className="orrery-core"><strong>{dimension.focus}</strong><span>{c.coreLabel}</span></div>
        <div className="orrery-dimensions" role="tablist" aria-label={c.dimensionsAria}>
          {c.dimensions.map((item, index) => (
            <button key={item.label} type="button" role="tab" aria-selected={index === active} onClick={() => setActive(index)}><i />{item.label}</button>
          ))}
        </div>
        <article aria-live="polite"><span>{dimension.label}</span><p>{dimension.statement}</p><strong>{c.takeaway}</strong></article>
        <img className="orrery-kazuha" src="/genshin-kazuha.webp" alt={c.kazuhaAlt} />
        <img className="orrery-nahida" src="/genshin-nahida.webp" alt={c.nahidaAlt} />
      </div>
      <p className="single-evidence-note">{c.note}</p>
    </section>
  );
}

export default function ResearchVisuals({ kind, view, lang = "en" }: ResearchVisualsProps) {
  if (kind === "character") return <CharacterResearch lang={lang} />;
  if (kind === "genshin") return <GenshinCulturalOrrery lang={lang} />;
  if (kind === "fps") return view === "drivers" ? <FpsDriversEvidence lang={lang} /> : <FpsSessionsEvidence lang={lang} />;
  if (kind === "ai") return view === "trust" ? <AiTrustEvidence lang={lang} /> : <AiAdoptionEvidence lang={lang} />;
  const exhaustive: never = kind;
  return exhaustive;
}
