import type { DialogueTurn } from "@/data/dialogues";
import { Info, X } from "lucide-react";

type Props = {
  simulatedTurns: DialogueTurn[];
  parentTyping: boolean;
  sentLabel: "A" | "B" | null;
  onClear: () => void;
};

export function DialoguePreviewPanel({
  simulatedTurns,
  parentTyping,
  sentLabel,
  onClear,
}: Props) {
  const hasContent = simulatedTurns.length > 0 || parentTyping;

  return (
    <section
      aria-label="Optional dialogue preview"
      className="rounded-2xl border border-dashed border-border bg-muted/30 p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Optional Dialogue Preview
          </h2>
          <p className="mt-1 text-sm text-foreground">
            See how the selected response might land in conversation. This area
            does not change the review stimulus above.
          </p>
        </div>
        {hasContent && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground transition hover:text-foreground"
          >
            <X className="h-3 w-3" /> Clear preview
          </button>
        )}
      </div>

      {!hasContent ? (
        <div className="mt-4 rounded-xl border border-border bg-card/60 p-5 text-center text-sm text-muted-foreground">
          Use <span className="font-medium">“Preview in dialogue context”</span>{" "}
          on Response A or B to simulate how a parent might respond. Previews
          are not scored.
        </div>
      ) : (
        <div className="mt-4 space-y-2 rounded-xl border border-border bg-card p-4">
          {sentLabel && (
            <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Previewing Response {sentLabel}
            </div>
          )}
          {simulatedTurns.map((turn, i) => (
            <Bubble key={i} speaker={turn.speaker} text={turn.text} />
          ))}
          {parentTyping && <TypingBubble />}
        </div>
      )}

      <p className="mt-3 inline-flex items-start gap-1.5 text-[11px] text-muted-foreground">
        <Info className="mt-px h-3 w-3 shrink-0" />
        Prototype preview only — no live AI is used, the simulated parent reply
        is canned, and nothing here affects your review or scoring.
      </p>
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
          {isParent ? "Parent (simulated)" : "Clinician"}
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
