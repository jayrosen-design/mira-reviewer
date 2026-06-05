import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type Props = {
  dialogueId: string;
  reviewSet: string;
  reviewerId?: string;
};

export function ResearchMetadata({
  dialogueId,
  reviewSet,
  reviewerId = "Demo Reviewer",
}: Props) {
  const [open, setOpen] = useState(false);

  const rows: [string, string][] = [
    ["Dialogue ID", dialogueId],
    ["Review Set", reviewSet],
    ["Response A Source", "Hidden"],
    ["Response B Source", "Hidden"],
    ["Reviewer ID", reviewerId],
  ];

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="rounded-2xl border border-border bg-card shadow-sm"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between px-6 py-4 text-left">
        <span className="text-sm font-semibold text-foreground">
          Research metadata
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t border-border px-6 py-4">
        <dl className="grid gap-3 sm:grid-cols-2">
          {rows.map(([k, v]) => (
            <div key={k} className="flex flex-col">
              <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {k}
              </dt>
              <dd className="text-sm text-foreground">{v}</dd>
            </div>
          ))}
        </dl>
      </CollapsibleContent>
    </Collapsible>
  );
}
