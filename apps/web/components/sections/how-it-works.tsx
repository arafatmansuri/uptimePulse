import { Bell, Globe, LayoutDashboard } from 'lucide-react';
import { Container, Eyebrow } from '@/components/primitives';

const steps = [
  {
    n: '01',
    icon: Globe,
    title: 'Add a monitor',
    body: 'Paste a URL or endpoint. Pick a check type — HTTP, TCP, ping, DNS, or heartbeat. We start probing within seconds.',
  },
  {
    n: '02',
    icon: Bell,
    title: 'Set up alerts',
    body: 'Choose who gets notified and how. Build an on-call schedule and escalation policy so the right person is always paged.',
  },
  {
    n: '03',
    icon: LayoutDashboard,
    title: 'Share your status',
    body: 'Publish a branded status page and let customers subscribe. They get notified automatically when you post an incident.',
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="border-y border-ink-800/60 bg-ink-950/40 py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Up and running in minutes</Eyebrow>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
            From signup to first alert in under 5 minutes
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              {i < steps.length - 1 && (
                <div className="absolute left-full top-12 hidden h-px w-full -translate-x-6 bg-gradient-to-r from-brand-500/40 to-transparent md:block" />
              )}
              <div className="rounded-2xl border border-ink-800 bg-ink-900/40 p-6">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500 text-ink-950">
                    <s.icon className="h-5 w-5" strokeWidth={2.4} />
                  </span>
                  <span className="font-mono text-3xl font-bold text-ink-800">{s.n}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-300">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
