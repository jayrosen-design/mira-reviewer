import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onNext: () => void;
  hasNext: boolean;
};

export function SubmittedState({ onNext, hasNext }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
        <CheckCircle2 className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-foreground">
        Review submitted. Thank you.
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Your responses have been recorded for this dialogue.
      </p>
      <div className="mt-6">
        <Button onClick={onNext} disabled={!hasNext}>
          {hasNext ? "Next dialogue" : "All reviews complete"}
        </Button>
      </div>
    </div>
  );
}
