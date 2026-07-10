"use client";

import { Button } from "@/components/ui/button";
import { Methods } from "@/lib/constants";
import { useAuthMutation } from "@/lib/queries/authQueries";
import { updateProfileSchema, UpdateProfileValues } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Save, User, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export function UpdateProfileForm({ email, name }: UpdateProfileValues) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [updateProfileSuccessMessage, setUpdateProfileSuccessMessage] =
    useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    // defaultValues: { name, email },
  });
  const authMutation = useAuthMutation();

  useEffect(() => {
    if (name && email) {
      reset({
        name: name,
        email: email,
      });
      // setServerError(null);
    }
  }, [reset, name, email]);
  const onSubmit = async (values: UpdateProfileValues) => {
    setServerError(null);
    setLoading(true);

    authMutation.mutate(
      { data: values, endpoint: "/profile", method: Methods.UPDATE },
      {
        onError(error) {
          setServerError(error.message);
        },
        onSuccess(data) {
          setUpdateProfileSuccessMessage(data.message);
          localStorage.setItem("user", JSON.stringify(data.data.user));
        },
        onSettled() {
          setLoading(false);
        },
      }
    );
  };

  return (
    <section
      id="profile"
      className="mt-8 rounded-2xl border border-ink-800 bg-ink-900/40 p-6"
    >
      <div className="flex items-center gap-2">
        <UserIcon className="h-5 w-5 text-brand-400" />
        <h2 className="text-base font-semibold text-white">Profile</h2>
      </div>
      <p className="mt-1 text-sm text-ink-400">
        Update your personal information.
      </p>

      <div className="mt-5 mb-5 flex items-center gap-4">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-linear-to-br from-brand-500 to-brand-600 text-xl font-bold text-ink-950">
          {name
            ?.trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((p) => p[0])
            .join("")
            .toUpperCase() || "?"}
        </span>
        <div>
          <div className="text-sm font-semibold text-white">{name}</div>
          <div className="text-xs text-ink-400">{email}</div>
        </div>
      </div>
      {serverError && (
        <div className="block rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-300">
          {serverError}
        </div>
      )}
      {updateProfileSuccessMessage && (
        <div className="block rounded-lg border border-green-500/30 bg-green-500/10 p-2 text-sm text-green-300">
          {updateProfileSuccessMessage}
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-3 grid gap-4 sm:grid-cols-2"
        noValidate
      >
        <div>
          <label
            htmlFor="settings-name"
            className="mb-1.5 block text-sm font-medium text-ink-200"
          >
            Name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-500" />
            <input
              id="settings-name"
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              {...register("name")}
              className="w-full rounded-xl border border-ink-700 bg-ink-900/60 py-3 pr-3 pl-10 text-sm text-white transition outline-none placeholder:text-ink-500 focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          {errors.name && (
            <p className="mt-1.5 text-xs text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="settings-email"
            className="mb-1.5 block text-sm font-medium text-ink-200"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-500" />
            <input
              id="settings-email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              {...register("email")}
              className="w-full rounded-xl border border-ink-700 bg-ink-900/60 py-3 pr-3 pl-10 text-sm text-white transition outline-none placeholder:text-ink-500 focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* <div className="mt-5"> */}
        <Button type="submit" className="w-32">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save changes
        </Button>
        {/* </div> */}
      </form>
    </section>
  );
}
