"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Methods } from "@/lib/constants";
import { useAuthMutation } from "@/lib/queries/authQueries";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function DeleteAccountDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const authMutation = useAuthMutation();
  const navigate = useRouter();
  const onConfirm = async () => {
    setDeleting(true);
    authMutation.mutate(
      {
        endpoint: `/account`,
        method: Methods.DELETE,
      },
      {
        onSuccess: () => {
          toast.success("Account deleted successfully");
          setTimeout(() => {
            setDeleting(false);
            onOpenChange(false);
            navigate.push("/signin");
          }, 600);
        },
        onError: () => {
          toast.error("Failed to delete account");
          setDeleting(false);
          onOpenChange(false);
        },
      }
    );
  };
  useEffect(() => {
    let toastId: string | number;
    if (authMutation.isPending) {
      toastId = toast.loading("Deleting account...", {
        style: { backgroundColor: "#1f2937", color: "#fff" },
      });
    }
    return () => {
      if (authMutation.isPending) {
        toast.dismiss(toastId);
      }
    };
  }, [authMutation.isPending]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-400">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div>
              <DialogTitle>Delete account</DialogTitle>
              <DialogDescription className="mt-1">
                Are you sure you want to delete your account? This action cannot
                be undone. You will lose all your monitors and data associated with your account.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-5 flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1 bg-red-500 text-white hover:bg-red-600"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
