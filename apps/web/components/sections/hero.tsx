import { Container, Eyebrow } from '@/components/primitives';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronRight, Code2, Globe, Heart, Server, Sparkles, Zap } from 'lucide-react';

function StatusDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-brand-400" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-400" />
    </span>
  );
}

const bars = [62, 78, 45, 88, 70, 95, 60, 82, 50, 90, 72, 86];
const monitors = [
  { name: 'api.production.com', uptime: '99.99%', status: 'operational' },
  { name: 'checkout.stripe.com', uptime: '99.98%', status: 'operational' },
  { name: 'webhooks.inbound.io', uptime: '99.95%', status: 'degraded' },
  { name: 'cdn.assets.app', uptime: '100.00%', status: 'operational' },
];

function HeroDashboard() {
  return (
    <div className="relative rounded-2xl border border-ink-800 bg-ink-900/70 p-4 shadow-soft backdrop-blur-xl sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-ink-700" />
          <span className="h-3 w-3 rounded-full bg-ink-700" />
          <span className="h-3 w-3 rounded-full bg-ink-700" />
        </div>
        <div className="flex items-center gap-2 rounded-md bg-ink-800/80 px-3 py-1 text-xs text-ink-400">
          <Globe className="h-3.5 w-3.5" /> app.uptimepulse.io
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-300">
          <StatusDot /> All systems normal
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Uptime', value: '99.99%', icon: Heart, tone: 'text-brand-400' },
          { label: 'Response', value: '142ms', icon: Zap, tone: 'text-amber-400' },
          { label: 'Monitors', value: '248', icon: Server, tone: 'text-ink-200' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-ink-800 bg-ink-950/60 p-3">
            <div className="flex items-center gap-2 text-xs text-ink-400">
              <s.icon className={`h-3.5 w-3.5 ${s.tone}`} /> {s.label}
            </div>
            <div className="mt-1 text-xl font-bold text-white">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-ink-800 bg-ink-950/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-ink-300">Response time · last 12h</span>
          <span className="text-xs text-ink-500">avg 142ms</span>
        </div>
        <div className="flex h-24 items-end gap-1.5">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 origin-bottom rounded-t bg-gradient-to-t from-brand-600 to-brand-400 animate-bar-grow"
              style={{ height: `${h}%`, animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {monitors.map((m) => (
          <div
            key={m.name}
            className="flex items-center justify-between rounded-lg border border-ink-800 bg-ink-950/40 px-3 py-2.5"
          >
            <div className="flex items-center gap-2.5">
              <span className={`h-2 w-2 rounded-full ${m.status === 'operational' ? 'bg-brand-400' : 'bg-amber-400'}`} />
              <span className="font-mono text-xs text-ink-200">{m.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-ink-500">{m.uptime}</span>
              <span className={`text-xs font-semibold ${m.status === 'operational' ? 'text-brand-300' : 'text-amber-400'}`}>
                {m.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36">
      <div className="pointer-events-none absolute inset-0 bg-grid mask-fade-b opacity-60" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-[120px]" />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="animate-fade-up">
            <Eyebrow>
              <Sparkles className="h-3.5 w-3.5" /> Now with on-call schedules
            </Eyebrow>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-white text-balance sm:text-5xl lg:text-6xl">
              Uptime monitoring that{' '}
              <span className="bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">
                actually wakes you up
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-300 text-balance">
              Monitor your websites, APIs, and cron jobs every 30 seconds. Get instant alerts via
              phone call, SMS, Slack, and email the moment something breaks — and a beautiful status
              page your customers trust.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg">
                <a href="#" className="group flex items-center justify-center gap-1.5">
                  Start monitoring free <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </a>
              </Button>
              <Button variant="outline" size="lg">
                <a href="#" className='flex items-center gap-1.5'>
                  <Code2 className="h-4 w-4" /> View live demo
                </a>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-400">
              {['No credit card', '10 monitors free forever', 'Setup in 2 minutes'].map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-400" /> {t}
                </span>
              ))}
            </div>
          </div>

          <div className="animate-fade-up [animation-delay:120ms]">
            <HeroDashboard />
          </div>
        </div>
      </Container>
    </section>
  );
}
