import type { DialogueTurn, BarrierCategory } from "@/data/dialogues";
import { Info, X } from "lucide-react";

type Props = {
  parentConcern: string;
  barrierCategory: BarrierCategory;
  priorDialogue?: DialogueTurn[];
  simulatedTurns?: DialogueTurn[];
  parentTyping?: boolean;
  sentLabel?: "A" | "B" | null;
  onClearPreview?: () => void;
};

export function DialogueContext({
  parentConcern,
  barrierCategory,
  priorDialogue,
  simulatedTurns = [],
  parentTyping = false,
  sentLabel = null,
  onClearPreview,
}: Props) {
  const prior = priorDialogue ?? [];
  const hasPreview = simulatedTurns.length > 0 || parentTyping;
  const totalTurns = prior.length + simulatedTurns.length;

  if (prior.length === 0 && !hasPreview) {
    return (
      <section className="space-y-4">
        <ConcernCard
          parentConcern={parentConcern}
          barrierCategory={barrierCategory}
        />
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <ConcernCard
        parentConcern={parentConcern}
        barrierCategory={barrierCategory}
      />

      <details open className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Prior Dialogue Context ({totalTurns} turn{totalTurns === 1 ? "" : "s"})
        </summary>

        <div className="mt-4 space-y-2">
          {prior.map((turn, i) => (
            <Bubble key={`p-${i}`} speaker={turn.speaker} text={turn.text} />
          ))}
        </div>

        {hasPreview && (
          <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/30 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Optional Dialogue Preview
                {sentLabel && (
                  <span className="ml-2 rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-medium text-foreground">
                    Previewing Response {sentLabel}
                  </span>
                )}
              </div>
              {onClearPreview && (
                <button
                  type="button"
                  onClick={onClearPreview}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2 py-1 text-[11px] text-muted-foreground transition hover:text-foreground"
                >
                  <X className="h-3 w-3" /> Clear preview
                </button>
              )}
            </div>

            <div className="space-y-2">
              {simulatedTurns.map((turn, i) => (
                <Bubble
                  key={`s-${i}`}
                  speaker={turn.speaker}
                  text={turn.text}
                  simulated
                />
              ))}
              {parentTyping && <TypingBubble />}
            </div>

            <p className="mt-3 inline-flex items-start gap-1.5 text-[11px] text-muted-foreground">
              <Info className="mt-px h-3 w-3 shrink-0" />
              Prototype preview only — no live AI is used, the simulated parent
              reply is canned, and nothing here affects your review or scoring.
            </p>
          </div>
        )}
      </details>
    </section>
  );
}

function ConcernCard({
  parentConcern,
  barrierCategory,
}: {
  parentConcern: string;
  barrierCategory: BarrierCategory;
}) {
  return (
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
  );
}

function Bubble({
  speaker,
  text,
  simulated = false,
}: {
  speaker: "parent" | "clinician";
  text: string;
  simulated?: boolean;
}) {
  const isParent = speaker === "parent";
  const label = isParent
    ? simulated
      ? "Parent (simulated)"
      : "Parent"
    : simulated
      ? "Clinician (preview)"
      : "Clinician";
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
          {label}
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
          Parent (simulated)
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
