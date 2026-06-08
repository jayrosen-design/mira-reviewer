import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { DIALOGUES, type Criterion } from "@/data/dialogues";
import { Header } from "./Header";
import { DialogueContext } from "./DialogueContext";
import { ResponseComparison, type Selection } from "./ResponseComparison";
import type { SourceGuess } from "./ResponseCard";
import { RubricRating, type Ratings } from "./RubricRating";
import { ReviewerComments } from "./ReviewerComments";
import { ReviewActions } from "./ReviewActions";

import { SubmittedState } from "./SubmittedState";

type ReviewState = {
  selectedStronger: Selection;
  ratingsA: Ratings;
  ratingsB: Ratings;
  guessA: SourceGuess;
  guessB: SourceGuess;
  comments: string;
  status: "draft" | "submitted";
};

function emptyReview(): ReviewState {
  return {
    selectedStronger: null,
    ratingsA: {},
    ratingsB: {},
    guessA: null,
    guessB: null,
    comments: "",
    status: "draft",
  };
}

export function DialogueReview() {
  const [index, setIndex] = useState(0);
  const [reviews, setReviews] = useState<ReviewState[]>(() =>
    DIALOGUES.map(() => emptyReview()),
  );
  const [parentTyping, setParentTyping] = useState(false);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleSelect = (which: Selection) => {
    updateReview({ selectedStronger: which });
    if (typingTimer.current) clearTimeout(typingTimer.current);
    if (which === "A" || which === "B") {
      setParentTyping(true);
      typingTimer.current = setTimeout(() => setParentTyping(false), 1400);
    } else {
      setParentTyping(false);
    }
  };

  // Reset typing state when changing dialogues.
  useEffect(() => {
    if (typingTimer.current) clearTimeout(typingTimer.current);
    setParentTyping(false);
  }, [index]);

  useEffect(() => {
    return () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
    };
  }, []);

  const handleRate = (
    which: "A" | "B",
    criterion: Criterion,
    value: number | null,
  ) => {
    const key = which === "A" ? "ratingsA" : "ratingsB";
    const next = { ...review[key] };
    if (value === null) delete next[criterion];
    else next[criterion] = value;
    updateReview({ [key]: next } as Partial<ReviewState>);
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

  const simulatedResponse =
    review.selectedStronger === "A"
      ? { which: "A" as const, text: current.responseA.text }
      : review.selectedStronger === "B"
        ? { which: "B" as const, text: current.responseB.text }
        : null;

  const parentReply =
    review.selectedStronger === "A"
      ? current.parentReplyA
      : review.selectedStronger === "B"
        ? current.parentReplyB
        : null;

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
              selectedResponse={simulatedResponse}
              parentTyping={parentTyping}
              parentReply={parentReply}
            />

            <ResponseComparison
              responseA={current.responseA}
              responseB={current.responseB}
              selected={review.selectedStronger}
              onSelect={handleSelect}
              guessA={review.guessA}
              guessB={review.guessB}
              onGuess={(which, g) =>
                updateReview(
                  which === "A" ? { guessA: g } : { guessB: g },
                )
              }
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
      </main>

      <Toaster />
    </div>
  );
}
