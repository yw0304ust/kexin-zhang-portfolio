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

const en = {
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
      subtitle: "A first-person narrative puzzle game about memory and care",
      role: "Narrative & puzzle design · Player experience · AI-assisted build",
      status: "Web build released",
      stat: "4 chapters · playable on web",
      description:
        "A playable inquiry into fragmented memory, caregiver pressure, and the effort to preserve a sense of home — told across four spaces: a home, a property office, a metro station, and a hospital.",
      tags: ["Deterministic puzzle FSM", "Narrative systems", "Godot 4 · WebGL2", "Constrained AI agents"],
      details: [
        {
          label: "Design premise",
          text: "When memory fails, identity is proven by objects, habits, routes, and how others respond. A daughter’s present and her mother’s fragmented memories re-anchor each other across four spaces.",
        },
        {
          label: "Puzzle systems",
          text: "Every puzzle is a verifiable causal loop: a kitchen steaming FSM, dual-track CCTV time calibration, a triptych-mirror alignment, and a seven-stage mechanical escape — deterministic and recoverable.",
        },
        {
          label: "AI agent design",
          text: "Guidance agents layer hints from discovered facts; interrogation agents can be challenged with evidence. Agents output text only — truth, saves, and endings stay with the local FSM.",
        },
        {
          label: "My contribution",
          text: "Narrative, puzzle, and player-experience design end to end — from script to a playable Godot 4 / WebGL2 web build through an AI-assisted workflow, including the Blender asset pipeline and chaptered web packs.",
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
    prototype: "Design notes",
    "world-home": "Home",
    "world-property": "Property",
    "world-subway": "Metro",
    "world-hospital": "Hospital",
    systems: "Systems",
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
  anchorSpaces: [
    {
      id: "world-home",
      index: "01",
      name: "Home",
      styleLabel: "Art direction",
      styleTitle: "Warm light as a narrative grammar",
      styleText:
        "The home chapter is staged the way memory works: five warm lamps make fragments of a childhood visible one by one, and when light reaches the photographs, their order becomes the puzzle itself. Same furniture, same scale — only recognisability changes. In this light, care quietly reverses: the one who was cared for becomes the caregiver.",
      worldA: "Readable — medication times, the steamer, shoes by the door: objects, habits and routes line up into “this is who I am”.",
      worldB: "Unstable — the familiar room turns strange; the 03/12 date and the door handle must be pieced back together before home opens.",
      images: [
        { src: "/anchor-space-home.webp", alt: "A warm lamp lighting a bookshelf in Anchor's home chapter", slot: "a" },
        { src: "/anchor-home-table.webp", alt: "Sunlight and dust over the living-room table", slot: "b" },
        { src: "/anchor-home-mirror.webp", alt: "A mirror with vanity lamps reflecting the boy", slot: "c" },
        { src: "/anchor-home-bedroom.webp", alt: "The bedroom: bookshelf, pendant lamp, and a family photo on the wall", slot: "d" },
        { src: "/anchor-home-livingroom.webp", alt: "The living room under the chandelier, dust drifting in the light", slot: "e" },
        { src: "/anchor-world-home.webp", alt: "The locked front door of the home", slot: "f" },
      ],
    },
    {
      id: "world-property",
      index: "02",
      name: "Property office",
      styleLabel: "Art direction",
      styleTitle: "A documentary aesthetic of public evidence",
      styleText:
        "The property lobby is shot like a case file: mailboxes, notice boards, a glass CCTV booth, timestamps everywhere. There is no facial recognition in this chapter — two independent paper logs and the footage drift by the same four minutes, landmarks re-check the route, and a deduction only becomes real when it is returned to the physical east gate.",
      worldA: "Readable — visitor logs, clocks and camera feeds agree with one another.",
      worldB: "Unstable — every timestamp is four minutes off, until the offset itself becomes the evidence.",
      images: [
        { src: "/anchor-space-property.webp", alt: "The property investigation terminal replaying CCTV footage", slot: "a" },
        { src: "/anchor-property-gate-night.webp", alt: "CCTV still of the east gate on a rainy night", slot: "b" },
        { src: "/anchor-property-lobby-live.webp", alt: "In-game view of the property lobby, surveillance cameras overhead", slot: "c" },
      ],
    },
    {
      id: "world-subway",
      index: "03",
      name: "Metro station",
      styleLabel: "Art direction",
      styleTitle: "Sound and mirrors assemble a place",
      styleText:
        "In the metro, direction itself is the puzzle. Broadcast syllables lock into a station name, a lost-property code is built out of time, and a triptych mirror aligns moving points into one continuous route. The visual rule stays honest: same position, same scale, only legibility shifts — identity here is proven by still knowing the way.",
      worldA: "Readable — announcements, signs and exits point somewhere real.",
      worldB: "Unstable — syllables, reflections and faces blur, until the player reassembles them into Guixiang Road.",
      images: [
        { src: "/anchor-subway-fog.webp", alt: "The metro exit in heavy fog, the station name reduced to question marks", slot: "a" },
        { src: "/anchor-space-subway.webp", alt: "A metro gate area with a staff member whose face is unreadable", slot: "b" },
        { src: "/anchor-world-subway.webp", alt: "Ticket gates and escalators under fluorescent light", slot: "c" },
        { src: "/anchor-subway-barrier.webp", alt: "Platform screen doors along the yellow tactile paving", slot: "d" },
      ],
    },
    {
      id: "world-hospital",
      index: "04",
      name: "Hospital",
      styleLabel: "Art direction",
      styleTitle: "A clinical landscape that tells the story",
      styleText:
        "The hospital speaks through its scenery: long corridors, benches, windows — the same hallway bright at admission and dim at night. Behind the observation room's closed door, seven mechanical stages must be read from physical states alone, before consultation and an MRI review re-read the anchors the player actually kept.",
      worldA: "Readable — corridor, records, diagnosis: the follow-up visit as a calm review of what happened.",
      worldB: "Unstable — the room seals itself; only the mechanical chain, step by visible step, opens it again.",
      images: [
        { src: "/anchor-hospital-exterior.webp", alt: "The hospital building seen from above, between the city and the sea", slot: "a" },
        { src: "/anchor-space-hospital.webp", alt: "The hospital corridor at night with scattered papers", slot: "b" },
        { src: "/anchor-hospital-mri.webp", alt: "The MRI review room", slot: "c" },
        { src: "/anchor-hospital-sink.webp", alt: "The returned hand sanitizer by the sink", slot: "d" },
        { src: "/anchor-world-hospital.webp", alt: "The bright hospital corridor during the day", slot: "e" },
      ],
    },
  ],
  anchorSystems: {
    heading: "Systems that hold the story",
    lede: "Puzzles are not decoration on the narrative — they are how memory, care, and direction become playable. Each system is deterministic, observable, and recoverable.",
    cards: [
      {
        label: "Puzzle FSM",
        title: "A kitchen steamer as a full 3D state machine",
        text: "Temperature thresholds, a water-separated steaming structure, and a safe reset sequence. Wrong actions feed back only the current mechanism — earlier progress is never wiped.",
        image: "/anchor-puzzle-kitchen.webp",
        alt: "Kitchen puzzle area in Anchor with stove, steamer pot, and countertop props",
      },
      {
        label: "Environmental forensics",
        title: "A threshold timeline from shoes, sensors, and wet prints",
        text: "Who came home, when, and how to walk together safely next time — time is locked to one doorway through physical traces the player reads and verifies.",
        image: "/anchor-puzzle-threshold.webp",
        alt: "Entryway evidence in Anchor: shoes, cabinet, and footprints by the door",
      },
      {
        label: "Constrained AI agents",
        title: "Two dialogue paradigms on a deterministic core",
        text: "Guidance agents layer hints from discovered facts; interrogation agents can be challenged with evidence. Agents output text only — story state, puzzle progress, saves, and endings never leave the local FSM.",
        image: "/anchor-agents-duo.webp",
        alt: "Portraits of two Anchor dialogue agents, a duty officer and a nurse",
      },
    ],
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
    { id: "world-home", label: "Home", type: "story" },
    { id: "world-property", label: "Property", type: "story" },
    { id: "world-subway", label: "Metro", type: "story" },
    { id: "world-hospital", label: "Hospital", type: "story" },
    { id: "systems", label: "Systems", type: "method" },
    { id: "prototype", label: "Design notes", type: "evidence" },
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

function ResearchPortrait() {
  const portraitCopy = en.portrait;
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

function AnchorSpacePage({
  space,
  label,
}: {
  space: (typeof en.anchorSpaces)[number];
  label: string;
}) {
  return (
    <section className="anchor-space-slide" data-space={space.id} aria-label={`Anchor · ${label}`}>
      <header className="anchor-slide-intro">
        <h2>
          <span className="anchor-space-index">{space.index}</span>
          {space.name}
        </h2>
        <p>{space.styleTitle}</p>
      </header>
      <div className="anchor-space-body">
        <div className="anchor-space-wall">
          {space.images.map((image) => (
            <figure className={`anchor-space-photo anchor-space-photo-${image.slot}`} key={image.src}>
              <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
            </figure>
          ))}
        </div>
        <aside className="anchor-space-panel">
          <span className="anchor-space-style-label">{space.styleLabel}</span>
          <p className="anchor-space-style-text">{space.styleText}</p>
          <div className="anchor-space-ab">
            <article>
              <span>World A · Readable</span>
              <p>{space.worldA}</p>
            </article>
            <article>
              <span>World B · Unstable</span>
              <p>{space.worldB}</p>
            </article>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default function PortfolioPager() {
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

  const t = en;

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
                <ResearchPortrait />
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
                  ) : activeProject.kind === "anchor" && activeProjectSlide.type === "story" ? (
                          <AnchorSpacePage
                            space={t.anchorSpaces.find((space) => space.id === activeProjectSlide.id) ?? t.anchorSpaces[0]}
                            label={activeSlideLabel}
                          />
                  ) : activeProject.kind === "anchor" && activeProjectSlide.id === "systems" ? (
                          <section className="anchor-systems-slide" aria-label={`${activeProject.title} · ${t.slideLabels.systems}`}>
                            <header className="anchor-slide-intro">
                              <h2>{t.anchorSystems.heading}</h2>
                              <p>{t.anchorSystems.lede}</p>
                            </header>
                            <div className="anchor-systems-grid">
                              {t.anchorSystems.cards.map((card) => (
                                <article className="anchor-system-card" key={card.label}>
                                  {"image" in card && card.image ? (
                                    <img src={card.image} alt={card.alt} loading="lazy" decoding="async" />
                                  ) : null}
                                  <div className="anchor-system-card-body">
                                    <span>{card.label}</span>
                                    <h3>{card.title}</h3>
                                    <p>{card.text}</p>
                                  </div>
                                </article>
                              ))}
                            </div>
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
                            <ResearchVisuals kind={activeProject.kind} view={activeProjectSlide.id} />
                          )}
                        </section>
                  ) : activeProject.kind !== "anchor" ? (
                    <ProjectNarratives kind={activeProject.kind} slideId={activeProjectSlide.id} />
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
