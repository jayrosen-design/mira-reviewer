import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { displayItemId } from "@/lib/brand";

type Props = {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  itemId?: string;
  barrierCategory?: string;
  beforeNav?: ReactNode;
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
  beforeNav,
}: Props) {
  return (
    <header className="mx-auto max-w-6xl space-y-4 px-6 pt-8 pb-2">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-heading">
          Dialogue Review
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Response Review · Item {current} of {total}
        </p>
      </div>

      {beforeNav}

      <section className="rounded-lg border border-border bg-card p-4">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
          <Button variant="outline" size="sm" onClick={onPrev} disabled={!hasPrev} aria-label="Previous item">
            <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline">Prev</span>
          </Button>
          <div className="min-w-0 flex-1 text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
              {itemId && <span>{displayItemId(itemId)}</span>}
              {itemId && barrierCategory && <span>·</span>}
              {barrierCategory && <span>{barrierCategory}</span>}
              <span>·</span>
              <span>
                Review {current} of {total}
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onNext} disabled={!hasNext} aria-label="Next item">
            <span className="hidden sm:inline">Next</span> <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </header>
  );
}

