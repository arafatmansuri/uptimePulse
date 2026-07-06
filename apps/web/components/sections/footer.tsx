import { Activity, Globe } from 'lucide-react';
import { Container } from '@/components/primitives';

const cols = [
  { title: 'Product', links: ['Features', 'Pricing', 'Status pages', 'Integrations', 'Changelog'] },
  { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact', 'Press kit'] },
  { title: 'Resources', links: ['Docs', 'API reference', 'Guides', 'Community', 'Support'] },
  { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'DPA', 'SLA'] },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-800/60 bg-ink-950">
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500 text-ink-950">
                <Activity className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="text-lg font-bold text-white">UptimePulse</span>
            </a>
            <p className="mt-4 max-w-xs text-sm text-ink-400">
              Uptime monitoring and on-call alerting for teams that take reliability seriously.
            </p>
            <div className="mt-5 flex gap-3">
              <a href="#" className="grid h-9 w-9 place-items-center rounded-lg border border-ink-800 text-ink-400 transition hover:border-ink-700 hover:text-white">
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-semibold text-white">{c.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-ink-400 transition hover:text-white">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink-800/60 pt-6 sm:flex-row">
          <p className="text-xs text-ink-500">© {new Date().getFullYear()} UptimePulse, Inc. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs text-ink-500">
            <span className="h-2 w-2 rounded-full bg-brand-400" /> All systems operational
          </div>
        </div>
      </Container>
    </footer>
  );
}
