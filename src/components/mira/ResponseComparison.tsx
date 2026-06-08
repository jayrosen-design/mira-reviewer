import { Check, Equal, Ban } from "lucide-react";
import type { Response } from "@/data/dialogues";
import { ResponseCard } from "./ResponseCard";

export type Selection = "A" | "B" | "neither" | "too_similar" | null;

type Props = {
  responseA: Response;
  responseB: Response;
  selected: Selection;
  onSelect: (which: Selection) => void;
};

export function ResponseComparison({ responseA, responseB, selected, onSelect }: Props) {
  return (
    <section
      aria-label="Response comparison"
      className="grid gap-4 md:grid-cols-[1fr_180px_1fr]"
    >
      <ResponseCard
        response={responseA}
        selected={selected === "A"}
        onSelect={() => onSelect(selected === "A" ? null : "A")}
      />

      <div className="flex flex-col gap-3">
        <AltOption
          label="Too similar"
          description="Both responses are essentially equivalent in quality."
          icon={<Equal className="h-4 w-4" />}
          active={selected === "too_similar"}
          onClick={() =>
            onSelect(selected === "too_similar" ? null : "too_similar")
          }
        />
        <AltOption
          label="Neither"
          description="Neither response is acceptable."
          icon={<Ban className="h-4 w-4" />}
          active={selected === "neither"}
          onClick={() => onSelect(selected === "neither" ? null : "neither")}
        />
      </div>

      <ResponseCard
        response={responseB}
        selected={selected === "B"}
        onSelect={() => onSelect(selected === "B" ? null : "B")}
      />
    </section>

  );
}

function AltOption({
  label,
  description,
  icon,
  active,
  onClick,
}: {
  label: string;
  description: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-full flex-col items-start gap-2 rounded-2xl border bg-card p-4 text-left shadow-sm transition ${
        active
          ? "border-accent ring-2 ring-accent/40"
          : "border-border hover:border-primary/40"
      }`}
    >
      <div className="flex w-full items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          {icon}
          {label}
        </span>
        {active && (
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
            <Check className="h-3 w-3" />
          </span>
        )}
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
    </button>
  );
}
