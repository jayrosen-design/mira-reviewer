import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { UserRound, Stethoscope, ShieldCheck } from "lucide-react";
import { loginAs, useAuth } from "@/lib/auth";
import type { ReviewerRole } from "@/lib/reviewerRole";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — MIRA Reviewer" },
      { name: "description", content: "Select an account type to enter the MIRA Reviewer." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

const OPTIONS: {
  id: ReviewerRole;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: "parent",
    label: "Parent Reviewer",
    desc: "Review dialogues from a parent's perspective.",
    icon: UserRound,
  },
  {
    id: "expert",
    label: "Expert Reviewer",
    desc: "Evaluate responses for clinical safety and accuracy.",
    icon: Stethoscope,
  },
  {
    id: "researcher",
    label: "Researcher / Admin",
    desc: "Access dashboards, data, and API documentation.",
    icon: ShieldCheck,
  },
];

function LoginPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const { isLoggedIn, role } = useAuth();
  const [selected, setSelected] = useState<ReviewerRole | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn && role) {
      navigate({ to: role === "researcher" ? "/dashboard" : "/", replace: true });
    }
  }, [isLoggedIn, role, navigate]);

  // Warm the likely destinations so the target page is ready to paint together
  // with the navbar the instant we navigate.
  useEffect(() => {
    router.preloadRoute({ to: "/" }).catch(() => {});
    router.preloadRoute({ to: "/dashboard" }).catch(() => {});
  }, [router]);

  const handleSignIn = async () => {
    if (!selected || signingIn) return;
    setSigningIn(true);
    const to = selected === "researcher" ? "/dashboard" : "/";
    // Preload the destination route chunk + loader BEFORE flipping auth so the
    // navbar and the page appear in the same paint.
    try {
      await router.preloadRoute({ to });
    } catch {
      /* ignore preload errors — we'll still navigate */
    }
    loginAs(selected);
    navigate({ to, replace: true });
  };


  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-primary">
            MIRA
          </h1>
          <p className="mt-2 text-lg font-semibold text-foreground">
            Motivational Interviewing Response Assessment
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full border border-primary/30 bg-primary-soft px-2.5 py-0.5 text-[11px] font-medium text-primary">
              Research Preview
            </span>
            <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
              Version 0.0.1
            </span>
          </div>
          <p className="mt-8 text-base font-semibold text-foreground">
            Select an account to continue
          </p>
        </div>

        <div className="mt-8 space-y-2">
          {OPTIONS.map(({ id, label, desc, icon: Icon }) => {
            const active = selected === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelected(id)}
                className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition ${
                  active
                    ? "border-primary bg-primary-soft"
                    : "border-border hover:bg-muted"
                }`}
              >
                <span
                  className={`mt-0.5 rounded-md p-2 ${
                    active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-medium text-foreground">{label}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{desc}</span>
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={!selected}
          onClick={handleSignIn}
          className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Sign in
        </button>

      </div>
    </div>
  );
}
