import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, Square, Equal, Ban } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import {
  DIALOGUE_PROGRESS,
  summarizeProgress,
  type DialogueProgress,
} from "@/data/mockProgress";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress Tracker — MIRA" },
      {
        name: "description",
        content: "Track your dialogue review progress across the assessment set.",
      },
    ],
  }),
  component: ProgressTrackerPage,
});

const PAGE_SIZE = 10;

function SelectedCell({ value }: { value: DialogueProgress["selected"] }) {
  if (value === "A")
    return (
      <Badge className="bg-primary-soft text-primary hover:bg-primary-soft">
        Response A
      </Badge>
    );
  if (value === "B")
    return (
      <Badge className="bg-accent text-accent-foreground hover:bg-accent">
        Response B
      </Badge>
    );
  if (value === "neither")
    return (
      <Badge variant="outline" className="gap-1">
        <Ban className="h-3 w-3" />
        Neither
      </Badge>
    );
  if (value === "too_similar")
    return (
      <Badge variant="outline" className="gap-1">
        <Equal className="h-3 w-3" />
        Too similar
      </Badge>
    );
  return <span className="text-xs text-muted-foreground">—</span>;
}

function Grade({ value }: { value: number | null }) {
  if (value == null) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <span className="tabular-nums text-sm font-medium text-foreground">
      {value.toFixed(1)}
      <span className="text-xs text-muted-foreground"> / 5</span>
    </span>
  );
}

function ProgressTrackerPage() {
  const [page, setPage] = useState(1);
  const summary = useMemo(() => summarizeProgress(DIALOGUE_PROGRESS), []);
  const totalPages = Math.ceil(DIALOGUE_PROGRESS.length / PAGE_SIZE);
  const pageItems = DIALOGUE_PROGRESS.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );
  const pct = Math.round((summary.completed / summary.total) * 100);

  const pageNumbers = useMemo(() => {
    const set = new Set<number>([1, totalPages, page, page - 1, page + 1]);
    return [...set]
      .filter((n) => n >= 1 && n <= totalPages)
      .sort((a, b) => a - b);
  }, [page, totalPages]);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Progress Tracker
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your scoring progress across the full review set.
          </p>
        </header>

        <section className="rounded-lg border border-border bg-card p-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Overall progress
              </p>
              <p className="mt-1 text-3xl font-semibold tabular-nums text-foreground">
                {summary.completed}
                <span className="text-base font-normal text-muted-foreground">
                  {" "}
                  / {summary.total} dialogues
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <Stat label="Picked A" value={summary.aPicks} />
              <Stat label="Picked B" value={summary.bPicks} />
              <Stat label="Neither" value={summary.neither} />
              <Stat label="Too similar" value={summary.tooSim} />
              <Stat label="Avg A" value={summary.avgA.toFixed(1)} />
              <Stat label="Avg B" value={summary.avgB.toFixed(1)} />
            </div>
          </div>
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>{pct}% complete</span>
              <span>{summary.total - summary.completed} remaining</span>
            </div>
            <Progress value={pct} />
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">Done</TableHead>
                <TableHead className="w-28">ID</TableHead>
                <TableHead>Scenario</TableHead>
                <TableHead className="w-36">Selected</TableHead>
                <TableHead className="w-24 text-right">Avg A</TableHead>
                <TableHead className="w-24 text-right">Avg B</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-center">
                    {item.completed ? (
                      <CheckCircle2
                        className="mx-auto h-5 w-5 text-emerald-600"
                        aria-label="Completed"
                      />
                    ) : (
                      <Square
                        className="mx-auto h-5 w-5 text-muted-foreground/60"
                        aria-label="Not yet completed"
                      />
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {item.id}
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="line-clamp-2 text-sm text-foreground">
                      {item.scenario}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.reviewSet}</p>
                  </TableCell>
                  <TableCell>
                    <SelectedCell value={item.selected} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Grade value={item.avgA} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Grade value={item.avgB} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="border-t border-border px-4 py-3">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.max(1, p - 1));
                    }}
                  />
                </PaginationItem>
                {pageNumbers.map((n, i) => {
                  const prev = pageNumbers[i - 1];
                  const showEllipsis = prev != null && n - prev > 1;
                  return (
                    <span key={n} className="flex items-center">
                      {showEllipsis && (
                        <span className="px-2 text-sm text-muted-foreground">…</span>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          isActive={n === page}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(n);
                          }}
                        >
                          {n}
                        </PaginationLink>
                      </PaginationItem>
                    </span>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.min(totalPages, p + 1));
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-base font-semibold tabular-nums text-foreground">
        {value}
      </span>
    </div>
  );
}
