import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Download,
  FileText,
  FileJson,
  Lock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  CONSTRUCT_MEANS_BY_SOURCE,
  CATEGORY_RESULTS,
  REVIEWERS,
  REVIEW_ITEMS,
  reviewerSummary,
  getConstructMeansForItem,
  getConstructBarData,
  getPreferenceForItem,
  getSourceMeansForItem,
  getItemSummary,
  getItemReviewCounts,
  getItemResponses,
  getAggregatePreference,
  getAggregateSourceMeans,
  type Group,
} from "@/data/mockProgress";


export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Research Dashboard — MIRA Reviewer" },
      {
        name: "description",
        content:
          "Aggregate review metrics and per-item drilldown for the MIRA study.",
      },
    ],
  }),
  component: ResearchDashboardPage,
});

type View = "overall" | "byItem";

function ResearchDashboardPage() {
  const [group, setGroup] = useState<Group>("all");
  const [view, setView] = useState<View>("overall");
  const [selectedItemId, setSelectedItemId] = useState<string>(REVIEW_ITEMS[0].id);

  const filteredReviewers = useMemo(
    () =>
      REVIEWERS.filter((r) =>
        group === "all" ? true : group === "parent" ? r.type === "parent" : r.type === "expert",
      ),
    [group],
  );
  const summary = useMemo(() => reviewerSummary(filteredReviewers), [filteredReviewers]);

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

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
          <Tabs value={view} onValueChange={(v) => setView(v as View)}>
            <TabsList>
              <TabsTrigger value="overall">Overall Summary</TabsTrigger>
              <TabsTrigger value="byItem">By Parent Concern</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Reviewer group</span>
            <ToggleGroup
              type="single"
              size="sm"
              value={group}
              onValueChange={(v) => v && setGroup(v as Group)}
            >
              <ToggleGroupItem value="all">All</ToggleGroupItem>
              <ToggleGroupItem value="parent">Parents</ToggleGroupItem>
              <ToggleGroupItem value="expert">Experts</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        {view === "overall" ? (
          <OverallView group={group} summary={summary} />
        ) : (
          <ByItemView
            group={group}
            selectedItemId={selectedItemId}
            onSelect={setSelectedItemId}
          />
        )}

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
              {[...filteredReviewers]
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

function OverallView({
  group,
  summary,
}: {
  group: Group;
  summary: ReturnType<typeof reviewerSummary>;
}) {
  const constructRows = CONSTRUCT_MEANS_BY_SOURCE;
  const barData = useMemo(
    () =>
      constructRows.map((r) => ({
        name: r.short,
        humanParent: r.humanParent,
        humanExpert: r.humanExpert,
        miraParent: r.miraParent,
        miraExpert: r.miraExpert,
      })),
    [constructRows],
  );


  const preferenceData = getAggregatePreference(group);
  const sourceData = getAggregateSourceMeans(group);

  return (
    <>
      <section className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <KpiCard
          label="Assigned reviewers"
          value={summary.reviewers}
          sub={`${summary.parents} parents · ${summary.experts} experts`}
        />
        <KpiCard
          label="Reviews completed"
          value={`${summary.totalCompleted.toLocaleString()} / ${summary.totalAssigned.toLocaleString()}`}
          sub={`${summary.completionRate}% completion rate`}
        />
        {group !== "expert" && (
          <KpiCard
            label="Mean parent score"
            value={summary.meanParentScore.toFixed(1)}
            sub="across 6 constructs"
          />
        )}
        {group !== "parent" && (
          <KpiCard
            label="Expert 'Yes' rate"
            value={`${summary.expertYesRate}%`}
            sub="safe · accurate · relevant"
          />
        )}
        <KpiCard
          label="Items in study"
          value={CATEGORY_RESULTS.reduce((s, c) => s + c.reviewsCompleted, 0)}
          sub="completed across all reviewers"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <RadarCard
          title="Human-authored — mean rating by construct"
          data={constructRows}
          parentKey="humanParent"
          expertKey="humanExpert"
          color="var(--primary)"
          group={group}
        />
        <RadarCard
          title="MIRA-generated — mean rating by construct"
          data={constructRows}
          parentKey="miraParent"
          expertKey="miraExpert"
          color="var(--accent)"
          group={group}
        />
      </section>

      <section>
        <Card title="Average rating by construct (1–7)">
          <ConstructBar data={barData} group={group} />
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card title="Source comparison summary (researcher view only)">
          <SourceBar data={sourceData} />
          <p className="mt-2 text-xs text-muted-foreground">
            Hidden from participants. Compares blinded responses by true authorship source.
          </p>
        </Card>
        <Card title="Preferred response distribution">
          <PreferencePie data={preferenceData} />
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
    </>
  );
}

function ByItemView({
  group,
  selectedItemId,
  onSelect,
}: {
  group: Group;
  selectedItemId: string;
  onSelect: (id: string) => void;
}) {
  const idx = REVIEW_ITEMS.findIndex((it) => it.id === selectedItemId);
  const item = REVIEW_ITEMS[idx] ?? REVIEW_ITEMS[0];
  const prev = () =>
    onSelect(REVIEW_ITEMS[(idx - 1 + REVIEW_ITEMS.length) % REVIEW_ITEMS.length].id);
  const next = () => onSelect(REVIEW_ITEMS[(idx + 1) % REVIEW_ITEMS.length].id);

  const constructRows = useMemo(() => getConstructMeansForItem(item.id), [item.id]);
  const barData = useMemo(
    () =>
      constructRows.map((r) => ({
        name: r.short,
        humanParent: r.humanParent,
        humanExpert: r.humanExpert,
        miraParent: r.miraParent,
        miraExpert: r.miraExpert,
      })),
    [constructRows],
  );

  const preferenceData = useMemo(
    () => getPreferenceForItem(item.id, group),
    [item.id, group],
  );
  const sourceData = useMemo(
    () => getSourceMeansForItem(item.id, group),
    [item.id, group],
  );
  const summary = getItemSummary(item.id, group);
  const responses = useMemo(() => getItemResponses(item.id), [item.id]);
  const preferredSource: "Human" | "MIRA agent" | null =
    summary.preferred === "Human" || summary.preferred === "MIRA agent"
      ? summary.preferred
      : null;

  const counts = getItemReviewCounts(item.id);
  const parentPref = useMemo(() => getPreferenceForItem(item.id, "parent"), [item.id]);
  const expertPref = useMemo(() => getPreferenceForItem(item.id, "expert"), [item.id]);
  const share = (arr: typeof parentPref, label: string) => {
    const total = arr.reduce((s, r) => s + r.value, 0) || 1;
    return (arr.find((r) => r.label === label)?.value ?? 0) / total;
  };
  const votes = {
    human: {
      parent: Math.round(counts.parents * share(parentPref, "Human")),
      expert: Math.round(counts.experts * share(expertPref, "Human")),
    },
    mira: {
      parent: Math.round(counts.parents * share(parentPref, "MIRA agent")),
      expert: Math.round(counts.experts * share(expertPref, "MIRA agent")),
    },
  };
  const maxVotes = Math.max(
    votes.human.parent + votes.human.expert,
    votes.mira.parent + votes.mira.expert,
    1,
  );

  return (
    <>
      <section className="rounded-lg border border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="outline" size="sm" onClick={prev}>
            <ChevronLeft className="h-4 w-4" /> Prev
          </Button>
          <div className="min-w-0 flex-1 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono">{item.id}</span>
              <span>·</span>
              <span>{item.barrierCategory}</span>
              <span>·</span>
              <span>
                {summary.parents} parents / {summary.experts} experts
              </span>
            </div>
            <p className="mt-1 truncate text-sm font-medium text-foreground">
              "{item.parentConcern}"
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={next}>
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ResponseTextCard
          label="Human interviewer"
          text={responses.human}
          isPreferred={preferredSource === "Human"}
          accent="var(--primary)"
          parentVotes={votes.human.parent}
          expertVotes={votes.human.expert}
          parentTotal={counts.parents}
          expertTotal={counts.experts}
          maxVotes={maxVotes}
        />
        <ResponseTextCard
          label="MIRA agent"
          text={responses.mira}
          isPreferred={preferredSource === "MIRA agent"}
          accent="var(--accent)"
          parentVotes={votes.mira.parent}
          expertVotes={votes.mira.expert}
          parentTotal={counts.parents}
          expertTotal={counts.experts}
          maxVotes={maxVotes}
        />
      </section>


      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="Reviews (filtered)" value={summary.reviews} sub={`of ${getItemReviewCounts(item.id).total} total`} />

        {group !== "expert" && (
          <KpiCard label="Mean parent score" value={summary.meanParent.toFixed(1)} sub="1–7 scale" />
        )}
        {group !== "parent" && (
          <KpiCard label="Expert 'Yes' rate" value={`${summary.yesRate}%`} sub="safe · accurate · relevant" />
        )}
        <KpiCard label="Preferred response" value={summary.preferred} sub="most-picked option" />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <RadarCard
          title="Human-authored — mean rating by construct"
          data={constructRows}
          parentKey="humanParent"
          expertKey="humanExpert"
          color="var(--primary)"
          group={group}
        />
        <RadarCard
          title="MIRA-generated — mean rating by construct"
          data={constructRows}
          parentKey="miraParent"
          expertKey="miraExpert"
          color="var(--accent)"
          group={group}
        />
      </section>

      <section>
        <Card title="Average rating by construct (1–7)">
          <ConstructBar data={barData} group={group} />
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card title="Source comparison (this item)">
          <SourceBar data={sourceData} />
        </Card>
        <Card title="Preferred response (this item)">
          <PreferencePie data={preferenceData} />
        </Card>
      </section>

      <section className="rounded-lg border border-border bg-card">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold text-foreground">Parent concerns</h2>
          <p className="text-xs text-muted-foreground">
            Select a row to load its aggregated review data above.
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Barrier</TableHead>
              <TableHead>Parent concern</TableHead>
              <TableHead className="text-right">Reviews</TableHead>
              <TableHead className="text-right">Mean</TableHead>
              <TableHead>Preferred</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {REVIEW_ITEMS.map((it) => {
              const s = getItemSummary(it.id, group);
              const isSelected = it.id === item.id;
              return (
                <TableRow
                  key={it.id}
                  onClick={() => onSelect(it.id)}
                  className={`cursor-pointer ${isSelected ? "bg-muted" : ""}`}
                >
                  <TableCell className="font-mono text-xs">{it.id}</TableCell>
                  <TableCell className="text-xs">{it.barrierCategory}</TableCell>
                  <TableCell className="max-w-[24rem] truncate text-sm">
                    {it.parentConcern}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{s.reviews}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {s.meanParent.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{s.preferred}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </section>
    </>
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
      <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
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

function ResponseTextCard({
  label,
  text,
  isPreferred,
  accent,
}: {
  label: string;
  text: string;
  isPreferred: boolean;
  accent: string;
}) {
  return (
    <div
      className="flex h-full flex-col rounded-lg border bg-card p-5"
      style={{
        borderColor: isPreferred ? accent : "var(--border)",
        boxShadow: isPreferred ? `0 0 0 1px ${accent}` : undefined,
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{label}</h3>
        {isPreferred && (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-white"
            style={{ backgroundColor: accent }}
          >
            ★ Preferred
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-foreground">{text}</p>
    </div>
  );
}

function RadarCard({

  title,
  data,
  parentKey,
  expertKey,
  group,
}: {
  title: string;
  data: ReturnType<typeof getConstructMeansForItem>;
  parentKey: "humanParent" | "miraParent";
  expertKey: "humanExpert" | "miraExpert";
  color?: string;
  group: Group;
}) {
  const showParent = group !== "expert";
  const showExpert = group !== "parent";
  const parentColor = "oklch(0.62 0.17 250)"; // blue
  const expertColor = "oklch(0.68 0.17 45)"; // orange
  return (
    <Card title={title}>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="72%">
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis
              dataKey="short"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 7]}
              tickCount={8}
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            />
            {showParent && (
              <Radar
                name="Parent"
                dataKey={parentKey}
                stroke={parentColor}
                fill={parentColor}
                fillOpacity={0.3}
              />
            )}
            {showExpert && (
              <Radar
                name="Expert"
                dataKey={expertKey}
                stroke={expertColor}
                fill={expertColor}
                fillOpacity={0.3}
              />
            )}
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                fontSize: 12,
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function ConstructBar({
  data,
  group,
}: {
  data: Array<{
    name: string;
    humanParent: number;
    humanExpert: number;
    miraParent: number;
    miraExpert: number;
  }>;
  group: Group;
}) {
  const showParent = group !== "expert";
  const showExpert = group !== "parent";
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 50 }}>
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
          {showParent && (
            <Bar dataKey="humanParent" name="Human · Parent" fill="var(--primary)" />
          )}
          {showExpert && (
            <Bar
              dataKey="humanExpert"
              name="Human · Expert"
              fill="oklch(0.72 0.14 250)"
            />
          )}
          {showParent && (
            <Bar dataKey="miraParent" name="MIRA · Parent" fill="var(--accent)" />
          )}
          {showExpert && (
            <Bar
              dataKey="miraExpert"
              name="MIRA · Expert"
              fill="oklch(0.78 0.14 45)"
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}



function SourceBar({ data }: { data: Array<{ label: string; mean: number }> }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data.map((d) => ({ name: d.label, mean: d.mean }))}
          margin={{ top: 8, right: 8, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
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
          <Bar dataKey="mean" name="Mean score" fill="var(--primary)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function PreferencePie({
  data,
}: {
  data: Array<{ label: string; value: number; color: string }>;
}) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius={55}
            outerRadius={95}
            paddingAngle={2}
          >
            {data.map((entry) => (
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
  );
}
