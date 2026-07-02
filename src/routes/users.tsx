import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Settings, RotateCcw, KeyRound, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REVIEWERS } from "@/data/mockProgress";

type UserType = "parent" | "expert" | "researcher";
type UserFilter = "all" | UserType;

type UserRow = {
  id: string;
  name: string;
  type: UserType;
  assigned?: number;
  completed?: number;
  meanParentScore?: number;
  expertYesRate?: number;
};

const RESEARCHERS: UserRow[] = [
  { id: "A-01", name: "Dr. Amelia Chen", type: "researcher" },
  { id: "A-02", name: "Dr. Marcus Patel", type: "researcher" },
  { id: "A-03", name: "Priya Rao (RA)", type: "researcher" },
];

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "Users — MIRA Reviewer" },
      {
        name: "description",
        content: "Reviewer and admin roster for the MIRA study.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: UsersPage,
});

const TYPE_BADGE: Record<UserType, string> = {
  parent: "bg-accent-soft text-accent-foreground",
  expert: "bg-primary-soft text-primary",
  researcher: "bg-muted text-foreground",
};

const TYPE_LABEL: Record<UserType, string> = {
  parent: "Parent",
  expert: "Expert",
  researcher: "Researcher / Admin",
};

function UsersPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<UserFilter>("all");
  const [editing, setEditing] = useState<UserRow | null>(null);

  const allUsers: UserRow[] = useMemo(
    () => [...REVIEWERS.map((r) => ({ ...r }) as UserRow), ...RESEARCHERS],
    [],
  );

  const filtered = useMemo(
    () => (filter === "all" ? allUsers : allUsers.filter((u) => u.type === filter)),
    [allUsers, filter],
  );

  const goToReviewer = (u: UserRow) => {
    if (u.type === "researcher") return;
    navigate({ to: "/reviewers/$reviewerId", params: { reviewerId: u.id } });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Users
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Reviewer and admin roster. Anonymous identifiers used to protect
              reviewer privacy.
            </p>
          </div>
          <ToggleGroup
            type="single"
            value={filter}
            onValueChange={(v) => v && setFilter(v as UserFilter)}
            variant="outline"
            size="sm"
          >
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            <ToggleGroupItem value="parent">Parents</ToggleGroupItem>
            <ToggleGroupItem value="expert">Experts</ToggleGroupItem>
            <ToggleGroupItem value="researcher">Researchers / Admins</ToggleGroupItem>
          </ToggleGroup>
        </header>

        <section className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="w-64">Completion</TableHead>
                <TableHead className="text-right">Mean parent score</TableHead>
                <TableHead className="text-right">Expert 'Yes' rate</TableHead>
                <TableHead className="w-12 text-right">Manage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...filtered]
                .sort((a, b) => (b.completed ?? -1) - (a.completed ?? -1))
                .map((u) => {
                  const isReviewer = u.type !== "researcher";
                  const pct =
                    isReviewer && u.assigned
                      ? Math.round((u.completed! / u.assigned) * 100)
                      : null;
                  return (
                    <TableRow
                      key={u.id}
                      onClick={() => goToReviewer(u)}
                      className={
                        isReviewer
                          ? "cursor-pointer transition hover:bg-muted/60"
                          : undefined
                      }
                    >
                      <TableCell>
                        <div className="font-medium text-foreground">{u.name}</div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {u.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${TYPE_BADGE[u.type]}`}
                        >
                          {TYPE_LABEL[u.type]}
                        </span>
                      </TableCell>
                      <TableCell>
                        {pct !== null ? (
                          <div className="flex items-center gap-3">
                            <Progress value={pct} className="h-2 flex-1" />
                            <span className="w-24 text-right text-xs tabular-nums text-muted-foreground">
                              {u.completed}/{u.assigned} ({pct}%)
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {u.type === "parent" && u.meanParentScore !== undefined
                          ? u.meanParentScore.toFixed(1)
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {u.type === "expert" && u.expertYesRate !== undefined
                          ? `${u.expertYesRate}%`
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Manage ${u.name}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditing(u);
                          }}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </section>
      </main>

      <ManageUserDialog
        user={editing}
        onOpenChange={(open) => !open && setEditing(null)}
      />

      <Toaster />
    </div>
  );
}

function ManageUserDialog({
  user,
  onOpenChange,
}: {
  user: UserRow | null;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<UserType>("parent");

  // Sync form when user changes
  useMemo(() => {
    if (user) {
      setName(user.name);
      setType(user.type);
    }
  }, [user]);

  const isReviewer = user?.type !== "researcher";

  const handleSave = () => {
    toast.success("User updated", {
      description: `${user?.id} saved. In production, this would persist changes.`,
    });
    onOpenChange(false);
  };

  const handleResetReviews = () => {
    toast.success("Reviews reset", {
      description: `All submitted reviews for ${user?.id} have been cleared.`,
    });
  };

  const handlePasswordReset = () => {
    toast.success("Password reset sent", {
      description: `Password reset email queued for ${user?.name}.`,
    });
  };

  const handleDelete = () => {
    toast.error("Account deleted", {
      description: `${user?.id} has been permanently removed.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage user</DialogTitle>
          <DialogDescription>
            Update details or run account actions for{" "}
            <span className="font-mono">{user?.id}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="user-name">Name</Label>
            <Input
              id="user-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="user-type">Account type</Label>
            <Select value={type} onValueChange={(v) => setType(v as UserType)}>
              <SelectTrigger id="user-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">Parent Reviewer</SelectItem>
                <SelectItem value="expert">Expert Reviewer</SelectItem>
                <SelectItem value="researcher">Researcher / Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 rounded-md border border-border bg-muted/40 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Account actions
            </p>
            <div className="flex flex-wrap gap-2">
              {isReviewer && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResetReviews}
                >
                  <RotateCcw className="h-4 w-4" /> Reset reviews
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePasswordReset}
              >
                <KeyRound className="h-4 w-4" /> Send password reset
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" /> Delete account
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
