import type { Response } from "@/data/dialogues";
import { ResponseCard } from "./ResponseCard";

type Props = {
  responseA: Response;
  responseB: Response;
  selected: "A" | "B" | null;
  onSelect: (which: "A" | "B") => void;
};

export function ResponseComparison({ responseA, responseB, selected, onSelect }: Props) {
  return (
    <section aria-label="Response comparison" className="grid gap-4 md:grid-cols-2">
      <ResponseCard
        response={responseA}
        selected={selected === "A"}
        onSelect={() => onSelect("A")}
      />
      <ResponseCard
        response={responseB}
        selected={selected === "B"}
        onSelect={() => onSelect("B")}
      />
    </section>
  );
}
