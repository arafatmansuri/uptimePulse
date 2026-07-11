"use client";

import { ChangePasswordForm } from "@/components/auth/change-password-form";
import { DeleteAccountForm } from "@/components/auth/delete-account";
import { UpdateProfileForm } from "@/components/auth/update-profile-form";
import { UserMenu } from "@/components/dashboard/user-menu";
import { User } from "@/lib/responses";
import { Activity } from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  // setUser(JSON.parse(localStorage.getItem("user")));
  useEffect(() => {
    //   if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(storedUser));
      console.log("user", JSON.parse(storedUser));
    }
    //   }
  }, []);
  // const [savedMessage, setSavedMessage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-ink-950 text-ink-100">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-ink-800/80 bg-ink-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between px-5 sm:px-8">
          <a href="/dashboard" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500 text-ink-950 shadow-glow">
              <Activity className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="text-lg font-bold tracking-tight text-white">
              UptimePulse
            </span>
          </a>
          {user && <UserMenu />}
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-ink-400">
          Manage your account and preferences.
        </p>

        {/* {savedMessage && (
          <div className="mt-4 rounded-xl border border-brand-500/30 bg-brand-500/10 px-4 py-3 text-sm text-brand-300">
            {savedMessage}
          </div>
        )} */}

        {/* Profile section */}
        <UpdateProfileForm email={user?.email || ""} name={user?.name || ""} />

        {/* Security section */}
        <ChangePasswordForm />

        {/* Notifications section */}
        {/* Danger zone */}
        <DeleteAccountForm />
      </main>
    </div>
  );
}
