"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { CarWithImages } from "@/lib/supabase/types";

export default function CarCard({ car }: { car: CarWithImages }) {
  const t = useTranslations("cars.card");
  const tEnums = useTranslations("enums");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const cover = [...(car.car_images ?? [])].sort(
    (a, b) => a.position - b.position,
  )[0];

  const title =
    locale === "el"
      ? [car.make, car.model, car.trim_gr].filter(Boolean).join(" ")
      : [car.make, car.model, car.trim_en].filter(Boolean).join(" ");

  function openDetail() {
    const params = new URLSearchParams(window.location.search);
    params.set("car", car.id);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <button
      type="button"
      onClick={openDetail}
      className="group card-quiet flex flex-col border border-line bg-surface text-left hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
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
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ash">
          {car.year}
          {car.month ? `/${car.month}` : ""} · {car.mileage_km.toLocaleString()} km ·{" "}
          {tEnums(`fuelType.${car.fuel_type}`)}
        </p>
        <p className="mt-auto pt-3 font-mono text-base font-semibold tabular-nums text-ink">
          {car.price
            ? `${Number(car.price).toLocaleString()} €`
            : t("priceOnRequest")}
        </p>
      </div>
    </button>
  );
}
