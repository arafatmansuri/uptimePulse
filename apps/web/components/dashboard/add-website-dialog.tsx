'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Methods } from '@/lib/constants';
import { useWebsiteMutation } from '@/lib/queries/websiteQueries';
import { addWebsiteSchema, type AddWebsiteValues } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function AddWebsiteDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const addMutation = useWebsiteMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddWebsiteValues>({
    resolver: zodResolver(addWebsiteSchema),
    defaultValues: { description: '', url: "" },
  });

//   const selectedInterval = watch('checkInterval');

  const onSubmit = async (values: AddWebsiteValues) => {
    setServerError(null);
    addMutation.mutate({endpoint:"/",data: values,method:Methods.POST}, {
      onError: (error) => setServerError(error.message),
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a website to monitor</DialogTitle>
          <DialogDescription>
            We&apos;ll start checking your endpoint from 12 global regions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4" noValidate>
          {serverError && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {serverError}
            </div>
          )}

          <div>
            <label htmlFor="website-url" className="mb-1.5 block text-sm font-medium text-ink-200">
              URL
            </label>
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
              <input
                id="website-url"
                type="url"
                placeholder="https://api.example.com/health"
                {...register('url')}
                className="w-full rounded-xl border border-ink-700 bg-ink-950/60 py-3 pl-10 pr-3 text-sm text-white placeholder:text-ink-500 outline-none transition focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            {errors.url && <p className="mt-1.5 text-xs text-red-400">{errors.url.message}</p>}
          </div>
           <div>
            <label htmlFor="website-description" className="mb-1.5 block text-sm font-medium text-ink-200">
              Description
            </label>
            <input
              id="website-description"
              type="text"
              placeholder="My API"
              {...register('description')}
              className="w-full rounded-xl border border-ink-700 bg-ink-950/60 px-3 py-3 text-sm text-white placeholder:text-ink-500 outline-none transition focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
            />
            {errors.description && <p className="mt-1.5 text-xs text-red-400">{errors.description.message}</p>}
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
            <Button type="submit" className="flex-1" disabled={addMutation.isPending}>
              {addMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Add website'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
