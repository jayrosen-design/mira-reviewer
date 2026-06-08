import { Star } from "lucide-react";
import type { Response } from "@/data/dialogues";

type Props = {
  response: Response;
  preferred: boolean;
};

export function ResponseCard({ response, preferred }: Props) {
  return (
    <div
      className={`flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm transition ${
        preferred
          ? "border-accent ring-2 ring-accent/40"
          : "border-border"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-primary">{response.title}</h3>
        {preferred && (
          <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
            <Star className="h-3 w-3" /> Preferred
          </span>
        )}
      </div>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
        {response.text}
      </p>
    </div>
  );
}
