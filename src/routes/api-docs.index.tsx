import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api-docs/")({
  component: ApiDocsOverview,
});

function ApiDocsOverview() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-amber-200 bg-amber-50/60 p-4 text-sm text-amber-900">
        <p className="font-semibold">Prototype boundary</p>
        <p className="mt-1 text-amber-900/80">
          This prototype demonstrates the MIRA dialogue review workflow only.
          It does not include live AI generation, chatbot interaction, real
          transcripts, authentication, or production data storage. All data on
          this site is mocked in the frontend.
        </p>
      </section>

      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-lg font-semibold">Overview</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The MIRA API is a REST + JSON service. All endpoints live under{" "}
          <code className="font-mono">/v1</code> on the same origin as the app, and
          would be implemented as TanStack Start server functions and server routes.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          The future backend supports reviewer login with three distinct roles
          (<code className="font-mono">parent</code>,{" "}
          <code className="font-mono">expert</code>,{" "}
          <code className="font-mono">researcher</code>), role-based route
          access, review-item assignment, response randomization and blinding,
          draft saving and review submission, per-reviewer progress tracking,
          dashboard aggregation with parent-vs-expert breakdowns, researcher
          administration of user accounts (rename, change role, reset reviews,
          send password reset, delete account), and self-service account
          management for every reviewer.
        </p>
      </section>

      <section className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-base font-semibold">App surface these endpoints back</h3>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          <li><strong className="text-foreground">/login</strong> — role-picker sign-in (Auth).</li>
          <li><strong className="text-foreground">/about</strong> — onboarding for parent and expert reviewers (static, no API).</li>
          <li><strong className="text-foreground">/</strong> — Review screen (Dialogues + Reviews).</li>
          <li><strong className="text-foreground">/progress</strong> — reviewer's own progress (Progress).</li>
          <li><strong className="text-foreground">/dashboard</strong> — aggregate research dashboard (Metrics).</li>
          <li><strong className="text-foreground">/users</strong> — researcher user roster and Manage User dialog (Users).</li>
          <li><strong className="text-foreground">/reviewers/:id</strong> and <strong className="text-foreground">/reviews/:reviewerId/:itemId</strong> — researcher drilldown into a reviewer and one of their reviews (Progress + Reviews).</li>
          <li><strong className="text-foreground">/generate</strong> — transcript generation and REDCap transmission (Transcripts &amp; REDCap).</li>
          <li><strong className="text-foreground">Edit Account dialog</strong> (top nav) — self-service name change, password reset, review reset (Account).</li>
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">
          A secondary, blinded review runs outside this app: MIRA-generated transcripts are pushed to
          REDCap, where the research team codes them with MITI. This app only queues generation,
          previews the blinded transcripts, and tracks transmission status — no coding happens here,
          and no model is called at request time.
        </p>
      </section>


      <section className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-base font-semibold">Blinding &amp; randomization</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Production behavior: human-interviewer and Mira responses are stored
          with hidden source labels. Reviewers only see Response A and Response
          B and are not asked to guess which is which. Response order is
          randomized per assignment using a stored seed. Source identity is used
          only for researcher-side post-hoc analysis and exports.
        </p>
      </section>


      <section className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-base font-semibold">Base URL</h3>
        <pre className="mt-2 overflow-x-auto rounded-md border border-border bg-muted/40 p-3 text-xs">
          <code>https://mira.example.org/v1</code>
        </pre>
      </section>

      <section className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-base font-semibold">Authentication</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Reviewers sign in with email + password and receive a bearer JWT. Every
          request other than <code className="font-mono">POST /v1/auth/login</code>{" "}
          must include:
        </p>
        <pre className="mt-2 overflow-x-auto rounded-md border border-border bg-muted/40 p-3 text-xs">
          <code>Authorization: Bearer &lt;jwt&gt;</code>
        </pre>
        <p className="mt-2 text-sm text-muted-foreground">
          Endpoints marked <em>Researcher</em> or <em>Admin</em> require the
          corresponding role on the reviewer record.
        </p>
      </section>

      <section className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-base font-semibold">Error envelope</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Errors return a standard envelope with an HTTP status, a stable code, and a
          human-readable message. <code className="font-mono">details</code> may carry
          field-level validation errors.
        </p>
        <pre className="mt-2 overflow-x-auto rounded-md border border-border bg-muted/40 p-3 text-xs">
          <code>{JSON.stringify(
            {
              error: {
                code: "validation_failed",
                message: "preferred must be one of 'A', 'B', 'neither', 'too_similar'",
                details: { preferred: "invalid_enum" },
              },
            },
            null,
            2,
          )}</code>
        </pre>
      </section>

      <section className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-base font-semibold">Pagination</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          List endpoints accept <code className="font-mono">?page=&amp;page_size=</code> (default 20, max 100) and return:
        </p>
        <pre className="mt-2 overflow-x-auto rounded-md border border-border bg-muted/40 p-3 text-xs">
          <code>{JSON.stringify(
            {
              data: ["…"],
              page: 1,
              page_size: 20,
              total: 100,
            },
            null,
            2,
          )}</code>
        </pre>
      </section>

      <section className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-base font-semibold">Versioning</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Breaking changes ship under a new path prefix (e.g.{" "}
          <code className="font-mono">/v2</code>). Additive changes — new fields,
          new optional query params — are made in place.
        </p>
      </section>
    </div>
  );
}
