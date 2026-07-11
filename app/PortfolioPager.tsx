"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import ResearchVisuals from "./ResearchVisuals";

const pages = [
  { id: "home", label: "Home" },
  { id: "work", label: "Work" },
  { id: "practice", label: "Practice" },
  { id: "profile", label: "Profile" },
  { id: "contact", label: "Contact" },
] as const;

const projects = [
  {
    kind: "anchor",
    number: "01",
    title: "Anchor",
    subtitle: "A first-person narrative puzzle game",
    period: "2026—Present",
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
    external: "https://tch.cloud.tencent.com/contest/40",
  },
  {
    kind: "character",
    number: "02",
    title: "Character Attachment",
    subtitle: "How Nijigen characters begin to feel alive",
    period: "2024",
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
  {
    kind: "fps",
    number: "03",
    title: "FPS Playtime Study",
    subtitle: "Factors associated with online playtime",
    period: "2024",
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
  {
    kind: "ai",
    number: "04",
    title: "AI × Library Live Chat",
    subtitle: "Student use of AI at King’s College London",
    period: "2023—24",
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
] as const;

const practiceAreas = [
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
] as const;

const methods = [
  "User research",
  "Questionnaire design",
  "Data cleaning & recoding",
  "Reliability analysis",
  "Ordinal regression",
  "Data visualisation",
  "Interview design",
  "Narrative prototyping",
] as const;

type SphereNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  z: number;
  size: number;
  tone: "accent" | "light" | "muted";
};

// The points form a semantic graph, not a random pile of words: the central
// theme branches into care, mechanics, lived experience, and the three modes
// that emerged from the dissertation.
const researchSphereNodes: SphereNode[] = [
  { id: "attachment", label: "character attachment", x: 0, y: 0.06, z: 0.98, size: 18, tone: "accent" },
  { id: "care", label: "mutual care", x: -0.38, y: 0.24, z: 0.88, size: 12, tone: "light" },
  { id: "mechanics", label: "interaction mechanics", x: -0.68, y: -0.28, z: 0.66, size: 9, tone: "light" },
  { id: "gacha", label: "gacha", x: 0.63, y: -0.19, z: 0.71, size: 11, tone: "light" },
  { id: "personality", label: "personality", x: -0.84, y: 0.37, z: 0.38, size: 8, tone: "muted" },
  { id: "story", label: "story", x: -0.27, y: 0.73, z: 0.58, size: 10, tone: "light" },
  { id: "reality", label: "real-world factors", x: 0.72, y: 0.4, z: 0.5, size: 8, tone: "muted" },
  { id: "behaviour", label: "player behaviour", x: 0.14, y: -0.64, z: 0.7, size: 8, tone: "light" },
  { id: "symbiotic", label: "symbiotic", x: -0.56, y: -0.76, z: 0.2, size: 7, tone: "muted" },
  { id: "observance", label: "observance", x: 0.08, y: -0.86, z: 0.27, size: 7, tone: "muted" },
  { id: "actualisation", label: "actualisation", x: 0.7, y: -0.58, z: 0.2, size: 7, tone: "muted" },
];

const researchSphereEdges: Array<[string, string]> = [
  ["attachment", "care"],
  ["attachment", "mechanics"],
  ["attachment", "gacha"],
  ["attachment", "story"],
  ["attachment", "personality"],
  ["care", "symbiotic"],
  ["care", "observance"],
  ["care", "actualisation"],
  ["mechanics", "gacha"],
  ["mechanics", "behaviour"],
  ["story", "personality"],
  ["story", "reality"],
  ["behaviour", "observance"],
  ["gacha", "actualisation"],
  ["reality", "actualisation"],
];

function ResearchSphere() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const pointer = {
      active: false,
      lastX: 0,
      lastY: 0,
      velocityX: 0,
      velocityY: 0,
    };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fontFamily = getComputedStyle(canvas).fontFamily || "ui-monospace, monospace";
    let rotationX = -0.08;
    let rotationY = 0.36;
    let width = 0;
    let height = 0;
    let devicePixelRatio = 1;
    let animationFrame = 0;
    let cancelled = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * devicePixelRatio);
      canvas.height = Math.floor(height * devicePixelRatio);
    };

    const project = (node: SphereNode, radius: number, centerX: number, centerY: number) => {
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const rotatedX = node.x * cosY - node.z * sinY;
      const rotatedZ = node.x * sinY + node.z * cosY;
      const projectedY = node.y * cosX - rotatedZ * sinX;
      const depth = node.y * sinX + rotatedZ * cosX;
      const perspective = 0.76 + ((depth + 1) / 2) * 0.28;

      return {
        node,
        x: centerX + rotatedX * radius * perspective,
        y: centerY + projectedY * radius * perspective,
        depth,
        perspective,
      };
    };

    const draw = () => {
      if (cancelled) return;

      if (!pointer.active) {
        if (!reducedMotion) rotationY += 0.0022 + pointer.velocityY;
        rotationX += pointer.velocityX;
        pointer.velocityX *= 0.94;
        pointer.velocityY *= 0.94;
      }

      const centerX = width / 2;
      const centerY = height / 2 + height * 0.02;
      const radius = Math.min(width, height) * 0.4;
      const projected = researchSphereNodes.map((node) => project(node, radius, centerX, centerY));
      const projectedById = new Map(projected.map((item) => [item.node.id, item]));

      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);

      const glow = context.createRadialGradient(
        centerX - radius * 0.24,
        centerY - radius * 0.3,
        radius * 0.08,
        centerX,
        centerY,
        radius * 1.16,
      );
      glow.addColorStop(0, "rgba(238, 106, 69, 0.16)");
      glow.addColorStop(0.5, "rgba(238, 106, 69, 0.045)");
      glow.addColorStop(1, "rgba(18, 22, 19, 0)");
      context.fillStyle = glow;
      context.beginPath();
      context.arc(centerX, centerY, radius * 1.16, 0, Math.PI * 2);
      context.fill();

      context.save();
      context.strokeStyle = "rgba(251, 250, 246, 0.1)";
      context.lineWidth = 0.7;
      context.setLineDash([2, 5]);
      context.beginPath();
      context.ellipse(centerX, centerY, radius * 1.03, radius * 0.42, 0, 0, Math.PI * 2);
      context.stroke();
      context.beginPath();
      context.ellipse(centerX, centerY, radius * 0.42, radius * 1.03, 0, 0, Math.PI * 2);
      context.stroke();
      context.restore();

      for (const [fromId, toId] of researchSphereEdges) {
        const from = projectedById.get(fromId);
        const to = projectedById.get(toId);
        if (!from || !to) continue;
        const depth = Math.max(0.08, (from.depth + to.depth + 2) / 4);
        context.strokeStyle = `rgba(238, 106, 69, ${0.08 + depth * 0.23})`;
        context.lineWidth = 0.55 + depth * 0.7;
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
        context.stroke();
      }

      projected
        .sort((a, b) => a.depth - b.depth)
        .forEach(({ node, x, y, depth, perspective }) => {
          const visibility = 0.3 + ((depth + 1) / 2) * 0.7;
          const mobileScale = width < 260 ? 0.72 : 1;
          const fontSize = Math.max(6, node.size * perspective * mobileScale);
          const dotSize = Math.max(1.5, 2.2 * perspective * mobileScale);
          const tone =
            node.tone === "accent"
              ? `rgba(238, 106, 69, ${visibility})`
              : node.tone === "light"
                ? `rgba(251, 250, 246, ${0.48 + visibility * 0.42})`
                : `rgba(251, 250, 246, ${0.27 + visibility * 0.36})`;

          context.save();
          context.globalAlpha = visibility;
          context.fillStyle = tone;
          context.shadowColor = node.tone === "accent" ? "rgba(238, 106, 69, 0.42)" : "transparent";
          context.shadowBlur = node.tone === "accent" ? 12 : 0;
          context.beginPath();
          context.arc(x, y, dotSize, 0, Math.PI * 2);
          context.fill();
          context.shadowBlur = 0;
          context.font = `${node.tone === "accent" ? 650 : 520} ${fontSize}px ${fontFamily}`;
          context.textAlign = "center";
          context.textBaseline = "bottom";
          const textWidth = context.measureText(node.label).width;
          const labelX = Math.max(textWidth / 2 + 4, Math.min(width - textWidth / 2 - 4, x));
          const labelY = Math.max(fontSize + 4, y - dotSize - 4);
          context.fillText(node.label, labelX, Math.min(height - 4, labelY));
          context.restore();
        });

      animationFrame = window.requestAnimationFrame(draw);
    };

    const onPointerDown = (event: PointerEvent) => {
      pointer.active = true;
      pointer.lastX = event.clientX;
      pointer.lastY = event.clientY;
      pointer.velocityX = 0;
      pointer.velocityY = 0;
      canvas.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!pointer.active) return;
      const deltaX = event.clientX - pointer.lastX;
      const deltaY = event.clientY - pointer.lastY;
      rotationY += deltaX * 0.009;
      rotationX = Math.max(-0.75, Math.min(0.75, rotationX + deltaY * 0.006));
      pointer.velocityY = deltaX * 0.0008;
      pointer.velocityX = deltaY * 0.00045;
      pointer.lastX = event.clientX;
      pointer.lastY = event.clientY;
    };

    const onPointerUp = (event: PointerEvent) => {
      pointer.active = false;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        rotationY += event.key === "ArrowLeft" ? -0.18 : 0.18;
        event.preventDefault();
      }
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        rotationX = Math.max(-0.75, Math.min(0.75, rotationX + (event.key === "ArrowUp" ? -0.12 : 0.12)));
        event.preventDefault();
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("keydown", onKeyDown);
    resize();
    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div
      className="research-sphere"
      role="img"
      aria-label="Interactive research graph: character attachment connects mutual care, interaction mechanics, gacha, personality, story, real-world factors, player behaviour, and the symbiotic, observance, and actualisation modes."
    >
      <canvas className="research-sphere-canvas" ref={canvasRef} tabIndex={0} aria-hidden="true" />
      <div className="research-sphere-hint" aria-hidden="true">
        <span>Character attachment / Nijigen games</span>
        <span>Drag to rotate</span>
      </div>
      <div className="research-sphere-legend" aria-hidden="true">
        <span>Core theme</span>
        <span>Conditions</span>
        <span>Attachment modes</span>
      </div>
    </div>
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

const profileTabs = ["Methods", "Tools", "Recognition"] as const;

type Detail = number | "story" | null;
type HistoryMode = "push" | "replace" | "none";

function pageIndexFromHash() {
  if (typeof window === "undefined") return 0;
  const id = window.location.hash.replace("#", "");
  const index = pages.findIndex((page) => page.id === id);
  return index >= 0 ? index : 0;
}

export default function PortfolioPager() {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeDetail, setActiveDetail] = useState<Detail>(null);
  const [profileTab, setProfileTab] = useState(0);
  const currentPageRef = useRef(0);
  const focusAfterNavigation = useRef(false);
  const headingRefs = useRef<Array<HTMLHeadingElement | null>>([]);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);

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
    setCurrentPage(initialPage);

    if (!window.location.hash || window.location.hash !== `#${pages[initialPage].id}`) {
      window.history.replaceState({ page: initialPage }, "", `#${pages[initialPage].id}`);
    }

    const handleHistory = () => {
      const nextPage = pageIndexFromHash();
      currentPageRef.current = nextPage;
      focusAfterNavigation.current = true;
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
      const isEditing = target?.closest(
        "input, textarea, select, [contenteditable='true'], dialog",
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
    const nextTab = (profileTab + delta + profileTabs.length) % profileTabs.length;
    setProfileTab(nextTab);
    tabRefs.current[nextTab]?.focus();
  };

  const closeDetail = () => setActiveDetail(null);
  const selectedProject = typeof activeDetail === "number" ? projects[activeDetail] : null;

  return (
    <div className="pager-app" data-page={currentPage}>
      <a className="pager-skip" href={`#${pages[currentPage].id}`}>
        Skip to current page
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
          aria-label="Kexin Zhang, home"
          onClick={(event) => {
            event.preventDefault();
            navigateTo(0);
          }}
        >
          KZ<span aria-hidden="true">.</span>
        </a>

        <nav className="pager-main-nav" aria-label="Primary pages">
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
              {page.label}
            </a>
          ))}
        </nav>

        <span className="pager-mobile-title" aria-hidden="true">
          {pages[currentPage].label}
        </span>

        <a className="pager-email" href="mailto:Ruihi.zhang@outlook.com">
          Email <span aria-hidden="true">↗</span>
        </a>
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
                  Game design · Player experience · Human-centered HCI
                </p>
                <h1
                  id="home-title"
                  tabIndex={-1}
                  ref={(element) => {
                    headingRefs.current[0] = element;
                  }}
                >
                  Kexin <span>Zhang</span>
                </h1>
                <p className="home-statement">
                  I explore how <strong>rules, stories, and consequential choices</strong>{" "}
                  shape the way people experience memory, care, and identity.
                </p>
                <div className="home-actions">
                  <button className="pager-primary-action" onClick={() => navigateTo(1)}>
                    Explore selected work <span aria-hidden="true">→</span>
                  </button>
                  <div className="home-meta" aria-label="Profile summary">
                    <span>Research-led creative practice</span>
                    <span>Chinese · English</span>
                  </div>
                </div>
              </div>

              <div
                className="focus-card research-graph-card page-enter"
              >
                <div className="focus-card-top research-graph-meta">
                  <span>Research vocabulary</span>
                  <span>MA dissertation · 2024</span>
                </div>
                <ResearchSphere />
              </div>
            </div>
          </div>
        </section>

        <section
          className={`pager-screen pager-work ${
            currentPage === 1 ? "is-active" : currentPage < 1 ? "is-after" : "is-before"
          }`}
          id="work"
          aria-hidden={currentPage !== 1}
          inert={currentPage !== 1}
          aria-labelledby="work-title"
        >
          <div className="pager-screen-scroll">
            <div className="pager-shell work-layout">
              <div className="pager-page-heading page-enter">
                <div>
                  <p className="pager-eyebrow">02 / Selected work</p>
                  <h2
                    id="work-title"
                    tabIndex={-1}
                    ref={(element) => {
                      headingRefs.current[1] = element;
                    }}
                  >
                    Questions made playable.
                  </h2>
                </div>
                <p>
                  Four projects across narrative design, game research, player
                  research, and service-focused HCI.
                </p>
              </div>

              <div className="pager-project-grid page-enter">
                {projects.map((project, index) => (
                  <button
                    className={`pager-project-card project-tone-${index}`}
                    key={project.title}
                    onClick={() => setActiveDetail(index)}
                    aria-haspopup="dialog"
                  >
                    <div className="project-card-topline">
                      <span>{project.number}</span>
                      <span>{project.period}</span>
                    </div>
                    <div className={`project-card-signal signal-${index}`} aria-hidden="true">
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="project-card-copy">
                      <span className="project-card-status">{project.status}</span>
                      <h3>{project.title}</h3>
                      <p>{project.subtitle}</p>
                      <div>
                        <span>{project.role}</span>
                        <strong>{project.stat}</strong>
                      </div>
                    </div>
                    <span className="project-card-open">
                      Open summary <span aria-hidden="true">↗</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className={`pager-screen pager-practice ${
            currentPage === 2 ? "is-active" : currentPage < 2 ? "is-after" : "is-before"
          }`}
          id="practice"
          aria-hidden={currentPage !== 2}
          inert={currentPage !== 2}
          aria-labelledby="practice-title"
        >
          <div className="pager-screen-scroll">
            <div className="pager-shell practice-layout">
              <div className="pager-page-heading page-enter">
                <div>
                  <p className="pager-eyebrow">03 / Practice</p>
                  <h2
                    id="practice-title"
                    tabIndex={-1}
                    ref={(element) => {
                      headingRefs.current[2] = element;
                    }}
                  >
                    Design as a way of asking.
                  </h2>
                </div>
                <p>
                  A practice that moves between close observation, system design,
                  and tangible prototypes.
                </p>
              </div>

              <div className="practice-cards page-enter">
                {practiceAreas.map((area) => (
                  <article className="practice-card" key={area.number}>
                    <span>{area.number}</span>
                    <h3>{area.title}</h3>
                    <p>{area.text}</p>
                  </article>
                ))}
              </div>

              <div className="practice-footer page-enter">
                <div className="process-strip" aria-label="Creative research process">
                  <div>
                    <strong>Observe</strong>
                    <span>behaviour, context, tension</span>
                  </div>
                  <span aria-hidden="true">→</span>
                  <div>
                    <strong>Translate</strong>
                    <span>insight into mechanics</span>
                  </div>
                  <span aria-hidden="true">→</span>
                  <div>
                    <strong>Prototype</strong>
                    <span>play, test, refine</span>
                  </div>
                </div>

                <button
                  className="story-button"
                  onClick={() => setActiveDetail("story")}
                  aria-haspopup="dialog"
                >
                  <span>Storytelling foundations</span>
                  <span className="story-evidence">
                    <strong>17</strong> published works
                    <strong>1K+</strong> reads
                    <strong>1.267M</strong> livestream traffic
                  </span>
                  <span aria-hidden="true">↗</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section
          className={`pager-screen pager-profile ${
            currentPage === 3 ? "is-active" : currentPage < 3 ? "is-after" : "is-before"
          }`}
          id="profile"
          aria-hidden={currentPage !== 3}
          inert={currentPage !== 3}
          aria-labelledby="profile-title"
        >
          <div className="pager-screen-scroll">
            <div className="pager-shell profile-layout">
              <div className="pager-page-heading page-enter">
                <div>
                  <p className="pager-eyebrow">04 / Profile</p>
                  <h2
                    id="profile-title"
                    tabIndex={-1}
                    ref={(element) => {
                      headingRefs.current[3] = element;
                    }}
                  >
                    Researcher’s rigour, maker’s curiosity.
                  </h2>
                </div>
                <p>
                  Trained across digital media, communication, user research, and
                  hands-on production.
                </p>
              </div>

              <div className="profile-content page-enter">
                <div className="profile-timeline">
                  <div className="timeline-group">
                    <span className="timeline-group-title">Education</span>
                    <article>
                      <time>2023—25</time>
                      <div>
                        <h3>King’s College London</h3>
                        <p>MA, Digital Asset & Media Management</p>
                      </div>
                    </article>
                    <article>
                      <time>2019—23</time>
                      <div>
                        <h3>East China University of Political Science and Law</h3>
                        <p>BA, Journalism and Communication · GPA 3.8 / 4.0</p>
                      </div>
                    </article>
                  </div>

                  <div className="timeline-group">
                    <span className="timeline-group-title">Experience</span>
                    <article>
                      <time>2022</time>
                      <div>
                        <h3>Sichuan Newspaper Group · Cover News</h3>
                        <p>Media Intern, Automotive Desk</p>
                      </div>
                    </article>
                    <article>
                      <time>2021</time>
                      <div>
                        <h3>Zigong Daily</h3>
                        <p>New Media Editorial Intern</p>
                      </div>
                    </article>
                  </div>
                </div>

                <div className="profile-tabs">
                  <div className="profile-tab-list" role="tablist" aria-label="Profile details">
                    {profileTabs.map((tab, index) => (
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
                        {methods.map((method) => (
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
                        <p>
                          Two Second Prizes at the 7th Hongfeng College Student
                          Journalists Festival—for writing and video.
                        </p>
                        <p>
                          ECUPL Comprehensive Scholarship, 2019—20 and 2020—21.
                        </p>
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
            currentPage === 4 ? "is-active" : "is-after"
          }`}
          id="contact"
          aria-hidden={currentPage !== 4}
          inert={currentPage !== 4}
          aria-labelledby="contact-title"
        >
          <div className="pager-screen-scroll">
            <div className="pager-shell contact-layout">
              <div className="contact-copy page-enter">
                <p className="pager-eyebrow">05 / Contact</p>
                <h2
                  id="contact-title"
                  tabIndex={-1}
                  ref={(element) => {
                    headingRefs.current[4] = element;
                  }}
                >
                  Let’s make systems <span>people can feel.</span>
                </h2>
                <p>
                  For research conversations, game collaborations, or portfolio
                  enquiries, send me a note.
                </p>
                <a className="contact-email" href="mailto:Ruihi.zhang@outlook.com">
                  Ruihi.zhang@outlook.com <span aria-hidden="true">↗</span>
                </a>
              </div>

              <div className="contact-signature page-enter" aria-hidden="true">
                <span>KZ</span>
                <p>Questions · Evidence · Play</p>
              </div>

              <p className="contact-copyright">© 2026 Kexin Zhang</p>
            </div>
          </div>
        </section>
      </main>

      <nav className="pager-controls pager-glass" aria-label="Page controls">
        <button
          className="pager-arrow"
          onClick={() => navigateTo(currentPage - 1)}
          disabled={currentPage === 0}
          aria-label="Previous page"
        >
          <span aria-hidden="true">←</span>
        </button>

        <span className="pager-count" aria-hidden="true">
          {String(currentPage + 1).padStart(2, "0")} / {String(pages.length).padStart(2, "0")}
        </span>

        <div className="pager-steps" aria-label="Choose a page">
          {pages.map((page, index) => (
            <button
              key={page.id}
              className={currentPage === index ? "is-current" : ""}
              onClick={() => navigateTo(index)}
              aria-label={`Go to ${page.label}`}
              aria-current={currentPage === index ? "page" : undefined}
            >
              <span aria-hidden="true" />
            </button>
          ))}
        </div>

        <button
          className="pager-arrow"
          onClick={() => navigateTo(currentPage + 1)}
          disabled={currentPage === pages.length - 1}
          aria-label="Next page"
        >
          <span aria-hidden="true">→</span>
        </button>
      </nav>

      <div className="pager-live-region" aria-live="polite" aria-atomic="true">
        Page {currentPage + 1} of {pages.length}: {pages[currentPage].label}
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
            <span>{activeDetail === "story" ? "Storytelling" : selectedProject?.number}</span>
            <button onClick={closeDetail}>Close</button>
          </div>

          {selectedProject && (
            <div
              className={`detail-content ${
                selectedProject.kind === "anchor" ? "" : "research-detail-content"
              }`.trim()}
            >
              <div className="detail-heading">
                <p>{selectedProject.role}</p>
                <h2 id="detail-title">{selectedProject.title}</h2>
                <span>{selectedProject.subtitle}</span>
              </div>
              <p className="detail-lead">{selectedProject.description}</p>
              <div className="detail-grid">
                {selectedProject.details.map((detail) => (
                  <article key={detail.label}>
                    <span>{detail.label}</span>
                    <p>{detail.text}</p>
                  </article>
                ))}
              </div>
              {selectedProject.kind !== "anchor" && (
                <ResearchVisuals kind={selectedProject.kind} />
              )}
              <ul className="detail-tags" aria-label="Project tags">
                {selectedProject.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              {"external" in selectedProject && selectedProject.external && (
                <a
                  className="detail-link"
                  href={selectedProject.external}
                  target="_blank"
                  rel="noreferrer"
                >
                  View competition context <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          )}

          {activeDetail === "story" && (
            <div className="detail-content story-detail">
              <div className="detail-heading">
                <p>Media & communication</p>
                <h2 id="detail-title">Before systems, stories.</h2>
                <span>
                  Reporting and media production taught me to listen closely,
                  frame a human question, and make complexity legible.
                </span>
              </div>
              <div className="story-detail-metrics">
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
              <div className="detail-grid story-projects">
                <article>
                  <span>Interview-led feature · 2020</span>
                  <h3>A Dialogue Across Seventeen Years</h3>
                  <p>
                    Interviewed healthcare workers who had lived through both
                    SARS and COVID-19, then wrote the resulting feature.
                  </p>
                </article>
                <article>
                  <span>Documentary video · 2020</span>
                  <h3>A Restaurant During the Pandemic</h3>
                  <p>
                    Wrote the script for a video following a Shanghai restaurant’s
                    two-month recovery through owner and customer interviews.
                  </p>
                </article>
              </div>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
}
