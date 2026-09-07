"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter, Link } from "@/i18n/navigation";
import type { CarWithImages } from "@/lib/supabase/types";
import { ArrowRightIcon, CloseIcon } from "@/components/site/icons";

function SpecRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex justify-between gap-4 border-b border-line py-2.5 text-sm last:border-none">
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ash">
        {label}
      </span>
      <span className="text-right font-medium text-ink">{value}</span>
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4"
      onClick={close}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden border border-line bg-surface md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label={t("close")}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center bg-ink text-on-ink transition-colors hover:bg-ink-2"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        <div className="relative flex w-full flex-col bg-surface-2 md:w-1/2">
          <div className="relative aspect-[4/3] w-full">
            {images.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={images[activeIndex].url}
                alt={title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-ash">
                —
              </div>
            )}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous photo"
                  className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-ink/80 text-lg text-on-ink transition-colors hover:bg-ink"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next photo"
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-ink/80 text-lg text-on-ink transition-colors hover:bg-ink"
                >
                  ›
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="rail flex gap-2 overflow-x-auto p-3">
              {images.map((img, index) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-14 w-14 shrink-0 overflow-hidden border-2 transition-colors ${
                    index === activeIndex ? "border-ink" : "border-transparent"
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
          <h2 className="text-xl font-medium tracking-[-0.01em] text-ink">
            {title}
          </h2>
          <p className="mb-5 mt-1 font-mono text-xl font-semibold tabular-nums text-ink">
            {Number(car.price).toLocaleString()} €
          </p>

          <h3 className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ash">
            {t("specs")}
          </h3>
          <div className="mb-5">
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
              <h3 className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ash">
                {t("features")}
              </h3>
              <div className="mb-5 flex flex-wrap gap-2">
                {car.features.map((feature) => (
                  <span
                    key={feature}
                    className="border border-line bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-ink"
                  >
                    {tEnums(`features.${feature}`)}
                  </span>
                ))}
              </div>
            </>
          )}

          {description && (
            <>
              <h3 className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ash">
                {t("description")}
              </h3>
              <p className="mb-5 whitespace-pre-line text-sm text-graphite">
                {description}
              </p>
            </>
          )}

          <Link
            href="/#contact"
            onClick={close}
            className="group inline-flex items-center gap-2 bg-ink px-5 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-on-ink transition-colors hover:bg-ink-2"
          >
            {t("contactAboutThis")}
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
