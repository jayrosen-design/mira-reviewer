import { Button } from "@/components/ui/button";

type Props = {
  onSaveDraft: () => void;
  onSubmit: () => void;
  onNext: () => void;
  hasNext: boolean;
};

export function ReviewActions({ onSaveDraft, onSubmit, onNext, hasNext }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Button variant="ghost" onClick={onSaveDraft}>
        Save draft
      </Button>
      <Button variant="outline" onClick={onNext} disabled={!hasNext}>
        Next dialogue
      </Button>
      <Button onClick={onSubmit}>Submit review</Button>
    </div>
  );
}
