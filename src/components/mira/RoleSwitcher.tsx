import { UserRound, Stethoscope, ShieldCheck } from "lucide-react";
import type { ReviewerRole } from "@/lib/reviewerRole";

type Props = {
  role: ReviewerRole;
  onChange: (r: ReviewerRole) => void;
};

const options: { id: ReviewerRole; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "parent", label: "Parent Reviewer", icon: UserRound },
  { id: "expert", label: "Expert Reviewer", icon: Stethoscope },
  { id: "researcher", label: "Researcher / Admin", icon: ShieldCheck },
];

export function RoleSwitcher({ role, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Reviewer type"
      className="inline-flex rounded-lg border border-border bg-card p-1 shadow-sm"
    >
      {options.map(({ id, label, icon: Icon }) => {
        const active = role === id;
        return (
          <button
            key={id}
            role="radio"
            aria-checked={active}
            type="button"
            onClick={() => onChange(id)}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
