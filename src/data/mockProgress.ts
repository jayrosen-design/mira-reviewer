import { DIALOGUES, RUBRIC_CRITERIA } from "./dialogues";

export type Source = "human" | "ai";

export type DialogueProgress = {
  id: string;
  reviewSet: string;
  scenario: string;
  selected: "A" | "B" | "neither" | "too_similar" | null;
  avgA: number | null;
  avgB: number | null;
  /** Ground truth — which response was authored by a human. */
  sourceA: Source;
  sourceB: Source;
  /** Reviewer's guess for each response. null if not yet guessed. */
  guessA: Source | null;
  guessB: Source | null;
  completed: boolean;
};

// Deterministic pseudo-random
function rand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const SCENARIO_TEMPLATES = [
  "A parent is uncertain about transitioning their toddler from a bottle to a cup.",
  "A parent is weighing the pros and cons of starting ADHD medication for their child.",
  "A parent is worried about their teenager's screen time but fears conflict.",
  "A parent is hesitant to start their child on insulin for newly diagnosed type 1 diabetes.",
  "A parent is feeling overwhelmed by their child's eczema flare-ups and treatment routine.",
  "A parent is unsure whether to pursue speech therapy for a late-talking toddler.",
  "A parent is concerned about the flu vaccine for their child after a prior reaction.",
  "A parent feels guilty about their child's weight and is unsure how to introduce changes.",
  "A parent is anxious about their preteen's recent withdrawal from family activities.",
  "A parent is unsure how to talk to their child about an upcoming surgery.",
  "A parent is debating whether to allow their teen to drive after a minor accident.",
  "A parent is reluctant to follow up on a referral to a child psychologist.",
  "A parent worries their child's picky eating is more than just a phase.",
  "A parent is uncertain about how to manage their child's anxiety before school.",
  "A parent is hesitant about a recommended dental procedure under sedation.",
];

const SETS = ["Pilot Set A", "Pilot Set B", "Pilot Set C"];

function buildExtendedScenarios(target: number) {
  const items: { id: string; reviewSet: string; scenario: string }[] = DIALOGUES.map(
    (d) => ({ id: d.id, reviewSet: d.reviewSet, scenario: d.scenario }),
  );
  let i = items.length;
  while (items.length < target) {
    const tmpl = SCENARIO_TEMPLATES[(i - DIALOGUES.length) % SCENARIO_TEMPLATES.length];
    items.push({
      id: `MIRA-${String(i + 1).padStart(3, "0")}`,
      reviewSet: SETS[i % SETS.length],
      scenario: tmpl,
    });
    i++;
  }
  return items;
}

export const TOTAL_DIALOGUES = 100;

export const DIALOGUE_PROGRESS: DialogueProgress[] = buildExtendedScenarios(
  TOTAL_DIALOGUES,
).map((d, idx) => {
  const r = rand(idx + 1);
  // ~62% completed
  const completed = r < 0.62;
  // Ground truth: roughly half human-A / half human-B
  const sourceA: Source = rand(idx + 71) < 0.5 ? "human" : "ai";
  const sourceB: Source = sourceA === "human" ? "ai" : "human";

  if (!completed) {
    return {
      ...d,
      selected: null,
      avgA: null,
      avgB: null,
      sourceA,
      sourceB,
      guessA: null,
      guessB: null,
      completed: false,
    };
  }
  const pick = rand(idx + 17);
  const selected: DialogueProgress["selected"] =
    pick < 0.55 ? "A" : pick < 0.85 ? "B" : pick < 0.93 ? "neither" : "too_similar";

  const baseA = 3.2 + rand(idx + 31) * 1.4;
  const baseB = 3.0 + rand(idx + 53) * 1.5;
  const avgA = Math.round(baseA * 10) / 10;
  const avgB = Math.round(baseB * 10) / 10;

  // Reviewers guess correctly ~68% of the time
  const guessA: Source =
    rand(idx + 91) < 0.68 ? sourceA : sourceA === "human" ? "ai" : "human";
  const guessB: Source =
    rand(idx + 113) < 0.68 ? sourceB : sourceB === "human" ? "ai" : "human";

  return {
    ...d,
    selected,
    avgA,
    avgB,
    sourceA,
    sourceB,
    guessA,
    guessB,
    completed,
  };
});

export function summarizeProgress(items: DialogueProgress[]) {
  const completed = items.filter((i) => i.completed).length;
  const total = items.length;
  const aPicks = items.filter((i) => i.selected === "A").length;
  const bPicks = items.filter((i) => i.selected === "B").length;
  const neither = items.filter((i) => i.selected === "neither").length;
  const tooSim = items.filter((i) => i.selected === "too_similar").length;
  const ratedA = items.filter((i) => i.avgA != null);
  const ratedB = items.filter((i) => i.avgB != null);
  const avgA =
    ratedA.length === 0
      ? 0
      : ratedA.reduce((s, i) => s + (i.avgA ?? 0), 0) / ratedA.length;
  const avgB =
    ratedB.length === 0
      ? 0
      : ratedB.reduce((s, i) => s + (i.avgB ?? 0), 0) / ratedB.length;
  return {
    completed,
    total,
    aPicks,
    bPicks,
    neither,
    tooSim,
    avgA: Math.round(avgA * 10) / 10,
    avgB: Math.round(avgB * 10) / 10,
  };
}

// -------- Reviewer dashboard mock data --------

const ANIMALS = [
  "Otter", "Falcon", "Heron", "Marmot", "Lynx", "Bison", "Crane",
  "Ibis", "Wren", "Badger", "Kestrel", "Vole", "Stoat", "Magpie",
  "Auk", "Tern", "Shrew", "Sable", "Owl", "Finch",
];

export type Reviewer = {
  id: string;
  name: string;
  completed: number;
  total: number;
  avgA: number;
  avgB: number;
  aPicks: number;
  bPicks: number;
  neither: number;
  tooSim: number;
  medianMinutes: number;
};

export const REVIEWERS: Reviewer[] = ANIMALS.map((animal, idx) => {
  const total = TOTAL_DIALOGUES;
  const completion = 0.15 + rand(idx + 101) * 0.85;
  const completed = Math.round(total * completion);
  const aPickRate = 0.35 + rand(idx + 201) * 0.3;
  const aPicks = Math.round(completed * aPickRate);
  const remaining = completed - aPicks;
  const bPicks = Math.round(remaining * 0.78);
  const neither = Math.round((remaining - bPicks) * 0.6);
  const tooSim = Math.max(0, remaining - bPicks - neither);
  return {
    id: `R-${String(idx + 1).padStart(2, "0")}`,
    name: `Anon ${animal}`,
    completed,
    total,
    avgA: Math.round((3.4 + rand(idx + 301) * 1.2) * 10) / 10,
    avgB: Math.round((3.2 + rand(idx + 401) * 1.3) * 10) / 10,
    aPicks,
    bPicks,
    neither,
    tooSim,
    medianMinutes: Math.round((4 + rand(idx + 501) * 6) * 10) / 10,
  };
});

export function reviewerAverages(rs: Reviewer[]) {
  const totalCompleted = rs.reduce((s, r) => s + r.completed, 0);
  const totalPossible = rs.reduce((s, r) => s + r.total, 0);
  const avgCompletionPct = Math.round((totalCompleted / totalPossible) * 100);
  const meanA = rs.reduce((s, r) => s + r.avgA, 0) / rs.length;
  const meanB = rs.reduce((s, r) => s + r.avgB, 0) / rs.length;
  const aPicks = rs.reduce((s, r) => s + r.aPicks, 0);
  const bPicks = rs.reduce((s, r) => s + r.bPicks, 0);
  const neither = rs.reduce((s, r) => s + r.neither, 0);
  const tooSim = rs.reduce((s, r) => s + r.tooSim, 0);
  return {
    reviewers: rs.length,
    totalCompleted,
    totalPossible,
    avgCompletionPct,
    meanA: Math.round(meanA * 10) / 10,
    meanB: Math.round(meanB * 10) / 10,
    aPicks,
    bPicks,
    neither,
    tooSim,
    medianMinutes:
      Math.round(
        (rs.reduce((s, r) => s + r.medianMinutes, 0) / rs.length) * 10,
      ) / 10,
  };
}

// Per-criterion averages (overall, across all dialogues / reviewers — mocked)
export const CRITERION_AVERAGES = RUBRIC_CRITERIA.map((c, idx) => ({
  criterion: c,
  responseA: Math.round((3.6 + rand(idx + 11) * 0.9) * 10) / 10,
  responseB: Math.round((3.4 + rand(idx + 27) * 1.0) * 10) / 10,
}));
