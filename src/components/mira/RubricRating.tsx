import {
  PARENT_STATEMENTS,
  AGREEMENT_LABELS,
  EXPERT_QUESTIONS,
  type ParentStatement,
  type ExpertQuestion,
  type ExpertAnswer,
} from "@/data/dialogues";

export type ParentRatings = Partial<Record<ParentStatement, number>>;
export type ExpertRatings = Partial<Record<ExpertQuestion, ExpertAnswer>>;

// ---------- Parent (7-point agreement) ----------

type ParentProps = {
  ratingsA: ParentRatings;
  ratingsB: ParentRatings;
  onChange: (which: "A" | "B", statement: ParentStatement, value: number | null) => void;
};

function AgreementRow({
  value,
  onChange,
  ariaLabelPrefix,
}: {
  value: number | undefined;
  onChange: (v: number | null) => void;
  ariaLabelPrefix: string;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {[1, 2, 3, 4, 5, 6, 7].map((n) => {
        const active = value === n;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(active ? null : n)}
            title={AGREEMENT_LABELS[n]}
            aria-label={`${ariaLabelPrefix}: ${AGREEMENT_LABELS[n]}`}
            aria-pressed={active}
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

export function ParentRubric({ ratingsA, ratingsB, onChange }: ParentProps) {
  return (
    <section
      aria-label="Parent reviewer rubric"
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">Rate each response</h2>
        <p className="text-sm text-muted-foreground">
          Rate your agreement with each statement on a 7-point scale.
          <span className="ml-1 text-xs">
            (1 = Strongly Disagree, 4 = Neutral, 7 = Strongly Agree)
          </span>
        </p>
      </div>

      <div className="hidden grid-cols-[1fr_auto_1fr] items-center gap-6 border-b border-border pb-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
        <span className="justify-self-center">Response A</span>
        <span className="text-center">Statement</span>
        <span className="justify-self-center">Response B</span>
      </div>

      <ul className="divide-y divide-border">
        {PARENT_STATEMENTS.map((s) => (
          <li
            key={s}
            className="grid gap-3 py-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-6"
          >
            <div className="order-2 sm:order-1 sm:justify-self-center">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:hidden">
                Response A
              </div>
              <AgreementRow
                value={ratingsA[s]}
                onChange={(v) => onChange("A", s, v)}
                ariaLabelPrefix={`A — ${s}`}
              />
            </div>
            <div className="order-1 max-w-xs text-sm text-foreground sm:order-2 sm:text-center">
              {s}
            </div>
            <div className="order-3 sm:justify-self-center">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:hidden">
                Response B
              </div>
              <AgreementRow
                value={ratingsB[s]}
                onChange={(v) => onChange("B", s, v)}
                ariaLabelPrefix={`B — ${s}`}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---------- Expert (Yes / No / Unsure) ----------

type ExpertProps = {
  ratingsA: ExpertRatings;
  ratingsB: ExpertRatings;
  onChange: (which: "A" | "B", question: ExpertQuestion, value: ExpertAnswer) => void;
  notesA: string;
  notesB: string;
  onNotes: (which: "A" | "B", value: string) => void;
};

function YesNoUnsure({
  value,
  onChange,
}: {
  value: ExpertAnswer;
  onChange: (v: ExpertAnswer) => void;
}) {
  const opts: { id: NonNullable<ExpertAnswer>; label: string }[] = [
    { id: "yes", label: "Yes" },
    { id: "no", label: "No" },
    { id: "unsure", label: "Unsure" },
  ];
  return (
    <div className="flex gap-1.5">
      {opts.map(({ id, label }) => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(active ? null : id)}
            aria-pressed={active}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function ExpertRubric({
  ratingsA,
  ratingsB,
  onChange,
  notesA,
  notesB,
  onNotes,
}: ExpertProps) {
  return (
    <section
      aria-label="Expert reviewer rubric"
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">Expert safety review</h2>
        <p className="text-sm text-muted-foreground">
          For each response, indicate whether it is medically safe, accurate, and relevant.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {(["A", "B"] as const).map((which) => {
          const ratings = which === "A" ? ratingsA : ratingsB;
          const notes = which === "A" ? notesA : notesB;
          return (
            <div
              key={which}
              className="rounded-xl border border-border bg-muted/30 p-4"
            >
              <h3 className="mb-3 text-sm font-semibold text-primary">
                Response {which}
              </h3>
              <ul className="space-y-3">
                {EXPERT_QUESTIONS.map((q) => (
                  <li key={q} className="space-y-1.5">
                    <div className="text-sm text-foreground">{q}</div>
                    <YesNoUnsure
                      value={ratings[q] ?? null}
                      onChange={(v) => onChange(which, q, v)}
                    />
                  </li>
                ))}
              </ul>
              <label className="mt-4 block">
                <span className="mb-1 block text-xs font-medium text-foreground">
                  Optional expert notes
                </span>
                <textarea
                  value={notes}
                  onChange={(e) => onNotes(which, e.target.value)}
                  placeholder="Clinical notes, caveats, or suggested edits."
                  className="min-h-20 w-full resize-y rounded-md border border-border bg-background p-2 text-sm"
                />
              </label>
            </div>
          );
        })}
      </div>
    </section>
  );
}
