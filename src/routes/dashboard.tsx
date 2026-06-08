import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
  CRITERION_AVERAGES,
  REVIEWERS,
  reviewerAverages,
} from "@/data/mockProgress";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Research Dashboard — MIRA" },
      {
        name: "description",
        content:
          "Overview of reviewer progress and assessment metrics across the MIRA study.",
      },
    ],
  }),
  component: ResearchDashboardPage,
});

function ResearchDashboardPage() {
  const summary = useMemo(() => reviewerAverages(REVIEWERS), []);

  const completionData = useMemo(
    () =>
      [...REVIEWERS]
        .sort((a, b) => b.completed - a.completed)
        .map((r) => ({
          name: r.name.replace("Anon ", ""),
          completed: r.completed,
          remaining: r.total - r.completed,
        })),
    [],
  );

  const selectionData = [
    { name: "Response A", value: summary.aPicks, color: "var(--primary)" },
    { name: "Response B", value: summary.bPicks, color: "var(--accent)" },
    { name: "Neither", value: summary.neither, color: "var(--muted-foreground)" },
    { name: "Too similar", value: summary.tooSim, color: "oklch(0.78 0.15 80)" },
  ];

  const criterionData = CRITERION_AVERAGES.map((c) => ({
    name: c.criterion.length > 18 ? c.criterion.slice(0, 16) + "…" : c.criterion,
    full: c.criterion,
    "Response A": c.responseA,
    "Response B": c.responseB,
  }));

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Research Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Aggregate metrics across all reviewers participating in the MIRA study.
          </p>
        </header>

        <section className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <KpiCard label="Reviewers" value={summary.reviewers} />
          <KpiCard
            label="Reviews completed"
            value={`${summary.totalCompleted.toLocaleString()} / ${summary.totalPossible.toLocaleString()}`}
            sub={`${summary.avgCompletionPct}% of target`}
          />
          <KpiCard
            label="Avg score (A / B)"
            value={`${summary.meanA.toFixed(1)} / ${summary.meanB.toFixed(1)}`}
          />
          <KpiCard
            label="Human vs AI accuracy"
            value={`${summary.meanSourceAccuracy}%`}
            sub="mean across reviewers"
          />
          <KpiCard
            label="Median time / review"
            value={`${summary.medianMinutes.toFixed(1)} min`}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card title="Reviewer completion">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={completionData}
                  margin={{ top: 8, right: 8, left: 0, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    angle={-35}
                    textAnchor="end"
                    height={50}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <Tooltip
                    cursor={{ fill: "var(--muted)" }}
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar
                    dataKey="completed"
                    stackId="a"
                    fill="var(--primary)"
                    name="Completed"
                  />
                  <Bar
                    dataKey="remaining"
                    stackId="a"
                    fill="var(--muted)"
                    name="Remaining"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Aggregate response selection">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={selectionData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {selectionData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        <section>
          <Card title="Average rubric scores by criterion">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={criterionData}
                  margin={{ top: 8, right: 8, left: 0, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    height={70}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  />
                  <YAxis
                    domain={[0, 5]}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--muted)" }}
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Response A" fill="var(--primary)" />
                  <Bar dataKey="Response B" fill="var(--accent)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        <section className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-5 py-3">
            <h2 className="text-sm font-semibold text-foreground">
              Reviewer leaderboard
            </h2>
            <p className="text-xs text-muted-foreground">
              Anonymous identifiers used to protect reviewer privacy.
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reviewer</TableHead>
                <TableHead className="w-64">Completion</TableHead>
                <TableHead className="text-right">Picked A</TableHead>
                <TableHead className="text-right">Picked B</TableHead>
                <TableHead className="text-right">Avg A</TableHead>
                <TableHead className="text-right">Avg B</TableHead>
                <TableHead className="text-right">Median time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...REVIEWERS]
                .sort((a, b) => b.completed - a.completed)
                .map((r) => {
                  const pct = Math.round((r.completed / r.total) * 100);
                  return (
                    <TableRow key={r.id}>
                      <TableCell>
                        <div className="font-medium text-foreground">{r.name}</div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {r.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress value={pct} className="h-2 flex-1" />
                          <span className="w-20 text-right text-xs tabular-nums text-muted-foreground">
                            {r.completed}/{r.total} ({pct}%)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{r.aPicks}</TableCell>
                      <TableCell className="text-right tabular-nums">{r.bPicks}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {r.avgA.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {r.avgB.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {r.medianMinutes.toFixed(1)} min
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

function KpiCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h2 className="mb-3 text-sm font-semibold text-foreground">{title}</h2>
      {children}
    </div>
  );
}
