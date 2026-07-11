import { Bell } from "lucide-react";

export default function NotificationSection() {
  return (
    <section className="mt-6 rounded-2xl border border-ink-800 bg-ink-900/40 p-6">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-brand-400" />
        <h2 className="text-base font-semibold text-white">Notifications</h2>
      </div>
      <p className="mt-1 text-sm text-ink-400">Choose how you get alerted.</p>

      <div className="mt-5 space-y-3">
        {[
          {
            label: "Email alerts",
            desc: "Get notified by email when a monitor goes down",
            defaultChecked: true,
          },
          {
            label: "Slack notifications",
            desc: "Send alerts to your Slack workspace",
            defaultChecked: false,
          },
          {
            label: "Weekly uptime report",
            desc: "A summary of your monitors every Monday",
            defaultChecked: true,
          },
        ].map((item) => (
          <label
            key={item.label}
            className="flex cursor-pointer items-center justify-between rounded-xl border border-ink-800 bg-ink-950/40 px-4 py-3 transition hover:border-ink-700"
          >
            <div>
              <div className="text-sm font-medium text-white">{item.label}</div>
              <div className="text-xs text-ink-400">{item.desc}</div>
            </div>
            <input
              type="checkbox"
              defaultChecked={item.defaultChecked}
              className="relative h-5 w-9 cursor-pointer appearance-none rounded-full border border-ink-600 bg-ink-800 transition after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-ink-400 after:transition checked:border-brand-500 checked:bg-brand-500 checked:after:translate-x-4 checked:after:bg-ink-950"
            />
          </label>
        ))}
      </div>
    </section>
  );
}
