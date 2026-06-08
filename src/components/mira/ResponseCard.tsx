import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Response } from "@/data/dialogues";

export type SourceGuess = "human" | "ai" | null;

type Props = {
  response: Response;
  selected: boolean;
  onSelect: () => void;
  guess: SourceGuess;
  onGuess: (g: SourceGuess) => void;
};

export function ResponseCard({
  response,
  selected,
  onSelect,
  guess,
  onGuess,
}: Props) {
  return (
    <div
      className={`flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm transition ${
        selected
          ? "border-accent ring-2 ring-accent/40"
          : "border-border hover:border-primary/40"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-primary">{response.title}</h3>
        {selected && (
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
            <Check className="h-3 w-3" /> Selected
          </span>
        )}
      </div>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
        {response.text}
      </p>
      <Button
        type="button"
        variant={selected ? "default" : "outline"}
        onClick={onSelect}
        className="mt-6"
      >
        {selected ? "Selected as stronger response" : "Select as stronger response"}
      </Button>

      <div className="mt-4 border-t border-border pt-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Guess the source
        </p>
        <div className="grid grid-cols-2 gap-2">
          <GuessButton
            label="Human"
            active={guess === "human"}
            onClick={() => onGuess(guess === "human" ? null : "human")}
          />
          <GuessButton
            label="AI"
            active={guess === "ai"}
            onClick={() => onGuess(guess === "ai" ? null : "ai")}
          />
        </div>
      </div>
    </div>
  );
}

function GuessButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
