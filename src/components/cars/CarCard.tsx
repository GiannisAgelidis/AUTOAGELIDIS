import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { CarWithImages } from "@/lib/supabase/types";

export default async function CarCard({ car }: { car: CarWithImages }) {
  const t = await getTranslations("cars.card");
  const tEnums = await getTranslations("enums");
  const locale = await getLocale();

  const cover = [...(car.car_images ?? [])].sort(
    (a, b) => a.position - b.position,
  )[0];

  const title =
    locale === "el"
      ? [car.make, car.model, car.trim_gr].filter(Boolean).join(" ")
      : [car.make, car.model, car.trim_en].filter(Boolean).join(" ");

  return (
    <Link
      href={`/vehicles/${car.id}`}
      className="group card-quiet flex flex-col overflow-hidden rounded-xl border border-line bg-surface text-left hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-2">
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
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="font-medium">{title}</p>
        <p className="font-num text-xs uppercase tracking-[0.03em] text-ash">
          {car.year}
          {car.month ? `/${car.month}` : ""} · {car.mileage_km.toLocaleString()} km ·{" "}
          {tEnums(`fuelType.${car.fuel_type}`)}
        </p>
        <div className="mt-auto pt-3">
          <span className="inline-flex items-center rounded-full border border-mint-line bg-mint px-3 py-1 font-num text-sm font-semibold tabular-nums text-mint-ink">
            {car.price
              ? `${Number(car.price).toLocaleString()} €`
              : t("priceOnRequest")}
          </span>
        </div>
      </div>
    </Link>
  );
}
