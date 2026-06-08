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
        Why did you prefer this response?
      </label>
      <p className="mb-3 mt-1 text-xs text-muted-foreground">
        Optional. A short explanation helps the research team interpret your choice.
      </p>
      <Textarea
        id="reviewer-comments"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="What stood out? What felt stronger or weaker?"
        className="min-h-28 resize-y"
      />
    </section>
  );
}
