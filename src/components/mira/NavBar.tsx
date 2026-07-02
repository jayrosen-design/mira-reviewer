import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, ClipboardList, LayoutDashboard, MessagesSquare, LogOut, UserRound, Stethoscope, ShieldCheck, ChevronDown, Users, UserCog, Info } from "lucide-react";
import { logout, useAuth } from "@/lib/auth";
import type { ReviewerRole } from "@/lib/reviewerRole";
import { ROLE_LABEL } from "@/lib/reviewerRole";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditAccountDialog } from "./EditAccountDialog";

const ALL_LINKS = [
  { to: "/", label: "Review", icon: MessagesSquare, exact: true, roles: ["parent", "expert"] as ReviewerRole[] },
  { to: "/progress", label: "My Progress", icon: ClipboardList, exact: true, roles: ["parent", "expert"] as ReviewerRole[] },
  { to: "/dashboard", label: "Research Dashboard", icon: LayoutDashboard, exact: true, roles: ["researcher"] as ReviewerRole[] },
  { to: "/users", label: "Users", icon: Users, exact: true, roles: ["researcher"] as ReviewerRole[] },
  { to: "/api-docs", label: "API / Data Model", icon: BookOpen, exact: false, roles: ["researcher"] as ReviewerRole[] },
] as const;

const ROLE_ICON: Record<ReviewerRole, React.ComponentType<{ className?: string }>> = {
  parent: UserRound,
  expert: Stethoscope,
  researcher: ShieldCheck,
};

export function NavBar() {
  const { isLoggedIn, role } = useAuth();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);

  if (!isLoggedIn || !role) return null;

  const links = ALL_LINKS.filter((l) => (l.roles as readonly ReviewerRole[]).includes(role));
  const RoleIcon = ROLE_ICON[role];

  const handleLogout = () => {
    logout();
    navigate({ to: "/login", replace: true });
  };

  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
        <Link to={role === "researcher" ? "/dashboard" : "/"} className="text-base font-semibold tracking-tight text-primary">
          MIRA Reviewer
        </Link>
        <ul className="flex flex-1 flex-wrap items-center gap-1">
          {links.map(({ to, label, icon: Icon, exact }) => (
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
              </Link>
            </li>
          ))}
        </ul>

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
            <RoleIcon className="h-4 w-4" />
            {ROLE_LABEL[role]}
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Signed in as</DropdownMenuLabel>
            <DropdownMenuItem disabled className="opacity-100">
              <RoleIcon className="mr-2 h-4 w-4" />
              {ROLE_LABEL[role]}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => setEditOpen(true)}>
              <UserCog className="mr-2 h-4 w-4" />
              Edit account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <EditAccountDialog open={editOpen} onOpenChange={setEditOpen} role={role} />
    </nav>
  );
}
