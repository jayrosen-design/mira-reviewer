import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Sparkles,
  CheckCircle2,
  Loader2,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BATCH_STATUS_LABEL,
  MODEL_VERSION,
  SEED_BATCHES,
  SEED_TRANSCRIPTS,
  generateTranscripts,
  getMitiPreview,
  type BatchStatus,
  type GeneratedTranscript,
  type TranscriptBatch,
} from "@/data/mockTranscripts";

export const Route = createFileRoute("/generate")({
  head: () => ({
    meta: [
      { title: "Generate Transcripts — MIRA" },
      {
        name: "description",
        content:
          "Researcher tool for generating blinded MIRA transcripts and transmitting them to REDCap for MITI coding.",
      },
      { property: "og:title", content: "Generate Transcripts — MIRA" },
      {
        property: "og:description",
        content:
          "Generate blinded MIRA transcripts and transmit them to REDCap for secondary MITI review.",
      },
    ],
  }),
  component: GenerateTranscriptsPage,
});

const STATUS_CLASS: Record<BatchStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  queued: "bg-accent/15 text-accent-foreground",
  sent: "bg-primary-soft text-primary",
  coded: "bg-primary text-primary-foreground",
};

function StatusChip({ status }: { status: BatchStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASS[status]}`}
    >
      {BATCH_STATUS_LABEL[status]}
    </span>
  );
}

function fmt(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function GenerateTranscriptsPage() {
  const [batches, setBatches] = useState<TranscriptBatch[]>(SEED_BATCHES);
  const [transcripts, setTranscripts] = useState<GeneratedTranscript[]>(SEED_TRANSCRIPTS);
  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState("3");
  const [generating, setGenerating] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState<string>(SEED_BATCHES[1].id);
  const [transcriptIndex, setTranscriptIndex] = useState(0);

  const batchTranscripts = useMemo(
    () => transcripts.filter((t) => t.batchId === selectedBatchId),
    [transcripts, selectedBatchId],
  );
  const current = batchTranscripts[Math.min(transcriptIndex, batchTranscripts.length - 1)];
  const selectedBatch = batches.find((b) => b.id === selectedBatchId);
  const miti = current ? getMitiPreview(current.id) : null;

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error("Enter a scenario prompt first.");
      return;
    }
    setGenerating(true);
    const n = Number(count);
    const batchId = `BATCH-2026-${String(batches.length + 3).padStart(3, "0")}`;
    window.setTimeout(() => {
      const batch: TranscriptBatch = {
        id: batchId,
        prompt: prompt.trim(),
        count: n,
        createdAt: new Date().toISOString(),
        status: "draft",
        modelVersion: MODEL_VERSION,
      };
      setBatches((prev) => [batch, ...prev]);
      setTranscripts((prev) => [...prev, ...generateTranscripts(batch.prompt, n, batchId)]);
      setSelectedBatchId(batchId);
      setTranscriptIndex(0);
      setPrompt("");
      setGenerating(false);
      toast.success(`Generated ${n} transcript${n === 1 ? "" : "s"} in ${batchId}.`);
    }, 900);
  };

  const sendToRedcap = (batchId: string) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, status: "queued" as BatchStatus } : b)),
    );
    window.setTimeout(() => {
      setBatches((prev) =>
        prev.map((b) =>
          b.id === batchId
            ? {
                ...b,
                status: "sent" as BatchStatus,
                sentAt: new Date().toISOString(),
                redcapRecordId: `REDCAP-2026-0${140 + prev.length}`,
              }
            : b,
        ),
      );
      toast.success(`${batchId} transmitted to REDCap for blinded MITI coding.`);
    }, 1100);
  };

  const markCoded = (batchId: string) => {
    setBatches((prev) =>
      prev.map((b) =>
        b.id === batchId
          ? { ...b, status: "coded" as BatchStatus, codedAt: new Date().toISOString() }
          : b,
      ),
    );
    toast.success(`${batchId} marked as MITI coded.`);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <Toaster />

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Generate Transcripts</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Produce MIRA-generated counseling transcripts for the secondary, blinded MITI review that
            the research team completes in REDCap.
          </p>
        </div>
        <span className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          Research preview — mock output
        </span>
      </header>

      <p className="mt-3 rounded-md border border-dashed border-border bg-muted/40 p-3 text-xs text-muted-foreground">
        Prototype only — transcripts here are pre-scripted mock content. In production, generation runs
        offline as a batch job; the reviewer app never calls an LLM at request time. REDCap transmission
        and MITI coding are simulated.
      </p>

      {/* --- Generation form --- */}
      <section className="mt-6 rounded-lg border border-border bg-card p-5">
        <h2 className="text-sm font-semibold">New generation run</h2>
        <div className="mt-3 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="scenario">Scenario prompt</Label>
            <Textarea
              id="scenario"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="Parent hesitant about the HPV vaccine for a 9-year-old; worried it is too early…"
            />
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="count">Transcripts</Label>
              <Select value={count} onValueChange={setCount}>
                <SelectTrigger id="count" className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Model</Label>
              <div className="rounded-md border border-input bg-background px-3 py-2 font-mono text-sm text-muted-foreground">
                {MODEL_VERSION}
              </div>
            </div>
            <Button onClick={handleGenerate} disabled={generating} className="ml-auto">
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* --- Batches --- */}
      <section className="mt-6 rounded-lg border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold">Batches</h2>
          <p className="text-xs text-muted-foreground">
            Draft → Queued → Sent to REDCap → MITI coded
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch</TableHead>
              <TableHead className="min-w-[240px]">Scenario prompt</TableHead>
              <TableHead className="text-right">Count</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>REDCap record</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batches.map((b) => (
              <TableRow
                key={b.id}
                onClick={() => {
                  setSelectedBatchId(b.id);
                  setTranscriptIndex(0);
                }}
                className={`cursor-pointer ${b.id === selectedBatchId ? "bg-muted" : ""}`}
              >
                <TableCell className="font-mono text-xs">{b.id}</TableCell>
                <TableCell className="max-w-[320px] truncate text-sm text-muted-foreground">
                  {b.prompt}
                </TableCell>
                <TableCell className="text-right tabular-nums">{b.count}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{fmt(b.createdAt)}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {b.redcapRecordId ?? "—"}
                </TableCell>
                <TableCell>
                  <StatusChip status={b.status} />
                </TableCell>
                <TableCell className="text-right">
                  {b.status === "draft" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        sendToRedcap(b.id);
                      }}
                    >
                      <Send className="mr-1.5 h-3.5 w-3.5" />
                      Send to REDCap
                    </Button>
                  )}
                  {b.status === "queued" && (
                    <span className="inline-flex items-center text-xs text-muted-foreground">
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Transmitting…
                    </span>
                  )}
                  {b.status === "sent" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        markCoded(b.id);
                      }}
                    >
                      <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                      Mark coded
                    </Button>
                  )}
                  {b.status === "coded" && (
                    <span className="text-xs text-muted-foreground">{fmt(b.codedAt)}</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      {/* --- Transcript viewer --- */}
      {current && miti && (
        <section className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-5 py-3">
            <div>
              <p className="text-sm font-semibold">
                <span className="font-mono">{current.blindedId}</span>{" "}
                <span className="text-muted-foreground">
                  — transcript {Math.min(transcriptIndex, batchTranscripts.length - 1) + 1} of{" "}
                  {batchTranscripts.length}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedBatch?.id} · {current.barrierCategory} · {current.modelVersion}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setTranscriptIndex(
                    (i) => (i - 1 + batchTranscripts.length) % batchTranscripts.length,
                  )
                }
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Prev
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setTranscriptIndex((i) => (i + 1) % batchTranscripts.length)}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {/* Transcript */}
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Transcript</h3>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Blinded for coding — MITI coders see only the opaque ID, never the generator or model
                version.
              </p>
              <ul className="mt-4 space-y-3">
                {current.turns.map((t, i) => (
                  <li key={i} className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {t.speaker === "parent" ? "Parent" : "Clinician"}
                    </span>
                    <p
                      className={`rounded-lg px-3 py-2 text-sm ${
                        t.speaker === "parent"
                          ? "bg-muted text-foreground"
                          : "bg-primary-soft text-foreground"
                      }`}
                    >
                      {t.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* MITI preview */}
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-sm font-semibold">MITI coding preview</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Read-only illustration of the REDCap instrument. Actual coding is performed by the
                research team inside REDCap.
              </p>

              <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Global scores (1–5)
              </h4>
              <ul className="mt-2 space-y-2">
                {miti.globals.map((g) => (
                  <li key={g.key} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm">{g.label}</p>
                      <p className="text-xs text-muted-foreground">{g.help}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span
                          key={n}
                          className={`h-2.5 w-2.5 rounded-full ${
                            n <= g.score ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </li>
                ))}
              </ul>

              <h4 className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Behavior counts
              </h4>
              <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
                {miti.behaviors.map((b) => (
                  <li key={b.key} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{b.label}</span>
                    <span className="tabular-nums font-medium">{b.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
