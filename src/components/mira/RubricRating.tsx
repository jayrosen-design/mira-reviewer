import { RUBRIC_CRITERIA, type Criterion } from "@/data/dialogues";

export type Ratings = Partial<Record<Criterion, number>>;

type Props = {
  ratingsA: Ratings;
  ratingsB: Ratings;
  onChange: (which: "A" | "B", criterion: Criterion, value: number) => void;
};

function RatingRow({
  value,
  onChange,
}: {
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = value === n;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-label={`Rate ${n}`}
            className={`h-8 w-8 rounded-md border text-xs font-medium transition ${
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}

export function RubricRating({ ratingsA, ratingsB, onChange }: Props) {
  return (
    <section
      aria-label="Rating rubric"
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Rating rubric</h2>
          <p className="text-sm text-muted-foreground">
            Rate each response from 1 (low) to 5 (high).
          </p>
        </div>
        <div className="hidden gap-12 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:flex">
          <span>Response A</span>
          <span>Response B</span>
        </div>
      </div>

      <ul className="divide-y divide-border">
        {RUBRIC_CRITERIA.map((c) => (
          <li
            key={c}
            className="grid gap-3 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-8"
          >
            <span className="text-sm font-medium text-foreground">{c}</span>
            <div>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:hidden">
                Response A
              </div>
              <RatingRow
                value={ratingsA[c]}
                onChange={(v) => onChange("A", c, v)}
              />
            </div>
            <div>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:hidden">
                Response B
              </div>
              <RatingRow
                value={ratingsB[c]}
                onChange={(v) => onChange("B", c, v)}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
