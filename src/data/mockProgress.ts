import { BARRIER_CATEGORIES, DIALOGUES, type BarrierCategory } from "./dialogues";

export type Source = "human" | "mira";
export type Selection = "A" | "B" | "neither" | "too_similar" | null;

export type ReviewItemProgress = {
  id: string;
  reviewSet: string;
  barrierCategory: BarrierCategory;
  parentConcern: string;
  /** Reviewer's preferred response. */
  preferred: Selection;
  /** Mean parent rating (or expert yes-count) summary for A. */
  avgA: number | null;
  avgB: number | null;
  sourceA: Source;
  sourceB: Source;
  status: "completed" | "draft" | "not_started";
};

function rand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const TOTAL_REVIEW_ITEMS = 35;

const PARENT_CONCERN_TEMPLATES: Record<BarrierCategory, string[]> = {
  "Vaccine effectiveness": [
    "How well does this vaccine really work?",
    "I'm not sure the studies are strong enough to be confident.",
    "Does it really prevent cancer or just the virus?",
  ],
  "Safety or side effects": [
    "I've heard about side effects, and I'm not sure my child needs this yet.",
    "I'm worried about long-term effects we don't know about yet.",
    "My nephew had a bad reaction to a vaccine. That's stuck with me.",
  ],
  "Sexual activity concern": [
    "She's only ten — talking about this feels like it sends the wrong message.",
    "I don't want him to think we're giving permission for something.",
    "We're raising her with certain values, and this feels like it crosses that.",
  ],
  "Lack of clinician recommendation": [
    "Our regular doctor never mentioned this, so I assumed it wasn't urgent.",
    "If it was important, wouldn't we have heard about it sooner?",
    "Nobody's pushed this on us before. Why now?",
  ],
  "Child is too young": [
    "Nine just feels too young to be thinking about this.",
    "Can't this wait a few more years until he's older?",
    "She's still a kid. Why are we doing this now?",
  ],
};

function buildItems(target: number): ReviewItemProgress[] {
  const base: ReviewItemProgress[] = DIALOGUES.map((d, i) => ({
    id: d.id,
    reviewSet: d.reviewSet,
    barrierCategory: d.barrierCategory,
    parentConcern: d.parentConcern,
    preferred: null,
    avgA: null,
    avgB: null,
    sourceA: d.responseA.source,
    sourceB: d.responseB.source,
    status: i % 2 === 0 ? "completed" : "draft",
  }));

  const items: ReviewItemProgress[] = [...base];
  let i = items.length;
  while (items.length < target) {
    const category = BARRIER_CATEGORIES[i % BARRIER_CATEGORIES.length];
    const templates = PARENT_CONCERN_TEMPLATES[category];
    const concern = templates[(i * 7) % templates.length];
    items.push({
      id: `MIRA-${String(i + 1).padStart(3, "0")}`,
      reviewSet: `Pilot Set ${String.fromCharCode(65 + (i % 3))}`,
      barrierCategory: category,
      parentConcern: concern,
      preferred: null,
      avgA: null,
      avgB: null,
      sourceA: rand(i + 31) < 0.5 ? "human" : "mira",
      sourceB: "human",
      status: "not_started",
    });
    i++;
  }

  // Apply statuses + mock metrics: ~60% completed, ~10% draft, rest not_started.
  return items
    .map((it, idx) => {
      const r = rand(idx + 1);
      let status: ReviewItemProgress["status"] = "not_started";
      if (r < 0.6) status = "completed";
      else if (r < 0.7) status = "draft";

      if (status === "not_started") {
        return { ...it, status, sourceB: it.sourceA === "human" ? "mira" : "human" } as ReviewItemProgress;
      }

      const sourceA: Source = rand(idx + 71) < 0.5 ? "human" : "mira";
      const sourceB: Source = sourceA === "human" ? "mira" : "human";
      const pick = rand(idx + 17);
      const preferred: Selection =
        pick < 0.5 ? "A" : pick < 0.85 ? "B" : pick < 0.93 ? "neither" : "too_similar";

      const avgA = Math.round((4.2 + rand(idx + 31) * 2.2) * 10) / 10;
      const avgB = Math.round((4.0 + rand(idx + 53) * 2.4) * 10) / 10;

      return {
        ...it,
        status,
        preferred,
        avgA: status === "completed" ? avgA : null,
        avgB: status === "completed" ? avgB : null,
        sourceA,
        sourceB,
      };
    })
    .sort((a, b) => {
      const rank = (s: ReviewItemProgress["status"]) =>
        s === "completed" ? 0 : s === "draft" ? 1 : 2;
      return rank(a.status) - rank(b.status);
    });
}

export const REVIEW_ITEMS: ReviewItemProgress[] = buildItems(TOTAL_REVIEW_ITEMS);

export function summarizeProgress(items: ReviewItemProgress[]) {
  const completed = items.filter((i) => i.status === "completed").length;
  const draft = items.filter((i) => i.status === "draft").length;
  const remaining = items.length - completed;
  const byCategory: Record<BarrierCategory, { total: number; completed: number }> =
    Object.fromEntries(
      BARRIER_CATEGORIES.map((c) => [c, { total: 0, completed: 0 }]),
    ) as Record<BarrierCategory, { total: number; completed: number }>;

  for (const it of items) {
    byCategory[it.barrierCategory].total++;
    if (it.status === "completed") byCategory[it.barrierCategory].completed++;
  }

  return {
    total: items.length,
    completed,
    draft,
    remaining,
    byCategory,
  };
}

// -------- Researcher dashboard mock data --------

const ANIMALS = [
  "Otter", "Falcon", "Heron", "Marmot", "Lynx", "Bison", "Crane",
  "Ibis", "Wren", "Badger", "Kestrel", "Vole", "Stoat", "Magpie",
  "Auk", "Tern",
];

export type Reviewer = {
  id: string;
  name: string;
  type: "parent" | "expert";
  assigned: number;
  completed: number;
  /** Mean parent score (1–7) across completed items. */
  meanParentScore: number;
  /** Share of expert "yes" responses across safety / accuracy / relevance. */
  expertYesRate: number;
};

export const REVIEWERS: Reviewer[] = ANIMALS.map((animal, idx) => {
  const total = TOTAL_REVIEW_ITEMS;
  const completion = 0.2 + rand(idx + 101) * 0.8;
  const completed = Math.round(total * completion);
  const type: Reviewer["type"] = idx % 3 === 0 ? "expert" : "parent";
  return {
    id: `R-${String(idx + 1).padStart(2, "0")}`,
    name: `Anon ${animal}`,
    type,
    assigned: total,
    completed,
    meanParentScore: Math.round((4.8 + rand(idx + 201) * 1.8) * 10) / 10,
    expertYesRate: Math.round((0.6 + rand(idx + 301) * 0.35) * 100),
  };
});

export function reviewerSummary(rs: Reviewer[]) {
  const totalAssigned = rs.reduce((s, r) => s + r.assigned, 0);
  const totalCompleted = rs.reduce((s, r) => s + r.completed, 0);
  const completionRate = Math.round((totalCompleted / totalAssigned) * 100);
  const parents = rs.filter((r) => r.type === "parent");
  const experts = rs.filter((r) => r.type === "expert");
  return {
    reviewers: rs.length,
    parents: parents.length,
    experts: experts.length,
    totalAssigned,
    totalCompleted,
    completionRate,
    meanParentScore:
      Math.round(
        (parents.reduce((s, r) => s + r.meanParentScore, 0) /
          Math.max(parents.length, 1)) * 10,
      ) / 10,
    expertYesRate: Math.round(
      experts.reduce((s, r) => s + r.expertYesRate, 0) /
        Math.max(experts.length, 1),
    ),
  };
}

// Mean parent scores per construct (the 6 statements) by response.
import { PARENT_STATEMENTS } from "./dialogues";

export const CONSTRUCT_MEANS = PARENT_STATEMENTS.map((s, idx) => ({
  statement: s,
  responseA: Math.round((5.0 + rand(idx + 11) * 1.4) * 10) / 10,
  responseB: Math.round((4.6 + rand(idx + 27) * 1.6) * 10) / 10,
}));

export type Group = "all" | "parent" | "expert";

export const CONSTRUCT_MEANS_BY_SOURCE = PARENT_STATEMENTS.map((s, idx) => ({
  statement: s,
  short: s.replace(/^This response /, "").replace(/\.$/, ""),
  human: Math.round((5.2 + rand(idx + 131) * 1.2) * 10) / 10,
  mira: Math.round((4.8 + rand(idx + 149) * 1.4) * 10) / 10,
  humanParent: Math.round((5.3 + rand(idx + 131) * 1.1) * 10) / 10,
  humanExpert: Math.round((4.8 + rand(idx + 137) * 1.1) * 10) / 10,
  miraParent: Math.round((4.9 + rand(idx + 149) * 1.3) * 10) / 10,
  miraExpert: Math.round((4.4 + rand(idx + 157) * 1.3) * 10) / 10,
}));

// Mean scores by true source (researcher-only — hidden from participants).
export const SOURCE_MEANS = [
  {
    label: "Human-authored",
    mean: Math.round((5.5 + rand(91) * 0.6) * 10) / 10,
  },
  {
    label: "Mira-generated",
    mean: Math.round((5.2 + rand(92) * 0.7) * 10) / 10,
  },
];

// Preferred response distribution across all completed reviews.
export const PREFERENCE_DISTRIBUTION = [
  { label: "Response A", value: 38, color: "var(--primary)" },
  { label: "Response B", value: 31, color: "var(--accent)" },
  { label: "Too similar", value: 12, color: "oklch(0.78 0.04 250)" },
  { label: "Neither acceptable", value: 6, color: "var(--muted-foreground)" },
];

// Aggregate results broken down by barrier category.
export const CATEGORY_RESULTS = BARRIER_CATEGORIES.map((c, idx) => ({
  category: c,
  meanScore: Math.round((4.8 + rand(idx + 41) * 1.6) * 10) / 10,
  safetyFlags: Math.round(rand(idx + 53) * 3),
  reviewsCompleted: Math.round(40 + rand(idx + 61) * 60),
}));

// -------- Per-item drilldown helpers (deterministic mock) --------

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function groupBias(group: Group): { parent: number; expert: number } {
  if (group === "parent") return { parent: 1, expert: 0 };
  if (group === "expert") return { parent: 0, expert: 1 };
  return { parent: 1, expert: 1 };
}

export function getConstructMeansForItem(itemId: string) {
  const seed = hashId(itemId);
  return CONSTRUCT_MEANS_BY_SOURCE.map((c, idx) => {
    const jitter = (k: number) => (rand(seed + idx * 7 + k) - 0.5) * 0.9;
    const clamp = (v: number) => Math.max(1, Math.min(7, Math.round(v * 10) / 10));
    return {
      statement: c.statement,
      short: c.short,
      humanParent: clamp(c.humanParent + jitter(1)),
      humanExpert: clamp(c.humanExpert + jitter(2)),
      miraParent: clamp(c.miraParent + jitter(3)),
      miraExpert: clamp(c.miraExpert + jitter(4)),
    };
  });
}

export function getConstructBarData(
  rows: ReturnType<typeof getConstructMeansForItem>,
  group: Group,
) {
  const b = groupBias(group);
  return rows.map((r) => {
    const humanValues = [
      b.parent ? r.humanParent : null,
      b.expert ? r.humanExpert : null,
    ].filter((v): v is number => v !== null);
    const miraValues = [
      b.parent ? r.miraParent : null,
      b.expert ? r.miraExpert : null,
    ].filter((v): v is number => v !== null);
    const avg = (arr: number[]) =>
      arr.length ? Math.round((arr.reduce((s, v) => s + v, 0) / arr.length) * 10) / 10 : 0;
    return {
      name: r.short,
      full: r.statement,
      "Response A": avg(humanValues),
      "Response B": avg(miraValues),
    };
  });
}

export function getPreferenceForItem(itemId: string, group: Group) {
  const seed = hashId(itemId) + (group === "expert" ? 11 : group === "parent" ? 7 : 3);
  return [
    { label: "Response A", color: "var(--primary)", base: 34 },
    { label: "Response B", color: "var(--accent)", base: 30 },
    { label: "Too similar", color: "oklch(0.78 0.04 250)", base: 14 },
    { label: "Neither acceptable", color: "var(--muted-foreground)", base: 6 },
  ].map((r, i) => ({
    label: r.label,
    color: r.color,
    value: Math.max(1, Math.round(r.base + (rand(seed + i * 5) - 0.5) * 18)),
  }));
}

export function getSourceMeansForItem(itemId: string, group: Group) {
  const seed = hashId(itemId);
  const bump = group === "expert" ? -0.3 : group === "parent" ? 0.15 : 0;
  const clamp = (v: number) => Math.max(1, Math.min(7, Math.round(v * 10) / 10));
  return [
    { label: "Human-authored", mean: clamp(5.4 + bump + (rand(seed + 1) - 0.5) * 1.2) },
    { label: "Mira-generated", mean: clamp(5.1 + bump + (rand(seed + 2) - 0.5) * 1.4) },
  ];
}

export function getItemReviewCounts(itemId: string) {
  const seed = hashId(itemId);
  const parents = 8 + Math.round(rand(seed + 1) * 10);
  const experts = 2 + Math.round(rand(seed + 2) * 4);
  return { parents, experts, total: parents + experts };
}

export function getItemSummary(itemId: string, group: Group) {
  const seed = hashId(itemId);
  const counts = getItemReviewCounts(itemId);
  const meanParent = Math.round((4.6 + rand(seed + 21) * 2.0) * 10) / 10;
  const yesRate = Math.round((0.55 + rand(seed + 33) * 0.4) * 100);
  const pref = getPreferenceForItem(itemId, group);
  const top = [...pref].sort((a, b) => b.value - a.value)[0];
  return {
    reviews:
      group === "parent" ? counts.parents : group === "expert" ? counts.experts : counts.total,
    parents: counts.parents,
    experts: counts.experts,
    meanParent,
    yesRate,
    preferred: top.label,
  };
}

export function getAggregatePreference(group: Group) {
  if (group === "all") return PREFERENCE_DISTRIBUTION;
  const bump = group === "expert" ? -6 : 4;
  return PREFERENCE_DISTRIBUTION.map((p, i) => ({
    ...p,
    value: Math.max(1, p.value + (i === 0 ? bump : i === 1 ? -bump / 2 : 0)),
  }));
}

export function getAggregateSourceMeans(group: Group) {
  const bump = group === "expert" ? -0.3 : group === "parent" ? 0.1 : 0;
  return SOURCE_MEANS.map((s) => ({
    ...s,
    mean: Math.max(1, Math.min(7, Math.round((s.mean + bump) * 10) / 10)),
  }));
}
