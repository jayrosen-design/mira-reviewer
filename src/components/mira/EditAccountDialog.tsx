import { useEffect, useState } from "react";
import { KeyRound, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ReviewerRole } from "@/lib/reviewerRole";
import { ROLE_LABEL } from "@/lib/reviewerRole";

export function EditAccountDialog({
  open,
  onOpenChange,
  role,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: ReviewerRole;
}) {
  const [name, setName] = useState(ROLE_LABEL[role]);

  useEffect(() => {
    if (open) setName(ROLE_LABEL[role]);
  }, [open, role]);

  const handleSave = () => {
    toast.success("Account updated", {
      description: "In production, this would persist your changes.",
    });
    onOpenChange(false);
  };

  const handlePasswordReset = () => {
    toast.success("Password reset sent", {
      description: "Check your email for a reset link.",
    });
  };

  const handleResetReviews = () => {
    toast.success("Reviews reset", {
      description: "All of your submitted reviews have been cleared.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit account</DialogTitle>
          <DialogDescription>
            Update your display name or run account actions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="account-name">Name</Label>
            <Input
              id="account-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="space-y-2 rounded-md border border-border bg-muted/40 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Account actions
            </p>
            <div className="flex flex-wrap gap-2">
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
                variant="outline"
                size="sm"
                onClick={handleResetReviews}
              >
                <RotateCcw className="h-4 w-4" /> Reset reviews
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
