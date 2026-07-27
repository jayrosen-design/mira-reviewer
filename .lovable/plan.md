## Goal

Add a Researcher/Admin-only **Generate Transcripts** page where a researcher writes a scenario prompt, "generates" MIRA transcripts (mocked — no LLM at runtime), reads them turn-by-turn, previews the blinded MITI coding sheet, and pushes batches to REDCap with tracked statuses.

## Navigation & access

- New nav item **Generate Transcripts**, researcher-only, placed after **Users** in the navbar.
- Route `/generate`, added to the researcher allow-list in the `__root` auth gate (blocked for parent/expert).
- Page `head()` with its own title/description.

## Page layout (`src/routes/generate.tsx`)

```text
Generate Transcripts                       [ Research preview — mock output ]
Scenario prompt
[ textarea: "Parent hesitant about HPV vaccine for a 9-year-old…" ]
Barrier category (auto-tagged)  ·  # transcripts [1–5]  ·  Model: mira-v0.4.1
                                                        [ Generate ]

Batches
┌ Batch · prompt excerpt · count · created · status chip · [Send to REDCap] ┐
└ rows clickable → expands / selects batch                                  ┘

Selected batch → transcript list (T-001 … T-00n)  [ ◀ Prev  Next ▶ ]
  ┌ Transcript viewer ─────────────┐ ┌ MITI coding preview (blinded) ──────┐
  │ clinician / parent turn bubbles│ │ Global: Cultivating Change Talk 1–5 │
  │ blinded ID: MIRA-GEN-7c41      │ │ Partnership, Empathy, Softening     │
  │ (no source label shown)        │ │ Behavior counts: OQ, CQ, SR, CR,    │
  └────────────────────────────────┘ │ Affirm, Seek Collab, MI Adherent    │
                                     │ read-only, "coded in REDCap" note   │
                                     └──────────────────────────────────────┘
```

- A generation run is simulated: button shows a short "Generating…" state, then transcripts appear (deterministic mock builder seeded from the prompt text).
- Note under the header: *"Prototype only — transcripts are pre-scripted mock content. The production system generates these offline; MIRA does not run an LLM at review time."*
- Blinding note in the viewer: transcripts are labeled with an opaque generated ID and never show `source`.

## REDCap transmission

- Per-batch status chip: **Draft → Queued → Sent → Coded**, with mocked REDCap record ID (`REDCAP-2026-0142`) and timestamp shown once sent.
- **Send to REDCap** button advances Draft → Queued → Sent after a brief simulated delay; a **Mark coded** action (researcher-only mock) advances Sent → Coded.
- Sent batches become read-only; a small legend explains each status.

## Mock data (`src/data/mockTranscripts.ts`)

New file, matching the style of `mockProgress.ts`:
- `GeneratedTranscript` — `{ id, blindedId, batchId, barrierCategory, turns: DialogueTurn[], modelVersion, generatedAt }`
- `TranscriptBatch` — `{ id, prompt, count, createdAt, status, redcapRecordId?, sentAt? }`
- `MITI_GLOBAL_SCORES` (Cultivating Change Talk, Softening Sustain Talk, Partnership, Empathy — 1–5) and `MITI_BEHAVIOR_COUNTS` (Open/Closed Questions, Simple/Complex Reflections, Affirmations, Seeking Collaboration, MI Adherent/Non-Adherent).
- `generateTranscripts(prompt, count)` — deterministic seeded builder that assembles turns from templated MI fragments per barrier category.
- Two pre-seeded batches so the page isn't empty on first load (one `Sent`, one `Coded`).

State lives in React (`useState`) on the page — no persistence, consistent with the rest of the prototype.

## Docs

- **New API docs page** `src/routes/api-docs.transcripts.tsx`, linked in the API Docs sidebar after Users:
  - `POST /v1/transcripts/generate` — scenario prompt + count → batch
  - `GET /v1/transcripts/batches` and `GET /v1/transcripts/batches/:id`
  - `GET /v1/transcripts/:id` — blinded transcript payload
  - `POST /v1/transcripts/batches/:id/redcap` — push to REDCap, returns record ID
  - `GET /v1/transcripts/batches/:id/redcap/status` — coding progress webhook/poll
  - All researcher-auth, with error codes.
- **`src/data/schemaErd.ts`** — add `TRANSCRIPT_BATCHES` and `GENERATED_TRANSCRIPTS` tables and their relations to `REVIEWERS`.
- **`README.md`** — new "Generate Transcripts / REDCap MITI review" section describing the secondary blinded review loop, the two new tables with sample rows, and a Mermaid sequence diagram (Researcher → app → generation service → REDCap → MITI coders → results back).
- **`api-docs.index.tsx`** — mention the new section and note that REDCap coding happens outside this app.

## Technical notes

- Purely presentational; no backend, no Lovable Cloud, no LLM calls.
- Reuses `DialogueTurn`/`BarrierCategory` types from `src/data/dialogues.ts`.
- Uses existing shadcn primitives (Card, Table, Badge, Button, Textarea, Select) and the same design tokens as the dashboard — no new colors.
