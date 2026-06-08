import { Link } from "@tanstack/react-router";
import { BookOpen, ClipboardList, LayoutDashboard, MessagesSquare } from "lucide-react";

const links = [
  { to: "/", label: "Review", icon: MessagesSquare, exact: true },
  { to: "/progress", label: "Progress Tracker", icon: ClipboardList, exact: true },
  { to: "/dashboard", label: "Research Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/api-docs", label: "API Docs", icon: BookOpen, exact: false },
] as const;


export function NavBar() {
  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">
        <Link to="/" className="text-base font-semibold tracking-tight text-primary">
          MIRA
        </Link>
        <ul className="flex flex-1 items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                activeOptions={{ exact: true }}
                activeProps={{
                  className:
                    "bg-primary-soft text-primary",
                }}
                inactiveProps={{
                  className: "text-muted-foreground hover:text-foreground hover:bg-muted",
                }}
                className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
