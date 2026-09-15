"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";

export default function ChangePasswordForm({ email }: { email: string }) {
  const t = useTranslations("admin.account");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setStatus("sending");
    setError(null);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${window.location.origin}/${locale}/admin/set-password` },
    );

    if (resetError) {
      setError(t(resetError.status === 429 ? "rateLimited" : "error"));
      setStatus("idle");
      return;
    }

    setStatus("sent");
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <p className="mb-6 text-sm text-zinc-500">{t("changeIntro")}</p>

      {error && (
        <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {status === "sent" && !error && (
        <p className="mb-4 text-sm text-green-600 dark:text-green-400">
          {t("resetSent")}
        </p>
      )}

      <button
        type="button"
        onClick={handleClick}
        disabled={status !== "idle"}
        className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {t("sendReset")}
      </button>
    </div>
  );
}
