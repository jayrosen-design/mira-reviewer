import type { BarrierCategory, DialogueTurn } from "./dialogues";
import { BARRIER_CATEGORIES } from "./dialogues";

export type BatchStatus = "draft" | "queued" | "sent" | "coded";

export const BATCH_STATUS_LABEL: Record<BatchStatus, string> = {
  draft: "Draft",
  queued: "Queued",
  sent: "Sent to REDCap",
  coded: "MITI coded",
};

export type GeneratedTranscript = {
  id: string;
  /** Opaque ID shown to MITI coders — never reveals the generator. */
  blindedId: string;
  batchId: string;
  barrierCategory: BarrierCategory;
  turns: DialogueTurn[];
  modelVersion: string;
  generatedAt: string;
};

export type TranscriptBatch = {
  id: string;
  prompt: string;
  count: number;
  createdAt: string;
  status: BatchStatus;
  modelVersion: string;
  redcapRecordId?: string;
  sentAt?: string;
  codedAt?: string;
};

export const MODEL_VERSION = "mira-v0.4.1";

// ---------- MITI coding sheet (mirrors the REDCap instrument) ----------

export const MITI_GLOBAL_SCORES = [
  { key: "cct", label: "Cultivating Change Talk", help: "Encourages the parent's own reasons for change." },
  { key: "sst", label: "Softening Sustain Talk", help: "Avoids reinforcing arguments against change." },
  { key: "partnership", label: "Partnership", help: "Treats the parent as a collaborator." },
  { key: "empathy", label: "Empathy", help: "Conveys understanding of the parent's perspective." },
] as const;

export const MITI_BEHAVIOR_COUNTS = [
  { key: "oq", label: "Open Questions" },
  { key: "cq", label: "Closed Questions" },
  { key: "sr", label: "Simple Reflections" },
  { key: "cr", label: "Complex Reflections" },
  { key: "af", label: "Affirmations" },
  { key: "sc", label: "Seeking Collaboration" },
  { key: "mia", label: "MI Adherent" },
  { key: "mina", label: "MI Non-Adherent" },
] as const;

export type MitiPreview = {
  globals: { key: string; label: string; help: string; score: number }[];
  behaviors: { key: string; label: string; count: number }[];
};

// ---------- Deterministic pseudo-random helpers ----------

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Stable MITI preview values for a given transcript. */
export function getMitiPreview(transcriptId: string): MitiPreview {
  const rand = seeded(hashString(transcriptId) || 7);
  return {
    globals: MITI_GLOBAL_SCORES.map((g) => ({
      ...g,
      score: 3 + Math.round(rand() * 2), // 3–5
    })),
    behaviors: MITI_BEHAVIOR_COUNTS.map((b) => ({
      ...b,
      count:
        b.key === "mina"
          ? Math.round(rand() * 1)
          : b.key === "cr" || b.key === "oq"
            ? 3 + Math.round(rand() * 4)
            : 1 + Math.round(rand() * 4),
    })),
  };
}

// ---------- Transcript content templates ----------

const PARENT_OPENERS: Record<BarrierCategory, string[]> = {
  "Vaccine effectiveness": [
    "I keep reading that it doesn't really stop cancer, so I'm not sure it's worth it.",
    "How do you even know this works ten or twenty years down the line?",
  ],
  "Safety or side effects": [
    "A friend's daughter fainted right after her shot. That really scared me.",
    "I've seen a lot online about long-term side effects nobody talks about.",
  ],
  "Sexual activity concern": [
    "He's eleven. Bringing this up feels like we're opening a door too early.",
    "I worry she'll think we're expecting her to be sexually active.",
  ],
  "Lack of clinician recommendation": [
    "Nobody at our old clinic ever mentioned it, so I assumed it could wait.",
    "If it were important, wouldn't our pediatrician have pushed it already?",
  ],
  "Child is too young": [
    "Nine feels far too early for a vaccine like this.",
    "Can't we just wait until she's a teenager and revisit it then?",
  ],
};

const CLINICIAN_REFLECTIONS = [
  "It sounds like you want to be sure this is the right call for your child, not just the default one.",
  "You've clearly been doing your own reading, and you want an answer that holds up.",
  "What I'm hearing is that protecting your child comes first, and you're not going to rush this.",
  "You're weighing what you've heard against what feels right for your family.",
];

const CLINICIAN_INFO = [
  "Would it be okay if I shared what the follow-up studies have found, and then you tell me what you think?",
  "I can walk you through what we typically see, and you can decide how much of it matters to you.",
  "There's no decision needed today — would it help to look at the numbers together?",
  "Some parents find it useful to hear what the first few days after the shot usually look like.",
];

const PARENT_FOLLOWUPS = [
  "I guess I'd want to know what's actually been studied, not just what people post.",
  "That's fair. I'm still nervous, but I'd listen.",
  "Okay — what would you tell a parent who's on the fence?",
  "I appreciate you not pushing. That helps.",
];

const CLINICIAN_CLOSERS = [
  "Whatever you decide, I'd rather you leave with your questions answered than with a shot you weren't sure about.",
  "How about we revisit this at the next visit, and in the meantime I'll send you a plain-language summary?",
  "You know your child better than anyone — my job is just to make sure you have the full picture.",
];

function pick<T>(arr: readonly T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length) % arr.length];
}

function inferCategory(prompt: string, rand: () => number): BarrierCategory {
  const p = prompt.toLowerCase();
  if (/effect|work|cancer|protect/.test(p)) return "Vaccine effectiveness";
  if (/safe|side effect|reaction|risk/.test(p)) return "Safety or side effects";
  if (/sex|activity|promiscu/.test(p)) return "Sexual activity concern";
  if (/pediatric|doctor|recommend|clinician/.test(p)) return "Lack of clinician recommendation";
  if (/young|age|nine|9|10|eleven/.test(p)) return "Child is too young";
  return pick(BARRIER_CATEGORIES, rand);
}

/**
 * Deterministic mock "generation". In production this call would hit an offline
 * generation service; the reviewer app never runs an LLM at request time.
 */
export function generateTranscripts(
  prompt: string,
  count: number,
  batchId: string,
): GeneratedTranscript[] {
  const base = hashString(`${batchId}::${prompt}`);
  const now = new Date().toISOString();

  return Array.from({ length: count }, (_, i) => {
    const rand = seeded(base + i * 977);
    const barrierCategory = inferCategory(prompt, rand);
    const turns: DialogueTurn[] = [
      { speaker: "clinician", text: "Thanks for making time today. I wanted to check in about the HPV vaccine — where are you with it right now?" },
      { speaker: "parent", text: pick(PARENT_OPENERS[barrierCategory], rand) },
      { speaker: "clinician", text: pick(CLINICIAN_REFLECTIONS, rand) },
      { speaker: "clinician", text: pick(CLINICIAN_INFO, rand) },
      { speaker: "parent", text: pick(PARENT_FOLLOWUPS, rand) },
      { speaker: "clinician", text: pick(CLINICIAN_CLOSERS, rand) },
    ];

    const blindedSuffix = (hashString(`${batchId}-${i}`) % 65536).toString(16).padStart(4, "0");
    return {
      id: `${batchId}-T${String(i + 1).padStart(3, "0")}`,
      blindedId: `TRX-${blindedSuffix.toUpperCase()}`,
      batchId,
      barrierCategory,
      turns,
      modelVersion: MODEL_VERSION,
      generatedAt: now,
    };
  });
}

// ---------- Pre-seeded batches so the page is never empty ----------

export const SEED_BATCHES: TranscriptBatch[] = [
  {
    id: "BATCH-2026-003",
    prompt: "Parent hesitant about HPV vaccine safety for a 10-year-old after reading about side effects online.",
    count: 4,
    createdAt: "2026-07-14T09:20:00Z",
    status: "coded",
    modelVersion: MODEL_VERSION,
    redcapRecordId: "REDCAP-2026-0138",
    sentAt: "2026-07-14T10:02:00Z",
    codedAt: "2026-07-21T16:41:00Z",
  },
  {
    id: "BATCH-2026-004",
    prompt: "Parent unsure the vaccine really prevents cancer; wants evidence on long-term effectiveness.",
    count: 3,
    createdAt: "2026-07-22T13:05:00Z",
    status: "sent",
    modelVersion: MODEL_VERSION,
    redcapRecordId: "REDCAP-2026-0142",
    sentAt: "2026-07-22T13:31:00Z",
  },
];

export const SEED_TRANSCRIPTS: GeneratedTranscript[] = SEED_BATCHES.flatMap((b) =>
  generateTranscripts(b.prompt, b.count, b.id),
);
