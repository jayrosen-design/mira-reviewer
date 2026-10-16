import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, ClipboardList, LayoutDashboard, MessagesSquare, LogOut, UserRound, Stethoscope, ShieldCheck, ChevronDown, Users, UserCog, Info, Sparkles, Menu } from "lucide-react";
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
import { ParentVaccineTalkLogo } from "./ParentVaccineTalkLogo";
import { ThemeSwitcher, ThemeMenuItems } from "./ThemeSwitcher";

const ALL_LINKS = [
  { to: "/about", label: "About", icon: Info, exact: true, roles: ["parent", "expert"] as ReviewerRole[] },
  { to: "/", label: "Review", icon: MessagesSquare, exact: true, roles: ["parent", "expert"] as ReviewerRole[] },
  { to: "/progress", label: "My Progress", icon: ClipboardList, exact: true, roles: ["parent", "expert"] as ReviewerRole[] },
  { to: "/dashboard", label: "Research Dashboard", icon: LayoutDashboard, exact: true, roles: ["researcher"] as ReviewerRole[] },
  { to: "/users", label: "Users", icon: Users, exact: true, roles: ["researcher"] as ReviewerRole[] },
  { to: "/generate", label: "Generate Transcripts", icon: Sparkles, exact: true, roles: ["researcher"] as ReviewerRole[] },
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

  // Inline nav only where every link fits on one line; otherwise a single menu button.
  const isResearcher = role === "researcher";
  const inlineCls = isResearcher ? "hidden xl:flex" : "hidden lg:flex";
  const compactCls = isResearcher ? "xl:hidden" : "lg:hidden";

  return (
    <nav className="border-b border-border bg-card">
      <div className={`mx-auto flex items-center gap-3 px-4 py-3 sm:px-6 ${isResearcher ? "max-w-7xl" : "max-w-6xl"}`}>
        <Link to={isResearcher ? "/dashboard" : "/about"} className="flex min-w-0 shrink-0 items-center gap-2 transition-opacity hover:opacity-80" aria-label="Parent Vaccine Talk · Response Review">
          <ParentVaccineTalkLogo className="h-7 w-auto shrink-0" />
          <span className="hidden whitespace-nowrap font-display text-base font-semibold tracking-tight text-foreground min-[380px]:inline">
            Parent Vaccine Talk
          </span>
          <span className={`hidden whitespace-nowrap text-xs font-medium text-muted-foreground ${isResearcher ? "min-[1800px]:inline" : "sm:inline"}`}>Response Review</span>
        </Link>
        <ul className={`${inlineCls} min-w-0 flex-1 basis-0 items-center gap-1 overflow-hidden`}>
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
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={`${inlineCls} shrink-0 items-center gap-3`}>
          <ThemeSwitcher />

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
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

        <div className={`${compactCls} ml-auto shrink-0`}>
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Open menu"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Menu className="h-4 w-4" />
              <span className="hidden sm:inline">Menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-[80vh] w-64 overflow-y-auto">
              <DropdownMenuLabel className="flex items-center gap-2">
                <RoleIcon className="h-4 w-4" /> {ROLE_LABEL[role]}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {links.map(({ to, label, icon: Icon, exact }) => (
                <DropdownMenuItem key={to} asChild>
                  <Link
                    to={to}
                    activeOptions={{ exact }}
                    activeProps={{ className: "bg-primary-soft text-primary" }}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Color scheme</DropdownMenuLabel>
              <ThemeMenuItems />
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
      </div>

      <EditAccountDialog open={editOpen} onOpenChange={setEditOpen} role={role} />
    </nav>
  );
}
