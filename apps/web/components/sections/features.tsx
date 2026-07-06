import { Bell, Cpu, Globe, LayoutDashboard, Shield, Smartphone } from 'lucide-react';
import { Container, Eyebrow } from '@/components/primitives';

const features = [
  {
    icon: Globe,
    title: 'Website & API monitoring',
    body: 'HTTP, HTTPS, TCP, DNS, and ping checks from 12 global regions every 30 seconds. Verify response body, status codes, and SSL certs.',
  },
  {
    icon: Cpu,
    title: 'Cron job monitoring',
    body: 'Heartbeat monitors that alert you when a scheduled job silently stops running. Just ping us when the job finishes.',
  },
  {
    icon: Bell,
    title: 'On-call & escalation',
    body: 'Rotating schedules, escalation policies, and maintenance windows. We call your phone until someone acknowledges the incident.',
  },
  {
    icon: LayoutDashboard,
    title: 'Status pages',
    body: 'A branded, public status page with subscriber notifications. Show customers the truth before they open a ticket.',
  },
  {
    icon: Shield,
    title: 'SSL & domain expiry',
    body: 'Get warned 30, 14, and 7 days before your SSL certificate or domain expires. Never let one lapse again.',
  },
  {
    icon: Smartphone,
    title: 'Instant alerts',
    body: 'Phone calls, SMS, Slack, Microsoft Teams, Discord, PagerDuty, email, and webhooks — all included on every plan.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Everything you need</Eyebrow>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
            One platform for every kind of monitoring
          </h2>
          <p className="mt-4 text-lg text-ink-300 text-balance">
            Stop stitching together five tools. UptimePulse covers your whole surface area with
            alerts that reach you anywhere.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-ink-800 bg-ink-900/40 p-6 transition hover:-translate-y-1 hover:border-brand-500/40 hover:bg-ink-900/70"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-500/10 opacity-0 blur-2xl transition group-hover:opacity-100" />
              <div className="grid h-11 w-11 place-items-center rounded-xl border border-brand-500/30 bg-brand-500/10 text-brand-300">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">{f.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
