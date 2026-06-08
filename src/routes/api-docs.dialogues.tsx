import { createFileRoute } from "@tanstack/react-router";
import { ApiEndpoint } from "@/components/mira/ApiEndpoint";

export const Route = createFileRoute("/api-docs/dialogues")({
  component: DialoguesDocs,
});

function DialoguesDocs() {
  return (
    <div className="space-y-5">
      <header>
        <h2 className="text-lg font-semibold">Dialogues</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Fetch the next assignment or a specific dialogue. Responses are returned with
          A/B already shuffled per the reviewer's assignment; the <code className="font-mono">source</code>{" "}
          field is never exposed.
        </p>
      </header>

      <ApiEndpoint
        method="GET"
        path="/v1/dialogues/next"
        summary="Return the next unreviewed dialogue assigned to the caller."
        auth="reviewer"
        responseExample={{
          assignment_id: "asg_91f0",
          dialogue: {
            id: "MIRA-014",
            review_set: "Pilot Set B",
            scenario: "Parent uncertain about ADHD medication.",
            turns: [
              { speaker: "parent", text: "I just don't know if medication is right for him." },
              { speaker: "clinician", text: "Can you tell me what's worrying you most?" },
            ],
          },
          response_a: {
            id: "rsp_7710",
            title: "Response 1",
            text: "It sounds like you're weighing a lot here…",
          },
          response_b: {
            id: "rsp_7711",
            title: "Response 2",
            text: "Many parents start with a low dose and see how it goes…",
          },
          remaining: 38,
        }}
        errors={[
          { status: 401, meaning: "Not authenticated." },
          { status: 404, meaning: "No assignments remaining." },
        ]}
      />

      <ApiEndpoint
        method="GET"
        path="/v1/dialogues/:id"
        summary="Look up a single dialogue. Researchers receive ground-truth source fields."
        auth="reviewer"
        responseExample={{
          id: "MIRA-014",
          review_set: "Pilot Set B",
          scenario: "Parent uncertain about ADHD medication.",
          turns: [{ speaker: "parent", text: "I just don't know…" }],
          response_a: { id: "rsp_7710", title: "Response 1", text: "…" },
          response_b: { id: "rsp_7711", title: "Response 2", text: "…" },
        }}
        errors={[
          { status: 401, meaning: "Not authenticated." },
          { status: 404, meaning: "Dialogue not found." },
        ]}
      />
    </div>
  );
}
