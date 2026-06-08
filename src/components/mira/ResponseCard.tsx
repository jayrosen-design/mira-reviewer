import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Response } from "@/data/dialogues";

type Props = {
  response: Response;
  selected: boolean;
  onSelect: () => void;
};

export function ResponseCard({ response, selected, onSelect }: Props) {
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
    </div>
  );
}
