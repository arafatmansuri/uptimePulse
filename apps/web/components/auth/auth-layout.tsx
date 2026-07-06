import { Activity, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — marketing panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink-950 p-12 lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-grid mask-fade-b opacity-50" />
        <div className="pointer-events-none absolute -top-32 left-1/2 h-105 w-160 -translate-x-1/2 rounded-full bg-brand-500/15 blur-[120px]" />

        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500 text-ink-950 shadow-glow">
            <Activity className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-bold tracking-tight text-white">UptimePulse</span>
        </Link>

        <div className="relative">
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-white text-balance">
            Uptime monitoring that actually wakes you up
          </h2>
          <p className="mt-4 max-w-md text-ink-300">
            Join 4,000+ engineering teams who catch outages before their customers do.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              '30-second checks from 12 global regions',
              'Phone, SMS, Slack & email alerts',
              'Branded status pages included',
              'Free forever for 10 monitors',
            ].map((t) => (
              <li key={t} className="flex items-center gap-3 text-ink-200">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-400" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative text-sm text-ink-500">
          &ldquo;We caught a database failover 90 seconds after it started — before any customer
          noticed.&rdquo;
          <div className="mt-1 text-ink-400">— Maya Chen, SRE Lead at Northwind</div>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex items-center justify-center bg-ink-950 px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          {/* mobile logo */}
          <Link href="/" className="mb-8 flex items-center justify-center gap-2.5 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500 text-ink-950">
              <Activity className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="text-lg font-bold tracking-tight text-white">UptimePulse</span>
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
          <p className="mt-2 text-sm text-ink-400">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
