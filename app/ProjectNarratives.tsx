"use client";

import { useMemo, useState, type CSSProperties } from "react";
import type { Language } from "./i18n";

export type NarrativeKind = "character" | "genshin" | "fps" | "ai";

type ProjectNarrativesProps = {
  kind: NarrativeKind;
  slideId: string;
  lang?: Language;
};

type AttachmentCase = {
  name: string;
  game: string;
  mode: string;
  cue: string;
  text: string;
  image: string;
  framed?: boolean;
};

const fill = (template: string, values: Record<string, string>) =>
  Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template,
  );

const en = {
  attachment: {
    railAria: "Choose a character case",
    altTemplate: "{name} from {game}",
    casesA: {
      title: "When care follows a character’s life.",
      lead: "Five cases show attachment as resonance, observation, and the freedom to let a character grow.",
      cases: [
        {
          name: "Kaveh",
          game: "Genshin Impact",
          mode: "Symbiotic",
          cue: "A kindred spirit",
          text: "Shared ideals and struggle made the player feel understood. Kaveh’s growth later became a model for difficult choices in their own life.",
          image: "/attachment-kaveh-cutout.webp",
        },
        {
          name: "Ayase Mayoi",
          game: "Ensemble Stars",
          mode: "Symbiotic → Observance",
          cue: "Healing through growth",
          text: "His movement from self-loathing toward connection helped the player reconsider their own. As he flourished, care became the wish to see him shine without them.",
          image: "/attachment-ayase-mayoi-cutout.webp",
        },
        {
          name: "Ningguang",
          game: "Genshin Impact",
          mode: "Observance",
          cue: "A world after logout",
          text: "A nightly ritual—leaving her seated in Liyue—made the game world feel continuous, independent, and safe after the screen went dark.",
          image: "/attachment-ningguang-cutout.webp",
        },
        {
          name: "Itsuki Shu",
          game: "Ensemble Stars",
          mode: "Observance",
          cue: "Admiration beyond appearance",
          text: "Story and performance overturned an uneasy first impression. His artistic principles made him feel like a life teacher rather than a collectible image.",
          image: "/attachment-itsuki-shu-cutout-v2.webp",
        },
        {
          name: "Arataki Itto",
          game: "Genshin Impact",
          mode: "Observance",
          cue: "Joy in contradiction",
          text: "The contrast between playful bravado and dependable loyalty created affection. Simply seeing him could interrupt a bad mood.",
          image: "/attachment-arataki-itto-cutout.webp",
        },
      ] as AttachmentCase[],
    },
    casesB: {
      title: "When a bond becomes tangible.",
      lead: "Five cases show attachment moving through archives, routines, reassurance, and objects in everyday life.",
      cases: [
        {
          name: "Artem Wing",
          game: "Tears of Themis",
          mode: "Actualisation",
          cue: "The archive becomes a relationship",
          text: "Collecting every card and unlocking each story made the bond feel cumulative—part memory, part date, part everyday companionship.",
          image: "/attachment-artem-wing-cutout.webp",
        },
        {
          name: "Necrologist",
          game: "Reverse: 1999",
          mode: "Actualisation",
          cue: "Comfort carried into life",
          text: "Voice lines reframed grief and affection levels made closeness visible. The relationship crossed into daily life through memory, media, and a tattoo.",
          image: "/attachment-necrologist-cutout.webp",
        },
        {
          name: "Sun Ce",
          game: "Ashes of the Kingdom",
          mode: "Actualisation",
          cue: "Designing a shared home",
          text: "Furniture, touch responses, clothes, and voice lines let the player perform a relationship—imagining a home designed around what he would like.",
          image: "/attachment-sun-ce.jpg",
          framed: true,
        },
        {
          name: "Artoria Pendragon",
          game: "Fate/Grand Order",
          mode: "Observance",
          cue: "Intimacy with a boundary",
          text: "The player could call her a partner while still recognising that her loyalty belonged to the protagonist. Attachment remained close, but deliberately observed.",
          image: "/attachment-artoria-pendragon-render.webp",
        },
        {
          name: "Alter",
          game: "Fate/Grand Order",
          mode: "Utility → Companionship",
          cue: "Habit becomes presence",
          text: "She entered the team because she was useful. Repeated play turned utility into reassurance—the player could imagine her saying “welcome back” after a long absence.",
          image: "/attachment-alter-render.webp",
        },
      ] as AttachmentCase[],
    },
    formation: {
      aria: "How character attachment forms",
      heading: "Attraction is only the opening.",
      sub: "The study follows a loop between character design, responsive play, and everyday life.",
      stages: [
        {
          title: "Attraction",
          kicker: "The first opening",
          text: "Appearance and voice can start attention; personality, history, and achievement more often make the character feel socially real.",
        },
        {
          title: "Response",
          kicker: "The relationship test",
          text: "Touch reactions, voice lines, resource allocation, photographs, and changing affection levels let players look for reassurance that the bond is mutual.",
        },
        {
          title: "Beyond the screen",
          kicker: "Attachment becomes portable",
          text: "Merchandise, fan media, daily rituals, and personal choices carry the relationship into life—and can also reshape how the character is felt in-game.",
        },
      ],
      note: "10 semi-structured interviews · 6 Nijigen games · thematic analysis",
    },
  },
  genshin: {
    overview: {
      aria: "Genshin Across Cultures overview",
      titleLead: "Genshin",
      titleAccent: "Across Cultures",
      lede: "How a Chinese open-world RPG turns cultural difference into shared meaning.",
      strong: "Culture travels through systems, not isolated symbols.",
      body: "Literature review and comparative textual analysis trace four connected systems: values, narrative, audiovisual expression, and character relationships.",
      arcAria: "Featured Genshin Impact characters",
      characters: {
        zhongli: "Zhongli",
        yunJin: "Yun Jin",
        huTao: "Hu Tao",
      },
      note: "Interpretive single-case study · no original survey or player interviews · imagery © HoYoverse",
    },
    shared: {
      aria: "A world no single culture owns",
      heading: "A world no single culture owns.",
      sub: "Choose a region to follow how a shared world makes difference readable.",
      altTemplate: "{region} character example",
      routeAria: "Teyvat regions",
      regions: [
        {
          name: "Mondstadt",
          principle: "Freedom through resistance",
          text: "A flatter civic order lets individual action sit inside a collective story.",
          image: "/genshin-yun-jin.webp",
        },
        {
          name: "Liyue",
          principle: "Rule moves from gods to people",
          text: "Local landscape, ritual, and hybrid character design make civic transition culturally specific.",
          image: "/genshin-zhongli.webp",
        },
        {
          name: "Inazuma",
          principle: "Eternity revised by listening",
          text: "Personal conscience re-enters collective life as isolation gives way to dialogue.",
          image: "/genshin-kazuha.webp",
        },
        {
          name: "Sumeru",
          principle: "Knowledge becomes a question of power",
          text: "Hierarchy is challenged through collective action, sacrifice, and care for the future.",
          image: "/genshin-nahida.webp",
        },
      ],
    },
    living: {
      aria: "Culture becomes lived experience",
      heading: "Culture becomes lived experience.",
      sub: "Hu Tao is assembled across ritual, relationships, voice, and play—not explained in one biography.",
      buttonsAria: "Character evidence layers",
      evidence: [
        {
          label: "Constellation",
          text: "Poetic names turn progression into a second layer of character writing.",
        },
        {
          label: "Ritual",
          text: "Funeral practice is translated through gesture, humour, and everyday responsibility.",
        },
        {
          label: "Relationships",
          text: "Other characters’ reactions let identity emerge socially rather than through one biography.",
        },
        {
          label: "Story quest",
          text: "The memory of her grandfather connects personal grief to a wider cultural view of death.",
        },
      ],
      strong: "Players assemble fragments into emotional knowledge.",
    },
  },
  fps: {
    overview: {
      aria: "FPS Playtime Study overview",
      kicker: "Quantitative player research",
      heading: "What keeps an FPS session going?",
      stats: [
        { value: "97", label: "Chinese FPS players" },
        { value: "3", label: "proposed drivers" },
        { value: "1", label: "ordinal model" },
      ],
      modelAria: "Ordinal model: three proposed drivers of session duration",
      coreTop: "Session",
      coreBottom: "duration",
      drivers: [
        { code: "SI", name: "Social interaction", note: "Strongest driver", className: "driver-si" },
        { code: "EV", name: "Experience value", note: "Also significant", className: "driver-ev" },
        { code: "PU", name: "Perceived usability", note: "Not significant", className: "driver-pu" },
      ],
      quote: "Social interaction emerged as the strongest significant factor; experience value also mattered.",
      cite: "Perceived usability was not significant.",
    },
    method: {
      aria: "FPS study method",
      heading: "From 115 responses to 97 valid cases.",
      sub: "Every exclusion stays visible before the model is allowed to speak.",
      stepsAria: "Sample processing steps",
      steps: [
        { value: "115", label: "responses collected", note: "WeChat convenience sample" },
        { value: "−7", label: "outliers", note: "identified by IQR" },
        { value: "−11", label: "invalid paths", note: "logic-check exclusions" },
        { value: "97", label: "valid cases", note: "ordinal logistic regression" },
      ],
      note: "5-point measures · reliability audit · ordinal logistic regression",
    },
  },
  ai: {
    overview: {
      aria: "AI and King's Library overview",
      kicker: "Mixed-method HCI study",
      titleName: "King’s Library",
      lede: "High adoption. Conditional trust.",
      usedAi: "had used AI",
      survey: "55 survey responses",
      interviews: "6 interviews",
      quote: "Students wanted AI speed with search traceability and human empathy.",
      cite: "Design opportunity: AI for retrieval. People for nuance.",
    },
    service: {
      aria: "AI and human library service opportunity",
      heading: "AI for retrieval. People for nuance.",
      sub: "Move the handoff point to explore where automation helps—and where human judgement matters.",
      aiSide: {
        label: "AI support",
        strong: "Instant, broad, low-cost",
        text: "Best suited to retrieval, orientation, and repeatable questions.",
      },
      humanSide: {
        label: "Live Chat",
        strong: "Empathetic, current, contextual",
        text: "Best suited to ambiguity, emotion, and questions that need judgement.",
      },
      leaning: {
        aiFirst: "AI-first",
        humanFirst: "Human-first",
        hybrid: "Hybrid handoff",
      },
      sliderAria: "AI to human service handoff",
      anchor: "interviewees mentioned retrieval",
      note: "Qualitative service attributes · interview mentions, n=6",
    },
  },
};

const zh: typeof en = {
  attachment: {
    railAria: "选择一个角色案例",
    altTemplate: "《{game}》中的{name}",
    casesA: {
      title: "当关心追随角色的人生。",
      lead: "五个案例呈现了依恋的样貌：共鸣、守望，以及让角色自由成长的余地。",
      cases: [
        {
          name: "卡维",
          game: "原神",
          mode: "共生型",
          cue: "灵魂同路人",
          text: "共同的理想与挣扎让玩家感到被理解。卡维后来的成长，成为玩家自己面对艰难抉择时的参照。",
          image: "/attachment-kaveh-cutout.webp",
        },
        {
          name: "礼濑真宵",
          game: "偶像梦幻祭",
          mode: "共生型 → 守望型",
          cue: "在成长中被治愈",
          text: "他从自我厌弃走向与人联结的过程，让玩家重新审视了自己。当他逐渐绽放，关心也变成了希望他在没有自己参与的世界里继续发光。",
          image: "/attachment-ayase-mayoi-cutout.webp",
        },
        {
          name: "凝光",
          game: "原神",
          mode: "守望型",
          cue: "下线之后仍在的世界",
          text: "每晚的仪式——让她端坐在璃月——让游戏世界在屏幕熄灭之后依然显得连续、独立而安心。",
          image: "/attachment-ningguang-cutout.webp",
        },
        {
          name: "斋宫宗",
          game: "偶像梦幻祭",
          mode: "守望型",
          cue: "超越外表的欣赏",
          text: "剧情与演出推翻了最初略显不适的第一印象。他的艺术坚持让他更像一位人生导师，而非一张可供收藏的卡面。",
          image: "/attachment-itsuki-shu-cutout-v2.webp",
        },
        {
          name: "荒泷一斗",
          game: "原神",
          mode: "守望型",
          cue: "反差带来的快乐",
          text: "玩世不恭与可靠忠诚之间的反差让人心生喜爱。只是看到他，就能打断坏心情。",
          image: "/attachment-arataki-itto-cutout.webp",
        },
      ] as AttachmentCase[],
    },
    casesB: {
      title: "当联结变得可触可感。",
      lead: "五个案例呈现了依恋如何穿过收集、日常仪式、确认感与生活中的物件。",
      cases: [
        {
          name: "左然",
          game: "未定事件簿",
          mode: "实现型",
          cue: "收集册成为一段关系",
          text: "集齐每一张卡、解锁每一段剧情，让这段关系有了累积感——一部分是回忆，一部分是约会，一部分是日常陪伴。",
          image: "/attachment-artem-wing-cutout.webp",
        },
        {
          name: "讣告人",
          game: "重返未来：1999",
          mode: "实现型",
          cue: "被带进生活的安慰",
          text: "语音重新诠释了悲伤，好感度让亲密变得可见。这段关系通过记忆、媒介和一枚纹身走进了日常生活。",
          image: "/attachment-necrologist-cutout.webp",
        },
        {
          name: "孙策",
          game: "代号鸢",
          mode: "实现型",
          cue: "设计一个共同的家",
          text: "家具、触碰反馈、服装与语音，让玩家得以经营一段关系——想象一个按照他的喜好来设计的家。",
          image: "/attachment-sun-ce.jpg",
          framed: true,
        },
        {
          name: "阿尔托莉雅·潘德拉贡",
          game: "Fate/Grand Order",
          mode: "守望型",
          cue: "有边界的亲密",
          text: "玩家可以称她为伴侣，同时清楚她的忠诚属于主人公。依恋依然亲密，却刻意保持着旁观。",
          image: "/attachment-artoria-pendragon-render.webp",
        },
        {
          name: "Alter",
          game: "Fate/Grand Order",
          mode: "功用 → 陪伴",
          cue: "习惯成为存在",
          text: "她最初因为实用而进入队伍。一次次并肩作战，把功用变成了安心——玩家可以想象，在久别之后她会说一句“欢迎回来”。",
          image: "/attachment-alter-render.webp",
        },
      ] as AttachmentCase[],
    },
    formation: {
      aria: "角色依恋如何形成",
      heading: "吸引只是开始。",
      sub: "研究追踪了一条在角色设计、回应式游玩与日常生活之间循环的路径。",
      stages: [
        {
          title: "吸引",
          kicker: "最初的入口",
          text: "外表与声音可以唤起注意；而个性、经历与成就，更多时候才让角色在社会意义上显得真实。",
        },
        {
          title: "回应",
          kicker: "关系的试金石",
          text: "触碰反馈、语音、资源投入、照片与变化的好感度，让玩家得以寻找证据，确认这段关系是相互的。",
        },
        {
          title: "屏幕之外",
          kicker: "依恋变得可以携带",
          text: "周边、同人媒介、日常仪式与个人选择，把这段关系带进了生活——也会反过来重塑角色在游戏中的感受。",
        },
      ],
      note: "10 次半结构化访谈 · 6 款二次元游戏 · 主题分析",
    },
  },
  genshin: {
    overview: {
      aria: "《原神》跨文化研究概览",
      titleLead: "原神",
      titleAccent: "跨文化之旅",
      lede: "一款中国开放世界 RPG，如何把文化差异转化为共享的意义。",
      strong: "文化通过系统传播，而非孤立的符号。",
      body: "通过文献综述与比较文本分析，追溯四个相互关联的系统：价值观、叙事、视听表达与角色关系。",
      arcAria: "《原神》代表角色",
      characters: {
        zhongli: "钟离",
        yunJin: "云堇",
        huTao: "胡桃",
      },
      note: "阐释性单案例研究 · 不含原创问卷或玩家访谈 · 图像 © HoYoverse",
    },
    shared: {
      aria: "一个不属于任何单一文化的世界",
      heading: "一个不属于任何单一文化的世界。",
      sub: "选择一个地区，看看这个共享世界如何让差异变得可读。",
      altTemplate: "{region}地区角色形象",
      routeAria: "提瓦特各地区",
      regions: [
        {
          name: "蒙德",
          principle: "以抗争守护自由",
          text: "更扁平的城邦秩序，让个人行动嵌入集体叙事之中。",
          image: "/genshin-yun-jin.webp",
        },
        {
          name: "璃月",
          principle: "治理由神交还给人",
          text: "本土的山水、仪式与融合的角色设计，让这场权力交接具有鲜明的文化特殊性。",
          image: "/genshin-zhongli.webp",
        },
        {
          name: "稻妻",
          principle: "因倾听而改写的永恒",
          text: "当封闭让位于对话，个人良知重新进入集体生活。",
          image: "/genshin-kazuha.webp",
        },
        {
          name: "须弥",
          principle: "知识成为权力的问题",
          text: "等级秩序在集体行动、牺牲与对未来的照拂中受到挑战。",
          image: "/genshin-nahida.webp",
        },
      ],
    },
    living: {
      aria: "文化成为可亲历的体验",
      heading: "文化成为可亲历的体验。",
      sub: "胡桃由仪式、关系、声音与游玩共同拼合而成——而不是由一段生平讲完。",
      buttonsAria: "角色证据层次",
      evidence: [
        {
          label: "命之座",
          text: "诗意的命名让成长系统成为角色书写的第二层。",
        },
        {
          label: "仪式",
          text: "丧葬实践通过手势、幽默与日常责任被重新讲述。",
        },
        {
          label: "关系",
          text: "其他角色的反应让她的身份在社会关系中浮现，而非依赖一段自述。",
        },
        {
          label: "传说任务",
          text: "关于爷爷的记忆，把个人的哀伤连接到更开阔的生死观。",
        },
      ],
      strong: "玩家把碎片拼合成情感性的认知。",
    },
  },
  fps: {
    overview: {
      aria: "FPS 游戏时长研究概览",
      kicker: "定量玩家研究",
      heading: "是什么让一次 FPS 游戏持续更久？",
      stats: [
        { value: "97", label: "中国 FPS 玩家" },
        { value: "3", label: "候选驱动因素" },
        { value: "1", label: "有序模型" },
      ],
      modelAria: "有序模型：单次时长的三个候选驱动因素",
      coreTop: "单次",
      coreBottom: "时长",
      drivers: [
        { code: "SI", name: "社交互动", note: "最强驱动因素", className: "driver-si" },
        { code: "EV", name: "体验价值", note: "同样显著", className: "driver-ev" },
        { code: "PU", name: "感知易用性", note: "不显著", className: "driver-pu" },
      ],
      quote: "社交互动是最强的显著因素；体验价值同样重要。",
      cite: "感知易用性不显著。",
    },
    method: {
      aria: "FPS 研究方法",
      heading: "从 115 份回复到 97 个有效样本。",
      sub: "在模型开口之前，每一次剔除都保持可见。",
      stepsAria: "样本处理步骤",
      steps: [
        { value: "115", label: "收集回复", note: "微信便利抽样" },
        { value: "−7", label: "离群值", note: "由 IQR 识别" },
        { value: "−11", label: "无效路径", note: "逻辑检验剔除" },
        { value: "97", label: "有效样本", note: "有序逻辑回归" },
      ],
      note: "5 点量表 · 信度检验 · 有序逻辑回归",
    },
  },
  ai: {
    overview: {
      aria: "AI 与国王学院图书馆研究概览",
      kicker: "混合方法 HCI 研究",
      titleName: "国王学院图书馆",
      lede: "高使用率。有条件的信任。",
      usedAi: "使用过 AI",
      survey: "55 份问卷",
      interviews: "6 次访谈",
      quote: "学生们既想要 AI 的速度，也想要可溯源的检索和人的共情。",
      cite: "设计机会：检索交给 AI，分寸留给人。",
    },
    service: {
      aria: "AI 与人工图书馆服务的机会点",
      heading: "检索交给 AI，分寸留给人。",
      sub: "移动交接点，看看自动化在哪里有帮助——以及哪里更需要人的判断。",
      aiSide: {
        label: "AI 支持",
        strong: "即时、广泛、低成本",
        text: "最适合检索、引导与可重复的问题。",
      },
      humanSide: {
        label: "在线客服",
        strong: "有共情、够及时、贴合情境",
        text: "最适合模糊、情绪化与需要判断的问题。",
      },
      leaning: {
        aiFirst: "AI 优先",
        humanFirst: "人工优先",
        hybrid: "混合交接",
      },
      sliderAria: "AI 与人工服务的交接点",
      anchor: "的受访者提到检索",
      note: "定性服务属性 · 访谈提及，n=6",
    },
  },
};

const copy: Record<Language, typeof en> = { en, zh };

function AttachmentCaseExplorer({
  cases,
  title,
  lead,
  railAria,
  altTemplate,
}: {
  cases: AttachmentCase[];
  title: string;
  lead: string;
  railAria: string;
  altTemplate: string;
}) {
  const [active, setActive] = useState(0);
  const current = cases[active];

  return (
    <section className="attachment-explorer" aria-label={title}>
      <header className="narrative-heading">
        <div>
          <h2>{title}</h2>
          <p>{lead}</p>
        </div>
        <strong>{String(active + 1).padStart(2, "0")} / {String(cases.length).padStart(2, "0")}</strong>
      </header>

      <div className="attachment-explorer-stage">
        <div className="attachment-active-copy" aria-live="polite">
          <span>{current.mode}</span>
          <h3>{current.cue}</h3>
          <p>{current.text}</p>
          <small>{current.name} · {current.game}</small>
        </div>

        <figure className={current.framed ? "is-framed" : undefined}>
          <span className="attachment-portrait-halo" aria-hidden="true" />
          <img src={current.image} alt={fill(altTemplate, { name: current.name, game: current.game })} />
          <figcaption>{current.name}</figcaption>
        </figure>

        <div
          className="attachment-case-rail"
          role="tablist"
          data-gesture-scope="inner-x"
          aria-label={railAria}
        >
          {cases.map((caseStudy, index) => (
            <button
              key={caseStudy.name}
              type="button"
              role="tab"
              aria-selected={index === active}
              onClick={() => setActive(index)}
            >
              <img src={caseStudy.image} alt="" aria-hidden="true" />
              <span>{caseStudy.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function AttachmentFormation({ lang }: { lang: Language }) {
  const c = copy[lang].attachment.formation;
  const [active, setActive] = useState(1);
  const stages = c.stages;

  return (
    <section className="attachment-formation-page" aria-label={c.aria}>
      <header className="narrative-heading">
        <div>
          <h2>{c.heading}</h2>
          <p>{c.sub}</p>
        </div>
      </header>
      <div className="attachment-formation-track">
        <svg viewBox="0 0 1000 250" preserveAspectRatio="none" aria-hidden="true">
          <path d="M35 176 C220 24 396 24 505 138 C618 252 810 232 965 52" />
        </svg>
        {stages.map((stage, index) => (
          <button
            key={stage.title}
            type="button"
            className={index === active ? "is-active" : undefined}
            onClick={() => setActive(index)}
          >
            <span>0{index + 1}</span>
            <strong>{stage.title}</strong>
          </button>
        ))}
        <article aria-live="polite">
          <span>{stages[active].kicker}</span>
          <h3>{stages[active].title}</h3>
          <p>{stages[active].text}</p>
        </article>
      </div>
      <p className="narrative-source-note">{c.note}</p>
    </section>
  );
}

function GenshinOverview({ lang }: { lang: Language }) {
  const c = copy[lang].genshin.overview;
  return (
    <section className="genshin-overview" aria-label={c.aria}>
      <header>
        <h2>{c.titleLead} <span>{c.titleAccent}</span></h2>
        <p>{c.lede}</p>
      </header>
      <div className="genshin-overview-copy">
        <strong>{c.strong}</strong>
        <p>
          {c.body}
        </p>
      </div>
      <div className="genshin-character-arc" aria-label={c.arcAria}>
        <figure className="genshin-arc-zhongli"><img src="/genshin-zhongli.webp" alt={c.characters.zhongli} /><figcaption>{c.characters.zhongli}</figcaption></figure>
        <figure className="genshin-arc-yunjin"><img src="/genshin-yun-jin.webp" alt={c.characters.yunJin} /><figcaption>{c.characters.yunJin}</figcaption></figure>
        <figure className="genshin-arc-hutao"><img src="/genshin-hu-tao.webp" alt={c.characters.huTao} /><figcaption>{c.characters.huTao}</figcaption></figure>
      </div>
      <p className="narrative-source-note">{c.note}</p>
    </section>
  );
}

function GenshinSharedWorld({ lang }: { lang: Language }) {
  const c = copy[lang].genshin.shared;
  const [active, setActive] = useState(1);
  const region = c.regions[active];

  return (
    <section className="genshin-world-page" aria-label={c.aria}>
      <header className="narrative-heading">
        <div>
          <h2>{c.heading}</h2>
          <p>{c.sub}</p>
        </div>
      </header>
      <div className="genshin-region-stage">
        <figure>
          <span aria-hidden="true" />
          <img src={region.image} alt={fill(c.altTemplate, { region: region.name })} />
        </figure>
        <article aria-live="polite">
          <span>{region.name}</span>
          <h3>{region.principle}</h3>
          <p>{region.text}</p>
        </article>
        <div className="genshin-region-route" role="tablist" aria-label={c.routeAria}>
          {c.regions.map((item, index) => (
            <button
              key={item.name}
              type="button"
              role="tab"
              aria-selected={index === active}
              onClick={() => setActive(index)}
            >
              <i aria-hidden="true" />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function GenshinLivingCulture({ lang }: { lang: Language }) {
  const c = copy[lang].genshin.living;
  const [active, setActive] = useState(0);

  return (
    <section className="genshin-living-page" aria-label={c.aria}>
      <header className="narrative-heading">
        <div>
          <h2>{c.heading}</h2>
          <p>{c.sub}</p>
        </div>
      </header>
      <div className="hu-tao-network">
        <figure><img src="/genshin-hu-tao.webp" alt={copy[lang].genshin.overview.characters.huTao} /></figure>
        <svg viewBox="0 0 800 500" preserveAspectRatio="none" aria-hidden="true">
          <path d="M360 248 C470 104 548 84 688 104" />
          <path d="M374 250 C532 210 612 224 738 244" />
          <path d="M366 272 C496 360 570 400 700 388" />
          <path d="M336 272 C264 380 220 416 126 396" />
        </svg>
        <div className="hu-tao-evidence-buttons" role="tablist" aria-label={c.buttonsAria}>
          {c.evidence.map((item, index) => (
            <button
              key={item.label}
              type="button"
              role="tab"
              aria-selected={index === active}
              onClick={() => setActive(index)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <article aria-live="polite">
          <span>{c.evidence[active].label}</span>
          <p>{c.evidence[active].text}</p>
          <strong>{c.strong}</strong>
        </article>
      </div>
    </section>
  );
}

function FpsOverview({ lang }: { lang: Language }) {
  const c = copy[lang].fps.overview;
  return (
    <section className="fps-narrative-overview" aria-label={c.aria}>
      <header>
        <span>{c.kicker}</span>
        <h2>{c.heading}</h2>
        <ul className="fps-stats">
          {c.stats.map((stat) => (
            <li key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></li>
          ))}
        </ul>
      </header>
      <div className="fps-model" role="img" aria-label={c.modelAria}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <line className="line-si" x1="50" y1="50" x2="50" y2="12" />
          <line className="line-ev" x1="50" y1="50" x2="12" y2="80" />
          <line className="line-pu" x1="50" y1="50" x2="88" y2="80" />
        </svg>
        <div className="fps-model-core"><strong>{c.coreTop}</strong><span>{c.coreBottom}</span></div>
        {c.drivers.map((driver) => (
          <div key={driver.code} className={`fps-driver ${driver.className}`}>
            <span>{driver.code}</span>
            <strong>{driver.name}</strong>
            <em>{driver.note}</em>
          </div>
        ))}
      </div>
      <blockquote>
        {c.quote}
        <cite>{c.cite}</cite>
      </blockquote>
    </section>
  );
}

function FpsMethod({ lang }: { lang: Language }) {
  const c = copy[lang].fps.method;
  const [active, setActive] = useState(3);
  const steps = c.steps;

  return (
    <section className="fps-method-page" aria-label={c.aria}>
      <header className="narrative-heading">
        <div>
          <h2>{c.heading}</h2>
          <p>{c.sub}</p>
        </div>
      </header>
      <div className="fps-sample-track">
        <div className="fps-particles" aria-hidden="true">
          {Array.from({ length: 38 }, (_, index) => <i key={index} />)}
        </div>
        <div className="fps-method-steps" role="tablist" aria-label={c.stepsAria}>
          {steps.map((step, index) => (
            <button
              key={step.label}
              type="button"
              role="tab"
              aria-selected={index === active}
              onClick={() => setActive(index)}
            >
              <strong>{step.value}</strong>
              <span>{step.label}</span>
            </button>
          ))}
        </div>
        <article aria-live="polite">
          <strong>{steps[active].value}</strong>
          <p>{steps[active].label}</p>
          <span>{steps[active].note}</span>
        </article>
      </div>
      <p className="narrative-source-note">{c.note}</p>
    </section>
  );
}

function AiOverview({ lang }: { lang: Language }) {
  const c = copy[lang].ai.overview;
  return (
    <section className="ai-narrative-overview" aria-label={c.aria}>
      <header>
        <span>{c.kicker}</span>
        <h2>AI <i>×</i> {c.titleName}</h2>
        <p>{c.lede}</p>
      </header>
      <div className="ai-adoption-signal">
        <div><strong>98.2%</strong><span>{c.usedAi}</span></div>
        <svg viewBox="0 0 500 160" preserveAspectRatio="none" aria-hidden="true">
          <path d="M8 93 C66 92 76 42 132 42 C192 42 202 120 260 120 C326 120 350 52 402 52 C448 52 458 92 492 92" />
        </svg>
        <p>{c.survey} <i>·</i> {c.interviews}</p>
      </div>
      <blockquote>
        {c.quote}
        <cite>{c.cite}</cite>
      </blockquote>
    </section>
  );
}

function AiServiceOpportunity({ lang }: { lang: Language }) {
  const c = copy[lang].ai.service;
  const [value, setValue] = useState(50);
  const leaning = useMemo(() => {
    if (value < 34) return c.leaning.aiFirst;
    if (value > 66) return c.leaning.humanFirst;
    return c.leaning.hybrid;
  }, [value, c]);

  return (
    <section className="ai-service-page" aria-label={c.aria}>
      <header className="narrative-heading">
        <div>
          <h2>{c.heading}</h2>
          <p>{c.sub}</p>
        </div>
      </header>
      <div className="ai-service-stage" style={{ "--handoff": `${value}%` } as CSSProperties}>
        <div className="ai-service-side ai-service-ai">
          <span>{c.aiSide.label}</span>
          <strong>{c.aiSide.strong}</strong>
          <p>{c.aiSide.text}</p>
        </div>
        <div className="ai-service-side ai-service-human">
          <span>{c.humanSide.label}</span>
          <strong>{c.humanSide.strong}</strong>
          <p>{c.humanSide.text}</p>
        </div>
        <label>
          <span>{leaning}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
            aria-label={c.sliderAria}
          />
        </label>
        <div className="ai-retrieval-anchor"><strong>5/6</strong><span>{c.anchor}</span></div>
      </div>
      <p className="narrative-source-note">{c.note}</p>
    </section>
  );
}

export default function ProjectNarratives({ kind, slideId, lang = "en" }: ProjectNarrativesProps) {
  if (kind === "character") {
    const c = copy[lang].attachment;
    if (slideId === "relationships-a") {
      return (
        <AttachmentCaseExplorer
          cases={c.casesA.cases}
          title={c.casesA.title}
          lead={c.casesA.lead}
          railAria={c.railAria}
          altTemplate={c.altTemplate}
        />
      );
    }
    if (slideId === "relationships-b") {
      return (
        <AttachmentCaseExplorer
          cases={c.casesB.cases}
          title={c.casesB.title}
          lead={c.casesB.lead}
          railAria={c.railAria}
          altTemplate={c.altTemplate}
        />
      );
    }
    if (slideId === "formation") return <AttachmentFormation lang={lang} />;
  }

  if (kind === "genshin") {
    if (slideId === "overview") return <GenshinOverview lang={lang} />;
    if (slideId === "shared-world") return <GenshinSharedWorld lang={lang} />;
    if (slideId === "living-culture") return <GenshinLivingCulture lang={lang} />;
  }

  if (kind === "fps") {
    if (slideId === "overview") return <FpsOverview lang={lang} />;
    if (slideId === "method") return <FpsMethod lang={lang} />;
  }

  if (kind === "ai") {
    if (slideId === "overview") return <AiOverview lang={lang} />;
    if (slideId === "service") return <AiServiceOpportunity lang={lang} />;
  }

  return null;
}
