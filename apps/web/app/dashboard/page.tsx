"use client"

import { AddWebsiteDialog } from "@/components/dashboard/add-website-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuthQuery } from "@/lib/queries/authQueries"
import { useWebsiteQuery } from "@/lib/queries/websiteQueries"
import { Website, WebsiteStatus } from "@/lib/responses"
import {
  Activity,
  Clock,
  Globe,
  Loader2,
  Plus,
  Server,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

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
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Activity
  label: string
  value: string
  tone: string
}) {
  return (
    <div className="rounded-2xl border border-ink-800 bg-ink-900/40 p-5">
      <div className="flex items-center gap-2 text-xs text-ink-400">
        <Icon className={`h-4 w-4 ${tone}`} /> {label}
      </div>
      <div className="mt-2 text-2xl font-bold text-white">{value}</div>
    </div>
  )
}

function WebsiteRow({ website }: { website: Website }) {
  const cfg = statusConfig[website.ticks[0].status]
  return (
    <div className="flex items-center justify-between gap-4 border-b border-ink-800/60 px-5 py-4 transition last:border-b-0 hover:bg-ink-900/40">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${cfg && cfg.dot}`}
        />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">
            {website.description}
          </div>
          <div className="flex items-center gap-1.5 truncate text-xs text-ink-400">
            <Globe className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{website.url}</span>
          </div>
        </div>
      </div>

      <div className="hidden flex-shrink-0 items-center gap-6 sm:flex">
        <div className="text-right">
          <div className="text-xs text-ink-500">Response</div>
          <div className="flex items-center gap-1 text-sm font-medium text-ink-200">
            <Zap className="h-3 w-3 text-amber-400" />
            {website.ticks[0].response_time_ms}ms
          </div>
        </div>
        {/* <div className="text-right">
          <div className="text-xs text-ink-500">Uptime</div>
          <div className="text-sm font-medium text-ink-200">{website.uptimePercentage}</div>
        </div> */}
        <div className="text-right">
          <div className="text-xs text-ink-500">Last checked</div>
          <div className="flex items-center gap-1 text-sm font-medium text-ink-200">
            <Clock className="h-3 w-3 text-ink-500" />
            {timeAgo(new Date(website.ticks[0].createdAt).toISOString())}
          </div>
        </div>
      </div>

      <Badge variant="outline" className={cfg && cfg.badge}>
        {cfg && cfg.label}
      </Badge>
    </div>
  )
}

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const { data, isLoading, isError, error } = useWebsiteQuery({ endpoint: "/" })
  const { isLoading: isAuthLoading, isError: isAuthError } = useAuthQuery({
    endpoint: "/me",
  })
  const navigate = useRouter()
  useEffect(() => {
    if (!isAuthLoading && isAuthError) {
      navigate.push("/signin")
    }
  }, [isAuthLoading, isAuthError])
  const websites = data?.data.websites || []
  const operational = websites.filter(
    (w) => w.ticks[0].status === WebsiteStatus.UP
  ).length
  const avgResponse =
    websites.length > 0
      ? Math.round(
          websites.reduce((sum, w) => sum + w.ticks[0].response_time_ms, 0) /
            websites.length
        )
      : 0
  const downCount = websites.filter(
    (w) => w.ticks[0].status === WebsiteStatus.DOWN
  ).length
  console.log(
    "operational:",
    operational,
    "avg:",
    avgResponse,
    "down:",
    downCount
  )
  console.log("websites:", websites.length > 0 && websites[0].ticks[0].status)
  return (
    <div className="min-h-screen bg-ink-950 text-ink-100">
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
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" /> Add website
          </Button>
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

        {/* Website list */}
        <div className="mt-8 rounded-2xl border border-ink-800 bg-ink-900/40">
          <div className="flex items-center justify-between border-b border-ink-800/60 px-5 py-4">
            <h2 className="text-sm font-semibold text-white">Your websites</h2>
            {websites.length > 0 && (
              <span className="text-xs text-ink-500">
                {websites.length} monitor{websites.length !== 1 ? "s" : ""}
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
                {error.message || "Failed to load websites."}
              </p>
            </div>
          ) : websites.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-2xl border border-ink-800 bg-ink-900/60 text-ink-500">
                <Globe className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">
                  No monitors yet
                </p>
                <p className="mt-1 text-sm text-ink-400">
                  Add your first website to start tracking uptime.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setModalOpen(true)}
                className="mt-2"
              >
                <Plus className="h-4 w-4" /> Add website
              </Button>
            </div>
          ) : (
            <div>
              {websites.map((w) => (
                <WebsiteRow key={w.id} website={w} />
              ))}
            </div>
          )}
        </div>
      </main>

      <AddWebsiteDialog open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}
