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
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-foreground">Rating rubric</h2>
        <p className="text-sm text-muted-foreground">
          Rate each response from 1 (low) to 5 (high).
        </p>
      </div>

      <div className="hidden grid-cols-3 items-center gap-6 border-b border-border pb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
        <span className="justify-self-center">Response A</span>
        <span className="text-center">Criterion</span>
        <span className="justify-self-center">Response B</span>
      </div>

      <ul className="divide-y divide-border">
        {RUBRIC_CRITERIA.map((c) => (
          <li
            key={c}
            className="grid gap-3 py-4 sm:grid-cols-3 sm:items-center sm:gap-6"
          >
            <div className="order-2 sm:order-1 sm:justify-self-center">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:hidden">
                Response A
              </div>
              <RatingRow
                value={ratingsA[c]}
                onChange={(v) => onChange("A", c, v)}
              />
            </div>
            <span className="order-1 text-sm font-medium text-foreground sm:order-2 sm:text-center">
              {c}
            </span>
            <div className="order-3 sm:justify-self-center">
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
