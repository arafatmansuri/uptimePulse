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
import { useWebsiteMutation } from "@/lib/queries/websiteQueries";
import { Website } from "@/lib/responses";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function DeleteWebsiteDialog({
  website,
  open,
  onOpenChange,
}: {
  website: Website | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const deleteWebsiteMutation = useWebsiteMutation();
  const onConfirm = async () => {
    setDeleting(true);
    deleteWebsiteMutation.mutate(
      {
        endpoint: `/${website?.id}`,
        method: Methods.DELETE,
      },
      {
        onSuccess: () => {
          toast.success("Website deleted successfully");
          setTimeout(() => {
            setDeleting(false);
            onOpenChange(false);
          }, 600);
        },
        onError: () => {
          toast.error("Failed to delete website");
          setDeleting(false);
          onOpenChange(false);
        },
      }
    );
  };
  useEffect(() => {
    let toastId: string | number;
    if (deleteWebsiteMutation.isPending) {
      toastId = toast.loading("Deleting website...", {
        style: { backgroundColor: "#1f2937", color: "#fff" },
      });
    }
    return () => {
      if (deleteWebsiteMutation.isPending) {
        toast.dismiss(toastId);
      }
    };
  }, [deleteWebsiteMutation.isPending]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-400">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div>
              <DialogTitle>Delete website</DialogTitle>
              <DialogDescription className="mt-1">
                Are you sure you want to stop monitoring{" "}
                <span className="font-semibold text-ink-200">
                  {website?.description || website?.url}
                </span>
                ? This action cannot be undone.
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
