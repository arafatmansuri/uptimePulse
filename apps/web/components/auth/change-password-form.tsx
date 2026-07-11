"use client";

import { Button } from "@/components/ui/button";
import { Methods } from "@/lib/constants";
import { useAuthMutation } from "@/lib/queries/authQueries";
import { changePasswordSchema, ChangePasswordValues } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function ChangePasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [changePasswordSuccessMessage, setChangePasswordSuccessMessage] =
    useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
  });
  const authMutation = useAuthMutation();

  const onSubmit = async (values: ChangePasswordValues) => {
    setServerError(null);
    setLoading(true);

    authMutation.mutate(
      { data: values, endpoint: "/password", method: Methods.UPDATE },
      {
        onError(error) {
          setServerError(error.message);
        },
        onSuccess(data) {
          setChangePasswordSuccessMessage(data.message);
        },
        onSettled() {
          setLoading(false);
        },
      }
    );
  };

  return (
    <section className="mt-6 rounded-2xl border border-ink-800 bg-ink-900/40 p-6">
      <div className="flex items-center gap-2">
        <Lock className="h-5 w-5 text-amber-400" />
        <h2 className="text-base font-semibold text-white">Security</h2>
      </div>
      <p className="mt-1 text-sm text-ink-400">
        Manage your password and session.
      </p>

      {serverError && (
        <div className="mt-5 block rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-300">
          {serverError}
        </div>
      )}
      {changePasswordSuccessMessage && (
        <div className="mt-5 block rounded-lg border border-green-500/30 bg-green-500/10 p-2 text-sm text-green-300">
          {changePasswordSuccessMessage}
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-3 grid gap-4 sm:grid-cols-2"
        noValidate
      >
        <div>
          <label
            htmlFor="current-pw"
            className="mb-1.5 block text-sm font-medium text-ink-200"
          >
            Current Password
          </label>
          <div className="relative">
            <input
              id="current-pw"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register("currentPassword")}
              className="w-full rounded-xl border border-ink-700 bg-ink-950/60 px-3 py-3 text-sm text-white transition outline-none placeholder:text-ink-500 focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          {errors.currentPassword && (
            <p className="mt-1.5 text-xs text-red-400">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="new-pw"
            className="mb-1.5 block text-sm font-medium text-ink-200"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="new-pw"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              {...register("newPassword")}
              className="w-full rounded-xl border border-ink-700 bg-ink-950/60 px-3 py-3 text-sm text-white transition outline-none placeholder:text-ink-500 focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          {errors.newPassword && (
            <p className="mt-1.5 text-xs text-red-400">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* <div className="mt-5"> */}
        <Button
          type="submit"
          className="w-36"
          variant="outline"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Update Password"
          )}
        </Button>
        {/* </div> */}
      </form>
    </section>
  );
}
