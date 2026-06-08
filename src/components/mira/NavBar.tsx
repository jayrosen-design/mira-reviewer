import { Link } from "@tanstack/react-router";
import { BookOpen, ClipboardList, LayoutDashboard, MessagesSquare, Lock } from "lucide-react";

const links = [
  { to: "/", label: "Review", icon: MessagesSquare, exact: true, restricted: false },
  { to: "/progress", label: "My Progress", icon: ClipboardList, exact: true, restricted: false },
  { to: "/dashboard", label: "Research Dashboard", icon: LayoutDashboard, exact: true, restricted: true },
  { to: "/api-docs", label: "API / Data Model", icon: BookOpen, exact: false, restricted: true },
] as const;


export function NavBar() {
  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">
        <Link to="/" className="text-base font-semibold tracking-tight text-primary">
          MIRA Reviewer
        </Link>
        <ul className="flex flex-1 flex-wrap items-center gap-1">
          {links.map(({ to, label, icon: Icon, exact, restricted }) => (
            <li key={to}>
              <Link
                to={to}
                activeOptions={{ exact }}
                activeProps={{
                  className: "bg-primary-soft text-primary",
                }}
                inactiveProps={{
                  className: "text-muted-foreground hover:text-foreground hover:bg-muted",
                }}
                className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
              >
                <Icon className="h-4 w-4" />
                {label}
                {restricted && (
                  <span
                    title="Researcher / admin access"
                    className="ml-1 inline-flex items-center text-[10px] text-muted-foreground"
                  >
                    <Lock className="h-3 w-3" />
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
