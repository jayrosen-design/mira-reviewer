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
            each reviewer has many dialogue assignments.
          </li>
          <li>
            <strong className="text-foreground">dialogues → responses</strong> —
            each dialogue has exactly two responses (A and B).
          </li>
          <li>
            <strong className="text-foreground">dialogues → assignments</strong> —
            the same dialogue can be assigned to multiple reviewers (overlap set).
          </li>
          <li>
            <strong className="text-foreground">assignments → reviews</strong> —
            each assignment yields at most one submitted review.
          </li>
          <li>
            <strong className="text-foreground">reviews → rubric_scores</strong> —
            one row per (response, criterion) pair, so 2 × N criteria per review.
          </li>
          <li>
            <strong className="text-foreground">rubric_criteria → rubric_scores</strong>{" "}
            — criteria can be added or deactivated without a deploy.
          </li>
          <li>
            <strong className="text-foreground">reviewers → audit_log</strong> —
            append-only trail of admin actions and review re-opens.
          </li>
        </ul>
      </section>
    </div>
  );
}
