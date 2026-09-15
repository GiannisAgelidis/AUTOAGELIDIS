"use client";

import { useActionState, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { signIn, type SignInState } from "../actions";
import { createClient } from "@/lib/supabase/client";

const initialState: SignInState = {};

export default function AdminLoginPage() {
  const t = useTranslations("admin.login");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(signIn, initialState);
  const [email, setEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState<"idle" | "sending" | "sent">(
    "idle",
  );
  const [forgotError, setForgotError] = useState<string | null>(null);

  async function handleForgotPassword() {
    if (!email) return;
    setForgotStatus("sending");
    setForgotError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/${locale}/admin/set-password`,
    });

    if (error) {
      setForgotError(t(error.status === 429 ? "rateLimited" : "sendError"));
      setForgotStatus("idle");
      return;
    }

    setForgotStatus("sent");
  }

  if (state?.sent) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <p className="max-w-sm text-center text-sm text-zinc-600 dark:text-zinc-400">
          {t("checkEmail")}
        </p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
      >
        <input type="hidden" name="locale" value={locale} />
        <h1 className="mb-6 text-xl font-semibold">{t("title")}</h1>

        <label className="mb-1 block text-sm font-medium" htmlFor="email">
          {t("email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />

        <label className="mb-1 block text-sm font-medium" htmlFor="password">
          {t("password")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mb-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />

        <button
          type="button"
          onClick={handleForgotPassword}
          disabled={!email || forgotStatus !== "idle"}
          className="mb-4 text-xs text-zinc-500 underline hover:text-zinc-900 disabled:opacity-50 dark:hover:text-zinc-100"
        >
          {t("forgotPassword")}
        </button>

        {forgotStatus === "sent" && !forgotError && (
          <p className="mb-4 text-sm text-green-600 dark:text-green-400">
            {t("resetSent")}
          </p>
        )}
        {forgotError && (
          <p className="mb-4 text-sm text-red-600 dark:text-red-400">
            {forgotError}
          </p>
        )}

        {state?.error && (
          <p className="mb-4 text-sm text-red-600 dark:text-red-400">
            {t(state.error)}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {t("submit")}
        </button>
      </form>
    </main>
  );
}
