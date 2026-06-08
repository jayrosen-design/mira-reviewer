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
            completed: 62,
            total: 100,
            avg_grade_a: 3.8,
            avg_grade_b: 3.4,
            source_accuracy: 0.71,
            picked_human: 34,
            picked_ai: 26,
            picked_neither: 2,
          },
          items: [
            {
              dialogue_id: "MIRA-014",
              review_set: "Pilot Set B",
              scenario: "Parent uncertain about ADHD medication.",
              completed: true,
              selected: "A",
              avg_a: 4.2,
              avg_b: 3.1,
              guess_a: "human",
              guess_b: "ai",
              correct_a: true,
              correct_b: true,
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
          reviewer: { id: "r_8f2a3b", display_name: "J. Doe" },
          summary: { completed: 62, total: 100, source_accuracy: 0.71 },
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
