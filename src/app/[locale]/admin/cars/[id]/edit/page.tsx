import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import CarForm from "@/components/admin/CarForm";

export default async function EditCarPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.form");

  const supabase = await createClient();
  const { data: car } = await supabase
    .from("cars")
    .select("*, car_images(*)")
    .eq("id", id)
    .single();

  if (!car) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold">{t("title")}</h1>
      <CarForm initialCar={car} />
    </main>
  );
}
