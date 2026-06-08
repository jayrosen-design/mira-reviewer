import { useEffect, useState } from "react";

export type ReviewerRole = "parent" | "expert" | "researcher";

const KEY = "mira:reviewerRole";

export const ROLE_LABEL: Record<ReviewerRole, string> = {
  parent: "Parent Reviewer",
  expert: "Expert Reviewer",
  researcher: "Researcher / Admin",
};

export function useReviewerRole(): [ReviewerRole, (r: ReviewerRole) => void] {
  const [role, setRole] = useState<ReviewerRole>("parent");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw === "parent" || raw === "expert" || raw === "researcher") {
        setRole(raw);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const update = (r: ReviewerRole) => {
    setRole(r);
    try {
      localStorage.setItem(KEY, r);
    } catch {
      /* ignore */
    }
  };

  return [role, update];
}
