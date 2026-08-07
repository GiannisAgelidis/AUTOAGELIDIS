import { getTranslations, setRequestLocale } from "next-intl/server";
import CarForm from "@/components/admin/CarForm";

export default async function NewCarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.form");

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold">{t("title")}</h1>
      <CarForm />
    </main>
  );
}
