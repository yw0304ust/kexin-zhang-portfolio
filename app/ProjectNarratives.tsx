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

const attachmentCasesA: AttachmentCase[] = [
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
];

const attachmentCasesB: AttachmentCase[] = [
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
];

function AttachmentCaseExplorer({
  cases,
  title,
  lead,
}: {
  cases: AttachmentCase[];
  title: string;
  lead: string;
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
          <img src={current.image} alt={`${current.name} from ${current.game}`} />
          <figcaption>{current.name}</figcaption>
        </figure>

        <div
          className="attachment-case-rail"
          role="tablist"
          data-gesture-scope="inner-x"
          aria-label="Choose a character case"
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
  const [active, setActive] = useState(1);
  const stages = [
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
  ];

  return (
    <section className="attachment-formation-page" aria-label="How character attachment forms">
      <header className="narrative-heading">
        <div>
          <h2>Attraction is only the opening.</h2>
          <p>The study follows a loop between character design, responsive play, and everyday life.</p>
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
      <p className="narrative-source-note">10 semi-structured interviews · 6 Nijigen games · thematic analysis</p>
    </section>
  );
}

const genshinRegions = [
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
];

function GenshinOverview() {
  return (
    <section className="genshin-overview" aria-label="Genshin Across Cultures overview">
      <header>
        <h2>Genshin <span>Across Cultures</span></h2>
        <p>How a Chinese open-world RPG turns cultural difference into shared meaning.</p>
      </header>
      <div className="genshin-overview-copy">
        <strong>Culture travels through systems, not isolated symbols.</strong>
        <p>
          Literature review and comparative textual analysis trace four connected systems:
          values, narrative, audiovisual expression, and character relationships.
        </p>
      </div>
      <div className="genshin-character-arc" aria-label="Featured Genshin Impact characters">
        <figure className="genshin-arc-zhongli"><img src="/genshin-zhongli.webp" alt="Zhongli" /><figcaption>Zhongli</figcaption></figure>
        <figure className="genshin-arc-yunjin"><img src="/genshin-yun-jin.webp" alt="Yun Jin" /><figcaption>Yun Jin</figcaption></figure>
        <figure className="genshin-arc-hutao"><img src="/genshin-hu-tao.webp" alt="Hu Tao" /><figcaption>Hu Tao</figcaption></figure>
      </div>
      <p className="narrative-source-note">Interpretive single-case study · no original survey or player interviews · imagery © HoYoverse</p>
    </section>
  );
}

function GenshinSharedWorld() {
  const [active, setActive] = useState(1);
  const region = genshinRegions[active];

  return (
    <section className="genshin-world-page" aria-label="A world no single culture owns">
      <header className="narrative-heading">
        <div>
          <h2>A world no single culture owns.</h2>
          <p>Choose a region to follow how a shared world makes difference readable.</p>
        </div>
      </header>
      <div className="genshin-region-stage">
        <figure>
          <span aria-hidden="true" />
          <img src={region.image} alt={`${region.name} character example`} />
        </figure>
        <article aria-live="polite">
          <span>{region.name}</span>
          <h3>{region.principle}</h3>
          <p>{region.text}</p>
        </article>
        <div className="genshin-region-route" role="tablist" aria-label="Teyvat regions">
          {genshinRegions.map((item, index) => (
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

const huTaoEvidence = [
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
];

function GenshinLivingCulture() {
  const [active, setActive] = useState(0);

  return (
    <section className="genshin-living-page" aria-label="Culture becomes lived experience">
      <header className="narrative-heading">
        <div>
          <h2>Culture becomes lived experience.</h2>
          <p>Hu Tao is assembled across ritual, relationships, voice, and play—not explained in one biography.</p>
        </div>
      </header>
      <div className="hu-tao-network">
        <figure><img src="/genshin-hu-tao.webp" alt="Hu Tao" /></figure>
        <svg viewBox="0 0 800 500" preserveAspectRatio="none" aria-hidden="true">
          <path d="M360 248 C470 104 548 84 688 104" />
          <path d="M374 250 C532 210 612 224 738 244" />
          <path d="M366 272 C496 360 570 400 700 388" />
          <path d="M336 272 C264 380 220 416 126 396" />
        </svg>
        <div className="hu-tao-evidence-buttons" role="tablist" aria-label="Character evidence layers">
          {huTaoEvidence.map((item, index) => (
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
          <span>{huTaoEvidence[active].label}</span>
          <p>{huTaoEvidence[active].text}</p>
          <strong>Players assemble fragments into emotional knowledge.</strong>
        </article>
      </div>
    </section>
  );
}

function FpsOverview() {
  return (
    <section className="fps-narrative-overview" aria-label="FPS Playtime Study overview">
      <header>
        <span>Quantitative player research</span>
        <h2>What keeps an FPS session going?</h2>
        <p>97 Chinese FPS players. Three proposed drivers. One ordinal model.</p>
      </header>
      <div className="fps-crosshair" aria-label="Three proposed drivers around session duration">
        <div className="fps-crosshair-ring"><strong>Session</strong><span>duration</span></div>
        <div className="fps-driver driver-ev"><span>EV</span><strong>Experience value</strong></div>
        <div className="fps-driver driver-pu"><span>PU</span><strong>Perceived usability</strong></div>
        <div className="fps-driver driver-si"><span>SI</span><strong>Social interaction</strong></div>
      </div>
      <blockquote>
        Social interaction emerged as the strongest significant factor; experience value also mattered.
        <cite>Perceived usability was not significant.</cite>
      </blockquote>
    </section>
  );
}

function FpsMethod() {
  const [active, setActive] = useState(3);
  const steps = [
    { value: "115", label: "responses collected", note: "WeChat convenience sample" },
    { value: "−7", label: "outliers", note: "identified by IQR" },
    { value: "−11", label: "invalid paths", note: "logic-check exclusions" },
    { value: "97", label: "valid cases", note: "ordinal logistic regression" },
  ];

  return (
    <section className="fps-method-page" aria-label="FPS study method">
      <header className="narrative-heading">
        <div>
          <h2>From 115 responses to 97 valid cases.</h2>
          <p>Every exclusion stays visible before the model is allowed to speak.</p>
        </div>
      </header>
      <div className="fps-sample-track">
        <div className="fps-particles" aria-hidden="true">
          {Array.from({ length: 38 }, (_, index) => <i key={index} />)}
        </div>
        <div className="fps-method-steps" role="tablist" aria-label="Sample processing steps">
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
      <p className="narrative-source-note">5-point measures · reliability audit · ordinal logistic regression</p>
    </section>
  );
}

function AiOverview() {
  return (
    <section className="ai-narrative-overview" aria-label="AI and King's Library overview">
      <header>
        <span>Mixed-method HCI study</span>
        <h2>AI <i>×</i> King’s Library</h2>
        <p>High adoption. Conditional trust.</p>
      </header>
      <div className="ai-adoption-signal">
        <div><strong>98.2%</strong><span>had used AI</span></div>
        <svg viewBox="0 0 500 160" preserveAspectRatio="none" aria-hidden="true">
          <path d="M8 93 C66 92 76 42 132 42 C192 42 202 120 260 120 C326 120 350 52 402 52 C448 52 458 92 492 92" />
        </svg>
        <p>55 survey responses <i>·</i> 6 interviews</p>
      </div>
      <blockquote>
        Students wanted AI speed with search traceability and human empathy.
        <cite>Design opportunity: AI for retrieval. People for nuance.</cite>
      </blockquote>
    </section>
  );
}

function AiServiceOpportunity() {
  const [value, setValue] = useState(50);
  const leaning = useMemo(() => {
    if (value < 34) return "AI-first";
    if (value > 66) return "Human-first";
    return "Hybrid handoff";
  }, [value]);

  return (
    <section className="ai-service-page" aria-label="AI and human library service opportunity">
      <header className="narrative-heading">
        <div>
          <h2>AI for retrieval. People for nuance.</h2>
          <p>Move the handoff point to explore where automation helps—and where human judgement matters.</p>
        </div>
      </header>
      <div className="ai-service-stage" style={{ "--handoff": `${value}%` } as CSSProperties}>
        <div className="ai-service-side ai-service-ai">
          <span>AI support</span>
          <strong>Instant, broad, low-cost</strong>
          <p>Best suited to retrieval, orientation, and repeatable questions.</p>
        </div>
        <div className="ai-service-side ai-service-human">
          <span>Live Chat</span>
          <strong>Empathetic, current, contextual</strong>
          <p>Best suited to ambiguity, emotion, and questions that need judgement.</p>
        </div>
        <label>
          <span>{leaning}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
            aria-label="AI to human service handoff"
          />
        </label>
        <div className="ai-retrieval-anchor"><strong>5/6</strong><span>interviewees mentioned retrieval</span></div>
      </div>
      <p className="narrative-source-note">Qualitative service attributes · interview mentions, n=6</p>
    </section>
  );
}

export default function ProjectNarratives({ kind, slideId }: ProjectNarrativesProps) {
  if (kind === "character") {
    if (slideId === "relationships-a") {
      return (
        <AttachmentCaseExplorer
          cases={attachmentCasesA}
          title="When care follows a character’s life."
          lead="Five cases show attachment as resonance, observation, and the freedom to let a character grow."
        />
      );
    }
    if (slideId === "relationships-b") {
      return (
        <AttachmentCaseExplorer
          cases={attachmentCasesB}
          title="When a bond becomes tangible."
          lead="Five cases show attachment moving through archives, routines, reassurance, and objects in everyday life."
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
