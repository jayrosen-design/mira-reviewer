import type { DialogueTurn, BarrierCategory } from "@/data/dialogues";

type Props = {
  parentConcern: string;
  barrierCategory: BarrierCategory;
  priorDialogue?: DialogueTurn[];
};

export function DialogueContext({ parentConcern, barrierCategory, priorDialogue }: Props) {
  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Parent Concern
          </h2>
          <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[11px] font-medium text-accent-foreground">
            {barrierCategory}
          </span>
        </div>
        <p className="mt-3 text-lg leading-relaxed text-foreground">
          “{parentConcern}”
        </p>
      </div>

      {priorDialogue && priorDialogue.length > 0 && (
        <details open className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Prior Dialogue Context ({priorDialogue.length} turns)
          </summary>
          <div className="mt-4 space-y-2">
            {priorDialogue.map((turn, i) => (
              <Bubble key={i} speaker={turn.speaker} text={turn.text} />
            ))}
          </div>
        </details>
      )}
    </section>
  );
}

function Bubble({ speaker, text }: { speaker: "parent" | "clinician"; text: string }) {
  const isParent = speaker === "parent";
  return (
    <div className={`flex ${isParent ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isParent
            ? "rounded-tl-sm bg-parent-bubble text-parent-bubble-foreground"
            : "rounded-tr-sm bg-clinician-bubble text-clinician-bubble-foreground"
        }`}
      >
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider opacity-70">
          {isParent ? "Parent" : "Clinician"}
        </div>
        {text}
      </div>
    </div>
  );
}
