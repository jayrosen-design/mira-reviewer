import type { DialogueTurn } from "@/data/dialogues";

type Props = {
  scenario: string;
  dialogue: DialogueTurn[];
};

export function DialogueContext({ scenario, dialogue }: Props) {
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
        {dialogue.map((turn, i) => {
          const isParent = turn.speaker === "parent";
          return (
            <div
              key={i}
              className={`flex ${isParent ? "justify-start" : "justify-end"}`}
            >
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
                {turn.text}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
