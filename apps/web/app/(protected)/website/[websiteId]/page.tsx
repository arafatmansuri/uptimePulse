"use client";

import { DeleteWebsiteDialog } from "@/components/dashboard/delete-website-dialog";
import { EditWebsiteDialog } from "@/components/dashboard/edit-website-dialog";
import { ResponseTimeChart } from "@/components/dashboard/response-time-chart";
import { UptimeChart } from "@/components/dashboard/uptime-chart";
import { UserMenu } from "@/components/dashboard/user-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWebsiteQuery } from "@/lib/queries/websiteQueries";
import { Website, WebsiteResponse, WebsiteStatus } from "@/lib/responses";
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  //   Bell,
  CheckCircle2,
  Clock,
  Globe,
  HelpCircle,
  Loader2,
  //   Mail,
  //   MapPin,
  Pencil,
  //   Plus,
  RefreshCw,
  Server,
  Trash2,
  XCircle,
  Zap,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function StatusIcon({ status }: { status: WebsiteStatus }) {
  if (status === WebsiteStatus.UP)
    return <CheckCircle2 className="h-4 w-4 text-brand-400" />;
  if (status === WebsiteStatus.DOWN)
    return <XCircle className="h-4 w-4 text-red-400" />;
  return <HelpCircle className="h-4 w-4 text-ink-500" />;
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-ink-800 bg-ink-900/40 p-5">
      <div className="flex items-center gap-2 text-xs text-ink-400">
        <Icon className={`h-4 w-4 ${tone}`} /> {label}
      </div>
      <div className="mt-2 text-2xl font-bold text-white">{value}</div>
    </div>
  );
}

export default function WebsiteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const websiteId = params.websiteId as string;
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  //   const [newAlertEmail, setNewAlertEmail] = useState("");
  //   const [newRegionId, setNewRegionId] = useState("");
  //   const [emailAlerts, setEmailAlerts] = useState<
  //     { id: string; email: string }[]
  //   >([]);
  //   const [regions, setRegions] = useState<
  //     { id: string; name: string; city: string }[]
  //   >([]);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useWebsiteQuery<WebsiteResponse>({
      endpoint: `/${websiteId}`,
    });
  const website: Website | null = data?.data?.website ?? null;
  const ticks = website?.ticks ?? [];
  const {
    tickCount: ticksCount,
    upCount: up,
    downCount: down,
    avgResponseTime,
  } = data?.data || {
    tickCount: 0,
    upCount: 0,
    downCount: 0,
    avgResponseTime: 0,
  };

  const stats = useMemo(() => {
    if (ticksCount === 0)
      return {
        uptime: "—",
        avgResponse: 0,
        upCount: 0,
        downCount: 0,
        // lastCheck: null,
      };
    return {
      uptime: ((up / ticksCount) * 100).toFixed(1) + "%",
      avgResponse: avgResponseTime,
      upCount: up,
      downCount: down,
      // lastCheck: ticks && ticks[ticks.length - 1].createdAt || "—",
    };
  }, [up, down, ticksCount, avgResponseTime]);

  //   const recentTicks = useMemo(() => [...ticks].reverse(), [ticks]);
  //   const recentTicks = useMemo(() => [...ticks].reverse().slice(0, 12), [ticks]);

  //   const handleAddAlert = () => {
  //     if (!newAlertEmail.trim()) return;
  //     setEmailAlerts((prev) => [
  //       ...prev,
  //       { id: crypto.randomUUID(), email: newAlertEmail.trim() },
  //     ]);
  //     setNewAlertEmail("");
  //   };

  //   const handleRemoveAlert = (id: string) => {
  //     setEmailAlerts((prev) => prev.filter((a) => a.id !== id));
  //   };

  //   const handleAddRegion = () => {
  //     if (!newRegionId.trim()) return;
  //     setRegions((prev) => [
  //       ...prev,
  //       {
  //         id: newRegionId.trim(),
  //         name: newRegionId.trim(),
  //         city: newRegionId.trim(),
  //       },
  //     ]);
  //     setNewRegionId("");
  //   };

  //   const handleRemoveRegion = (id: string) => {
  //     setRegions((prev) => prev.filter((r) => r.id !== id));
  //   };

  if (isLoading || !website) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950 text-ink-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-ink-950 text-center">
        <p className="text-sm text-red-400">
          {error?.message || "Failed to load website."}
        </p>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Back to dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-950 text-ink-100">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-ink-800/80 bg-ink-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="/dashboard" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500 text-ink-950 shadow-glow">
              <Activity className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="text-lg font-bold tracking-tight text-white">
              UptimePulse
            </span>
          </a>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            {<UserMenu />}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
        {/* Breadcrumb + title */}
        <div className="flex items-center gap-2 text-sm text-ink-400">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </button>
          <span>/</span>
          <span className="text-ink-200">{website.url}</span>
        </div>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-ink-800 bg-ink-900/60 text-brand-400">
              <Globe className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                {website.url}
              </h1>
              {website.description && (
                <p className="mt-0.5 text-sm text-ink-400">
                  {website.description}
                </p>
              )}
              <div className="mt-1.5 flex items-center gap-3 text-xs text-ink-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Added{" "}
                  {timeAgo(new Date(website.timeAdded).toISOString())}
                </span>
                <span className="flex items-center gap-1">
                  <Server className="h-3 w-3" /> {ticksCount} checks
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(website.url, "_blank")}
            >
              <ArrowUpRight className="h-4 w-4" /> Visit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="h-4 w-4" /> Edit
            </Button>
            <Button
              size="sm"
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={Activity}
            label="Uptime"
            value={stats.uptime}
            tone="text-brand-400"
          />
          <StatCard
            icon={Zap}
            label="Avg response"
            value={`${stats.avgResponse}ms`}
            tone="text-amber-400"
          />
          <StatCard
            icon={CheckCircle2}
            label="Checks up"
            value={String(stats.upCount)}
            tone="text-brand-400"
          />
          <StatCard
            icon={XCircle}
            label="Checks down"
            value={String(stats.downCount)}
            tone="text-red-400"
          />
        </div>

        {/* Charts */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <ResponseTimeChart ticks={ticks} />
          <UptimeChart ticks={ticks} />
        </div>

        {/* Recent checks + management */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {/* Recent checks */}
          <div className="rounded-2xl border border-ink-800 bg-ink-900/40 lg:col-span-2">
            <div className="border-b border-ink-800/60 px-5 py-4">
              <h2 className="text-sm font-semibold text-white">
                Recent checks
              </h2>
              <p className="text-xs text-ink-400">
                Latest {ticks.length} monitoring results
              </p>
            </div>
            {ticks.length === 0 ? (
              <div className="px-5 py-12 text-center text-sm text-ink-400">
                No checks recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-ink-800/60">
                {ticks.map((tick) => (
                  <div
                    key={tick.id}
                    className="flex items-center justify-between gap-4 px-5 py-3 transition hover:bg-ink-900/40"
                  >
                    <div className="flex items-center gap-3">
                      <StatusIcon status={tick.status} />
                      <div>
                        <div className="text-sm font-medium text-white">
                          {tick.status === WebsiteStatus.UP
                            ? "Up"
                            : tick.status === WebsiteStatus.DOWN
                              ? "Down"
                              : "Unknown"}
                        </div>
                        <div className="text-xs text-ink-500">
                          {new Date(tick.createdAt).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm font-medium text-ink-200">
                          <Zap className="h-3 w-3 text-amber-400" />
                          {tick.response_time_ms}ms
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          tick.status === WebsiteStatus.UP
                            ? "border-brand-500/30 bg-brand-500/10 text-brand-300"
                            : tick.status === WebsiteStatus.DOWN
                              ? "border-red-500/30 bg-red-500/10 text-red-400"
                              : "border-ink-700 bg-ink-800/40 text-ink-400"
                        }
                      >
                        {tick.regionId || "default"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Management panels */}
          {/* <div className="space-y-4"> */}
          {/* Regions */}
          {/* <div className="rounded-2xl border border-ink-800 bg-ink-900/40 p-5">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-400" />
                <h3 className="text-sm font-semibold text-white">
                  Monitoring regions
                </h3>
              </div>
              <p className="mt-0.5 text-xs text-ink-400">
                Regions checking this endpoint.
              </p>

              <div className="mt-3 space-y-2">
                {regions.length === 0 && (
                  <p className="text-xs text-ink-500">No regions added yet.</p>
                )}
                {regions.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-lg border border-ink-800 bg-ink-950/40 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 text-ink-400" />
                      <span className="text-sm text-ink-200">{r.name}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveRegion(r.id)}
                      className="text-ink-500 transition hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Region name..."
                  value={newRegionId}
                  onChange={(e) => setNewRegionId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddRegion()}
                  className="flex-1 rounded-lg border border-ink-700 bg-ink-950/60 px-3 py-2 text-sm text-white transition outline-none placeholder:text-ink-500 focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
                />
                <Button size="sm" variant="outline" onClick={handleAddRegion}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div> */}

          {/* Email alerts */}
          {/* <div className="rounded-2xl border border-ink-800 bg-ink-900/40 p-5">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">
                  Email alerts
                </h3>
              </div>
              <p className="mt-0.5 text-xs text-ink-400">
                Get notified when this goes down.
              </p>

              <div className="mt-3 space-y-2">
                {emailAlerts.length === 0 && (
                  <p className="text-xs text-ink-500">No alerts configured.</p>
                )}
                {emailAlerts.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between rounded-lg border border-ink-800 bg-ink-950/40 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-ink-400" />
                      <span className="truncate text-sm text-ink-200">
                        {a.email}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveAlert(a.id)}
                      className="flex-shrink-0 text-ink-500 transition hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex gap-2">
                <input
                  type="email"
                  placeholder="alert@example.com"
                  value={newAlertEmail}
                  onChange={(e) => setNewAlertEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddAlert()}
                  className="flex-1 rounded-lg border border-ink-700 bg-ink-950/60 px-3 py-2 text-sm text-white transition outline-none placeholder:text-ink-500 focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
                />
                <Button size="sm" variant="outline" onClick={handleAddAlert}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div> */}
          {/* </div> */}
        </div>
      </main>

      <EditWebsiteDialog
        website={website}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteWebsiteDialog
        website={website}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
}
