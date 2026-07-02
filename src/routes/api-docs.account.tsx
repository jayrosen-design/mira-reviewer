import { createFileRoute } from "@tanstack/react-router";
import { ApiEndpoint } from "@/components/mira/ApiEndpoint";

export const Route = createFileRoute("/api-docs/account")({
  head: () => ({
    meta: [
      { title: "Account — MIRA API Docs" },
      {
        name: "description",
        content:
          "Self-service account endpoints backing the Edit Account dialog in the top navigation.",
      },
    ],
  }),
  component: AccountDocs,
});

function AccountDocs() {
  return (
    <div className="space-y-5">
      <header>
        <h2 className="text-lg font-semibold">Account (self-service)</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Endpoints backing the <strong>Edit Account</strong> dialog in the top
          navigation. Available to every authenticated role (parent, expert,
          researcher). These act on the caller's own account, unlike the admin
          <code className="font-mono">/v1/users/:id</code> endpoints under
          Users.
        </p>
      </header>

      <ApiEndpoint
        method="PATCH"
        path="/v1/me/account"
        summary="Update the caller's own display name. Role cannot be self-changed — a researcher must use PATCH /v1/users/:id."
        auth="reviewer"
        requestExample={{ display_name: "Parent 01 (renamed)" }}
        responseExample={{
          id: "r_8f2a3b",
          display_name: "Parent 01 (renamed)",
          role: "parent",
          updated_at: "2026-07-02T14:02:11Z",
        }}
        errors={[
          { status: 401, meaning: "Not authenticated." },
          { status: 422, meaning: "Display name is empty or too long." },
        ]}
      />

      <ApiEndpoint
        method="POST"
        path="/v1/me/password-reset"
        summary="Email a password-reset link to the caller. Backs the 'Send password reset' button in Edit Account."
        auth="reviewer"
        responseExample={{ ok: true, sent_to: "parent01@example.org" }}
        errors={[{ status: 401, meaning: "Not authenticated." }]}
      />

      <ApiEndpoint
        method="POST"
        path="/v1/me/reset-reviews"
        summary="Clear the caller's own submitted reviews and drafts so their assigned dialogues are reviewable again from scratch. Assignments are preserved. Backs the 'Reset reviews' button in Edit Account for parent and expert reviewers."
        auth="reviewer"
        responseExample={{
          ok: true,
          reviews_deleted: 8,
          drafts_deleted: 2,
        }}
        errors={[
          { status: 401, meaning: "Not authenticated." },
          { status: 403, meaning: "Researchers cannot reset reviews (no reviews to clear)." },
        ]}
      />
    </div>
  );
}
