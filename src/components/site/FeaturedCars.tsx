import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import Tag from "./Tag";
import Reveal from "./Reveal";
import { ArrowRightIcon } from "./icons";

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
    <section className="bg-surface-dim text-ink">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-24">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-4">
            <Tag>{t("eyebrow")}</Tag>
            <h2 className="text-3xl font-extrabold tracking-[-0.02em] sm:text-4xl">
              {t("title")}
            </h2>
          </div>
          <Link
            href="/cars"
            className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-signal transition-colors hover:text-signal-700"
          >
            {t("viewAll")}
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>

        {featured.length === 0 ? (
          <p className="text-muted">{t("empty")}</p>
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
                    className="group card-lift flex h-full flex-col overflow-hidden rounded-xl border border-hairline bg-surface shadow-[0_1px_2px_rgba(15,23,42,0.05)] hover:border-slate/20 hover:shadow-[0_20px_40px_-16px_rgba(15,23,42,0.25)]"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-dim">
                      {cover && (
                        <Image
                          src={cover.url}
                          alt={title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                          className="card-cover object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5 p-5">
                      <p className="font-semibold">{title}</p>
                      <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
                        {car.year} · {car.mileage_km.toLocaleString()} km ·{" "}
                        {tEnums(`fuelType.${car.fuel_type}`)}
                      </p>
                      <p className="mt-auto pt-3 text-xl font-bold tabular-nums text-signal">
                        {Number(car.price).toLocaleString()} €
                      </p>
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
