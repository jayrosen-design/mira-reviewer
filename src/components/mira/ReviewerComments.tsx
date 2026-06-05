import { Textarea } from "@/components/ui/textarea";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function ReviewerComments({ value, onChange }: Props) {
  return (
    <section
      aria-label="Reviewer comments"
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <label
        htmlFor="reviewer-comments"
        className="text-sm font-semibold text-foreground"
      >
        Reviewer comments
      </label>
      <p className="mb-3 mt-1 text-xs text-muted-foreground">
        Optional. Used by the research team to interpret your ratings.
      </p>
      <Textarea
        id="reviewer-comments"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Add notes about strengths, concerns, or why one response was stronger."
        className="min-h-32 resize-y"
      />
    </section>
  );
}
