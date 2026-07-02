import { Link, Outlet, createFileRoute } from "@tanstack/react-router";

const sections = [
  { to: "/api-docs", label: "Overview", exact: true },
  { to: "/api-docs/schema", label: "Database Schema", exact: false },
  { to: "/api-docs/auth", label: "Auth", exact: false },
  { to: "/api-docs/account", label: "Account (self-service)", exact: false },
  { to: "/api-docs/users", label: "Users (admin)", exact: false },
  { to: "/api-docs/dialogues", label: "Dialogues", exact: false },
  { to: "/api-docs/reviews", label: "Reviews", exact: false },
  { to: "/api-docs/progress", label: "Progress", exact: false },
  { to: "/api-docs/metrics", label: "Metrics", exact: false },
] as const;

export const Route = createFileRoute("/api-docs")({
  head: () => ({
    meta: [
      { title: "API Docs — MIRA" },
      {
        name: "description",
        content:
          "Proposed REST API surface that would back the MIRA review platform when connected to a real backend.",
      },
    ],
  }),
  component: ApiDocsLayout,
});

function ApiDocsLayout() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">API Documentation</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Proposed REST surface for the real-backend version of MIRA. All payloads are illustrative — no endpoints are live yet.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-[200px_1fr]">
        <aside className="md:sticky md:top-6 md:self-start">
          <nav className="rounded-lg border border-border bg-card p-2">
            <ul className="space-y-0.5">
              {sections.map((s) => (
                <li key={s.to}>
                  <Link
                    to={s.to}
                    activeOptions={{ exact: s.exact }}
                    activeProps={{ className: "bg-primary-soft text-primary" }}
                    inactiveProps={{
                      className: "text-muted-foreground hover:text-foreground hover:bg-muted",
                    }}
                    className="block rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
