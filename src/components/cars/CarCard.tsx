"use client";

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
      className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white text-left transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="aspect-[4/3] w-full bg-zinc-100 dark:bg-zinc-900">
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover.url}
            alt={title}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-zinc-500">
          {car.year}
          {car.month ? `/${car.month}` : ""} ·{" "}
          {car.mileage_km.toLocaleString()} km ·{" "}
          {tEnums(`fuelType.${car.fuel_type}`)}
        </p>
        <p className="mt-auto pt-2 text-lg font-semibold">
          {car.price ? `${Number(car.price).toLocaleString()} €` : t("priceOnRequest")}
        </p>
      </div>
    </button>
  );
}
