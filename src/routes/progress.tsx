import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, Square, Equal, Ban, Check, X } from "lucide-react";
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
  const navigate = useNavigate();
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
              <Stat
                label="Human vs AI accuracy"
                value={`${summary.sourceAccuracy}%`}
              />
              <Stat
                label="Picked Human / AI"
                value={`${summary.pickedHuman} / ${summary.pickedAi}`}
              />
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
                <TableHead className="w-44">Source guess (A / B)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((item) => (
                <TableRow
                  key={item.id}
                  onClick={() => navigate({ to: "/" })}
                  className="cursor-pointer transition hover:bg-muted/60"
                >

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
                  <TableCell>
                    <SourceGuessCell
                      guessA={item.guessA}
                      guessB={item.guessB}
                      sourceA={item.sourceA}
                      sourceB={item.sourceB}
                    />
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
                    <PaginationItem key={n}>
                      {showEllipsis && (
                        <span className="px-2 text-sm text-muted-foreground">…</span>
                      )}
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

function SourceGuessCell({
  guessA,
  guessB,
  sourceA,
  sourceB,
}: {
  guessA: "human" | "ai" | null;
  guessB: "human" | "ai" | null;
  sourceA: "human" | "ai";
  sourceB: "human" | "ai";
}) {
  if (guessA == null && guessB == null)
    return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <div className="flex items-center gap-2 text-xs">
      <GuessChip label="A" guess={guessA} truth={sourceA} />
      <GuessChip label="B" guess={guessB} truth={sourceB} />
    </div>
  );
}

function GuessChip({
  label,
  guess,
  truth,
}: {
  label: string;
  guess: "human" | "ai" | null;
  truth: "human" | "ai";
}) {
  if (guess == null)
    return (
      <span className="rounded border border-dashed border-border px-1.5 py-0.5 text-muted-foreground">
        {label}: —
      </span>
    );
  const correct = guess === truth;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-medium ${
        correct
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {label}: {guess === "human" ? "Human" : "AI"}
      {correct ? (
        <Check className="h-3 w-3" />
      ) : (
        <X className="h-3 w-3" />
      )}
    </span>
  );
}
