import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import DeleteCarButton from "@/components/admin/DeleteCarButton";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.dashboard");
  const tEnums = await getTranslations("enums");

  const supabase = await createClient();
  const { data: cars } = await supabase
    .from("cars")
    .select("id, make, model, year, price, vehicle_type, car_images(url, position)")
    .order("created_at", { ascending: false });

  async function handleSignOut() {
    "use server";
    await signOut(locale);
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/cars/new"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {t("addCar")}
          </Link>
          <Link
            href="/admin/account"
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            {t("account")}
          </Link>
          <form action={handleSignOut}>
            <button
              type="submit"
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              {t("logout")}
            </button>
          </form>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {(cars ?? []).map((car) => {
          const cover = [...(car.car_images ?? [])].sort(
            (a, b) => a.position - b.position,
          )[0];

          return (
            <div
              key={car.id}
              className="flex items-center gap-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
                {cover && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cover.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">
                  {car.make} {car.model} ({car.year})
                </p>
                <p className="text-sm text-zinc-500">
                  {tEnums(`vehicleType.${car.vehicle_type}`)} ·{" "}
                  {Number(car.price).toLocaleString()} €
                </p>
              </div>
              <Link
                href={`/admin/cars/${car.id}/edit`}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                {t("edit")}
              </Link>
              <DeleteCarButton
                carId={car.id}
                confirmMessage={t("confirmDelete")}
                label={t("delete")}
              />
            </div>
          );
        })}
      </div>
    </main>
  );
}
