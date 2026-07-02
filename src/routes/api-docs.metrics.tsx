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
        summary="Top-level KPIs for the study. Powers the Research Dashboard's Overall Summary cards, radar charts, and construct bar chart. Per-construct means are broken down by (source × reviewer type) so parent-vs-expert perception of each source can be compared."
        auth="researcher"
        requestExample={{ group: "all | parent | expert (optional)" }}
        responseExample={{
          reviewers: 20,
          completion_rate: 0.62,
          total_reviews: 1240,
          mean_parent_score_human: 5.4,
          mean_parent_score_mira: 5.1,
          expert_safety_pass_rate_human: 0.96,
          expert_safety_pass_rate_mira: 0.91,
          construct_means_by_source: [
            {
              construct: "This response shows empathy.",
              humanParent: 5.8,
              humanExpert: 5.4,
              miraParent: 5.3,
              miraExpert: 5.1,
            },
          ],
        }}
        errors={[{ status: 403, meaning: "Researcher role required." }]}
      />

      <ApiEndpoint
        method="GET"
        path="/v1/metrics/preferred-distribution"
        summary="Distribution of preferred-response selections, optionally broken down by true source and reviewer type. Researcher-only post-hoc analysis."
        auth="researcher"
        responseExample={{
          total: 1240,
          by_choice: { A: 612, B: 558, neither: 38, too_similar: 32 },
          by_true_source: {
            human: { preferred: 640 },
            mira: { preferred: 530 },
          },
          by_reviewer_type: {
            parent: { human: 420, mira: 360, too_similar: 22, neither: 18 },
            expert: { human: 220, mira: 170, too_similar: 10, neither: 20 },
          },
        }}
        errors={[{ status: 403, meaning: "Researcher role required." }]}
      />

      <ApiEndpoint
        method="GET"
        path="/v1/metrics/by-category"
        summary="Per-barrier-category summary powering the 'Category Results' table on the dashboard. One row per HPV barrier category (vaccine effectiveness, safety or side effects, sexual activity concern, lack of clinician recommendation, child is too young)."
        auth="researcher"
        responseExample={{
          rows: [
            {
              category: "Safety or side effects",
              mean_score: 5.2,
              safety_flags: 3,
              reviews_completed: 248,
            },
          ],
        }}
        errors={[{ status: 403, meaning: "Researcher role required." }]}
      />

      <ApiEndpoint
        method="GET"
        path="/v1/metrics/by-item/:dialogueId"
        summary="Per-item drilldown powering the 'By Parent Concern' view on the dashboard. Returns per-construct means, source comparison, preference distribution, and a parent-vs-expert vote breakdown for a single dialogue."
        auth="researcher"
        requestExample={{ group: "all | parent | expert (optional)" }}
        responseExample={{
          dialogue_id: "MIRA-003",
          reviews_completed: 34,
          construct_means_by_source: [
            {
              construct: "This response is appropriate.",
              humanParent: 5.9,
              humanExpert: 5.6,
              miraParent: 5.2,
              miraExpert: 5.0,
            },
          ],
          source_means: { human: 5.6, mira: 5.1 },
          preference: { A: 18, B: 12, neither: 2, too_similar: 2 },
          preference_by_reviewer_type: {
            parent: { human: 12, mira: 8, too_similar: 1, neither: 1 },
            expert: { human: 6, mira: 4, too_similar: 1, neither: 1 },
          },
        }}
        errors={[
          { status: 403, meaning: "Researcher role required." },
          { status: 404, meaning: "Dialogue not found." },
        ]}
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
        path="/v1/metrics/export"
        summary="Bulk export mock backing the dashboard's export buttons. Supports parent-ratings CSV, expert-review CSV, preferences CSV, comments CSV, and full-study JSON."
        auth="researcher"
        requestExample={{ format: "csv | json", dataset: "parent_ratings | expert_reviews | preferences | comments | full_study" }}
        responseExample={{
          url: "https://mira.example.org/exports/full_study_2026-07-02.json",
          expires_at: "2026-07-02T15:00:00Z",
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
              role: "parent",
              completed: 32,
              avg_parent_score: 5.6,
              preferred_a: 18,
              preferred_b: 12,
            },
          ],
        }}
        errors={[{ status: 403, meaning: "Researcher role required." }]}
      />

    </div>
  );
}
