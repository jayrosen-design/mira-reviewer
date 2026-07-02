import { createFileRoute } from "@tanstack/react-router";
import { Mermaid } from "@/components/mira/Mermaid";
import { SCHEMA_ERD } from "@/data/schemaErd";

export const Route = createFileRoute("/api-docs/schema")({
  head: () => ({
    meta: [
      { title: "Database Schema — MIRA API Docs" },
      {
        name: "description",
        content:
          "Entity-relationship diagram of the proposed MIRA database schema.",
      },
    ],
  }),
  component: SchemaDocs,
});

function SchemaDocs() {
  return (
    <div className="space-y-5">
      <header>
        <h2 className="text-lg font-semibold">Database Schema</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Entity-relationship diagram of the proposed backend. Lines show foreign-key
          relationships; <code className="font-mono">||--o&#123;</code> means
          one-to-many, <code className="font-mono">||--o|</code> means one-to-one.
        </p>
      </header>

      <Mermaid chart={SCHEMA_ERD} />

      <section className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-base font-semibold">Relationship summary</h3>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">reviewers → assignments</strong> —
            each reviewer has many dialogue assignments. Role is one of
            <code className="font-mono"> parent</code>,
            <code className="font-mono"> expert</code>, or
            <code className="font-mono"> researcher</code>.
          </li>
          <li>
            <strong className="text-foreground">dialogues → responses</strong> —
            each dialogue has exactly two responses. The <code className="font-mono">source</code>{" "}
            column stores ground truth (human vs mira) and is never returned to reviewers.
          </li>
          <li>
            <strong className="text-foreground">dialogues → assignments</strong> —
            the same dialogue can be assigned to multiple reviewers (overlap set)
            with independent <code className="font-mono">position_shuffle</code> values so
            source position can't bias ratings.
          </li>
          <li>
            <strong className="text-foreground">assignments → reviews</strong> —
            each assignment yields at most one review. The{" "}
            <code className="font-mono">status</code> column tracks
            <code className="font-mono"> draft</code> vs{" "}
            <code className="font-mono">submitted</code> so the Save Draft button
            has a durable home.
          </li>
          <li>
            <strong className="text-foreground">reviews → rubric_scores</strong> —
            one row per (response, criterion) pair. Parent reviews populate
            <code className="font-mono"> score_1_to_7</code>; expert reviews populate
            <code className="font-mono"> expert_answer</code>.
          </li>
          <li>
            <strong className="text-foreground">rubric_criteria → rubric_scores</strong>{" "}
            — criteria carry a <code className="font-mono">type</code> of
            <code className="font-mono"> parent</code> or
            <code className="font-mono"> expert</code> so parent statements are only
            scored by parents and expert questions only by experts. Criteria can be
            added or deactivated without a deploy.
          </li>
          <li>
            <strong className="text-foreground">reviewers → audit_log</strong> —
            append-only trail of admin actions (rename, role change, review reset,
            account deletion) and review re-opens.
          </li>
          <li>
            <strong className="text-foreground">reviewers → simulated_exchanges</strong> —
            optional in-app "Preview in dialogue context" record. Not part of the
            formal review; excluded from rubric scoring and aggregate metrics.
          </li>
        </ul>
      </section>
    </div>
  );
}
