## Goal
On `/dashboard`, add two radar charts above the "Average parent rating by construct (1–7)" bar chart. Each chart has 6 axes (one per parent construct statement) and a 0–7 radial scale. One chart shows Human-authored mean ratings, the other shows MIRA-generated mean ratings.

## Changes

### 1. `src/data/mockProgress.ts`
- Add a new export `CONSTRUCT_MEANS_BY_SOURCE` alongside the existing `CONSTRUCT_MEANS`, shaped as:
  ```ts
  { statement: string; short: string; human: number; mira: number }[]
  ```
  Values seeded via the existing `rand()` helper so numbers stay stable (human ~5.2–6.4, mira ~4.8–6.2). `short` is the label used on radar axes (statement with "This response " stripped).

### 2. `src/routes/dashboard.tsx`
- Import `Radar`, `RadarChart`, `PolarGrid`, `PolarAngleAxis`, `PolarRadiusAxis` from `recharts`, plus the new `CONSTRUCT_MEANS_BY_SOURCE`.
- Insert a new `<section>` immediately above the existing construct bar chart section:
  - Two-column grid on `lg` (`grid gap-4 lg:grid-cols-2`), stacked on mobile.
  - Two `<Card>`s: "Human-authored — mean parent rating by construct" and "MIRA-generated — mean parent rating by construct".
  - Each card contains a `ResponsiveContainer` (h-80) wrapping a `RadarChart` with:
    - `PolarGrid stroke="var(--border)"`
    - `PolarAngleAxis dataKey="short"` with small muted tick style
    - `PolarRadiusAxis angle={90} domain={[0, 7]} tickCount={8}` (levels 0–7)
    - One `Radar` series: Human card uses `var(--primary)`, MIRA card uses `var(--accent)`, both with `fillOpacity={0.35}`
    - `Tooltip` styled to match existing charts
- Leave the existing bar chart, source comparison, pie chart, and tables unchanged.

## Notes
- Purely presentational; no schema, API doc, or business-logic changes.
- Uses the same design tokens already in play (`var(--primary)`, `var(--accent)`, `var(--border)`, `var(--muted-foreground)`, `var(--card)`).
