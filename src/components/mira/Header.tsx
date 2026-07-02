import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  itemId?: string;
  barrierCategory?: string;
  parentConcern?: string;
};

export function Header({
  current,
  total,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  itemId,
  barrierCategory,
  parentConcern,
}: Props) {
  return (
    <header className="mx-auto max-w-6xl space-y-4 px-6 pt-8 pb-2">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Dialogue Review
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mira Dialogue Review System · Review Item {current} of {total}
        </p>
      </div>

      <section className="rounded-lg border border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="outline" size="sm" onClick={onPrev} disabled={!hasPrev}>
            <ChevronLeft className="h-4 w-4" /> Prev
          </Button>
          <div className="min-w-0 flex-1 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              {itemId && <span className="font-mono">{itemId}</span>}
              {itemId && barrierCategory && <span>·</span>}
              {barrierCategory && <span>{barrierCategory}</span>}
              <span>·</span>
              <span>
                Review {current} of {total}
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onNext} disabled={!hasNext}>
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </header>
  );
}
