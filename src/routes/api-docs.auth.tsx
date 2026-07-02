import { createFileRoute } from "@tanstack/react-router";
import { ApiEndpoint } from "@/components/mira/ApiEndpoint";

export const Route = createFileRoute("/api-docs/auth")({
  component: AuthDocs,
});

function AuthDocs() {
  return (
    <div className="space-y-5">
      <header>
        <h2 className="text-lg font-semibold">Auth</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Reviewer login, logout, and current-session lookup.
        </p>
      </header>

      <ApiEndpoint
        method="POST"
        path="/v1/auth/login"
        summary="Exchange email + password for a bearer JWT. The reviewer's role determines which pages and endpoints they can access."
        auth="public"
        requestExample={{ email: "j.doe@uni.edu", password: "•••••••••" }}
        responseExample={{
          token: "eyJhbGciOi…",
          expires_at: "2026-06-09T14:02:11Z",
          reviewer: {
            id: "r_8f2a3b",
            email: "j.doe@uni.edu",
            display_name: "J. Doe",
            role: "parent",
          },
        }}
        errors={[
          { status: 401, meaning: "Invalid credentials." },
          { status: 422, meaning: "Missing email or password." },
        ]}
      />

      <ApiEndpoint
        method="POST"
        path="/v1/auth/logout"
        summary="Invalidate the current bearer token."
        auth="reviewer"
        responseExample={{ ok: true }}
        errors={[{ status: 401, meaning: "Missing or invalid token." }]}
      />

      <ApiEndpoint
        method="GET"
        path="/v1/auth/me"
        summary="Return the authenticated reviewer, including their role (parent, expert, or researcher)."
        auth="reviewer"
        responseExample={{
          id: "r_8f2a3b",
          email: "j.doe@uni.edu",
          display_name: "J. Doe",
          role: "expert",
          credentials: "LCSW, 8 yrs MI",
          created_at: "2026-05-10T12:00:00Z",
        }}
        errors={[{ status: 401, meaning: "Not authenticated." }]}
      />
    </div>
  );
}
