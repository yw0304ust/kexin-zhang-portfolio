"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode, type WheelEvent } from "react";

type ResearchKind = "character" | "genshin" | "fps" | "ai";

type ResearchVisualsProps = {
  kind: ResearchKind;
  view?: string;
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

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="research-metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function VizLane({ children, className = "" }: { children: ReactNode; className?: string }) {
  const l = en.lane;
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

function CharacterResearch() {
  const c = en.character;
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

      <VizLane className="character-viz-grid">
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

function FpsResearch() {
  const c = en.fpsResearch;
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

      <VizLane>
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

function AiResearch() {
  const c = en.aiResearch;
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

      <VizLane className="ai-viz-grid">
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

function FpsSessionsEvidence() {
  const c = en.fpsSessions;
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

function FpsDriversEvidence() {
  const c = en.fpsDrivers;
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

function AiAdoptionEvidence() {
  const c = en.aiAdoption;
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

function AiTrustEvidence() {
  const c = en.aiTrust;
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

const orreryRingFor = [0, 0, 1, 1, 2, 2];
const orreryAngles = [15, 195, 75, 255, 135, 315];

function GenshinCulturalOrrery() {
  const c = en.genshin;
  const [active, setActive] = useState(0);
  const dimension = c.dimensions[active];
  return (
    <section className="single-evidence-page genshin-orrery-page" aria-label={c.aria}>
      <header className="single-evidence-heading">
        <div>
          <h3>{c.heading}</h3>
          <p>{c.sub}</p>
        </div>
      </header>
      <div className="cultural-orrery">
        <svg viewBox="0 0 760 520" aria-hidden="true">
          <ellipse cx="380" cy="260" rx="292" ry="190" />
          <ellipse cx="380" cy="260" rx="218" ry="142" />
          <ellipse cx="380" cy="260" rx="132" ry="88" />
        </svg>
        <div className="orrery-core"><strong>{dimension.focus}</strong><span>{c.coreLabel}</span></div>
        <div className="orrery-dimensions" role="tablist" aria-label={c.dimensionsAria}>
          {[0, 1, 2].map((ring) => (
            <div className="orrery-ring" data-ring={ring} key={ring}>
              <div className="orbit-spin">
                {c.dimensions.map((item, index) =>
                  orreryRingFor[index] === ring ? (
                    <div className="orbit-seat" key={item.label} style={{ "--angle": `${orreryAngles[index]}deg` } as CSSProperties}>
                      <div className="orbit-rev">
                        <div className="orbit-unangle" style={{ "--angle": `${orreryAngles[index]}deg` } as CSSProperties}>
                          <button type="button" role="tab" aria-selected={index === active} onClick={() => setActive(index)}><i />{item.label}</button>
                        </div>
                      </div>
                    </div>
                  ) : null,
                )}
              </div>
            </div>
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

export default function ResearchVisuals({ kind, view }: ResearchVisualsProps) {
  if (kind === "character") return <CharacterResearch />;
  if (kind === "genshin") return <GenshinCulturalOrrery />;
  if (kind === "fps") return view === "drivers" ? <FpsDriversEvidence /> : <FpsSessionsEvidence />;
  if (kind === "ai") return view === "trust" ? <AiTrustEvidence /> : <AiAdoptionEvidence />;
  const exhaustive: never = kind;
  return exhaustive;
}
