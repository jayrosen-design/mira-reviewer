# MIRA — Dialogue Review POC

A frontend-only React proof of concept for reviewers to evaluate motivational interviewing responses. Single main page, mock data, local state only.

## Design system

Update `src/styles.css` tokens for a calm academic look:
- Light background (near-white, slight warm tint)
- Deep blue primary (UF-inspired, e.g. oklch ~0.32 0.12 255)
- Subtle orange accent (e.g. oklch ~0.75 0.15 55) for highlights/selected states
- Generous spacing, rounded-2xl cards, soft borders, restrained shadows
- Typography: system sans, clear hierarchy

All colors via semantic tokens (`bg-background`, `text-primary`, `bg-accent`, etc.) — no hardcoded hex in components.

## Routes

Replace placeholder `src/routes/index.tsx` with the Dialogue Review page (sets proper `<title>` and meta). No new routes needed.

## Mock data

`src/data/dialogues.ts` — 3 sample review items, each with:
- `id`, `reviewSet`
- `scenario` (one-sentence summary)
- `dialogue`: array of `{ speaker: "parent" | "clinician", text }` turns
- `responseA`, `responseB`: `{ title, text }` (sources hidden in UI)
- metadata (sources stored but rendered as "Hidden")

Topics: HPV vaccine hesitation, adolescent vaping, medication adherence.

## Component structure

```
src/routes/index.tsx                  -> renders <DialogueReview />
src/components/mira/
  Header.tsx                          -> title, subtitle, description, "Review N of M"
  DialogueContext.tsx                 -> scenario + chat bubbles (parent vs clinician styling)
  ResponseCard.tsx                    -> title, text, "Select as stronger response" button, selected state
  ResponseComparison.tsx              -> two ResponseCards side-by-side (stacks on tablet/mobile)
  RubricRating.tsx                    -> 7 criteria × 1–5 clickable buttons, per response (A and B columns)
  ReviewerComments.tsx                -> textarea
  ReviewActions.tsx                   -> Save Draft / Submit Review / Next Dialogue
  ResearchMetadata.tsx                -> collapsible (shadcn Collapsible), sources shown as "Hidden"
  SubmittedState.tsx                  -> "Review submitted. Thank you." confirmation
  DialogueReview.tsx                  -> page container, owns state, wires everything
```

Reuse existing shadcn primitives: `card`, `button`, `textarea`, `collapsible`, `separator`, `badge`, `sonner` (toast for Save Draft).

## State (local, per dialogue)

`DialogueReview` holds:
- `currentIndex` (0..N-1)
- `reviews[index] = { selectedStronger: "A" | "B" | null, ratingsA: Record<criterion, 1–5>, ratingsB: ..., comments: string, status: "draft" | "submitted" }`

Behavior:
- Selecting a stronger response toggles a subtle accent-bordered/filled state on the chosen card.
- Rating buttons highlight selected value (1–5 pill row per criterion, two columns labeled A/B).
- Save Draft → toast "Draft saved" (stays on item).
- Submit Review → marks item submitted, swaps page body for `SubmittedState` with a "Next Dialogue" button.
- Next Dialogue → advances `currentIndex` (wraps or disables at end), resets to review view for that item (preserving any prior state).
- All ephemeral; no persistence, no backend.

## Responsiveness

- Desktop/tablet: A/B cards side-by-side (grid-cols-2), rubric in two columns.
- Narrow tablet/mobile: stack to single column.

## Out of scope

No auth, no backend, no Lovable Cloud, no routing beyond the index page.
