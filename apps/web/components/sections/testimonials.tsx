import { Star } from 'lucide-react';
import { Container, Eyebrow } from '@/components/primitives';

const quotes = [
  {
    quote:
      'We caught a database failover 90 seconds after it started. UptimePulse called our on-call engineer before any customer noticed.',
    name: 'Maya Chen',
    role: 'SRE Lead, Northwind',
  },
  {
    quote:
      'The status page alone is worth it. Our support tickets dropped 40% because customers can see incidents in real time.',
    name: 'Daniel Okafor',
    role: 'CTO, Quanta',
  },
  {
    quote:
      'We replaced three separate tools with UptimePulse. Setup took an afternoon and the alerts actually reach us.',
    name: 'Sofia Rossi',
    role: 'Engineering Manager, Lumen',
  },
];

export function Testimonials() {
  return (
    <section id="customers" className="border-y border-ink-800/60 bg-ink-950/40 py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Loved by engineers</Eyebrow>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
            Teams sleep better with UptimePulse
          </h2>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {quotes.map((q) => (
            <figure key={q.name} className="flex flex-col rounded-2xl border border-ink-800 bg-ink-900/40 p-7">
              <div className="flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-ink-200">&ldquo;{q.quote}&rdquo;</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-bold text-ink-950">
                  {q.name.split(' ').map((n) => n[0]).join('')}
                </span>
                <div>
                  <div className="text-sm font-semibold text-white">{q.name}</div>
                  <div className="text-xs text-ink-400">{q.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
