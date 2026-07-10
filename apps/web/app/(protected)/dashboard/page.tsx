"use client";

import { AddWebsiteDialog } from "@/components/dashboard/add-website-dialog";
import { DeleteWebsiteDialog } from "@/components/dashboard/delete-website-dialog";
import { EditWebsiteDialog } from "@/components/dashboard/edit-website-dialog";
import { UserMenu } from "@/components/dashboard/user-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWebsiteQuery } from "@/lib/queries/websiteQueries";
import { Website, WebsitesResponse, WebsiteStatus } from "@/lib/responses";
import {
  Activity,
  ArrowUpRight,
  Clock,
  Globe,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Server,
  Trash2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

const statusConfig = {
  [WebsiteStatus.UP]: {
    label: "Operational",
    dot: "bg-brand-400",
    text: "text-brand-300",
    badge: "border-brand-500/30 bg-brand-500/10 text-brand-300",
  },
  [WebsiteStatus.Unknown]: {
    label: "Unknown",
    dot: "bg-amber-400",
    text: "text-amber-400",
    badge: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  },
  [WebsiteStatus.DOWN]: {
    label: "Down",
    dot: "bg-red-500",
    text: "text-red-400",
    badge: "border-red-500/30 bg-red-500/10 text-red-400",
  },
};

const statusFilters: { label: string; value: WebsiteStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Operational", value: WebsiteStatus.UP },
  { label: "Degraded", value: WebsiteStatus.Unknown },
  { label: "Down", value: WebsiteStatus.DOWN },
];

const regions = [
  "All regions",
  "North America",
  "Europe",
  "Asia Pacific",
  "South America",
  "Africa",
];

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

function WebsiteRow({
  website,
  onEdit,
  onDelete,
}: {
  website: Website;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const cfg = statusConfig[website.ticks[0].status];
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const updateButtonRef = useRef<HTMLButtonElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useRouter();
  const handleClick = (e: React.MouseEvent) => {
    if (
      anchorRef.current?.contains(e.target as Node) ||
      updateButtonRef.current?.contains(e.target as Node) ||
      deleteButtonRef.current?.contains(e.target as Node)
    ) {
      return;
    }
    navigate.push(`/website/${website.id}`);
  };
  return (
    <div
      className="group flex w-full cursor-pointer items-center justify-between gap-4 overflow-x-scroll border-b border-ink-800/60 px-5 py-4 transition last:border-b-0 hover:bg-ink-900/40 md:overflow-auto"
      onClick={handleClick}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${cfg.dot}`} />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">
            {website.description}
          </div>
          <div className="flex items-center gap-1.5 truncate text-xs text-ink-400">
            <Globe className="h-3 w-3 shrink-0" />
            <a
              ref={anchorRef}
              href={website.url}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate hover:underline"
            >
              {website.url}
            </a>
          </div>
        </div>
      </div>

      <div className="hidden shrink-0 items-center gap-6 sm:flex">
        <div className="text-right">
          <div className="text-xs text-ink-500">Response</div>
          <div className="flex items-center gap-1 text-sm font-medium text-ink-200">
            <Zap className="h-3 w-3 text-amber-400" />
            <span>{website.ticks[0].response_time_ms}ms</span>
          </div>
        </div>
        {/* <div className="text-right">
          <div className="text-xs text-ink-500">Uptime</div>
          <div className="text-sm font-medium text-ink-200">
            {website.uptimePercentage}%
          </div>
        </div> */}
        <div className="text-right">
          <div className="text-xs text-ink-500">Last checked</div>
          <div className="items-center gap-1 text-sm font-medium text-ink-200 flex">
            {website.ticks[0].status == WebsiteStatus.Unknown ? (
              <div>Unknown</div>
            ) : (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-green-400" />
                {timeAgo(new Date(website.ticks[0].createdAt).toISOString())}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Badge variant="outline" className={`${cfg.badge} hidden md:inline-flex`}>
          {cfg.label}
        </Badge>
        <div className="flex items-center gap-1 transition md:opacity-0 md:group-hover:opacity-100">
          <Button
            // href={`/website/${website.id}`}
            onClick={() => navigate.push(`/website/${website.id}`)}
            title="View website"
            className="grid h-8 w-8 place-items-center rounded-lg bg-ink-900/60 text-ink-400 transition hover:bg-ink-800 hover:text-white"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Button>
          <button
            ref={updateButtonRef}
            onClick={onEdit}
            title="Edit"
            className="grid h-8 w-8 place-items-center rounded-lg text-ink-400 transition hover:bg-ink-800 hover:text-brand-300"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            ref={deleteButtonRef}
            onClick={onDelete}
            title="Delete"
            className="grid h-8 w-8 place-items-center rounded-lg text-ink-400 transition hover:bg-ink-800 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Website | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Website | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<WebsiteStatus | "all">(
    "all"
  );
  // const [regionFilter, setRegionFilter] = useState("All regions");
  const { data, isLoading, isError, refetch, isFetched, isFetching, error } =
    useWebsiteQuery<WebsitesResponse>({ endpoint: "/" });
  const websites = data?.data.websites ?? [];
  const filtered = useMemo(() => {
    return websites.filter((w) => {
      const matchesSearch =
        !search ||
        (w.description &&
          w.description.toLowerCase().includes(search.toLowerCase())) ||
        w.url.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || w.ticks[0].status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, websites]);
  const operational = websites.filter(
    (w) => w.ticks[0].status === WebsiteStatus.UP
  ).length;
  const avgResponse = Math.round(data?.data.avgResponseTime || 0.0);
  const downCount = websites.filter(
    (w) => w.ticks[0].status === WebsiteStatus.DOWN
  ).length;
  useEffect(() => {
    if (isFetched && !isFetching) {
      toast.success("Websites loaded successfully");
    }
  }, [isFetched, isFetching]);
  return (
    <div
      className="min-h-screen bg-ink-950 text-ink-100"
      onKeyDown={(e) => {
        // console.log("Key pressed:", e.key, "Ctrl:", e.ctrlKey);
        if (e.ctrlKey && e.key === "Enter") {
          // e.preventDefault();
          toast.success("Ctrl+Enter pressed, opening Add Website dialog");
          setModalOpen(true);
        }
      }}
    >
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-ink-800/80 bg-ink-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500 text-ink-950 shadow-glow">
              <Activity className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="text-lg font-bold tracking-tight text-white">
              UptimePulse
            </span>
          </Link>
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
            <Button size="sm" onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Add website</span>
            </Button>
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-ink-400">
          Monitor your websites and endpoints in real time.
        </p>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={Server}
            label="Total monitors"
            value={String(websites.length)}
            tone="text-ink-200"
          />
          <StatCard
            icon={Activity}
            label="Operational"
            value={String(operational)}
            tone="text-brand-400"
          />
          <StatCard
            icon={Zap}
            label="Avg response"
            value={`${avgResponse}ms`}
            tone="text-amber-400"
          />
          <StatCard
            icon={Activity}
            label="Down"
            value={String(downCount)}
            tone="text-red-400"
          />
        </div>

        {/* Filter bar */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-500" />
            <input
              type="text"
              placeholder="Search by name or URL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-ink-700 bg-ink-900/60 py-2.5 pr-3 pl-10 text-sm text-white transition outline-none placeholder:text-ink-500 focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 rounded-xl border border-ink-700 bg-ink-900/60 p-1">
            {statusFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  statusFilter === f.value
                    ? "bg-brand-500/15 text-brand-300"
                    : "text-ink-400 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Region filter */}
          {/* <div className="relative flex items-center justify-between">
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="cursor-pointer appearance-none rounded-xl border border-ink-700 bg-ink-900/60 py-2.5 pr-9 pl-3 text-sm text-ink-200 transition outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
            >
              {regions.map((r) => (
                <option key={r} value={r} className="bg-ink-900 text-ink-200">
                  {r}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-ink-500">
              ▼
            </span>
          </div> */}
        </div>

        {/* Website list */}
        <div className="mt-4 rounded-2xl border border-ink-800 bg-ink-900/40">
          <div className="flex items-center justify-between border-b border-ink-800/60 px-5 py-4">
            <h2 className="text-sm font-semibold text-white">Your websites</h2>
            {filtered.length > 0 && (
              <span className="text-xs text-ink-500">
                {filtered.length} monitor{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-ink-400">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading your
              monitors...
            </div>
          ) : isError ? (
            <div className="px-5 py-16 text-center">
              <p className="text-sm text-red-400">
                {error?.message || "Failed to load websites."}
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-2xl border border-ink-800 bg-ink-900/60 text-ink-500">
                <Globe className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">
                  {websites.length === 0
                    ? "No monitors yet"
                    : "No matches found"}
                </p>
                <p className="mt-1 text-sm text-ink-400">
                  {websites.length === 0
                    ? "Add your first website to start tracking uptime."
                    : "Try adjusting your search or filters."}
                </p>
              </div>
              {websites.length === 0 && (
                <Button
                  size="sm"
                  onClick={() => setModalOpen(true)}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4" /> Add website
                </Button>
              )}
            </div>
          ) : (
            <div>
              {filtered.map((w) => (
                <WebsiteRow
                  key={w.id}
                  website={w}
                  onEdit={() => setEditTarget(w)}
                  onDelete={() => setDeleteTarget(w)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <AddWebsiteDialog open={modalOpen} onOpenChange={setModalOpen} />
      <EditWebsiteDialog
        website={editTarget}
        open={editTarget !== null}
        onOpenChange={(open) => !open && setEditTarget(null)}
      />
      <DeleteWebsiteDialog
        website={deleteTarget}
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      />
    </div>
  );
}
