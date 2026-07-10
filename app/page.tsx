const projects = [
  {
    number: "01",
    title: "Anchor",
    subtitle: "A first-person narrative puzzle game",
    period: "2026—Present",
    role: "Narrative design · Player experience",
    description:
      "A playable inquiry into fragmented memory, caregiver pressure, and the effort to preserve a sense of home.",
    tags: ["Game mechanics", "Narrative choices", "Prototype"],
  },
  {
    number: "02",
    title: "FPS Playtime Study",
    subtitle: "Factors associated with online playtime",
    period: "2024",
    role: "Project lead · Quantitative research",
    description:
      "A survey-led study that moved from questionnaire design to data cleaning, reliability analysis, and multiple regression.",
    tags: ["600+ responses", "SPSS", "Player research"],
  },
  {
    number: "03",
    title: "AI × Library Live Chat",
    subtitle: "Student use of AI at King’s College London",
    period: "2023—24",
    role: "Project lead · User research",
    description:
      "A collaborative study with KCL Library exploring how students use AI and how it might meet an existing support service.",
    tags: ["400 responses", "Data visualisation", "HCI"],
  },
] as const;

const practiceAreas = [
  {
    number: "01",
    title: "Narrative systems",
    text: "I translate themes into rules, routes, puzzles, and choices—so meaning emerges through what the player does, not only what the story says.",
  },
  {
    number: "02",
    title: "Player research",
    text: "I use surveys, interviews, and quantitative analysis to understand behaviour and communicate evidence without losing the people inside the data.",
  },
  {
    number: "03",
    title: "Playable inquiry",
    text: "I prototype core interaction flows early, treating the playable artefact as both a design proposal and a way to ask better research questions.",
  },
] as const;

const methods = [
  "User research",
  "Questionnaire design",
  "Data cleaning & recoding",
  "Reliability analysis",
  "Multiple regression",
  "Data visualisation",
  "Interview design",
  "Narrative prototyping",
] as const;

const tools = [
  "SPSS",
  "R",
  "Premiere Pro",
  "After Effects",
  "Audition",
  "Photoshop",
  "Lightroom",
] as const;

export default function Home() {
  return <PortfolioPager />;
}

function LegacyLongFormPortfolio() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <div className="scroll-progress" aria-hidden="true" />

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Kexin Zhang, home">
          KZ<span aria-hidden="true">.</span>
        </a>
        <nav className="primary-nav" aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#practice">Practice</a>
          <a href="#profile">Profile</a>
        </nav>
        <a className="header-contact" href="mailto:Ruihi.zhang@outlook.com">
          Let’s talk <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow hero-kicker">
              Game design · Player experience · Human-centered HCI
            </p>
            <h1 id="hero-title">
              <span>Kexin</span>
              <span>Zhang</span>
            </h1>
            <p className="hero-statement">
              I explore how <em>rules, stories, and consequential choices</em>{" "}
              shape the way people experience memory, care, and identity.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">
                Explore selected work <span aria-hidden="true">↓</span>
              </a>
              <a className="text-link" href="mailto:Ruihi.zhang@outlook.com">
                Ruihi.zhang@outlook.com
              </a>
            </div>
          </div>

          <div
            className="hero-field"
            role="img"
            aria-label="A conceptual map connecting memory, choice, and care"
          >
            <div className="field-grid" aria-hidden="true" />
            <div className="field-orbit field-orbit-large" aria-hidden="true" />
            <div className="field-orbit field-orbit-small" aria-hidden="true" />
            <div className="field-core" aria-hidden="true">
              <span />
            </div>
            <span className="field-label field-label-memory">memory</span>
            <span className="field-label field-label-choice">choice</span>
            <span className="field-label field-label-care">care</span>
            <p className="field-note">
              Current focus
              <strong>Anchor</strong>
              Narrative puzzle game
            </p>
          </div>

          <div className="hero-meta">
            <span>Research-led creative practice</span>
            <span>Chinese · English</span>
            <span>Selected portfolio · 2026</span>
          </div>
        </section>

        <section className="signal-strip" aria-label="Areas of practice">
          <span>Mechanics</span>
          <span>Player experience</span>
          <span>Digital communication</span>
          <span>Playable prototypes</span>
        </section>

        <section className="work section-shell" id="work" aria-labelledby="work-title">
          <div className="section-heading reveal">
            <p className="section-index">01 / Selected work</p>
            <div>
              <h2 id="work-title">Questions made playable.</h2>
              <p>
                Three projects across narrative design, player research, and
                service-focused HCI.
              </p>
            </div>
          </div>

          <article className="feature-project reveal">
            <div className="project-copy">
              <div className="project-topline">
                <span className="project-number">{projects[0].number}</span>
                <span className="status-pill">In progress</span>
              </div>
              <p className="project-role">{projects[0].role}</p>
              <h3>{projects[0].title}</h3>
              <p className="project-subtitle">{projects[0].subtitle}</p>
              <p className="project-description">{projects[0].description}</p>
              <ul className="tag-list" aria-label="Project tags">
                {projects[0].tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <details className="project-details">
                <summary>Project outline</summary>
                <div className="details-grid">
                  <div>
                    <span>Design premise</span>
                    <p>
                      The game alternates between a daughter’s present and her
                      mother’s fragmented memories across a home, metro station,
                      and hospital psychiatric department.
                    </p>
                  </div>
                  <div>
                    <span>Core mechanics</span>
                    <p>
                      Object investigation, combination locks, route choices,
                      photo puzzles, and narrative decisions. Retained memory
                      anchors shape what resurfaces and which ending unfolds.
                    </p>
                  </div>
                  <div>
                    <span>My contribution</span>
                    <p>
                      Narrative and player-experience design, supported by
                      lightweight AI-assisted prototyping of the core flow.
                    </p>
                  </div>
                </div>
              </details>
              <a
                className="project-link"
                href="https://tch.cloud.tencent.com/contest/40"
                target="_blank"
                rel="noreferrer"
              >
                View competition context <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div
              className="anchor-visual"
              role="img"
              aria-label="Conceptual map of Anchor moving between home, metro, and hospital memories"
            >
              <div className="visual-caption">
                <span>Memory topology</span>
                <span>Prototype / 2026</span>
              </div>
              <div className="memory-map" aria-hidden="true">
                <div className="memory-room room-home">
                  <span>01</span>
                  <strong>Home</strong>
                </div>
                <div className="memory-room room-metro">
                  <span>02</span>
                  <strong>Metro</strong>
                </div>
                <div className="memory-room room-hospital">
                  <span>03</span>
                  <strong>Hospital</strong>
                </div>
                <div className="memory-path path-one" />
                <div className="memory-path path-two" />
                <div className="memory-anchor anchor-one" />
                <div className="memory-anchor anchor-two" />
                <div className="memory-anchor anchor-three" />
                <div className="memory-choice">
                  <span>retain</span>
                  <span>release</span>
                </div>
              </div>
              <p className="visual-footnote">
                What we keep changes what returns.
              </p>
            </div>
          </article>

          <div className="research-grid">
            <article className="research-project reveal">
              <div className="research-card-head">
                <span className="project-number">{projects[1].number}</span>
                <span>{projects[1].period}</span>
              </div>
              <p className="project-role">{projects[1].role}</p>
              <h3>{projects[1].title}</h3>
              <p className="project-subtitle">{projects[1].subtitle}</p>
              <div
                className="data-visual"
                role="img"
                aria-label="Abstract distribution chart representing more than 600 valid survey responses"
              >
                <div className="data-stat">
                  <strong>600+</strong>
                  <span>valid responses</span>
                </div>
                <div className="data-bars" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <p className="project-description">{projects[1].description}</p>
              <details className="project-details compact-details">
                <summary>Methods used</summary>
                <p>
                  Questionnaire design, data cleaning and recoding, reliability
                  assessment, multiple regression in SPSS, and demographic
                  tables for communicating the sample.
                </p>
              </details>
            </article>

            <article className="research-project research-project-blue reveal">
              <div className="research-card-head">
                <span className="project-number">{projects[2].number}</span>
                <span>{projects[2].period}</span>
              </div>
              <p className="project-role">{projects[2].role}</p>
              <h3>{projects[2].title}</h3>
              <p className="project-subtitle">{projects[2].subtitle}</p>
              <div
                className="chat-visual"
                role="img"
                aria-label="Abstract live chat interface representing the student AI use study"
              >
                <div className="chat-stat">
                  <strong>400</strong>
                  <span>student responses</span>
                </div>
                <div className="chat-thread" aria-hidden="true">
                  <span className="chat-line chat-line-one" />
                  <span className="chat-line chat-line-two" />
                  <span className="chat-line chat-line-three" />
                  <span className="chat-dot" />
                </div>
              </div>
              <p className="project-description">{projects[2].description}</p>
              <details className="project-details compact-details">
                <summary>Study scope</summary>
                <p>
                  I led the survey, cleaned the data, created visualisations,
                  and presented the findings to King’s College London Library.
                </p>
              </details>
            </article>
          </div>
        </section>

        <section
          className="practice section-shell section-dark"
          id="practice"
          aria-labelledby="practice-title"
        >
          <div className="section-heading reveal">
            <p className="section-index">02 / Practice</p>
            <div>
              <h2 id="practice-title">Design as a way of asking.</h2>
              <p>
                A practice that moves between close observation, system design,
                and tangible prototypes.
              </p>
            </div>
          </div>

          <div className="practice-list">
            {practiceAreas.map((area) => (
              <article className="practice-item reveal" key={area.number}>
                <span>{area.number}</span>
                <h3>{area.title}</h3>
                <p>{area.text}</p>
              </article>
            ))}
          </div>

          <div className="process-loop reveal" aria-label="Creative research process">
            <div>
              <span>Observe</span>
              <p>behaviour, context, tension</p>
            </div>
            <span className="process-arrow" aria-hidden="true">→</span>
            <div>
              <span>Translate</span>
              <p>insight into mechanics</p>
            </div>
            <span className="process-arrow" aria-hidden="true">→</span>
            <div>
              <span>Prototype</span>
              <p>play, test, refine</p>
            </div>
          </div>
        </section>

        <section className="storytelling section-shell" aria-labelledby="story-title">
          <div className="section-heading reveal">
            <p className="section-index">03 / Storytelling</p>
            <div>
              <h2 id="story-title">Before systems, stories.</h2>
              <p>
                Reporting and media production taught me to listen closely,
                frame a human question, and make complexity legible.
              </p>
            </div>
          </div>

          <div className="story-layout">
            <div className="story-metrics reveal">
              <div>
                <strong>17</strong>
                <span>published videos & articles</span>
              </div>
              <div>
                <strong>1K+</strong>
                <span>reads on a reported feature</span>
              </div>
              <div>
                <strong>1.267M</strong>
                <span>aggregate livestream traffic</span>
              </div>
            </div>

            <div className="story-list">
              <article className="story-item reveal">
                <p>Interview-led feature · 2020</p>
                <h3>A Dialogue Across Seventeen Years</h3>
                <span>
                  Interviewed healthcare workers who had lived through both
                  SARS and COVID-19, then wrote the resulting feature.
                </span>
              </article>
              <article className="story-item reveal">
                <p>Documentary video · 2020</p>
                <h3>A Restaurant During the Pandemic</h3>
                <span>
                  Wrote the script for a video following a Shanghai restaurant’s
                  two-month recovery through owner and customer interviews.
                </span>
              </article>
            </div>
          </div>
        </section>

        <section
          className="profile section-shell"
          id="profile"
          aria-labelledby="profile-title"
        >
          <div className="section-heading reveal">
            <p className="section-index">04 / Profile</p>
            <div>
              <h2 id="profile-title">Researcher’s rigour, maker’s curiosity.</h2>
              <p>
                Trained across digital media, communication, user research, and
                hands-on production.
              </p>
            </div>
          </div>

          <div className="profile-grid">
            <div className="profile-column reveal">
              <h3>Education</h3>
              <article className="timeline-item">
                <span>2023—25</span>
                <div>
                  <h4>King’s College London</h4>
                  <p>MA, Digital Asset & Media Management</p>
                  <small>Data analysis · User research · HCI design</small>
                </div>
              </article>
              <article className="timeline-item">
                <span>2019—23</span>
                <div>
                  <h4>East China University of Political Science and Law</h4>
                  <p>BA, Journalism and Communication</p>
                  <small>GPA 3.8 / 4.0</small>
                </div>
              </article>
            </div>

            <div className="profile-column reveal">
              <h3>Experience</h3>
              <article className="timeline-item">
                <span>2022</span>
                <div>
                  <h4>Sichuan Newspaper Group · Cover News</h4>
                  <p>Media Intern, Automotive Desk</p>
                  <small>
                    Audience interviews · Livestream hosting · Editorial & video
                  </small>
                </div>
              </article>
              <article className="timeline-item">
                <span>2021</span>
                <div>
                  <h4>Zigong Daily</h4>
                  <p>New Media Editorial Intern</p>
                  <small>Story selection · Editing · Copy review</small>
                </div>
              </article>
            </div>
          </div>

          <div className="capability-grid">
            <div className="capability-panel reveal">
              <h3>Methods</h3>
              <ul className="capability-list">
                {methods.map((method) => (
                  <li key={method}>{method}</li>
                ))}
              </ul>
            </div>
            <div className="capability-panel reveal">
              <h3>Tools</h3>
              <ul className="capability-list">
                {tools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </div>
            <div className="capability-panel recognition-panel reveal">
              <h3>Recognition</h3>
              <p>
                Two Second Prizes at the 7th Hongfeng College Student Journalists
                Festival—for writing and video.
              </p>
              <p>
                ECUPL Comprehensive Scholarship, 2019—20 and 2020—21.
              </p>
            </div>
          </div>
        </section>

        <section className="contact" id="contact" aria-labelledby="contact-title">
          <div className="contact-copy reveal">
            <p className="section-index">05 / Contact</p>
            <h2 id="contact-title">
              Let’s make systems
              <span>people can feel.</span>
            </h2>
            <p>
              For research conversations, game collaborations, or portfolio
              enquiries, send me a note.
            </p>
            <a className="contact-link" href="mailto:Ruihi.zhang@outlook.com">
              Ruihi.zhang@outlook.com <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="contact-mark" aria-hidden="true">
            KZ
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>© 2026 Kexin Zhang</span>
        <span>Designed around questions, evidence, and play.</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </>
  );
}
import PortfolioPager from "./PortfolioPager";
