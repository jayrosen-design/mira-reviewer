import { useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { DIALOGUES, type Criterion } from "@/data/dialogues";
import { Header } from "./Header";
import { DialogueContext } from "./DialogueContext";
import { ResponseComparison } from "./ResponseComparison";
import { RubricRating, type Ratings } from "./RubricRating";
import { ReviewerComments } from "./ReviewerComments";
import { ReviewActions } from "./ReviewActions";
import { ResearchMetadata } from "./ResearchMetadata";
import { SubmittedState } from "./SubmittedState";

type ReviewState = {
  selectedStronger: "A" | "B" | null;
  ratingsA: Ratings;
  ratingsB: Ratings;
  comments: string;
  status: "draft" | "submitted";
};

function emptyReview(): ReviewState {
  return {
    selectedStronger: null,
    ratingsA: {},
    ratingsB: {},
    comments: "",
    status: "draft",
  };
}

export function DialogueReview() {
  const [index, setIndex] = useState(0);
  const [reviews, setReviews] = useState<ReviewState[]>(() =>
    DIALOGUES.map(() => emptyReview()),
  );

  const current = DIALOGUES[index];
  const review = reviews[index];
  const hasNext = index < DIALOGUES.length - 1;

  const updateReview = (patch: Partial<ReviewState>) => {
    setReviews((prev) => {
      const next = prev.slice();
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const handleSelect = (which: "A" | "B") => {
    updateReview({ selectedStronger: which });
  };

  const handleRate = (which: "A" | "B", criterion: Criterion, value: number) => {
    if (which === "A") {
      updateReview({ ratingsA: { ...review.ratingsA, [criterion]: value } });
    } else {
      updateReview({ ratingsB: { ...review.ratingsB, [criterion]: value } });
    }
  };

  const handleSaveDraft = () => {
    updateReview({ status: "draft" });
    toast.success("Draft saved", {
      description: "Your in-progress review is kept in memory for this session.",
    });
  };

  const handleSubmit = () => {
    updateReview({ status: "submitted" });
  };

  const handleNext = () => {
    if (hasNext) setIndex((i) => i + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header current={index + 1} total={DIALOGUES.length} />

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        {review.status === "submitted" ? (
          <SubmittedState onNext={handleNext} hasNext={hasNext} />
        ) : (
          <>
            <DialogueContext
              scenario={current.scenario}
              dialogue={current.dialogue}
            />

            <ResponseComparison
              responseA={current.responseA}
              responseB={current.responseB}
              selected={review.selectedStronger}
              onSelect={handleSelect}
            />

            <RubricRating
              ratingsA={review.ratingsA}
              ratingsB={review.ratingsB}
              onChange={handleRate}
            />

            <ReviewerComments
              value={review.comments}
              onChange={(v) => updateReview({ comments: v })}
            />

            <ReviewActions
              onSaveDraft={handleSaveDraft}
              onSubmit={handleSubmit}
              onNext={handleNext}
              hasNext={hasNext}
            />
          </>
        )}

        <ResearchMetadata
          dialogueId={current.id}
          reviewSet={current.reviewSet}
        />
      </main>

      <Toaster />
    </div>
  );
}
