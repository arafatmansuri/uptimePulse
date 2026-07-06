import { Container } from '@/components/primitives';

const stats = [
  { value: '4,000+', label: 'Teams monitored' },
  { value: '99.99%', label: 'Platform uptime' },
  { value: '<30s', label: 'Detection time' },
  { value: '12', label: 'Global regions' },
];

export function Stats() {
  return (
    <section className="border-y border-ink-800/60 bg-gradient-to-b from-ink-900/40 to-ink-950 py-16">
      <Container>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{s.value}</div>
              <div className="mt-2 text-sm font-medium text-ink-400">{s.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
