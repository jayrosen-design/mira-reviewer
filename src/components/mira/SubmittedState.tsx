import { CheckCircle2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
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
        Your response has been saved.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Button onClick={onNext} disabled={!hasNext}>
          {hasNext ? "Next Review Item" : "No more assigned reviews"}
        </Button>
        <Button asChild variant="outline">
          <Link to="/progress">Return to Progress</Link>
        </Button>
      </div>
    </div>
  );
}
