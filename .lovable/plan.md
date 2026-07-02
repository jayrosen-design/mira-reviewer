## Goal

Extend the Research Dashboard so researchers can:
1. Filter every chart/table by reviewer group (All / Parents / Experts).
2. Toggle between **Overall Summary** (current aggregate view) and **By Parent Concern** (per-item drilldown).
3. In drilldown mode, pick a parent concern from a table (styled like My Progress) or step through with prev/next arrows — all charts re-render for just that item.
4. See both **Expert** and **Parent** series overlaid inside each of the two radar charts (Human-authored / MIRA-generated).

Purely presentational — mock data only, no schema or API changes.

## Changes

### `src/data/mockProgress.ts`

- Extend `CONSTRUCT_MEANS_BY_SOURCE` shape to include per-group values:
  `{ statement, short, humanParent, humanExpert, miraParent, miraExpert }`
  Seed with `rand()` so expert values sit slightly below parent values (experts are stricter).
- Add `getConstructMeansForItem(itemId, group)` — returns the same 6-row shape but perturbed by a stable per-item hash so each parent concern has its own radar/bar values.
- Add `getPreferenceForItem(itemId, group)`, `getSourceMeansForItem(itemId, group)`, `getCategoryResultsForItem(itemId)` helpers returning the same shapes as the existing aggregate exports, all deterministically seeded from the item id.
- Add `getAggregateByGroup(group)` returning `{ constructs, preference, sourceMeans }` for the Overall view when a group filter is applied.

### `src/routes/dashboard.tsx`

Top of `ResearchDashboardPage`:

- Add `group` state: `"all" | "parent" | "expert"` — segmented control (shadcn `ToggleGroup`) in the header row, right under the title.
- Add `view` state: `"overall" | "byItem"` — tabs (`Tabs` component) above the KPI cards. Labels: **Overall Summary** and **By Parent Concern**.
- Add `selectedItemId` state (defaults to first `REVIEW_ITEMS` id). Only used in `byItem` mode.

Overall view: renders the current sections, but data comes from `getAggregateByGroup(group)` so the filter applies.

By-Parent-Concern view layout:

```text
[ ◀ Prev ]  MIRA-014 — "How well does this vaccine really work?"  [ Next ▶ ]
             Barrier: Vaccine effectiveness · Reviews: 12 parents / 4 experts

[ small KPI strip: reviews, mean parent score, expert yes-rate, preferred response ]

[ Radar: Human-authored ]   [ Radar: MIRA-generated ]
[ Bar chart: construct means for this item ]
[ Preferred response pie (this item) ]  [ Source comparison bar (this item) ]

[ Parent Concerns table — click a row to jump to it ]
  columns: ID · Barrier category · Parent concern · Reviews · Mean · Preferred
  the selected row is highlighted (bg-muted).
```

Prev/Next buttons wrap around `REVIEW_ITEMS`. Table row click sets `selectedItemId`.

### Radar chart update (both views)

`RadarCard` renders two `<Radar>` series in the same chart:
- **Parent** — solid `var(--primary)` for Human card / `var(--accent)` for MIRA card, `fillOpacity={0.35}`.
- **Expert** — dashed stroke (`strokeDasharray="4 4"`), same base color, `fillOpacity={0.15}`.
Include a `<Legend>` so the two series are distinguishable. When `group === "parent"` hide the Expert series; when `group === "expert"` hide the Parent series.

### Group filter applied everywhere

- KPI cards: hide expert-only KPI when `group === "parent"` and vice versa; recompute counts from `REVIEWERS` filtered by type.
- Reviewer completion table: filter rows by group.
- Preferred distribution pie / source comparison bar / category table: use the group-filtered helper.

No routing changes, no new files.
