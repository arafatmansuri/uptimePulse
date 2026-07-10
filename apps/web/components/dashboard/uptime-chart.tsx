'use client';

import { Tick, WebsiteStatus } from '@/lib/responses';
import { useMemo } from 'react';

export function UptimeChart({ ticks }: { ticks: Tick[] }) {
  const bars = useMemo(() => {
    const sorted = [...ticks].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    return sorted.slice(-40);
  }, [ticks]);

  if (bars.length === 0) return null;

  const upCount = bars.filter((t) => t.status === WebsiteStatus.UP).length;
  const uptimePct = ((upCount / bars.length) * 100).toFixed(1);

  return (
    <div className="rounded-2xl border border-ink-800 bg-ink-900/40 p-5">
      <div className="md:mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Uptime history</h3>
          <p className="text-xs text-ink-400">Last {bars.length} checks</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-brand-400">{uptimePct}%</div>
          <div className="text-xs text-ink-400">uptime</div>
        </div>
      </div>

      <div className="flex items-end gap-1 md:h-44 h-24" >
        {bars.map((tick, i) => {
          const isUp = tick.status === WebsiteStatus.UP;
          const isUnknown = tick.status === WebsiteStatus.Unknown;
          const heightPct = isUp
            ? Math.min((tick.response_time_ms / 1000) * 100, 100)
            : isUnknown
              ? 30
              : 100;
          return (
            <div
              key={tick.id || i}
              className="group relative flex-1"
              style={{ height: '100%' }}
            >
              <div
                className={`absolute bottom-0 w-full rounded-sm transition-all duration-200 ${
                  isUp
                    ? 'bg-brand-500/70 group-hover:bg-brand-400'
                    : isUnknown
                      ? 'bg-ink-600 group-hover:bg-ink-500'
                      : 'bg-red-500/70 group-hover:bg-red-400'
                }`}
                style={{ height: `${heightPct}%` }}
              />
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-ink-700 bg-ink-900 px-2.5 py-1.5 text-xs text-ink-200 shadow-soft group-hover:block">
                <div className="font-semibold text-white">
                  {isUp ? 'UP' : isUnknown ? 'Unknown' : 'DOWN'}
                </div>
                <div className="text-ink-400">{tick.response_time_ms}ms</div>
                <div className="text-ink-500">
                  {new Date(tick.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-ink-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-brand-500/70" /> Up
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-red-500/70" /> Down
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-ink-600" /> Unknown
        </span>
      </div>
    </div>
  );
}
