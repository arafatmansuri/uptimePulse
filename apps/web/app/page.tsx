import { CTA } from '@/components/sections/cta';
import { FAQ } from '@/components/sections/faq';
import { Features } from '@/components/sections/features';
import { Footer } from '@/components/sections/footer';
import { Hero } from '@/components/sections/hero';
import { HowItWorks } from '@/components/sections/how-it-works';
import { Integrations } from '@/components/sections/integrations';
import { LogoCloud } from '@/components/sections/logo-cloud';
import { Navbar } from '@/components/sections/navbar';
import { Pricing } from '@/components/sections/pricing';
import { Stats } from '@/components/sections/stats';
import { Testimonials } from '@/components/sections/testimonials';

export default function Home() {
  return (
    <div className="min-h-screen bg-ink-950 text-ink-50">
      <Navbar />
      <main>
        <Hero />
        <LogoCloud />
        <Features />
        <HowItWorks />
        <Integrations />
        <Stats />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}