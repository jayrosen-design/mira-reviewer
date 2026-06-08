import { createFileRoute } from "@tanstack/react-router";
import { DialogueReview } from "@/components/mira/DialogueReview";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MIRA Reviewer — Dialogue Review" },
      {
        name: "description",
        content:
          "Research evaluation interface for reviewing motivational interviewing responses related to HPV vaccination.",
      },
      { property: "og:title", content: "MIRA Reviewer — Dialogue Review" },
      {
        property: "og:description",
        content:
          "Blinded reviewer interface for evaluating Mira-generated responses against human interviewer responses.",
      },
    ],
  }),
  component: DialogueReview,
});
