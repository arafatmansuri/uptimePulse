"use client";

import { Tick, WebsiteStatus } from "@/lib/responses";
import { useMemo } from "react";

export function ResponseTimeChart({ ticks }: { ticks: Tick[] }) {
  const chartData = useMemo(() => {
    const sorted = [...ticks].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    if (!sorted.length) return [];

    const values = sorted.map((t) => t.response_time_ms);
    const min = Math.min(...values);
    const max = Math.max(...values);

    return sorted.map((t) => ({
      time: new Date(t.createdAt).getTime(),
      value: t.response_time_ms,
      status: t.status,
      normalized: max === min ? 0.5 : (t.response_time_ms - min) / (max - min),
      id: t.id,
    }));
  }, [ticks]);

  if (!chartData.length) return null;

  const width = 100;
  const height = 100;
  const padding = 4;

  const points = chartData.map((d, i) => ({
    x:
      padding + (i / Math.max(chartData.length - 1, 1)) * (width - padding * 2),
    y: height - padding - d.normalized * (height - padding * 2),
    ...d,
  }));

  // Smooth bezier curve
  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");

  const areaD = `${pathD}
    L ${points[points.length - 1].x} ${height - padding}
    L ${points[0].x} ${height - padding}
    Z`;

  const avg = Math.round(
    chartData.reduce((sum, d) => sum + d.value, 0) / chartData.length
  );

  return (
    <div className="rounded-2xl border border-ink-800 bg-ink-900/40 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Response Time</h3>
          <p className="text-xs text-ink-400">
            Latency over recent checks (ms)
          </p>
        </div>

        <div className="text-right">
          <div className="text-lg font-bold text-white">{avg} ms</div>
          <div className="text-xs text-ink-400">Average</div>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-40 w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="rt-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(74 222 128)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="rgb(74 222 128)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid Lines */}
        {[0.25, 0.5, 0.75].map((p) => {
          const y = padding + p * (height - padding * 2);

          return (
            <line
              key={p}
              x1={padding}
              x2={width - padding}
              y1={y}
              y2={y}
              stroke="rgb(38 38 38)"
              strokeWidth={0.3}
            />
          );
        })}

        {/* Area */}
        <path d={areaD} fill="url(#rt-area)" />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="rgb(74 222 128)"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points */}
        {points.map((p, i) => (
          <g key={i} className="">
            <circle
              cx={p.x}
              cy={p.y}
              r="0"
              fill={
                p.status === WebsiteStatus.UP
                  ? "rgb(74 222 128)"
                  : "rgb(248 113 113)"
              }
            />
          </g>
        ))}
      </svg>

      <div className="mt-3 flex justify-between text-xs text-ink-500">
        <span>
          {new Date(chartData[0].time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>

        <span>
          {new Date(chartData[chartData.length - 1].time).toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          )}
        </span>
      </div>

      {/* <div className="mt-1 flex justify-between text-xs text-ink-400">
        <span>
          {Math.min(...chartData.map((d) => d.value))}
          ms
        </span>

        <span>
          {Math.max(...chartData.map((d) => d.value))}
          ms
        </span>
      </div> */}
    </div>
  );
}
