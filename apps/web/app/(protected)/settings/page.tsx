"use client";

import { UpdateProfileForm } from "@/components/auth/update-profile-form";
import { UserMenu } from "@/components/dashboard/user-menu";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/responses";
import { Activity, Bell, Globe, Lock, User as UserIcon } from "lucide-react";
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
        <section className="mt-6 rounded-2xl border border-ink-800 bg-ink-900/40 p-6">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-amber-400" />
            <h2 className="text-base font-semibold text-white">Security</h2>
          </div>
          <p className="mt-1 text-sm text-ink-400">
            Manage your password and session.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="current-pw"
                className="mb-1.5 block text-sm font-medium text-ink-200"
              >
                Current password
              </label>
              <input
                id="current-pw"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-ink-700 bg-ink-950/60 px-3 py-3 text-sm text-white transition outline-none placeholder:text-ink-500 focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div>
              <label
                htmlFor="new-pw"
                className="mb-1.5 block text-sm font-medium text-ink-200"
              >
                New password
              </label>
              <input
                id="new-pw"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-ink-700 bg-ink-950/60 px-3 py-3 text-sm text-white transition outline-none placeholder:text-ink-500 focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          <div className="mt-5">
            <Button variant="outline">Update password</Button>
          </div>
        </section>

        {/* Notifications section */}
        <section className="mt-6 rounded-2xl border border-ink-800 bg-ink-900/40 p-6">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-brand-400" />
            <h2 className="text-base font-semibold text-white">
              Notifications
            </h2>
          </div>
          <p className="mt-1 text-sm text-ink-400">
            Choose how you get alerted.
          </p>

          <div className="mt-5 space-y-3">
            {[
              {
                label: "Email alerts",
                desc: "Get notified by email when a monitor goes down",
                defaultChecked: true,
              },
              {
                label: "Slack notifications",
                desc: "Send alerts to your Slack workspace",
                defaultChecked: false,
              },
              {
                label: "Weekly uptime report",
                desc: "A summary of your monitors every Monday",
                defaultChecked: true,
              },
            ].map((item) => (
              <label
                key={item.label}
                className="flex cursor-pointer items-center justify-between rounded-xl border border-ink-800 bg-ink-950/40 px-4 py-3 transition hover:border-ink-700"
              >
                <div>
                  <div className="text-sm font-medium text-white">
                    {item.label}
                  </div>
                  <div className="text-xs text-ink-400">{item.desc}</div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={item.defaultChecked}
                  className="relative h-5 w-9 cursor-pointer appearance-none rounded-full border border-ink-600 bg-ink-800 transition after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-ink-400 after:transition checked:border-brand-500 checked:bg-brand-500 checked:after:translate-x-4 checked:after:bg-ink-950"
                />
              </label>
            ))}
          </div>
        </section>

        {/* Danger zone */}
        <section className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-red-400" />
            <h2 className="text-base font-semibold text-white">Danger zone</h2>
          </div>
          <p className="mt-1 text-sm text-ink-400">Irreversible actions.</p>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-red-500/20 bg-ink-950/40 px-4 py-3">
            <div>
              <div className="text-sm font-medium text-white">
                Delete account
              </div>
              <div className="text-xs text-ink-400">
                Permanently remove your account and all monitors.
              </div>
            </div>
            <Button className="bg-red-500 text-white hover:bg-red-600">
              Delete account
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
