"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { CarWithImages } from "@/lib/supabase/types";

function SpecRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex justify-between border-b border-zinc-100 py-2 text-sm last:border-none dark:border-zinc-900">
      <span className="text-zinc-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export default function CarDetailModal({ car }: { car: CarWithImages }) {
  const t = useTranslations("carDetail");
  const tFields = useTranslations("carDetail.fields");
  const tEnums = useTranslations("enums");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeIndex, setActiveIndex] = useState(0);

  const images = [...(car.car_images ?? [])].sort(
    (a, b) => a.position - b.position,
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [car.id]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  function close() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("car");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function next() {
    setActiveIndex((i) => (images.length ? (i + 1) % images.length : 0));
  }

  function prev() {
    setActiveIndex((i) =>
      images.length ? (i - 1 + images.length) % images.length : 0,
    );
  }

  const title =
    locale === "el"
      ? [car.make, car.model, car.trim_gr].filter(Boolean).join(" ")
      : [car.make, car.model, car.trim_en].filter(Boolean).join(" ");

  const description = locale === "el" ? car.description_gr : car.description_en;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={close}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white dark:bg-zinc-950 md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label={t("close")}
          className="absolute right-6 top-6 z-10 rounded-full bg-black/60 px-2.5 py-1 text-sm text-white"
        >
          ✕
        </button>

        <div className="relative flex w-full flex-col bg-zinc-100 dark:bg-zinc-900 md:w-1/2">
          <div className="relative aspect-[4/3] w-full">
            {images.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={images[activeIndex].url}
                alt={title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-zinc-400">
                —
              </div>
            )}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2 text-white"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2 text-white"
                >
                  ›
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto p-3">
              {images.map((img, index) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 ${
                    index === activeIndex
                      ? "border-zinc-900 dark:border-white"
                      : "border-transparent"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-full overflow-y-auto p-6 md:w-1/2">
          <h2 className="mb-1 text-xl font-semibold">{title}</h2>
          <p className="mb-4 text-2xl font-bold">
            {Number(car.price).toLocaleString()} €
          </p>

          <h3 className="mb-2 text-sm font-semibold text-zinc-500">
            {t("specs")}
          </h3>
          <div className="mb-4">
            <SpecRow
              label={tFields("condition")}
              value={tEnums(`condition.${car.condition}`)}
            />
            <SpecRow
              label={tFields("category")}
              value={tEnums(`category.${car.category}`)}
            />
            <SpecRow
              label={tFields("yearMonth")}
              value={car.month ? `${car.month}/${car.year}` : car.year}
            />
            <SpecRow
              label={tFields("mileage")}
              value={`${car.mileage_km.toLocaleString()} km`}
            />
            <SpecRow
              label={tFields("fuelType")}
              value={tEnums(`fuelType.${car.fuel_type}`)}
            />
            <SpecRow
              label={tFields("engineCc")}
              value={car.engine_cc ? `${car.engine_cc.toLocaleString()} cc` : null}
            />
            <SpecRow
              label={tFields("horsepower")}
              value={car.horsepower ? `${car.horsepower} hp` : null}
            />
            <SpecRow
              label={tFields("transmission")}
              value={tEnums(`transmission.${car.transmission}`)}
            />
            <SpecRow
              label={tFields("driveType")}
              value={car.drive_type ? tEnums(`driveType.${car.drive_type}`) : null}
            />
            <SpecRow
              label={tFields("color")}
              value={car.color ? tEnums(`color.${car.color}`) : null}
            />
            <SpecRow
              label={tFields("upholstery")}
              value={car.upholstery ? tEnums(`upholstery.${car.upholstery}`) : null}
            />
            <SpecRow
              label={tFields("plateStatus")}
              value={tEnums(`plateStatus.${car.plate_status}`)}
            />
            <SpecRow label={tFields("airbags")} value={car.airbags} />
            <SpecRow label={tFields("doors")} value={car.doors} />
            <SpecRow label={tFields("seats")} value={car.seats} />
          </div>

          {car.features.length > 0 && (
            <>
              <h3 className="mb-2 text-sm font-semibold text-zinc-500">
                {t("features")}
              </h3>
              <div className="mb-4 flex flex-wrap gap-2">
                {car.features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full bg-zinc-100 px-3 py-1 text-xs dark:bg-zinc-900"
                  >
                    {tEnums(`features.${feature}`)}
                  </span>
                ))}
              </div>
            </>
          )}

          {description && (
            <>
              <h3 className="mb-2 text-sm font-semibold text-zinc-500">
                {t("description")}
              </h3>
              <p className="whitespace-pre-line text-sm">{description}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
