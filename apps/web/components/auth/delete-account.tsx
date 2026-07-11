"use client";

import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useState } from "react";
import { DeleteAccountDialog } from "./delete-account-dialog";

export function DeleteAccountForm() {
  const [modelOpen, setModelOpen] = useState(false);

  return (
    <section className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
      <div className="flex items-center gap-2">
        <Globe className="h-5 w-5 text-red-400" />
        <h2 className="text-base font-semibold text-white">Danger zone</h2>
      </div>
      <p className="mt-1 text-sm text-ink-400">Irreversible actions.</p>

      <div className="mt-5 flex items-center justify-between rounded-xl border border-red-500/20 bg-ink-950/40 px-4 py-3">
        <div>
          <div className="text-sm font-medium text-white">Delete account</div>
          <div className="text-xs text-ink-400">
            Permanently remove your account and all monitors.
          </div>
        </div>
        <Button
          className="bg-red-500 text-white hover:bg-red-600"
          onClick={() => setModelOpen(true)}
        >
          Delete account
        </Button>
      </div>
      <DeleteAccountDialog open={modelOpen} onOpenChange={setModelOpen} />
    </section>
  );
}
