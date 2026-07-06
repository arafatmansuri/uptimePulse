import { Bell, CheckCircle2, Code2, MessageSquare, Phone, Shield, Smartphone } from 'lucide-react';
import { Container, Eyebrow } from '@/components/primitives';

const items = [
  { name: 'Slack', icon: MessageSquare },
  { name: 'Phone', icon: Phone },
  { name: 'SMS', icon: Smartphone },
  { name: 'Email', icon: Bell },
  { name: 'Webhooks', icon: Code2 },
  { name: 'PagerDuty', icon: Shield },
];

export function Integrations() {
  return (
    <section id="integrations" className="py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Alerts that find you</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
              Reach the right person on the right channel
            </h2>
            <p className="mt-4 text-lg text-ink-300 text-balance">
              Connect the tools your team already lives in. UptimePulse routes incidents through
              your escalation policy until someone acknowledges — across every channel you use.
            </p>
            <ul className="mt-6 space-y-3">
              {['Multi-channel alert routing', 'Acknowledge from Slack or SMS', 'Maintenance windows & quiet hours'].map((t) => (
                <li key={t} className="flex items-center gap-3 text-ink-200">
                  <CheckCircle2 className="h-5 w-5 text-brand-400" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {items.map((it) => (
              <div
                key={it.name}
                className="flex flex-col items-center gap-3 rounded-2xl border border-ink-800 bg-ink-900/40 p-6 transition hover:-translate-y-1 hover:border-brand-500/40"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-ink-800 text-brand-300">
                  <it.icon className="h-6 w-6" />
                </span>
                <span className="text-sm font-semibold text-ink-200">{it.name}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
