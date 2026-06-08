import type { DialogueTurn, BarrierCategory } from "@/data/dialogues";

type Props = {
  parentConcern: string;
  barrierCategory: BarrierCategory;
  priorDialogue?: DialogueTurn[];
  simulatedTurns?: DialogueTurn[];
  parentTyping?: boolean;
};

export function DialogueContext({
  parentConcern,
  barrierCategory,
  priorDialogue,
  simulatedTurns,
  parentTyping,
}: Props) {
  const turns = [...(priorDialogue ?? []), ...(simulatedTurns ?? [])];
  const hasTurns = turns.length > 0 || parentTyping;

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

      {hasTurns && (
        <details open className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Prior Dialogue Context ({turns.length} turn{turns.length === 1 ? "" : "s"})
          </summary>
          <div className="mt-4 space-y-2">
            {turns.map((turn, i) => (
              <Bubble key={i} speaker={turn.speaker} text={turn.text} />
            ))}
            {parentTyping && <TypingBubble />}
          </div>
        </details>
      )}
    </section>
  );
}

function Bubble({ speaker, text }: { speaker: "parent" | "clinician"; text: string }) {
  const isParent = speaker === "parent";
  return (
    <div className={`flex ${isParent ? "justify-start" : "justify-end"} animate-fade-in`}>
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

function TypingBubble() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-parent-bubble px-4 py-3 text-sm shadow-sm text-parent-bubble-foreground">
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider opacity-70">
          Parent
        </div>
        <span className="inline-flex items-center gap-1" aria-label="Parent is typing">
          <Dot delay="0ms" />
          <Dot delay="150ms" />
          <Dot delay="300ms" />
        </span>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="inline-block h-2 w-2 animate-bounce rounded-full bg-current opacity-70"
      style={{ animationDelay: delay }}
    />
  );
}
