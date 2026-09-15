import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.account");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex flex-1 flex-col items-center gap-6 px-6 py-16">
      <div className="w-full max-w-sm">
        <Link
          href="/admin"
          className="mb-6 inline-block text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          ← {t("backToDashboard")}
        </Link>
        <h1 className="mb-1 text-xl font-semibold">{t("title")}</h1>
        {user?.email && (
          <p className="mb-6 text-sm text-zinc-500">
            {t("signedInAs")} {user.email}
          </p>
        )}
        {user?.email && <ChangePasswordForm email={user.email} />}
      </div>
    </main>
  );
}
