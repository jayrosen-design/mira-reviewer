import { createFileRoute } from "@tanstack/react-router";
import { ApiEndpoint } from "@/components/mira/ApiEndpoint";

export const Route = createFileRoute("/api-docs/progress")({
  component: ProgressDocs,
});

function ProgressDocs() {
  return (
    <div className="space-y-5">
      <header>
        <h2 className="text-lg font-semibold">Progress</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Per-reviewer progress used by the Progress Tracker page.
        </p>
      </header>

      <ApiEndpoint
        method="GET"
        path="/v1/me/progress"
        summary="Progress summary and per-dialogue rows for the authenticated reviewer."
        auth="reviewer"
        responseExample={{
          summary: {
            completed: 22,
            total: 35,
            avg_parent_score_a: 5.4,
            avg_parent_score_b: 5.1,
            preferred_a: 12,
            preferred_b: 8,
            preferred_neither: 1,
            preferred_too_similar: 1,
          },
          items: [
            {
              dialogue_id: "MIRA-014",
              review_set: "Pilot Set B",
              barrier_category: "Safety or side effects",
              completed: true,
              preferred: "A",
              avg_parent_a: 5.8,
              avg_parent_b: 5.0,
            },
          ],
        }}
        errors={[{ status: 401, meaning: "Not authenticated." }]}
      />

      <ApiEndpoint
        method="GET"
        path="/v1/reviewers/:id/progress"
        summary="Same shape as /me/progress for any reviewer. Researcher/admin only."
        auth="researcher"
        responseExample={{
          reviewer: { id: "r_8f2a3b", display_name: "J. Doe", role: "parent" },
          summary: { completed: 22, total: 35 },
          items: ["…"],
        }}
        errors={[
          { status: 401, meaning: "Not authenticated." },
          { status: 403, meaning: "Caller lacks researcher role." },
          { status: 404, meaning: "Reviewer not found." },
        ]}
      />
    </div>
  );
}
