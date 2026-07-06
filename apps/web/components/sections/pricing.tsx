import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container, Eyebrow } from '@/components/primitives';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    blurb: 'For side projects and small sites.',
    features: ['10 monitors', '5-minute checks', 'Email alerts', '1 status page', '2 team members'],
    cta: 'Start free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$24',
    period: '/month',
    blurb: 'For growing teams that need to move fast.',
    features: [
      '50 monitors',
      '30-second checks',
      'Phone, SMS & Slack alerts',
      'On-call schedules',
      '5 status pages',
      '10 team members',
    ],
    cta: 'Start 14-day trial',
    highlight: true,
  },
  {
    name: 'Business',
    price: '$79',
    period: '/month',
    blurb: 'For companies with serious uptime needs.',
    features: [
      'Unlimited monitors',
      '15-second checks',
      'Escalation policies',
      'Custom status domains',
      'Unlimited team members',
      'Audit log & SSO',
    ],
    cta: 'Start 14-day trial',
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Simple, honest pricing</Eyebrow>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
            Start free. Upgrade when you grow.
          </h2>
          <p className="mt-4 text-lg text-ink-300 text-balance">
            Every plan includes every alert channel. No surprise add-ons.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-2xl border p-7 ${
                p.highlight
                  ? 'border-brand-500/50 bg-ink-900/70 shadow-glow lg:-translate-y-3'
                  : 'border-ink-800 bg-ink-900/40'
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink-950">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-white">{p.name}</h3>
              <p className="mt-1 text-sm text-ink-400">{p.blurb}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight text-white">{p.price}</span>
                <span className="text-sm text-ink-400">{p.period}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-ink-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-400" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={p.highlight ? 'default' : 'outline'}
                className="mt-7 w-full"
              >
                <a href="#">{p.cta}</a>
              </Button>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
