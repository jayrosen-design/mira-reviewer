import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api-docs/")({
  component: ApiDocsOverview,
});

function ApiDocsOverview() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-lg font-semibold">Overview</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The MIRA API is a REST + JSON service. All endpoints live under{" "}
          <code className="font-mono">/v1</code> on the same origin as the app, and
          would be implemented as TanStack Start server functions and server routes.
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
                message: "guess_a must be 'human' or 'ai'",
                details: { guess_a: "invalid_enum" },
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
