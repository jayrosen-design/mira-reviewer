import { createFileRoute } from "@tanstack/react-router";
import { ApiEndpoint } from "@/components/mira/ApiEndpoint";

export const Route = createFileRoute("/api-docs/transcripts")({
  component: TranscriptsDocs,
});

function TranscriptsDocs() {
  return (
    <div className="space-y-5">
      <header>
        <h2 className="text-lg font-semibold">Transcript generation &amp; REDCap</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Researcher-only endpoints backing the <code className="font-mono">/generate</code> page.
          Generation runs offline as a batch job — the reviewer app never calls a model at request
          time. Generated transcripts are transmitted to REDCap, where the research team performs
          blinded MITI coding; the coding itself happens outside this application.
        </p>
      </header>

      <ApiEndpoint
        method="POST"
        path="/v1/transcripts/generate"
        summary="Queue a generation run from a free-text scenario prompt. Returns a batch in draft status."
        auth="researcher"
        requestExample={{
          prompt:
            "Parent hesitant about the HPV vaccine for a 9-year-old; worried it is too early.",
          count: 3,
          model_version: "mira-v0.4.1",
        }}
        responseExample={{
          id: "BATCH-2026-005",
          prompt: "Parent hesitant about the HPV vaccine for a 9-year-old…",
          count: 3,
          status: "draft",
          model_version: "mira-v0.4.1",
          created_at: "2026-07-27T14:02:11Z",
        }}
        errors={[
          { status: 401, meaning: "Not authenticated." },
          { status: 403, meaning: "Caller is not a researcher." },
          { status: 422, meaning: "prompt empty or count outside 1–5." },
        ]}
      />

      <ApiEndpoint
        method="GET"
        path="/v1/transcripts/batches"
        summary="List generation batches, newest first, with REDCap transmission status."
        auth="researcher"
        responseExample={{
          batches: [
            {
              id: "BATCH-2026-004",
              prompt: "Parent unsure the vaccine really prevents cancer…",
              count: 3,
              status: "sent",
              redcap_record_id: "REDCAP-2026-0142",
              sent_at: "2026-07-22T13:31:00Z",
            },
            {
              id: "BATCH-2026-003",
              count: 4,
              status: "coded",
              redcap_record_id: "REDCAP-2026-0138",
              coded_at: "2026-07-21T16:41:00Z",
            },
          ],
        }}
        errors={[{ status: 401, meaning: "Not authenticated." }]}
      />

      <ApiEndpoint
        method="GET"
        path="/v1/transcripts/batches/:id"
        summary="Fetch one batch with its generated transcripts (blinded IDs only)."
        auth="researcher"
        responseExample={{
          id: "BATCH-2026-004",
          status: "sent",
          transcripts: [
            {
              id: "BATCH-2026-004-T001",
              blinded_id: "TRX-4C1A",
              barrier_category: "Vaccine effectiveness",
              turn_count: 6,
            },
          ],
        }}
        errors={[
          { status: 401, meaning: "Not authenticated." },
          { status: 404, meaning: "Batch not found." },
        ]}
      />

      <ApiEndpoint
        method="GET"
        path="/v1/transcripts/:id"
        summary="Blinded transcript payload as delivered to MITI coders. Model version and generator are omitted for coder-scoped tokens."
        auth="researcher"
        responseExample={{
          id: "BATCH-2026-004-T001",
          blinded_id: "TRX-4C1A",
          barrier_category: "Vaccine effectiveness",
          turns: [
            { speaker: "clinician", text: "Where are you with the HPV vaccine right now?" },
            { speaker: "parent", text: "I keep reading that it doesn't really stop cancer…" },
          ],
          model_version: "mira-v0.4.1",
          generated_at: "2026-07-22T13:05:00Z",
        }}
        errors={[
          { status: 401, meaning: "Not authenticated." },
          { status: 404, meaning: "Transcript not found." },
        ]}
      />

      <ApiEndpoint
        method="POST"
        path="/v1/transcripts/batches/:id/redcap"
        summary="Transmit a draft batch to REDCap for blinded MITI coding. Idempotent — re-sending a sent batch returns the existing record."
        auth="researcher"
        requestExample={{ instrument: "miti_4_2_1", blind: true }}
        responseExample={{
          batch_id: "BATCH-2026-005",
          status: "sent",
          redcap_record_id: "REDCAP-2026-0145",
          sent_at: "2026-07-27T14:06:40Z",
          transcripts_transmitted: 3,
        }}
        errors={[
          { status: 401, meaning: "Not authenticated." },
          { status: 403, meaning: "Caller is not a researcher." },
          { status: 409, meaning: "Batch already coded." },
          { status: 502, meaning: "REDCap API unreachable." },
        ]}
      />

      <ApiEndpoint
        method="GET"
        path="/v1/transcripts/batches/:id/redcap/status"
        summary="Poll REDCap for coding progress. Coders' MITI scores are returned once the instrument is complete."
        auth="researcher"
        responseExample={{
          batch_id: "BATCH-2026-003",
          status: "coded",
          coded_at: "2026-07-21T16:41:00Z",
          results: [
            {
              blinded_id: "TRX-91B0",
              globals: {
                cultivating_change_talk: 4,
                softening_sustain_talk: 4,
                partnership: 5,
                empathy: 5,
              },
              behaviors: {
                open_questions: 6,
                closed_questions: 2,
                simple_reflections: 3,
                complex_reflections: 5,
                affirmations: 2,
                seeking_collaboration: 3,
                mi_adherent: 4,
                mi_non_adherent: 0,
              },
            },
          ],
        }}
        errors={[
          { status: 401, meaning: "Not authenticated." },
          { status: 404, meaning: "Batch not found." },
        ]}
      />
    </div>
  );
}
