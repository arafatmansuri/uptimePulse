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
import { addWebsiteSchema, type AddWebsiteValues } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function EditWebsiteDialog({
  website,
  open,
  onOpenChange,
}: {
  website: Website | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const updateWebsiteMutation = useWebsiteMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddWebsiteValues>({
    resolver: zodResolver(addWebsiteSchema),
    defaultValues: { description: "", url: "" },
  });

  useEffect(() => {
    if (website && open) {
      reset({
        description: website.description,
        url: website.url,
      });
      // setServerError(null);
    }
  }, [website, open, reset]);

  const onSubmit = async (values: AddWebsiteValues) => {
    setServerError(null);
    setSaving(true);
    updateWebsiteMutation.mutate(
      {
        endpoint: `/${website?.id}`,
        method: Methods.UPDATE,
        data: values,
      },
      {
        onSuccess: () => {
          toast.success("Website updated successfully");
          setTimeout(() => {
            setSaving(false);
            onOpenChange(false);
          }, 600);
        },
        onError: () => {
          toast.error("Failed to update website");
          setSaving(false);
          onOpenChange(false);
        },
      }
    );
  };
  useEffect(() => {
    let toastId: string | number;
    if (updateWebsiteMutation.isPending) {
      toastId = toast.loading("Updating website...", {
        style: { backgroundColor: "#1f2937", color: "#fff" },
      });
    }
    return () => {
      if (updateWebsiteMutation.isPending) {
        toast.dismiss(toastId);
      }
    };
  }, [updateWebsiteMutation.isPending]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit website</DialogTitle>
          <DialogDescription>
            Update the monitor configuration.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-5 space-y-4"
          noValidate
        >
          {serverError && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {serverError}
            </div>
          )}
          <div>
            <label
              htmlFor="edit-url"
              className="mb-1.5 block text-sm font-medium text-ink-200"
            >
              URL
            </label>
            <div className="relative">
              <Globe className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-500" />
              <input
                id="edit-url"
                type="url"
                placeholder="https://api.example.com/health"
                {...register("url")}
                className="w-full rounded-xl border border-ink-700 bg-ink-950/60 py-3 pr-3 pl-10 text-sm text-white transition outline-none placeholder:text-ink-500 focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            {errors.url && (
              <p className="mt-1.5 text-xs text-red-400">
                {errors.url.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="edit-description"
              className="mb-1.5 block text-sm font-medium text-ink-200"
            >
              Description
            </label>
            <input
              id="edit-description"
              type="text"
              placeholder="My API"
              {...register("description")}
              className="w-full rounded-xl border border-ink-700 bg-ink-950/60 px-3 py-3 text-sm text-white transition outline-none placeholder:text-ink-500 focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
            />
            {errors.description && (
              <p className="mt-1.5 text-xs text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
