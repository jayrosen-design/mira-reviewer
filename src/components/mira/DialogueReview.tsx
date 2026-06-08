import { useEffect, useRef, useState } from "react";
import type { DialogueTurn } from "@/data/dialogues";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  DIALOGUES,
  TOTAL_REVIEW_ITEMS,
  PARENT_STATEMENTS,
  EXPERT_QUESTIONS,
  type ParentStatement,
  type ExpertQuestion,
  type ExpertAnswer,
} from "@/data/dialogues";
import { useReviewerRole } from "@/lib/reviewerRole";
import { Header } from "./Header";
import { InstructionPanel } from "./InstructionPanel";
import { DialogueContext } from "./DialogueContext";

import { ResponseComparison, PreferredResponse, type Selection } from "./ResponseComparison";
import {
  ParentRubric,
  ExpertRubric,
  type ParentRatings,
  type ExpertRatings,
} from "./RubricRating";
import { ReviewerComments } from "./ReviewerComments";
import { ReviewActions } from "./ReviewActions";
import { SubmittedState } from "./SubmittedState";
import { ResearchMetadata } from "./ResearchMetadata";

type ReviewState = {
  preferred: Selection;
  parentA: ParentRatings;
  parentB: ParentRatings;
  expertA: ExpertRatings;
  expertB: ExpertRatings;
  expertNotesA: string;
  expertNotesB: string;
  comments: string;
  status: "draft" | "submitted";
};

function emptyReview(): ReviewState {
  return {
    preferred: null,
    parentA: {},
    parentB: {},
    expertA: {},
    expertB: {},
    expertNotesA: "",
    expertNotesB: "",
    comments: "",
    status: "draft",
  };
}

export function DialogueReview() {
  const [role, setRole] = useReviewerRole();
  const [index, setIndex] = useState(0);
  const [reviews, setReviews] = useState<ReviewState[]>(() =>
    DIALOGUES.map(() => emptyReview()),
  );
  const [simulatedTurns, setSimulatedTurns] = useState<DialogueTurn[]>([]);
  const [parentTyping, setParentTyping] = useState(false);
  const [sentLabel, setSentLabel] = useState<"A" | "B" | null>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = DIALOGUES[index];
  const review = reviews[index];
  const hasNext = index < DIALOGUES.length - 1;

  // Reset simulated chat when dialogue changes.
  useEffect(() => {
    setSimulatedTurns([]);
    setParentTyping(false);
    setSentLabel(null);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
  }, [index]);

  useEffect(() => {
    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, []);

  const handleSendToChat = (which: "A" | "B") => {
    const clinicianText = which === "A" ? current.responseA.text : current.responseB.text;
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    setSentLabel(which);
    setSimulatedTurns([{ speaker: "clinician", text: clinicianText }]);
    setParentTyping(true);
    typingTimeout.current = setTimeout(() => {
      const reply = pickParentReply(0);
      setSimulatedTurns([
        { speaker: "clinician", text: clinicianText },
        { speaker: "parent", text: reply },
      ]);
      setParentTyping(false);
    }, 1800);
  };

  const handleClearPreview = () => {
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    setSimulatedTurns([]);
    setParentTyping(false);
    setSentLabel(null);
  };

  const updateReview = (patch: Partial<ReviewState>) => {
    setReviews((prev) => {
      const next = prev.slice();
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const handleParentRate = (
    which: "A" | "B",
    statement: ParentStatement,
    value: number | null,
  ) => {
    const key = which === "A" ? "parentA" : "parentB";
    const next = { ...review[key] };
    if (value === null) delete next[statement];
    else next[statement] = value;
    updateReview({ [key]: next } as Partial<ReviewState>);
  };

  const handleExpertRate = (
    which: "A" | "B",
    question: ExpertQuestion,
    value: ExpertAnswer,
  ) => {
    const key = which === "A" ? "expertA" : "expertB";
    const next = { ...review[key] };
    if (value === null) delete next[question];
    else next[question] = value;
    updateReview({ [key]: next } as Partial<ReviewState>);
  };

  const handleExpertNotes = (which: "A" | "B", value: string) => {
    updateReview(
      which === "A" ? { expertNotesA: value } : { expertNotesB: value },
    );
  };

  const handleSaveDraft = () => {
    updateReview({ status: "draft" });
    toast.success("Draft saved locally for this prototype.", {
      description:
        "In production, draft data would be saved to the backend automatically.",
    });
  };

  // Validation: ratings + preferred required.
  const parentComplete =
    PARENT_STATEMENTS.every((s) => review.parentA[s] != null) &&
    PARENT_STATEMENTS.every((s) => review.parentB[s] != null);
  const expertComplete =
    EXPERT_QUESTIONS.every((q) => review.expertA[q] != null) &&
    EXPERT_QUESTIONS.every((q) => review.expertB[q] != null);

  const ratingsComplete = role === "expert" ? expertComplete : parentComplete;
  const preferenceComplete = review.preferred != null;
  const canSubmit = ratingsComplete && preferenceComplete;

  const missingHint = !ratingsComplete
    ? "Please complete every rating for Response A and Response B."
    : !preferenceComplete
      ? "Please choose a preferred response (or Neither / Too similar)."
      : null;

  const handleSubmit = () => {
    if (!canSubmit) return;
    updateReview({ status: "submitted" });
  };

  const handleNext = () => {
    if (hasNext) setIndex((i) => i + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        current={index + 1}
        total={TOTAL_REVIEW_ITEMS}
        role={role}
        onRoleChange={setRole}
      />

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        {review.status === "submitted" ? (
          <SubmittedState onNext={handleNext} hasNext={hasNext} />
        ) : (
          <>
            <InstructionPanel role={role} />

            <DialogueContext
              parentConcern={current.parentConcern}
              barrierCategory={current.barrierCategory}
              priorDialogue={current.priorDialogue}
              simulatedTurns={simulatedTurns}
              parentTyping={parentTyping}
              sentLabel={sentLabel}
              onClearPreview={sentLabel ? handleClearPreview : undefined}
            />

            <ResponseComparison
              responseA={current.responseA}
              responseB={current.responseB}
              onSend={handleSendToChat}
              sendDisabled={parentTyping}
            />

            {role === "expert" ? (
              <ExpertRubric
                ratingsA={review.expertA}
                ratingsB={review.expertB}
                onChange={handleExpertRate}
                notesA={review.expertNotesA}
                notesB={review.expertNotesB}
                onNotes={handleExpertNotes}
              />
            ) : (
              <ParentRubric
                ratingsA={review.parentA}
                ratingsB={review.parentB}
                onChange={handleParentRate}
              />
            )}

            <PreferredResponse
              responseA={current.responseA}
              responseB={current.responseB}
              selected={review.preferred}
              onSelect={(s) => updateReview({ preferred: s })}
            />

            <ReviewerComments
              value={review.comments}
              onChange={(v) => updateReview({ comments: v })}
            />

            <ResearchMetadata
              item={current}
              role={role}
              status={review.status}
            />

            <ReviewActions
              onSaveDraft={handleSaveDraft}
              onSubmit={handleSubmit}
              canSubmit={canSubmit}
              missingHint={missingHint}
            />
          </>
        )}
      </main>

      <Toaster />
    </div>
  );
}

const SIMULATED_PARENT_REPLIES = [
  "Hmm, okay. That actually makes me feel a little better about it.",
  "I see what you mean. Can you tell me more about the side effects you've actually seen?",
  "I appreciate that. I'd still like to think about it before deciding today.",
  "That's helpful. What would you recommend if she were your daughter?",
  "Okay. So you're saying it's safer to do it earlier rather than later?",
  "Alright. I think I just need a little time to talk it over with my partner.",
];

function pickParentReply(turnIndex: number): string {
  return SIMULATED_PARENT_REPLIES[turnIndex % SIMULATED_PARENT_REPLIES.length];
}
