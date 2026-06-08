import type { DialogueTurn } from "@/data/dialogues";

type SimulatedResponse = {
  which: "A" | "B";
  text: string;
};

type Props = {
  scenario: string;
  dialogue: DialogueTurn[];
  selectedResponse?: SimulatedResponse | null;
  parentTyping?: boolean;
  parentReply?: string | null;
};

export function DialogueContext({
  scenario,
  dialogue,
  selectedResponse,
  parentTyping,
  parentReply,
}: Props) {
  return (
    <section
      aria-label="Dialogue context"
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Scenario
        </h2>
      </div>
      <p className="mt-2 text-base leading-relaxed text-foreground">
        {scenario}
      </p>

      <div className="mt-6 space-y-3">
        {dialogue.map((turn, i) => (
          <Bubble key={i} speaker={turn.speaker} text={turn.text} />
        ))}

        {selectedResponse && (
          <Bubble
            speaker="clinician"
            text={selectedResponse.text}
            highlightLabel={`Response ${selectedResponse.which} (selected)`}
            highlighted
          />
        )}

        {selectedResponse && parentTyping && <TypingBubble />}

        {selectedResponse && !parentTyping && parentReply && (
          <Bubble speaker="parent" text={parentReply} />
        )}
      </div>
    </section>
  );
}

function Bubble({
  speaker,
  text,
  highlighted,
  highlightLabel,
}: {
  speaker: "parent" | "clinician";
  text: string;
  highlighted?: boolean;
  highlightLabel?: string;
}) {
  const isParent = speaker === "parent";
  return (
    <div className={`flex ${isParent ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isParent
            ? "rounded-tl-sm bg-parent-bubble text-parent-bubble-foreground"
            : "rounded-tr-sm bg-clinician-bubble text-clinician-bubble-foreground"
        } ${highlighted ? "ring-2 ring-accent ring-offset-2 ring-offset-card" : ""}`}
      >
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider opacity-70">
          {highlightLabel ?? (isParent ? "Parent" : "Clinician")}
        </div>
        {text}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-parent-bubble px-4 py-3 text-parent-bubble-foreground shadow-sm">
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider opacity-70">
          Parent
        </div>
        <div className="flex items-center gap-1 py-1">
          <Dot delay="0ms" />
          <Dot delay="150ms" />
          <Dot delay="300ms" />
        </div>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="inline-block h-2 w-2 animate-bounce rounded-full bg-current opacity-60"
      style={{ animationDelay: delay }}
    />
  );
}
