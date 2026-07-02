import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, FileEdit, Circle, Ban, Equal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  getReviewerById,
  getReviewerItems,
  summarizeProgress,
  type ReviewItemProgress,
} from "@/data/mockProgress";

export const Route = createFileRoute("/reviewers/$reviewerId")({
  head: ({ params }) => ({
    meta: [
      { title: `Reviewer ${params.reviewerId} Progress — MIRA Reviewer` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReviewerProgressPage,
});

const PAGE_SIZE = 10;

function ReviewerProgressPage() {
  const { reviewerId } = Route.useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const reviewer = getReviewerById(reviewerId);
  const items = useMemo(() => getReviewerItems(reviewerId), [reviewerId]);
  const summary = useMemo(() => summarizeProgress(items), [items]);

  if (!reviewer) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-6xl space-y-4 px-6 py-8">
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" /> Back to research dashboard
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            Reviewer <span className="font-mono">{reviewerId}</span> not found.
          </p>
        </main>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const pageItems = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pct = Math.round((summary.completed / Math.max(summary.total, 1)) * 100);

  const pageNumbers = useMemo(() => {
    const set = new Set<number>([1, totalPages, page, page - 1, page + 1]);
    return [...set].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
  }, [page, totalPages]);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/dashboard" })}>
            <ArrowLeft className="h-4 w-4" /> Back to research dashboard
          </Button>
        </div>

        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {reviewer.name}'s Progress
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-mono">{reviewer.id}</span> ·{" "}
              {reviewer.type === "expert" ? "Expert reviewer" : "Parent reviewer"} · assigned{" "}
              {reviewer.assigned} items
            </p>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              reviewer.type === "expert"
                ? "bg-primary-soft text-primary"
                : "bg-accent-soft text-accent-foreground"
            }`}
          >
            {reviewer.type === "expert" ? "Expert" : "Parent"}
          </span>
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
                  of {summary.total} reviews submitted
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <Stat label="Submitted" value={summary.completed} />
              <Stat label="Drafts saved" value={summary.draft} />
              <Stat label="Remaining" value={summary.remaining} />
              {reviewer.type === "parent" ? (
                <Stat label="Mean parent score" value={reviewer.meanParentScore.toFixed(1)} />
              ) : (
                <Stat label="Expert 'Yes' rate" value={`${reviewer.expertYesRate}%`} />
              )}
            </div>
          </div>
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>{pct}% complete</span>
              <span>{summary.remaining} remaining</span>
            </div>
            <Progress value={pct} />
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">
            Items by barrier category
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {Object.entries(summary.byCategory).map(([cat, v]) => (
              <div key={cat} className="rounded-lg border border-border bg-background p-3">
                <p className="text-[11px] font-medium text-muted-foreground">{cat}</p>
                <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
                  {v.completed}
                  <span className="text-xs font-normal text-muted-foreground">
                    {" "}
                    / {v.total}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">ID</TableHead>
                <TableHead className="w-40">Barrier</TableHead>
                <TableHead>Parent concern</TableHead>
                <TableHead className="w-36">Preferred</TableHead>
                <TableHead className="w-36">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {item.id}
                  </TableCell>
                  <TableCell>
                    <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
                      {item.barrierCategory}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="line-clamp-2 text-sm text-foreground">
                      "{item.parentConcern}"
                    </p>
                    <p className="text-xs text-muted-foreground">{item.reviewSet}</p>
                  </TableCell>
                  <TableCell>
                    <PreferenceCell value={item.preferred} />
                  </TableCell>
                  <TableCell>
                    <StatusCell status={item.status} />
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

function StatusCell({ status }: { status: ReviewItemProgress["status"] }) {
  if (status === "completed")
    return (
      <span className="inline-flex items-center gap-1 text-emerald-700">
        <CheckCircle2 className="h-4 w-4" />
        <span className="text-xs font-medium">Submitted</span>
      </span>
    );
  if (status === "draft")
    return (
      <span className="inline-flex items-center gap-1 text-amber-700">
        <FileEdit className="h-4 w-4" />
        <span className="text-xs font-medium">Draft saved</span>
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-muted-foreground">
      <Circle className="h-4 w-4" />
      <span className="text-xs font-medium">Not started</span>
    </span>
  );
}

function PreferenceCell({ value }: { value: ReviewItemProgress["preferred"] }) {
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
        <Ban className="h-3 w-3" /> Neither
      </Badge>
    );
  if (value === "too_similar")
    return (
      <Badge variant="outline" className="gap-1">
        <Equal className="h-3 w-3" /> Too similar
      </Badge>
    );
  return <span className="text-xs text-muted-foreground">—</span>;
}
