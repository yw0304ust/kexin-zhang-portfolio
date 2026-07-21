"use client";

import { useMemo, useState, type CSSProperties } from "react";

export type NarrativeKind = "character" | "genshin" | "fps" | "ai";

type ProjectNarrativesProps = {
  kind: NarrativeKind;
  slideId: string;
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
      gamesAria: "Representative FPS titles",
      gamesNote: "Key art © Valve · Riot Games · EA · TiMi Studio Group",
      games: [
        { name: "Delta Force", image: "/fps-delta-force.webp", tone: "delta" },
        { name: "Counter-Strike 2", image: "/fps-cs2.webp", tone: "cs2" },
        { name: "VALORANT", image: "/fps-valorant.webp", tone: "valorant" },
        { name: "Apex Legends", image: "/fps-apex.webp", tone: "apex" },
      ],
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

function AttachmentFormation() {
  const c = en.attachment.formation;
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

function GenshinOverview() {
  const c = en.genshin.overview;
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

function GenshinSharedWorld() {
  const c = en.genshin.shared;
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

function GenshinLivingCulture() {
  const c = en.genshin.living;
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
        <figure><img src="/genshin-hu-tao.webp" alt={en.genshin.overview.characters.huTao} /></figure>
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

function FpsOverview() {
  const c = en.fps.overview;
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
      <div className="fps-side">
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
        <div className="fps-games" aria-label={c.gamesAria}>
          <div className="fps-games-rail">
            {c.games.map((game) => (
              <figure key={game.name} className={`fps-game fps-game-${game.tone}`}>
                <img src={game.image} alt={game.name} loading="lazy" decoding="async" />
                <figcaption>{game.name}</figcaption>
              </figure>
            ))}
          </div>
          <p className="fps-games-note">{c.gamesNote}</p>
        </div>
      </div>
      <blockquote>
        {c.quote}
        <cite>{c.cite}</cite>
      </blockquote>
    </section>
  );
}

function FpsMethod() {
  const c = en.fps.method;
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

function AiOverview() {
  const c = en.ai.overview;
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

function AiServiceOpportunity() {
  const c = en.ai.service;
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

export default function ProjectNarratives({ kind, slideId }: ProjectNarrativesProps) {
  if (kind === "character") {
    const c = en.attachment;
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
    if (slideId === "formation") return <AttachmentFormation />;
  }

  if (kind === "genshin") {
    if (slideId === "overview") return <GenshinOverview />;
    if (slideId === "shared-world") return <GenshinSharedWorld />;
    if (slideId === "living-culture") return <GenshinLivingCulture />;
  }

  if (kind === "fps") {
    if (slideId === "overview") return <FpsOverview />;
    if (slideId === "method") return <FpsMethod />;
  }

  if (kind === "ai") {
    if (slideId === "overview") return <AiOverview />;
    if (slideId === "service") return <AiServiceOpportunity />;
  }

  return null;
}
