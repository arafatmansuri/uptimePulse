import { Container } from '@/components/primitives';

const names = ['Northwind', 'Acme Corp', 'Quanta', 'Lumen', 'Vertex', 'Helio', 'Cobalt', 'Nimbus'];

export function LogoCloud() {
  return (
    <section className="border-y border-ink-800/60 bg-ink-950/40 py-10">
      <Container>
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-ink-500">
          Trusted by 4,000+ engineering teams
        </p>
        <div className="mt-6 overflow-hidden mask-fade-x">
          <div className="flex w-max animate-marquee items-center gap-12">
            {[...names, ...names].map((n, i) => (
              <span key={i} className="text-lg font-bold text-ink-500/80 transition hover:text-ink-300">
                {n}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
