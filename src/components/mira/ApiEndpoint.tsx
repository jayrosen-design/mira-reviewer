import type { ReactNode } from "react";

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
type AuthLevel = "public" | "reviewer" | "researcher" | "admin";

const METHOD_STYLES: Record<Method, string> = {
  GET: "bg-emerald-100 text-emerald-800",
  POST: "bg-blue-100 text-blue-800",
  PATCH: "bg-amber-100 text-amber-800",
  PUT: "bg-amber-100 text-amber-800",
  DELETE: "bg-red-100 text-red-800",
};

const AUTH_LABEL: Record<AuthLevel, string> = {
  public: "Public",
  reviewer: "Reviewer",
  researcher: "Researcher",
  admin: "Admin",
};

export type ErrorRow = { status: number; meaning: string };

export type ApiEndpointProps = {
  method: Method;
  path: string;
  summary: string;
  auth: AuthLevel;
  request?: ReactNode;
  requestExample?: unknown;
  responseExample: unknown;
  errors?: ErrorRow[];
};

function CodeBlock({ value }: { value: unknown }) {
  const text = typeof value === "string" ? value : JSON.stringify(value, null, 2);
  return (
    <pre className="overflow-x-auto rounded-md border border-border bg-muted/40 p-3 text-xs leading-relaxed text-foreground">
      <code>{text}</code>
    </pre>
  );
}

export function ApiEndpoint({
  method,
  path,
  summary,
  auth,
  request,
  requestExample,
  responseExample,
  errors,
}: ApiEndpointProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <header className="flex flex-wrap items-center gap-3">
        <span
          className={`rounded px-2 py-0.5 font-mono text-xs font-semibold ${METHOD_STYLES[method]}`}
        >
          {method}
        </span>
        <code className="font-mono text-sm font-medium text-foreground">{path}</code>
        <span className="ml-auto rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
          Auth: {AUTH_LABEL[auth]}
        </span>
      </header>

      <p className="mt-2 text-sm text-muted-foreground">{summary}</p>

      {(request || requestExample !== undefined) && (
        <div className="mt-4 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Request
          </h4>
          {request}
          {requestExample !== undefined && <CodeBlock value={requestExample} />}
        </div>
      )}

      <div className="mt-4 space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Response 200
        </h4>
        <CodeBlock value={responseExample} />
      </div>

      {errors && errors.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Errors
          </h4>
          <ul className="text-xs text-muted-foreground">
            {errors.map((e) => (
              <li key={e.status} className="flex gap-2 py-0.5">
                <span className="font-mono font-semibold text-foreground">{e.status}</span>
                <span>{e.meaning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
