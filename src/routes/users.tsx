import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { REVIEWERS, type Group } from "@/data/mockProgress";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "Users — MIRA Reviewer" },
      {
        name: "description",
        content: "Reviewer roster and completion summary for the MIRA study.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: UsersPage,
});

function UsersPage() {
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group>("all");

  const filteredReviewers = useMemo(
    () =>
      REVIEWERS.filter((r) =>
        group === "all"
          ? true
          : group === "parent"
            ? r.type === "parent"
            : r.type === "expert",
      ),
    [group],
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Users
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Reviewer roster and completion summary. Anonymous identifiers used to
              protect reviewer privacy.
            </p>
          </div>
          <ToggleGroup
            type="single"
            value={group}
            onValueChange={(v) => v && setGroup(v as Group)}
            variant="outline"
            size="sm"
          >
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            <ToggleGroupItem value="parent">Parents</ToggleGroupItem>
            <ToggleGroupItem value="expert">Experts</ToggleGroupItem>
          </ToggleGroup>
        </header>

        <section className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reviewer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="w-64">Completion</TableHead>
                <TableHead className="text-right">Mean parent score</TableHead>
                <TableHead className="text-right">Expert 'Yes' rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...filteredReviewers]
                .sort((a, b) => b.completed - a.completed)
                .map((r) => {
                  const pct = Math.round((r.completed / r.assigned) * 100);
                  return (
                    <TableRow
                      key={r.id}
                      onClick={() =>
                        navigate({
                          to: "/reviewers/$reviewerId",
                          params: { reviewerId: r.id },
                        })
                      }
                      className="cursor-pointer transition hover:bg-muted/60"
                    >
                      <TableCell>
                        <div className="font-medium text-foreground">{r.name}</div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {r.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            r.type === "expert"
                              ? "bg-primary-soft text-primary"
                              : "bg-accent-soft text-accent-foreground"
                          }`}
                        >
                          {r.type === "expert" ? "Expert" : "Parent"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress value={pct} className="h-2 flex-1" />
                          <span className="w-24 text-right text-xs tabular-nums text-muted-foreground">
                            {r.completed}/{r.assigned} ({pct}%)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {r.type === "parent" ? r.meanParentScore.toFixed(1) : "—"}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {r.type === "expert" ? `${r.expertYesRate}%` : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </section>
      </main>
    </div>
  );
}
