"use client";

import { Methods } from "@/lib/constants";
import { useAuthMutation } from "@/lib/queries/authQueries";
import { User as UserType } from "@/lib/responses";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const signOutMutation = useAuthMutation();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(storedUser));
    }
  }, []);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    signOutMutation.mutate({endpoint:"/signout", method: Methods.POST}, {
      onSuccess: () => {
        localStorage.removeItem("user");
        window.location.href = "/signin";
      },
      onError: () => {
        localStorage.removeItem("user");
        setSigningOut(true);
        window.location.href = "/signin";
      },
    });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-ink-700 bg-ink-900/60 py-1.5 pr-2.5 pl-1.5 transition hover:border-ink-600 hover:bg-ink-800/60"
      >
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-linear-to-br from-brand-500 to-brand-600 text-sm font-bold text-ink-950">
          {user ? getInitials(user.name) : "?"}
        </span>
        <span className="hidden text-sm font-medium text-ink-200 sm:block">
          {user ? user.name : "User"}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-ink-400 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full right-0 z-50 mt-2 w-64 origin-top-right animate-in rounded-2xl border border-ink-800 bg-ink-900 p-2 shadow-soft duration-150 fade-in-0 zoom-in-95">
          {/* User info */}
          <div className="flex items-center gap-3 rounded-xl px-3 py-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-brand-500 to-brand-600 text-base font-bold text-ink-950">
              {user ? getInitials(user.name) : "?"}
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white">
                {user ? user.name : "User"}
              </div>
              <div className="truncate text-xs text-ink-400">
                {user ? user.email : "user@example.com"}
              </div>
            </div>
          </div>

          <div className="my-1 h-px bg-ink-800" />

          {/* Menu items */}
          <nav className="space-y-0.5">
            <a
              href="/dashboard"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-200 transition hover:bg-ink-800 hover:text-white"
            >
              <LayoutDashboard className="h-4 w-4 text-ink-400" /> Dashboard
            </a>
            <a
              href="/settings"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-200 transition hover:bg-ink-800 hover:text-white"
            >
              <Settings className="h-4 w-4 text-ink-400" /> Settings
            </a>
            <a
              href="/settings#profile"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-200 transition hover:bg-ink-800 hover:text-white"
            >
              <User className="h-4 w-4 text-ink-400" /> Profile
            </a>
          </nav>

          <div className="my-1 h-px bg-ink-800" />

          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}
