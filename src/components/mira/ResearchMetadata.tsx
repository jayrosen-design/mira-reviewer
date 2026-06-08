import { useState } from "react";
import { ChevronDown, Lock } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { DialogueItem } from "@/data/dialogues";
import type { ReviewerRole } from "@/lib/reviewerRole";

type Props = {
  item: DialogueItem;
  reviewerId?: string;
  role: ReviewerRole;
  status: "draft" | "submitted";
};

export function ResearchMetadata({ item, reviewerId = "R-DEMO-01", role, status }: Props) {
  const [open, setOpen] = useState(false);

  const baseRows: [string, string][] = [
    ["Review Item ID", item.id],
    ["Barrier Category", item.barrierCategory],
    ["Review Set", item.reviewSet],
    ["Transcript ID", item.meta.transcriptId],
    ["Turn Number", String(item.meta.turnNumber)],
    ["Assigned Reviewer ID", reviewerId],
    ["Submission Status", status === "submitted" ? "Submitted" : "Draft"],
  ];

  const researcherRows: [string, string][] =
    role === "researcher"
      ? [
          ["Response A Source", item.responseA.source === "human" ? "Human" : "Mira"],
          ["Response B Source", item.responseB.source === "human" ? "Human" : "Mira"],
          ["Mira Model Version", item.meta.miraModelVersion],
          ["Generation Date", item.meta.generationDate],
          ["Randomization Seed", String(item.meta.randomizationSeed)],
        ]
      : [
          ["Response A Source", "Hidden from reviewer"],
          ["Response B Source", "Hidden from reviewer"],
        ];

  const rows = [...baseRows, ...researcherRows];

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="rounded-2xl border border-border bg-card shadow-sm"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between px-6 py-4 text-left">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          Research metadata
          {role !== "researcher" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              <Lock className="h-3 w-3" /> Researcher only
            </span>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition ${open ? "rotate-180" : ""}`}
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
        <p className="mt-4 text-xs text-muted-foreground">
          Production note: response order is randomized per assignment. Reviewers only see
          Response A and Response B; the system stores the true source internally for analysis.
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
}
