"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

export default function ChangePasswordForm() {
  const t = useTranslations("admin.account");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError(t("tooShort"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("mismatch"));
      return;
    }

    setStatus("saving");
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setStatus("idle");

    if (updateError) {
      setError(t("error"));
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setStatus("saved");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <label className="mb-1 block text-sm font-medium" htmlFor="newPassword">
        {t("newPassword")}
      </label>
      <input
        id="newPassword"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />

      <label className="mb-1 block text-sm font-medium" htmlFor="confirmPassword">
        {t("confirmPassword")}
      </label>
      <input
        id="confirmPassword"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="mb-4 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />

      {error && (
        <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {status === "saved" && !error && (
        <p className="mb-4 text-sm text-green-600 dark:text-green-400">
          {t("success")}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "saving"}
        className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {t("submit")}
      </button>
    </form>
  );
}
