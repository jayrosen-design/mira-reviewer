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
        summary="Submit a review for an assignment."
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
        method="GET"
        path="/v1/reviews/:id"
        summary="Fetch a single review with its rubric scores."
        auth="reviewer"
        responseExample={{
          id: "rev_4c2",
          assignment_id: "asg_91f0",
          role: "parent",
          preferred: "A",
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
