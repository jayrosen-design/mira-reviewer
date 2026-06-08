import { Info } from "lucide-react";
import type { ReviewerRole } from "@/lib/reviewerRole";

const COPY: Record<ReviewerRole, { title: string; body: string }> = {
  parent: {
    title: "Reviewer instructions",
    body: "You will review two possible responses to a parent concern about HPV vaccination. Please read both responses carefully. You will not be told who created each response. Rate each response based on how appropriate, clear, responsible, and empathic it feels, then choose the response you prefer and briefly explain why.",
  },
  expert: {
    title: "Expert reviewer instructions",
    body: "You will review two possible responses to a parent concern about HPV vaccination. Please evaluate whether each response is medically safe, accurate, and relevant. You will not be told who created each response.",
  },
  researcher: {
    title: "Researcher view",
    body: "You are viewing the review interface with researcher metadata enabled. Reviewers in the study see Response A and Response B without source labels.",
  },
};

export function InstructionPanel({ role }: { role: ReviewerRole }) {
  const { title, body } = COPY[role];
  return (
    <section
      aria-label={title}
      className="flex gap-3 rounded-2xl border border-primary/15 bg-primary-soft/60 p-4"
    >
      <Info className="mt-0.5 h-5 w-5 flex-none text-primary" aria-hidden />
      <div>
        <h2 className="text-sm font-semibold text-primary">{title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-foreground/80">{body}</p>
      </div>
    </section>
  );
}
