import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/primitives';

export function CTA() {
  return (
    <section className="py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-brand-500/30 bg-gradient-to-br from-ink-900 to-ink-950 p-10 text-center sm:p-16">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[640px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-[100px]" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
              Start monitoring in the next 2 minutes
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ink-300 text-balance">
              Free forever for 10 monitors. No credit card. Cancel anytime.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg">
                <a href="#" className="group flex items-center gap-1.5">
                  Create free account <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </a>
              </Button>
              <Button variant="outline" size="lg">
                <a href="#">Talk to sales</a>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
