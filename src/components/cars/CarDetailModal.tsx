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
    <div className="flex justify-between gap-4 border-b border-hairline py-2.5 text-sm last:border-none">
      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label={t("close")}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/60 text-white transition-colors hover:bg-slate-900/80"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        <div className="relative flex w-full flex-col bg-surface-dim md:w-1/2">
          <div className="relative aspect-[4/3] w-full">
            {images.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={images[activeIndex].url}
                alt={title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted">
                —
              </div>
            )}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous photo"
                  className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/60 text-lg text-white transition-colors hover:bg-slate-900/80"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next photo"
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/60 text-lg text-white transition-colors hover:bg-slate-900/80"
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
                  className={`h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                    index === activeIndex ? "border-signal" : "border-transparent"
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
          <h2 className="text-xl font-extrabold tracking-[-0.01em] text-ink">
            {title}
          </h2>
          <p className="mb-5 mt-1 text-2xl font-bold tabular-nums text-signal">
            {Number(car.price).toLocaleString()} €
          </p>

          <h3 className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
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
              <h3 className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                {t("features")}
              </h3>
              <div className="mb-5 flex flex-wrap gap-2">
                {car.features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full border border-hairline bg-surface-dim px-3 py-1 text-xs text-ink"
                  >
                    {tEnums(`features.${feature}`)}
                  </span>
                ))}
              </div>
            </>
          )}

          {description && (
            <>
              <h3 className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                {t("description")}
              </h3>
              <p className="mb-5 whitespace-pre-line text-sm text-muted">
                {description}
              </p>
            </>
          )}

          <Link
            href="/#contact"
            onClick={close}
            className="group inline-flex items-center gap-2 rounded-lg bg-signal px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-signal-700"
          >
            {t("contactAboutThis")}
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
