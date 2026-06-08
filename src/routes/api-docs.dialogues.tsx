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

      <ApiEndpoint
        method="POST"
        path="/v1/dialogues/:id/simulated-exchange"
        summary="Send a candidate response into the conversation and get a simulated parent reply. Overwrites any prior simulated exchange for this reviewer + dialogue."
        auth="reviewer"
        requestExample={{
          sent_label: "A",
          sent_response_id: "rsp_7710",
        }}
        responseExample={{
          id: "sim_4a2",
          reviewer_id: "r_8f2",
          dialogue_id: "MIRA-014",
          sent_response_id: "rsp_7710",
          sent_label: "A",
          simulated_parent_reply:
            "Hmm, that actually makes me feel a little better about it.",
          generator: "template-v1",
          created_at: "2026-06-08T14:05:22Z",
        }}
        errors={[
          { status: 401, meaning: "Not authenticated." },
          { status: 404, meaning: "Dialogue or response not found." },
          { status: 422, meaning: "sent_response_id does not belong to dialogue." },
        ]}
      />

      <ApiEndpoint
        method="DELETE"
        path="/v1/dialogues/:id/simulated-exchange"
        summary="Clear the reviewer's simulated exchange for this dialogue (e.g. when moving to the next item)."
        auth="reviewer"
        responseExample={{ ok: true }}
        errors={[{ status: 401, meaning: "Not authenticated." }]}
      />
    </div>
  );
}
