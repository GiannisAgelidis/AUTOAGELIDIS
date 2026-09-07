"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { CarWithImages } from "@/lib/supabase/types";
import { ArrowRightIcon } from "./icons";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/** Subscribe to a media query the React-blessed way (no setState-in-effect). */
function useMediaQuery(query: string, serverFallback: boolean) {
  return useSyncExternalStore(
    (onChange) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", onChange);
      return () => m.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}

export default function FeaturedCarousel({ cars }: { cars: CarWithImages[] }) {
  const t = useTranslations("featured");
  const tEnums = useTranslations("enums");
  const locale = useLocale();

  const railRef = useRef<HTMLUListElement>(null);
  const [page, setPage] = useState(1);

  // Cards per view is fixed by the CSS breakpoints (1 / 2 / 3).
  const isLg = useMediaQuery("(min-width: 1024px)", true);
  const isSm = useMediaQuery("(min-width: 640px)", true);
  const perView = isLg ? 3 : isSm ? 2 : 1;
  const pages = Math.max(1, Math.ceil(cars.length / perView));

  // Track the current page from scroll position for the counter.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (rail.clientWidth < 1) return;
        setPage(
          Math.min(
            pages,
            Math.max(1, Math.round(rail.scrollLeft / rail.clientWidth) + 1),
          ),
        );
      });
    };
    rail.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      rail.removeEventListener("scroll", onScroll);
    };
  }, [pages]);

  const scrollByPage = useCallback(
    (dir: 1 | -1) => {
      const rail = railRef.current;
      if (!rail) return;

      const max = rail.scrollWidth - rail.clientWidth;
      const atStart = rail.scrollLeft <= 4;
      const atEnd = rail.scrollLeft >= max - 4;

      let target: number;
      if (dir === 1) target = atEnd ? 0 : rail.scrollLeft + rail.clientWidth;
      else target = atStart ? max : rail.scrollLeft - rail.clientWidth;
      target = Math.max(0, Math.min(max, target));

      const from = rail.scrollLeft;
      // Land immediately (works regardless of smooth-scroll / rAF support)...
      rail.scrollLeft = target;
      setPage((p) => {
        if (dir === 1) return atEnd ? 1 : Math.min(pages, p + 1);
        return atStart ? pages : Math.max(1, p - 1);
      });

      // ...then, when motion is allowed, animate the delta for polish.
      if (prefersReducedMotion() || from === target) return;
      const dist = from - target;
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / 300);
        const eased = 1 - Math.pow(1 - p, 3);
        rail.scrollLeft = target + dist * (1 - eased);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    },
    [pages],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByPage(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByPage(-1);
    }
  };

  const hasControls = pages > 1;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={t("title")}
      onKeyDown={onKeyDown}
    >
      {hasControls && (
        <div className="mb-6 flex items-center justify-end gap-4">
          <span
            aria-live="polite"
            className="font-mono text-[11px] tabular-nums tracking-[0.12em] text-ash"
          >
            {String(page).padStart(2, "0")} / {String(pages).padStart(2, "0")}
          </span>
          <div className="flex">
            <button
              type="button"
              onClick={() => scrollByPage(-1)}
              aria-label="Previous vehicles"
              className="flex h-11 w-11 items-center justify-center border border-line text-ink transition-colors hover:bg-ink hover:text-on-ink"
            >
              <ArrowRightIcon className="h-4 w-4 rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => scrollByPage(1)}
              aria-label="Next vehicles"
              className="-ml-px flex h-11 w-11 items-center justify-center border border-line text-ink transition-colors hover:bg-ink hover:text-on-ink"
            >
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <ul
        ref={railRef}
        className="rail -mx-1 flex snap-x snap-mandatory gap-6 overflow-x-auto px-1 pb-1"
      >
        {cars.map((car) => {
          const cover = [...(car.car_images ?? [])].sort(
            (a, b) => a.position - b.position,
          )[0];
          const title =
            locale === "el"
              ? [car.make, car.model, car.trim_gr].filter(Boolean).join(" ")
              : [car.make, car.model, car.trim_en].filter(Boolean).join(" ");

          return (
            <li
              key={car.id}
              className="w-[86%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
            >
              <Link
                href={{ pathname: "/cars", query: { car: car.id } }}
                className="group card-quiet flex h-full flex-col border border-line bg-surface hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-2">
                  {cover && (
                    <Image
                      src={cover.url}
                      alt={title}
                      fill
                      sizes="(max-width: 640px) 86vw, (max-width: 1024px) 45vw, 360px"
                      className="card-cover object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <p className="font-medium">{title}</p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ash">
                    {car.year} · {car.mileage_km.toLocaleString()} km ·{" "}
                    {tEnums(`fuelType.${car.fuel_type}`)}
                  </p>
                  <p className="mt-auto pt-3 font-mono text-base font-semibold tabular-nums text-ink">
                    {Number(car.price).toLocaleString()} €
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
