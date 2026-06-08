import { createFileRoute } from "@tanstack/react-router";
import { ApiEndpoint } from "@/components/mira/ApiEndpoint";

export const Route = createFileRoute("/api-docs/metrics")({
  component: MetricsDocs,
});

function MetricsDocs() {
  return (
    <div className="space-y-5">
      <header>
        <h2 className="text-lg font-semibold">Metrics</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Aggregate study metrics powering the Research Dashboard. All endpoints are
          researcher-only.
        </p>
      </header>

      <ApiEndpoint
        method="GET"
        path="/v1/metrics/overview"
        summary="Top-level KPIs for the study."
        auth="researcher"
        responseExample={{
          reviewers: 20,
          completion_rate: 0.62,
          total_reviews: 1240,
          mean_parent_score_human: 5.4,
          mean_parent_score_mira: 5.1,
          expert_safety_pass_rate_human: 0.96,
          expert_safety_pass_rate_mira: 0.91,
        }}
        errors={[{ status: 403, meaning: "Researcher role required." }]}
      />

      <ApiEndpoint
        method="GET"
        path="/v1/metrics/preferred-distribution"
        summary="Distribution of preferred-response selections, optionally broken down by true source. Researcher-only post-hoc analysis."
        auth="researcher"
        responseExample={{
          total: 1240,
          by_choice: { A: 612, B: 558, neither: 38, too_similar: 32 },
          by_true_source: {
            human: { preferred: 640 },
            mira: { preferred: 530 },
          },
        }}
        errors={[{ status: 403, meaning: "Researcher role required." }]}
      />

      <ApiEndpoint
        method="GET"
        path="/v1/metrics/inter-rater-agreement"
        summary="Cohen's-kappa-style agreement across reviewers on the overlap dialogue set."
        auth="researcher"
        responseExample={{
          overlap_dialogue_count: 10,
          kappa_preferred_response: 0.64,
          kappa_expert_safety: 0.78,
          pairs: [
            { a: "r_8f2a3b", b: "r_a14c8d", kappa: 0.58 },
          ],
        }}
        errors={[{ status: 403, meaning: "Researcher role required." }]}
      />


      <ApiEndpoint
        method="GET"
        path="/v1/metrics/leaderboard"
        summary="Anonymized reviewer leaderboard with completion and average scores."
        auth="researcher"
        responseExample={{
          rows: [
            {
              reviewer_id: "r_8f2a3b",
              display_name: "Reviewer 1",
              completed: 84,
              avg_score: 3.9,
              source_accuracy: 0.74,
              picked_human: 41,
              picked_ai: 39,
            },
          ],
        }}
        errors={[{ status: 403, meaning: "Researcher role required." }]}
      />
    </div>
  );
}
