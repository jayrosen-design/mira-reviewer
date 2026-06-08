import { Ban, Equal, Star } from "lucide-react";
import type { Response } from "@/data/dialogues";
import { ResponseCard } from "./ResponseCard";

export type Selection = "A" | "B" | "neither" | "too_similar" | null;

type Props = {
  responseA: Response;
  responseB: Response;
  selected: Selection;
  onSelect: (which: Selection) => void;
};

export function ResponseComparison({
  responseA,
  responseB,
  onSend,
  sendDisabled,
}: Pick<Props, "responseA" | "responseB"> & {
  selected?: Selection;
  onSend?: (which: "A" | "B") => void;
  sendDisabled?: boolean;
}) {
  return (
    <section
      aria-label="Response comparison"
      className="grid gap-4 md:grid-cols-2"
    >
      <ResponseCard
        response={responseA}
        preferred={false}
        onSend={onSend ? () => onSend("A") : undefined}
        sendDisabled={sendDisabled}
      />
      <ResponseCard
        response={responseB}
        preferred={false}
        onSend={onSend ? () => onSend("B") : undefined}
        sendDisabled={sendDisabled}
      />
    </section>
  );
}

type PreferredProps = {
  responseA: Response;
  responseB: Response;
  selected: Selection;
  onSelect: (which: Selection) => void;
};

export function PreferredResponse({ responseA, responseB, selected, onSelect }: PreferredProps) {
  const options: { id: Selection; label: string; sublabel?: string; icon?: React.ReactNode }[] = [
    { id: "A", label: "Prefer Response A", sublabel: truncate(responseA.text) },
    { id: "B", label: "Prefer Response B", sublabel: truncate(responseB.text) },
    {
      id: "too_similar",
      label: "Responses are too similar to choose",
      icon: <Equal className="h-4 w-4" />,
    },
    {
      id: "neither",
      label: "Neither response is acceptable",
      icon: <Ban className="h-4 w-4" />,
    },
  ];

  return (
    <section
      aria-label="Preferred response"
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">Preferred response</h2>
        <p className="text-sm text-muted-foreground">
          After rating both responses, choose which one you prefer overall.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((opt) => {
          const active = selected === opt.id;
          return (
            <button
              key={String(opt.id)}
              type="button"
              onClick={() => onSelect(active ? null : opt.id)}
              aria-pressed={active}
              className={`flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition ${
                active
                  ? "border-accent bg-accent-soft ring-2 ring-accent/40"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                {opt.icon}
                {opt.label}
                {active && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
                    <Star className="h-3 w-3" /> Preferred
                  </span>
                )}
              </span>
              {opt.sublabel && (
                <span className="line-clamp-2 text-xs text-muted-foreground">
                  {opt.sublabel}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function truncate(s: string, n = 120) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
