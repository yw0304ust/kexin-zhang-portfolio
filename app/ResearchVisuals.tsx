"use client";

import { useRef, type KeyboardEvent, type ReactNode, type WheelEvent } from "react";

type ResearchKind = "character" | "fps" | "ai";

type ResearchVisualsProps = {
  kind: ResearchKind;
};

const sessionDurations = [
  { label: "<1h", count: 7, width: "22.6%" },
  { label: "1–2h", count: 31, width: "100%" },
  { label: "2–3h", count: 29, width: "93.5%" },
  { label: "3–4h", count: 18, width: "58.1%" },
  { label: ">4h", count: 12, width: "38.7%" },
] as const;

const forestRows = [
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
] as const;

const reliabilityRows = [
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
] as const;

const themeMentions = [
  { label: "Gacha motivation", value: 10, width: "100%" },
  { label: "Character personality", value: 8, width: "80%" },
  { label: "Merchandise", value: 8, width: "80%" },
  { label: "Functional strength", value: 2, width: "20%" },
] as const;

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="research-metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function VizLane({ children, className = "" }: { children: ReactNode; className?: string }) {
  const laneRef = useRef<HTMLDivElement>(null);

  const move = (direction: -1 | 1) => {
    const lane = laneRef.current;
    if (!lane) return;
    lane.scrollBy({ left: lane.clientWidth * 0.82 * direction, behavior: "smooth" });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
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
        onKeyDown={handleKeyDown}
        onWheel={handleWheel}
        aria-label="Scrollable evidence charts. Use the arrow keys or controls to explore."
      >
        {children}
      </div>
      <div className="research-lane-controls">
        <span>Explore evidence</span>
        <button type="button" onClick={() => move(-1)} aria-label="Previous evidence chart">←</button>
        <button type="button" onClick={() => move(1)} aria-label="Next evidence chart">→</button>
      </div>
    </div>
  );
}

function CharacterResearch() {
  return (
    <section className="research-evidence evidence-character" aria-label="Character attachment research evidence">
      <div className="research-section-heading">
        <span>Evidence map</span>
        <h3>How a character begins to feel alive.</h3>
        <p>Interview themes translated into a player–character relationship framework.</p>
      </div>

      <div className="research-metrics" aria-label="Study overview">
        <Metric value="10" label="dedicated players" />
        <Metric value="6" label="Nijigen games" />
        <Metric value="10–15h" label="interview material" />
        <Metric value="3" label="attachment modes" />
      </div>

      <VizLane className="character-viz-grid">
        <figure
          className="research-viz research-viz-wide attachment-figure"
          role="img"
          aria-label="Three overlapping attachment modes: symbiotic, observance and actualisation, sharing mutual care and interaction"
        >
          <div className="viz-kicker">
            <span>Relationship model</span>
            <strong>Three modes, one shared centre</strong>
          </div>
          <div className="attachment-diagram" aria-hidden="true">
            <div className="attachment-circle attachment-symbiotic">
              <strong>Symbiotic</strong>
              <span>co-growth</span>
            </div>
            <div className="attachment-circle attachment-observance">
              <strong>Observance</strong>
              <span>witnessing</span>
            </div>
            <div className="attachment-circle attachment-actualisation">
              <strong>Actualisation</strong>
              <span>“we” in daily life</span>
            </div>
            <div className="attachment-centre">
              <span>mutual care</span>
              <strong>↔</strong>
              <span>interaction</span>
            </div>
          </div>
          <figcaption>The modes overlap; they are not fixed player types.</figcaption>
        </figure>

        <figure
          className="research-viz mention-figure"
          role="img"
          aria-label="Theme mentions among ten interviewees: gacha ten, character personality eight, merchandise eight, functional strength two"
        >
          <div className="viz-kicker">
            <span>Theme mentions</span>
            <strong>Emotion outweighed utility</strong>
          </div>
          <div className="mention-plot" aria-hidden="true">
            {themeMentions.map((item) => (
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
          <figcaption>Counts are interview mentions, not population estimates.</figcaption>
        </figure>

        <figure
          className="research-viz formation-figure"
          role="img"
          aria-label="Character attraction leads to attachment, strengthened by interaction mechanics and real-world factors"
        >
          <div className="viz-kicker">
            <span>Formation path</span>
            <strong>Attachment is designed across worlds</strong>
          </div>
          <div className="formation-map" aria-hidden="true">
            <div className="formation-node node-attraction">
              <span>01</span>
              <strong>Attraction</strong>
              <small>personality · story · form</small>
            </div>
            <span className="formation-arrow">→</span>
            <div className="formation-node node-attachment">
              <span>02</span>
              <strong>Attachment</strong>
              <small>character as social other</small>
            </div>
            <div className="formation-support support-game">
              <strong>Game</strong>
              <span>feedback · resources · photos</span>
            </div>
            <div className="formation-support support-life">
              <strong>Life</strong>
              <span>merch · media · daily choices</span>
            </div>
          </div>
          <figcaption>Responsive feedback can strengthen—or weaken—the bond.</figcaption>
        </figure>
        <aside className="research-viz cultural-thread" aria-labelledby="cultural-thread-title">
        <div className="cultural-thread-copy">
          <span>Earlier research thread · 2023</span>
          <h3 id="cultural-thread-title">Genshin Impact across cultures</h3>
          <p>
            A text-based case study of how shared values, cultural specificity and distribution strategy can reduce cultural discount.
          </p>
        </div>
        <div
          className="culture-lens"
          role="img"
          aria-label="Six-part qualitative lens: flatter power distance, individual and collective values, flexible gender roles, lower uncertainty avoidance, long-term orientation, and indulgence with restraint"
        >
          <div><span>01</span><strong>Flatter power</strong></div>
          <div><span>02</span><strong>Self + collective</strong></div>
          <div><span>03</span><strong>Flexible roles</strong></div>
          <div><span>04</span><strong>Embrace uncertainty</strong></div>
          <div><span>05</span><strong>Long-term arc</strong></div>
          <div><span>06</span><strong>Freedom + restraint</strong></div>
        </div>
        <p className="culture-lens-note">Qualitative analytical lens — not a score.</p>
        </aside>
      </VizLane>
    </section>
  );
}

function FpsResearch() {
  return (
    <section className="research-evidence evidence-fps" aria-label="FPS playtime study evidence">
      <div className="research-section-heading">
        <span>Evidence map</span>
        <h3>Shared play mattered most.</h3>
        <p>Social interaction showed the strongest association with longer session categories.</p>
      </div>

      <div className="research-metrics" aria-label="Study overview">
        <Metric value="115" label="responses collected" />
        <Metric value="97" label="valid responses" />
        <Metric value="84.3%" label="sample retained" />
        <Metric value="p<.001" label="overall model" />
      </div>

      <VizLane>
        <figure
          className="research-viz research-viz-wide sample-flow-figure"
          role="img"
          aria-label="Sample flow: 115 responses collected, seven outliers treated as missing, eleven invalid responses excluded, 97 retained"
        >
          <div className="viz-kicker">
            <span>Sample pipeline</span>
            <strong>From collection to analysis</strong>
          </div>
          <div className="sample-flow" aria-hidden="true">
            <div className="flow-stage flow-start"><strong>115</strong><span>collected</span></div>
            <div className="flow-loss"><strong>−7</strong><span>outliers</span></div>
            <div className="flow-loss"><strong>−11</strong><span>invalid</span></div>
            <div className="flow-stage flow-end"><strong>97</strong><span>retained</span></div>
          </div>
          <figcaption>Outliers were treated as missing; invalid logic paths were excluded.</figcaption>
        </figure>

        <figure
          className="research-viz session-figure"
          role="img"
          aria-label="Single-session duration among 97 players: under one hour 7, one to two hours 31, two to three hours 29, three to four hours 18, over four hours 12"
        >
          <div className="viz-kicker">
            <span>Session distribution</span>
            <strong>61.9% played 1–3 hours</strong>
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
          <figcaption>Percentages recalculated from source frequencies, n=97.</figcaption>
        </figure>

        <figure
          className="research-viz forest-figure"
          role="img"
          aria-label="Odds ratios and 95 percent confidence intervals: experience value 1.13 from 1.00 to 1.26, perceived usability 1.18 from 0.89 to 1.56, social interaction 1.23 from 1.04 to 1.45"
        >
          <div className="viz-kicker">
            <span>Ordinal regression</span>
            <strong>Odds of a longer category</strong>
          </div>
          <div className="forest-axis" aria-hidden="true">
            <div className="forest-reference" />
            {forestRows.map((row) => (
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
          <figcaption>PU crosses the OR=1 reference; EV and SI were significant.</figcaption>
        </figure>

        <figure
          className="research-viz reliability-figure"
          role="img"
          aria-label="Reliability before and after item removal: experience value point five zero to point five six, perceived usability point six nine to point seven seven, social interaction point four nine to point eight one"
        >
          <div className="viz-kicker">
            <span>Scale audit</span>
            <strong>Reliability before → after</strong>
          </div>
          <div className="reliability-plot" aria-hidden="true">
            <div className="reliability-threshold"><span>α .70</span></div>
            {reliabilityRows.map((row) => (
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
          <figcaption>EV remained weak after item removal, so the limitation stays visible.</figcaption>
        </figure>
      </VizLane>
      <p className="research-data-note">
        Associations, not causation. An OR of 1.23 describes odds of entering a longer category—not 23% more playtime.
      </p>
    </section>
  );
}

function AiResearch() {
  return (
    <section className="research-evidence evidence-ai" aria-label="Student AI use study evidence">
      <div className="research-section-heading">
        <span>Evidence map</span>
        <h3>High adoption. Conditional trust.</h3>
        <p>Students wanted AI speed with search traceability and human empathy.</p>
      </div>

      <div className="research-metrics" aria-label="Study overview">
        <Metric value="55" label="survey responses" />
        <Metric value="6" label="interviews completed" />
        <Metric value="98.2%" label="had used AI" />
        <Metric value="77.8%" label="wanted official guidance" />
      </div>

      <VizLane className="ai-viz-grid">
        <figure
          className="research-viz adoption-figure"
          role="img"
          aria-label="AI adoption was 98.2 percent. Among 54 AI users, 40.7 percent used it daily, 55.6 percent weekly, and 3.7 percent monthly"
        >
          <div className="viz-kicker">
            <span>Adoption pulse</span>
            <strong>AI was already routine</strong>
          </div>
          <div className="adoption-layout" aria-hidden="true">
            <div className="adoption-ring"><strong>98.2%</strong><span>used AI</span></div>
            <div className="frequency-stack">
              <div><span>Daily</span><strong>40.7%</strong><i style={{ width: "40.7%" }} /></div>
              <div><span>Weekly</span><strong>55.6%</strong><i style={{ width: "55.6%" }} /></div>
              <div><span>Monthly</span><strong>3.7%</strong><i style={{ width: "3.7%" }} /></div>
            </div>
          </div>
          <figcaption>Frequency uses the 54 respondents who had used AI.</figcaption>
        </figure>

        <figure
          className="research-viz purpose-figure"
          role="img"
          aria-label="Share of selected AI functions: text and writing 36.2 percent, translation 30.5 percent, efficiency tools 11.3 percent, drawing and design 11.3 percent, social assistance 10.6 percent"
        >
          <div className="viz-kicker">
            <span>Purpose constellation</span>
            <strong>Writing + translation led</strong>
          </div>
          <div className="purpose-constellation" aria-hidden="true">
            <div className="purpose-bubble bubble-writing"><strong>36.2%</strong><span>Writing</span></div>
            <div className="purpose-bubble bubble-translate"><strong>30.5%</strong><span>Translate</span></div>
            <div className="purpose-bubble bubble-efficiency"><strong>11.3%</strong><span>Efficiency</span></div>
            <div className="purpose-bubble bubble-design"><strong>11.3%</strong><span>Design</span></div>
            <div className="purpose-bubble bubble-social"><strong>10.6%</strong><span>Social</span></div>
          </div>
          <figcaption>Share of selected functions, not share of students.</figcaption>
        </figure>

        <figure
          className="research-viz research-viz-wide tension-figure"
          role="img"
          aria-label="Trust and privacy tension: 83.3 percent somewhat trust AI; 81.5 percent had some or high concern about data breaches; 98.1 percent would share personal data only with reservations or not at all"
        >
          <div className="viz-kicker">
            <span>Trust–privacy tension</span>
            <strong>Usage did not remove caution</strong>
          </div>
          <div className="tension-plot" aria-hidden="true">
            <div className="tension-row">
              <div><strong>Trust</strong><span>n=54</span></div>
              <div className="tension-bar trust-bar">
                <i style={{ flexBasis: "13%" }}><span>13.0</span></i>
                <i style={{ flexBasis: "83.3%" }}><span>83.3 somewhat</span></i>
                <i style={{ flexBasis: "3.7%" }}><span>3.7</span></i>
              </div>
            </div>
            <div className="tension-row">
              <div><strong>Data breach concern</strong><span>n=54</span></div>
              <div className="tension-bar concern-bar">
                <i style={{ flexBasis: "18.5%" }}><span>18.5 none</span></i>
                <i style={{ flexBasis: "63%" }}><span>63.0 some</span></i>
                <i style={{ flexBasis: "18.5%" }}><span>18.5 high</span></i>
              </div>
            </div>
            <div className="tension-row">
              <div><strong>Personal-data sharing</strong><span>n=54</span></div>
              <div className="tension-bar sharing-bar">
                <i style={{ flexBasis: "1.9%" }}><span>1.9</span></i>
                <i style={{ flexBasis: "61.1%" }}><span>61.1 reserved</span></i>
                <i style={{ flexBasis: "37%" }}><span>37.0 unwilling</span></i>
              </div>
            </div>
          </div>
          <figcaption>Direct labels preserve the different meanings of each scale.</figcaption>
        </figure>

        <figure
          className="research-viz guidance-figure"
          role="img"
          aria-label="77.8 percent wanted official anti-plagiarism guidance. Preferred guidance formats were workshop 45.7 percent, handbook 35.8 percent, and one-to-one tutorial 18.5 percent"
        >
          <div className="viz-kicker">
            <span>Guidance preference</span>
            <strong>Learning should be hands-on</strong>
          </div>
          <div className="guidance-flower" aria-hidden="true">
            <div className="guidance-core"><strong>77.8%</strong><span>wanted official guidance</span></div>
            <div className="guidance-petal petal-workshop"><strong>45.7%</strong><span>Workshop</span></div>
            <div className="guidance-petal petal-handbook"><strong>35.8%</strong><span>Handbook</span></div>
            <div className="guidance-petal petal-tutorial"><strong>18.5%</strong><span>1-to-1</span></div>
          </div>
          <figcaption>Format values are shares of selections.</figcaption>
        </figure>

        <figure
          className="research-viz library-figure"
          role="img"
          aria-label="Interview ideas for library AI services: data or book retrieval five of six, AI service desk one of six, topic collections one of six, reading lists one of six"
        >
          <div className="viz-kicker">
            <span>Library opportunity</span>
            <strong>Retrieval before replacement</strong>
          </div>
          <div className="library-orbit" aria-hidden="true">
            <div className="library-core"><strong>5/6</strong><span>data + book retrieval</span></div>
            <div className="library-satellite satellite-desk"><strong>1/6</strong><span>service desk</span></div>
            <div className="library-satellite satellite-collections"><strong>1/6</strong><span>collections</span></div>
            <div className="library-satellite satellite-reading"><strong>1/6</strong><span>reading lists</span></div>
          </div>
          <figcaption>Interview mentions; participants could suggest more than one idea.</figcaption>
        </figure>
      </VizLane>
      <p className="research-data-note">
        Survey bases vary by question (n=55, 54 or 50). Every visual keeps its original denominator or labels selection shares.
      </p>
    </section>
  );
}

export default function ResearchVisuals({ kind }: ResearchVisualsProps) {
  if (kind === "character") return <CharacterResearch />;
  if (kind === "fps") return <FpsResearch />;
  return <AiResearch />;
}
