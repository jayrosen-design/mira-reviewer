import { createFileRoute } from "@tanstack/react-router";
import { DialogueReview } from "@/components/mira/DialogueReview";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Review · Response Review" },
      {
        name: "description",
        content:
          "Parent Vaccine Talk Response Review — review two responses to a parent concern about HPV vaccination.",
      },
      { property: "og:title", content: "Review · Response Review" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      {
        property: "og:description",
        content:
          "Blinded review of responses to parent concerns about HPV vaccination.",
      },
    ],
  }),
  component: DialogueReview,
});
