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
import { Download, FileText, FileJson, Lock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  CONSTRUCT_MEANS,
  SOURCE_MEANS,
  PREFERENCE_DISTRIBUTION,
  CATEGORY_RESULTS,
  REVIEWERS,
  reviewerSummary,
} from "@/data/mockProgress";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Research Dashboard — MIRA Reviewer" },
      {
        name: "description",
        content:
          "Aggregate review metrics and source comparison summary for the MIRA study.",
      },
    ],
  }),
  component: ResearchDashboardPage,
});

function ResearchDashboardPage() {
  const summary = useMemo(() => reviewerSummary(REVIEWERS), []);

  const constructData = CONSTRUCT_MEANS.map((c) => ({
    name: c.statement.replace("This response ", "").replace(".", ""),
    full: c.statement,
    "Response A": c.responseA,
    "Response B": c.responseB,
  }));

  const sourceData = SOURCE_MEANS.map((s) => ({
    name: s.label,
    mean: s.mean,
  }));

  const preferenceData = PREFERENCE_DISTRIBUTION;

  const handleExport = (kind: string) => {
    toast.success(`${kind} export queued`, {
      description: "In production, this would download the requested CSV / JSON file.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Research Dashboard
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                <Lock className="h-3 w-3" /> Researcher / admin
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Aggregate review metrics across all participating reviewers.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport("Parent reviewer ratings (CSV)")}>
              <Download className="h-4 w-4" /> Parent ratings CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("Expert safety review (CSV)")}>
              <FileText className="h-4 w-4" /> Expert review CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("Preferred response summary (CSV)")}>
              <FileText className="h-4 w-4" /> Preferences CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("Qualitative comments (CSV)")}>
              <FileText className="h-4 w-4" /> Comments CSV
            </Button>
            <Button size="sm" onClick={() => handleExport("Full study export (JSON)")}>
              <FileJson className="h-4 w-4" /> Export study data
            </Button>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <KpiCard label="Assigned reviewers" value={summary.reviewers} sub={`${summary.parents} parents · ${summary.experts} experts`} />
          <KpiCard
            label="Reviews completed"
            value={`${summary.totalCompleted.toLocaleString()} / ${summary.totalAssigned.toLocaleString()}`}
            sub={`${summary.completionRate}% completion rate`}
          />
          <KpiCard
            label="Mean parent score"
            value={summary.meanParentScore.toFixed(1)}
            sub="across 6 constructs"
          />
          <KpiCard
            label="Expert 'Yes' rate"
            value={`${summary.expertYesRate}%`}
            sub="safe · accurate · relevant"
          />
          <KpiCard label="Items in study" value={CATEGORY_RESULTS.reduce((s, c) => s + c.reviewsCompleted, 0)} sub="completed across all reviewers" />
        </section>

        <section>
          <Card title="Average parent rating by construct (1–7)">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={constructData}
                  margin={{ top: 8, right: 8, left: 0, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={70}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  />
                  <YAxis
                    domain={[0, 7]}
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

        <section className="grid gap-4 lg:grid-cols-2">
          <Card title="Source comparison summary (researcher view only)">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceData} margin={{ top: 8, right: 8, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  />
                  <YAxis
                    domain={[0, 7]}
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
                  <Bar dataKey="mean" name="Mean parent score" fill="var(--primary)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Hidden from participants. Compares blinded responses by true authorship source.
            </p>
          </Card>

          <Card title="Preferred response distribution">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={preferenceData}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {preferenceData.map((entry) => (
                      <Cell key={entry.label} fill={entry.color} />
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

        <section className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-5 py-3">
            <h2 className="text-sm font-semibold text-foreground">
              Results by barrier category
            </h2>
            <p className="text-xs text-muted-foreground">
              Aggregate parent score, safety flags, and review volume per category.
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Barrier category</TableHead>
                <TableHead className="text-right">Mean parent score</TableHead>
                <TableHead className="text-right">Safety flags</TableHead>
                <TableHead className="text-right">Reviews completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CATEGORY_RESULTS.map((c) => (
                <TableRow key={c.category}>
                  <TableCell className="font-medium text-foreground">
                    {c.category}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {c.meanScore.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {c.safetyFlags > 0 ? (
                      <span className="rounded bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                        {c.safetyFlags}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {c.reviewsCompleted}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        <section className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-5 py-3">
            <h2 className="text-sm font-semibold text-foreground">
              Reviewer completion summary
            </h2>
            <p className="text-xs text-muted-foreground">
              Anonymous identifiers used to protect reviewer privacy.
            </p>
          </div>
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
              {[...REVIEWERS]
                .sort((a, b) => b.completed - a.completed)
                .map((r) => {
                  const pct = Math.round((r.completed / r.assigned) * 100);
                  return (
                    <TableRow key={r.id}>
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
      <Toaster />
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
