"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

type SessionStatus = "verifying" | "ready" | "failed";

/**
 * Supabase's invite/recovery redirect can land here with either a PKCE
 * `?code=` query param or a legacy `#access_token=&refresh_token=` hash —
 * which one depends on project auth settings. supabase-js's automatic
 * detectSessionInUrl doesn't reliably win the race against this page's own
 * render, so both cases are exchanged for a session explicitly on mount.
 */
async function establishSessionFromUrl(): Promise<boolean> {
  const supabase = createClient();
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    window.history.replaceState({}, "", url.pathname);
    return !error;
  }

  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = hashParams.get("access_token");
  const refreshToken = hashParams.get("refresh_token");

  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    window.history.replaceState({}, "", url.pathname);
    return !error;
  }

  // No tokens in the URL — maybe a session already exists (e.g. page refresh).
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return !!session;
}

export default function SetPasswordPage() {
  const t = useTranslations("admin.login");
  const router = useRouter();
  const [status, setStatus] = useState<SessionStatus>("verifying");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    establishSessionFromUrl().then((ok) => setStatus(ok ? "ready" : "failed"));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    setPending(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/admin");
  }

  if (status === "verifying") {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <p className="text-sm text-zinc-500">…</p>
      </main>
    );
  }

  if (status === "failed") {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <p className="max-w-sm text-center text-sm text-red-600 dark:text-red-400">
          {t("error")}
        </p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
      >
        <h1 className="mb-6 text-xl font-semibold">{t("password")}</h1>

        <label className="mb-1 block text-sm font-medium" htmlFor="password">
          {t("password")}
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />

        {error && (
          <p className="mb-4 text-sm text-red-600 dark:text-red-400">
            {error}
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
