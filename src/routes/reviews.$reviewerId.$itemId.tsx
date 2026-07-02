import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { ArrowLeft, Star, Ban, Equal, Check, X, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getReviewerById,
  getReviewerItemReview,
  getItemResponses,
  REVIEW_ITEMS,
} from "@/data/mockProgress";
import {
  PARENT_STATEMENTS,
  EXPERT_QUESTIONS,
  AGREEMENT_LABELS,
  DIALOGUES,
} from "@/data/dialogues";
import { ResearchMetadata } from "@/components/mira/ResearchMetadata";

export const Route = createFileRoute("/reviews/$reviewerId/$itemId")({
  head: ({ params }) => ({
    meta: [
      {
        title: `Reviewer ${params.reviewerId} · ${params.itemId} — MIRA Reviewer`,
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReviewerItemReviewPage,
});

function ReviewerItemReviewPage() {
  const { reviewerId, itemId } = Route.useParams();
  const navigate = useNavigate();

  const reviewer = getReviewerById(reviewerId);
  const item = REVIEW_ITEMS.find((i) => i.id === itemId);
  const dialogue = DIALOGUES.find((d) => d.id === itemId);
  const responses = useMemo(() => getItemResponses(itemId), [itemId]);
  const review = useMemo(
    () => getReviewerItemReview(reviewerId, itemId),
    [reviewerId, itemId],
  );

  const isExpert = reviewer?.type === "expert";
  const sourceA = dialogue?.responseA.source ?? item?.sourceA ?? "human";
  const sourceB = dialogue?.responseB.source ?? item?.sourceB ?? "mira";
  const textA = dialogue?.responseA.text ?? (sourceA === "human" ? responses.human : responses.mira);
  const textB = dialogue?.responseB.text ?? (sourceB === "human" ? responses.human : responses.mira);

  if (!reviewer || !item) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-6xl space-y-4 px-6 py-8">
          <Button variant="outline" size="sm" onClick={() => history.back()}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <p className="text-sm text-muted-foreground">
            Review not found for reviewer{" "}
            <span className="font-mono">{reviewerId}</span> on item{" "}
            <span className="font-mono">{itemId}</span>.
          </p>
        </main>
      </div>
    );
  }

  const preferredLabel =
    review.preferred === "A"
      ? "Response A"
      : review.preferred === "B"
        ? "Response B"
        : review.preferred === "neither"
          ? "Neither acceptable"
          : review.preferred === "too_similar"
            ? "Too similar to distinguish"
            : "—";

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              navigate({
                to: "/reviewers/$reviewerId",
                params: { reviewerId },
              })
            }
          >
            <ArrowLeft className="h-4 w-4" /> Back to {reviewer.name}'s progress
          </Button>
        </div>

        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Review by {reviewer.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-mono">{item.id}</span> · {item.barrierCategory}{" "}
              · {reviewer.type === "expert" ? "Expert reviewer" : "Parent reviewer"}
            </p>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              review.status === "completed"
                ? "bg-emerald-100 text-emerald-800"
                : review.status === "draft"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {review.status === "completed"
              ? "Submitted"
              : review.status === "draft"
                ? "Draft saved"
                : "Not started"}
          </span>
        </header>

        <section className="rounded-lg border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Parent concern
          </p>
          <p className="mt-1 text-base text-foreground">"{item.parentConcern}"</p>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <ResponseCard
            label="Response A"
            source={sourceA}
            text={textA}
            preferred={review.preferred === "A"}
          />
          <ResponseCard
            label="Response B"
            source={sourceB}
            text={textB}
            preferred={review.preferred === "B"}
          />
        </section>

        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">Preferred response</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {reviewer.name} selected{" "}
            <span className="font-medium text-foreground">{preferredLabel}</span>
            {review.preferred === "A" || review.preferred === "B" ? (
              <>
                {" "}
                (
                <span className="font-medium">
                  {review.preferred === "A"
                    ? sourceA === "human"
                      ? "Human"
                      : "MIRA"
                    : sourceB === "human"
                      ? "Human"
                      : "MIRA"}
                </span>
                -authored, blinded during review)
              </>
            ) : null}
          </p>
        </section>

        {review.status === "completed" ? (
          isExpert ? (
            <ExpertRatingsTable
              a={review.expertA}
              b={review.expertB}
              notesA={review.expertNotesA}
              notesB={review.expertNotesB}
            />
          ) : (
            <ParentRatingsTable a={review.parentA} b={review.parentB} />
          )
        ) : (
          <section className="rounded-lg border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
            No ratings recorded — this item is {review.status.replace("_", " ")}.
          </section>
        )}

        {review.comments && (
          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground">Reviewer comments</h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground">
              "{review.comments}"
            </p>
          </section>
        )}

        {dialogue && (
          <ResearchMetadata
            item={dialogue}
            reviewerId={reviewerId}
            role="researcher"
            status={review.status === "completed" ? "submitted" : "draft"}
          />
        )}
      </main>
    </div>
  );
}

function ResponseCard({
  label,
  source,
  text,
  preferred,
}: {
  label: string;
  source: "human" | "mira";
  text: string;
  preferred: boolean;
}) {
  return (
    <div
      className={`flex h-full flex-col rounded-lg border bg-card p-5 ${
        preferred ? "border-accent ring-2 ring-accent/40" : "border-border"
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{label}</h3>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Source (researcher-only): {source === "human" ? "Human interviewer" : "MIRA agent"}
          </p>
        </div>
        {preferred && (
          <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
            <Star className="h-3 w-3" /> Preferred
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-foreground">{text}</p>
    </div>
  );
}

function ParentRatingsTable({
  a,
  b,
}: {
  a: Record<string, number>;
  b: Record<string, number>;
}) {
  return (
    <section className="rounded-lg border border-border bg-card">
      <div className="border-b border-border px-5 py-3">
        <h2 className="text-sm font-semibold text-foreground">
          Parent Likert ratings (1–7)
        </h2>
        <p className="text-xs text-muted-foreground">
          1 = Strongly Disagree · 7 = Strongly Agree
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Statement</TableHead>
            <TableHead className="w-40 text-right">Response A</TableHead>
            <TableHead className="w-40 text-right">Response B</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {PARENT_STATEMENTS.map((s) => (
            <TableRow key={s}>
              <TableCell className="text-sm text-foreground">{s}</TableCell>
              <TableCell className="text-right">
                <RatingPill value={a[s]} />
              </TableCell>
              <TableCell className="text-right">
                <RatingPill value={b[s]} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

function RatingPill({ value }: { value?: number }) {
  if (value == null) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <span className="inline-flex items-center gap-2">
      <span className="rounded-md bg-primary-soft px-2 py-0.5 text-xs font-semibold tabular-nums text-primary">
        {value}
      </span>
      <span className="text-xs text-muted-foreground">
        {AGREEMENT_LABELS[value]}
      </span>
    </span>
  );
}

function ExpertRatingsTable({
  a,
  b,
  notesA,
  notesB,
}: {
  a: Record<string, "yes" | "no" | "unsure">;
  b: Record<string, "yes" | "no" | "unsure">;
  notesA: string;
  notesB: string;
}) {
  return (
    <section className="rounded-lg border border-border bg-card">
      <div className="border-b border-border px-5 py-3">
        <h2 className="text-sm font-semibold text-foreground">
          Expert safety / accuracy / relevance
        </h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead className="w-32 text-right">Response A</TableHead>
            <TableHead className="w-32 text-right">Response B</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {EXPERT_QUESTIONS.map((q) => (
            <TableRow key={q}>
              <TableCell className="text-sm text-foreground">{q}</TableCell>
              <TableCell className="text-right">
                <YesNo value={a[q]} />
              </TableCell>
              <TableCell className="text-right">
                <YesNo value={b[q]} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {(notesA || notesB) && (
        <div className="grid gap-4 border-t border-border p-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Notes on A</p>
            <p className="mt-1 text-sm text-foreground">{notesA || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Notes on B</p>
            <p className="mt-1 text-sm text-foreground">{notesB || "—"}</p>
          </div>
        </div>
      )}
    </section>
  );
}

function YesNo({ value }: { value?: "yes" | "no" | "unsure" }) {
  if (!value) return <span className="text-xs text-muted-foreground">—</span>;
  const map = {
    yes: { Icon: Check, cls: "bg-emerald-100 text-emerald-800", label: "Yes" },
    no: { Icon: X, cls: "bg-destructive/10 text-destructive", label: "No" },
    unsure: { Icon: HelpCircle, cls: "bg-muted text-muted-foreground", label: "Unsure" },
  } as const;
  const { Icon, cls, label } = map[value];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${cls}`}
    >
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}

// Reserve unused imports to satisfy the linter — Ban / Equal aren't used yet
// but kept for future selection variants without triggering warnings.
void Ban;
void Equal;
