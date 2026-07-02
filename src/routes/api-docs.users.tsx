import { createFileRoute } from "@tanstack/react-router";
import { ApiEndpoint } from "@/components/mira/ApiEndpoint";

export const Route = createFileRoute("/api-docs/users")({
  head: () => ({
    meta: [
      { title: "Users — MIRA API Docs" },
      {
        name: "description",
        content:
          "User administration endpoints backing the researcher Users page.",
      },
    ],
  }),
  component: UsersDocs,
});

function UsersDocs() {
  return (
    <div className="space-y-5">
      <header>
        <h2 className="text-lg font-semibold">Users</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Administration endpoints backing the researcher Users page. All
          endpoints require a researcher bearer token. Roles are one of{" "}
          <code className="font-mono">parent</code>,{" "}
          <code className="font-mono">expert</code>, or{" "}
          <code className="font-mono">researcher</code>.
        </p>
      </header>

      <ApiEndpoint
        method="GET"
        path="/v1/users"
        summary="List all users. Supports filtering by role for the Users page toggle (All / Parents / Experts / Researchers). Parent and expert rows include assignment and completion aggregates; researcher rows omit them."
        auth="researcher"
        requestExample={{ role: "parent | expert | researcher (optional)" }}
        responseExample={{
          data: [
            {
              id: "r_8f2a3b",
              display_name: "Parent 01",
              email: "parent01@example.org",
              role: "parent",
              assigned: 12,
              completed: 8,
              mean_parent_score: 5.4,
            },
            {
              id: "r_3d91cc",
              display_name: "Expert 02",
              email: "expert02@example.org",
              role: "expert",
              assigned: 10,
              completed: 10,
              expert_yes_rate: 0.72,
            },
            {
              id: "r_researcher01",
              display_name: "Dr. Alicia Nguyen",
              email: "a.nguyen@uni.edu",
              role: "researcher",
            },
          ],
          page: 1,
          page_size: 20,
          total: 3,
        }}
        errors={[{ status: 403, meaning: "Caller is not researcher/admin." }]}
      />

      <ApiEndpoint
        method="PATCH"
        path="/v1/users/:id"
        summary="Update a user's display name and/or account type. Backs the Manage User modal's save action."
        auth="admin"
        requestExample={{
          display_name: "Parent 01 (renamed)",
          role: "expert",
        }}
        responseExample={{
          id: "r_8f2a3b",
          display_name: "Parent 01 (renamed)",
          role: "expert",
          updated_at: "2026-07-02T14:02:11Z",
        }}
        errors={[
          { status: 403, meaning: "Caller is not admin." },
          { status: 404, meaning: "User not found." },
          { status: 422, meaning: "Invalid role value." },
        ]}
      />

      <ApiEndpoint
        method="POST"
        path="/v1/users/:id/reset-reviews"
        summary="Clear the user's submitted reviews and drafts so their assigned dialogues are reviewable again from scratch. Assignments themselves are preserved."
        auth="admin"
        responseExample={{
          ok: true,
          reviews_deleted: 8,
          drafts_deleted: 2,
        }}
        errors={[
          { status: 403, meaning: "Caller is not admin." },
          { status: 404, meaning: "User not found." },
        ]}
      />

      <ApiEndpoint
        method="POST"
        path="/v1/users/:id/password-reset"
        summary="Email a password-reset link to the user."
        auth="admin"
        responseExample={{ ok: true, sent_to: "parent01@example.org" }}
        errors={[
          { status: 403, meaning: "Caller is not admin." },
          { status: 404, meaning: "User not found." },
        ]}
      />

      <ApiEndpoint
        method="DELETE"
        path="/v1/users/:id"
        summary="Permanently delete a user account along with their assignments, reviews, and audit trail entries."
        auth="admin"
        responseExample={{ ok: true, deleted_id: "r_8f2a3b" }}
        errors={[
          { status: 403, meaning: "Caller is not admin." },
          { status: 404, meaning: "User not found." },
          { status: 409, meaning: "Cannot delete the last remaining admin." },
        ]}
      />
    </div>
  );
}
