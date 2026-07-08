'use client';

import { useEffect, useState } from 'react';
import {
  Activity,
  Bell,
  Globe,
  Loader2,
  Lock,
  Mail,
  Save,
  User as UserIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/dashboard/user-menu';
import { User } from '@/lib/responses';

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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setSavedMessage(null);
    // UI-only — wire to update mutation later
    setTimeout(() => {
      setSaving(false);
      setSavedMessage('Settings saved successfully');
      setTimeout(() => setSavedMessage(null), 3000);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-ink-950 text-ink-100">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-ink-800/80 bg-ink-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between px-5 sm:px-8">
          <a href="/dashboard" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500 text-ink-950 shadow-glow">
              <Activity className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="text-lg font-bold tracking-tight text-white">UptimePulse</span>
          </a>
          {user && <UserMenu />}
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
        <p className="mt-1 text-sm text-ink-400">Manage your account and preferences.</p>

        {savedMessage && (
          <div className="mt-4 rounded-xl border border-brand-500/30 bg-brand-500/10 px-4 py-3 text-sm text-brand-300">
            {savedMessage}
          </div>
        )}

        {/* Profile section */}
        <section id="profile" className="mt-8 rounded-2xl border border-ink-800 bg-ink-900/40 p-6">
          <div className="flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-brand-400" />
            <h2 className="text-base font-semibold text-white">Profile</h2>
          </div>
          <p className="mt-1 text-sm text-ink-400">Update your personal information.</p>

          <div className="mt-5 flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-linear-to-br from-brand-500 to-brand-600 text-xl font-bold text-ink-950">
              {user?.name
                ?.trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((p) => p[0])
                .join('')
                .toUpperCase() || '?'}
            </span>
            <div>
              <div className="text-sm font-semibold text-white">{user?.name}</div>
              <div className="text-xs text-ink-400">{user?.email}</div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="settings-name" className="mb-1.5 block text-sm font-medium text-ink-200">
                Name
              </label>
              <div className="relative">
                <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
                <input
                  id="settings-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-ink-700 bg-ink-950/60 py-3 pl-10 pr-3 text-sm text-white outline-none transition focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>
            <div>
              <label htmlFor="settings-email" className="mb-1.5 block text-sm font-medium text-ink-200">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
                <input
                  id="settings-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-ink-700 bg-ink-950/60 py-3 pl-10 pr-3 text-sm text-white outline-none transition focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>
          </div>

          <div className="mt-5">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save changes
            </Button>
          </div>
        </section>

        {/* Security section */}
        <section className="mt-6 rounded-2xl border border-ink-800 bg-ink-900/40 p-6">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-amber-400" />
            <h2 className="text-base font-semibold text-white">Security</h2>
          </div>
          <p className="mt-1 text-sm text-ink-400">Manage your password and session.</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="current-pw" className="mb-1.5 block text-sm font-medium text-ink-200">
                Current password
              </label>
              <input
                id="current-pw"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-ink-700 bg-ink-950/60 px-3 py-3 text-sm text-white placeholder:text-ink-500 outline-none transition focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div>
              <label htmlFor="new-pw" className="mb-1.5 block text-sm font-medium text-ink-200">
                New password
              </label>
              <input
                id="new-pw"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-ink-700 bg-ink-950/60 px-3 py-3 text-sm text-white placeholder:text-ink-500 outline-none transition focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
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
            <h2 className="text-base font-semibold text-white">Notifications</h2>
          </div>
          <p className="mt-1 text-sm text-ink-400">Choose how you get alerted.</p>

          <div className="mt-5 space-y-3">
            {[
              { label: 'Email alerts', desc: 'Get notified by email when a monitor goes down', defaultChecked: true },
              { label: 'Slack notifications', desc: 'Send alerts to your Slack workspace', defaultChecked: false },
              { label: 'Weekly uptime report', desc: 'A summary of your monitors every Monday', defaultChecked: true },
            ].map((item) => (
              <label
                key={item.label}
                className="flex cursor-pointer items-center justify-between rounded-xl border border-ink-800 bg-ink-950/40 px-4 py-3 transition hover:border-ink-700"
              >
                <div>
                  <div className="text-sm font-medium text-white">{item.label}</div>
                  <div className="text-xs text-ink-400">{item.desc}</div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={item.defaultChecked}
                  className="h-5 w-9 cursor-pointer appearance-none rounded-full border border-ink-600 bg-ink-800 transition checked:border-brand-500 checked:bg-brand-500 relative after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-ink-400 after:transition checked:after:translate-x-4 checked:after:bg-ink-950"
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
              <div className="text-sm font-medium text-white">Delete account</div>
              <div className="text-xs text-ink-400">Permanently remove your account and all monitors.</div>
            </div>
            <Button className="bg-red-500 text-white hover:bg-red-600">Delete account</Button>
          </div>
        </section>
      </main>
    </div>
  );
}
