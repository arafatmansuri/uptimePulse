"use client";

import { Tick, WebsiteStatus } from "@/lib/responses";
import { useMemo } from "react";

export function ResponseTimeChart({ ticks }: { ticks: Tick[] }) {
  const chartData = useMemo(() => {
    const sorted = [...ticks].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    if (sorted.length === 0) return [];
    const max = Math.max(...sorted.map((t) => t.response_time_ms), 1);
    return sorted.map((t) => ({
      time: new Date(t.createdAt).getTime(),
      value: t.response_time_ms,
      pct: (t.response_time_ms / max) * 100,
      status: t.status,
    }));
  }, [ticks]);

  if (chartData.length === 0) return null;

  const width = 100;
  const height = 50;
  const padding = 4;
  const points = chartData.map((d, i) => {
    const x =
      padding + (i / Math.max(chartData.length - 1, 1)) * (width - 2 * padding);
    const y = height - padding - (d.pct / 100) * (height - 2 * padding);
    return { x, y, ...d };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");

  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(2)} ${height - padding} L ${points[0].x.toFixed(2)} ${height - padding} Z`;

  return (
    <div className="rounded-2xl border border-ink-800 bg-ink-900/40 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Response time</h3>
          <p className="text-xs text-ink-400">
            Latency over recent checks (ms)
          </p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-white">
            {Math.round(
              chartData.reduce((s, d) => s + d.value, 0) / chartData.length
            )}
            ms
          </div>
          <div className="text-xs text-ink-400">avg</div>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-fit w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="rt-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(74 222 128)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="rgb(74 222 128)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[20, 40, 60, 80].map((y) => (
          <line
            key={y}
            x1={padding}
            x2={width - padding}
            y1={y}
            y2={y}
            stroke="rgb(38 38 38)"
            strokeWidth="0.3"
          />
        ))}
        <path d={areaD} fill="url(#rt-area)" />
        <path
          d={pathD}
          fill="none"
          stroke="rgb(74 222 128)"
          strokeWidth="0.8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="1"
            fill={
              p.status === WebsiteStatus.UP
                ? "rgb(74 222 128)"
                : "rgb(248 113 113)"
            }
          />
        ))}
      </svg>

      <div className="mt-2 flex justify-between text-xs text-ink-500">
        <span>
          {new Date(chartData[0].time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <span>
          {new Date(chartData[chartData.length - 1].time).toLocaleTimeString(
            [],
            { hour: "2-digit", minute: "2-digit" }
          )}
        </span>
      </div>
    </div>
  );
}
