import { createFileRoute } from "@tanstack/react-router";
import { ApiEndpoint } from "@/components/mira/ApiEndpoint";

export const Route = createFileRoute("/api-docs/reviews")({
  component: ReviewsDocs,
});

function ReviewsDocs() {
  return (
    <div className="space-y-5">
      <header>
        <h2 className="text-lg font-semibold">Reviews</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Submit rubric ratings, preferred response, and comments for an
          assignment. Each assignment can have exactly one review.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Response source (human interviewer vs Mira) is hidden from reviewers
          during the task and is not part of the submission payload. Reviewers
          do not guess the source.
        </p>
      </header>

      <ApiEndpoint
        method="POST"
        path="/v1/reviews"
        summary="Submit a review for an assignment. The payload shape depends on the reviewer's role — parent reviewers send 7-point Likert scores; expert reviewers send yes/no/unsure judgments plus optional per-response safety notes."
        auth="reviewer"
        requestExample={{
          assignment_id: "asg_91f0",
          role: "parent",
          preferred: "A",
          comments: "Response A reflects the parent's ambivalence more clearly.",
          parent_ratings: [
            { response_label: "A", statement: "This response is appropriate.", score: 6 },
            { response_label: "A", statement: "This response shows empathy.", score: 7 },
            { response_label: "B", statement: "This response is appropriate.", score: 5 },
            { response_label: "B", statement: "This response shows empathy.", score: 4 },
          ],
        }}
        responseExample={{
          id: "rev_4c2",
          assignment_id: "asg_91f0",
          role: "parent",
          preferred: "A",
          status: "submitted",
          submitted_at: "2026-06-02T17:23:09Z",
        }}
        errors={[
          { status: 401, meaning: "Not authenticated." },
          { status: 403, meaning: "Assignment belongs to another reviewer." },
          { status: 409, meaning: "Review already submitted for this assignment." },
          { status: 422, meaning: "Missing rubric scores or invalid enum value." },
        ]}
      />

      <ApiEndpoint
        method="POST"
        path="/v1/reviews (expert payload)"
        summary="Same endpoint, expert variant. Expert reviewers score each response on medical safety, accuracy, and relevance, and may attach optional free-text safety notes per response."
        auth="reviewer"
        requestExample={{
          assignment_id: "asg_a4b1",
          role: "expert",
          preferred: "B",
          comments: "B is more medically precise on side-effect framing.",
          expert_ratings: [
            { response_label: "A", question: "Is this response medically safe?", answer: "yes" },
            { response_label: "A", question: "Is this response accurate?", answer: "unsure" },
            { response_label: "A", question: "Is this response relevant to the parent concern?", answer: "yes" },
            { response_label: "B", question: "Is this response medically safe?", answer: "yes" },
            { response_label: "B", question: "Is this response accurate?", answer: "yes" },
            { response_label: "B", question: "Is this response relevant to the parent concern?", answer: "yes" },
          ],
          expert_notes_a: "Downplays HPV persistence risk slightly.",
          expert_notes_b: "",
        }}
        responseExample={{
          id: "rev_9a1",
          assignment_id: "asg_a4b1",
          role: "expert",
          preferred: "B",
          status: "submitted",
          submitted_at: "2026-06-02T17:41:02Z",
        }}
        errors={[
          { status: 422, meaning: "Missing expert answers for one or more (response, question) pairs." },
        ]}
      />

      <ApiEndpoint
        method="POST"
        path="/v1/reviews/draft"
        summary="Save an in-progress review as a draft. Same payload as POST /v1/reviews but partial rubric scores are allowed and the review is stored with status='draft' instead of 'submitted'. Backs the 'Save Draft' button on the review screen."
        auth="reviewer"
        requestExample={{
          assignment_id: "asg_91f0",
          role: "parent",
          preferred: null,
          comments: "Coming back to this — need to re-read B.",
          parent_ratings: [
            { response_label: "A", statement: "This response is appropriate.", score: 6 },
          ],
        }}
        responseExample={{
          id: "rev_4c2",
          status: "draft",
          updated_at: "2026-06-02T17:05:00Z",
        }}
        errors={[
          { status: 403, meaning: "Assignment belongs to another reviewer." },
          { status: 409, meaning: "Review already submitted." },
        ]}
      />

      <ApiEndpoint
        method="GET"
        path="/v1/reviews/:id"
        summary="Fetch a single review with its rubric scores. Researchers may fetch any review; reviewers may only fetch their own."
        auth="reviewer"
        responseExample={{
          id: "rev_4c2",
          assignment_id: "asg_91f0",
          role: "parent",
          preferred: "A",
          status: "submitted",
          comments: "…",
          submitted_at: "2026-06-02T17:23:09Z",
          parent_ratings: [
            { response_label: "A", statement: "This response is appropriate.", score: 6 },
            { response_label: "B", statement: "This response is appropriate.", score: 5 },
          ],
        }}
        errors={[
          { status: 401, meaning: "Not authenticated." },
          { status: 403, meaning: "Not your review." },
          { status: 404, meaning: "Review not found." },
        ]}
      />




      <ApiEndpoint
        method="PATCH"
        path="/v1/reviews/:id"
        summary="Edit a review before the assignment's due_at. Only the reviewer who submitted it may edit."
        auth="reviewer"
        requestExample={{
          preferred: "B",
          comments: "Reconsidered after re-reading — B feels stronger.",
        }}
        responseExample={{
          id: "rev_4c2",
          preferred: "B",
          comments: "Reconsidered after re-reading — B feels stronger.",
          submitted_at: "2026-06-02T17:23:09Z",
          updated_at: "2026-06-02T18:10:44Z",
        }}
        errors={[
          { status: 401, meaning: "Not authenticated." },
          { status: 403, meaning: "Edit window closed or not your review." },
          { status: 404, meaning: "Review not found." },
        ]}
      />
    </div>
  );
}
