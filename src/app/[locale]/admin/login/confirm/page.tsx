"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { establishSessionFromUrl } from "@/lib/supabase/session-from-url";

type Status = "verifying" | "failed";

export default function LoginConfirmPage() {
  const t = useTranslations("admin.login");
  const router = useRouter();
  const [status, setStatus] = useState<Status>("verifying");

  useEffect(() => {
    establishSessionFromUrl().then((ok) => {
      if (ok) {
        router.push("/admin");
      } else {
        setStatus("failed");
      }
    });
  }, [router]);

  if (status === "failed") {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="text-center">
          <p className="mb-4 max-w-sm text-sm text-red-600 dark:text-red-400">
            {t("confirmError")}
          </p>
          <Link
            href="/admin/login"
            className="text-sm text-zinc-500 underline hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            {t("backToLogin")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <p className="text-sm text-zinc-500">…</p>
    </main>
  );
}
