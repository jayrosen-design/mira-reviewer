import { RoleSwitcher } from "./RoleSwitcher";
import type { ReviewerRole } from "@/lib/reviewerRole";

type Props = {
  current: number;
  total: number;
  role: ReviewerRole;
  onRoleChange: (r: ReviewerRole) => void;
};

export function Header({ current, total, role, onRoleChange }: Props) {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-primary">
                MIRA Reviewer
              </h1>
              <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-medium text-primary">
                Research preview
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-foreground">
              Mira Dialogue Review System
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Dialogue Review · Review Item {current} of {total}
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <RoleSwitcher role={role} onChange={onRoleChange} />
          </div>
        </div>
      </div>
    </header>
  );
}
