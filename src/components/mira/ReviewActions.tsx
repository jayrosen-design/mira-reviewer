import { Button } from "@/components/ui/button";

type Props = {
  onSaveDraft: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
  missingHint?: string | null;
};

export function ReviewActions({ onSaveDraft, onSubmit, canSubmit, missingHint }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="text-xs text-muted-foreground">
        {missingHint ? (
          <span className="text-destructive">{missingHint}</span>
        ) : (
          "Submit when ratings and a preferred response are complete."
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" onClick={onSaveDraft}>
          Save draft
        </Button>
        <Button onClick={onSubmit} disabled={!canSubmit}>
          Submit review
        </Button>
      </div>
    </div>
  );
}
