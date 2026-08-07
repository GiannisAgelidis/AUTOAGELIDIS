import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import Tag from "./Tag";
import Reveal from "./Reveal";

export default async function FeaturedCars() {
  const t = await getTranslations("featured");
  const tEnums = await getTranslations("enums");
  const locale = await getLocale();

  const supabase = await createClient();
  const { data: cars } = await supabase
    .from("cars")
    .select("*, car_images(*)")
    .order("created_at", { ascending: false })
    .limit(3);

  const featured = cars ?? [];

  return (
    <section className="bg-paper-dim text-ink">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-20">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-4">
            <Tag>{t("eyebrow")}</Tag>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("title")}
            </h2>
          </div>
          <Link
            href="/cars"
            className="nav-link text-sm font-semibold uppercase tracking-wide text-ink hover:text-amber-dim"
          >
            {t("viewAll")} →
          </Link>
        </Reveal>

        {featured.length === 0 ? (
          <p className="text-ink/60">{t("empty")}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((car, index) => {
              const cover = [...(car.car_images ?? [])].sort(
                (a, b) => a.position - b.position,
              )[0];
              const title =
                locale === "el"
                  ? [car.make, car.model, car.trim_gr].filter(Boolean).join(" ")
                  : [car.make, car.model, car.trim_en].filter(Boolean).join(" ");

              return (
                <Reveal key={car.id} delay={index * 90}>
                  <Link
                    href={{ pathname: "/cars", query: { car: car.id } }}
                    className="group flex h-full flex-col overflow-hidden rounded-lg bg-paper shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-ink/5">
                      {cover && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cover.url}
                          alt={title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-5">
                      <p className="font-semibold">{title}</p>
                      <p className="text-sm text-ink/60">
                        {car.year} · {car.mileage_km.toLocaleString()} km ·{" "}
                        {tEnums(`fuelType.${car.fuel_type}`)}
                      </p>
                      <Tag className="mt-auto self-start" size="lg" interactive>
                        {Number(car.price).toLocaleString()} €
                      </Tag>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
