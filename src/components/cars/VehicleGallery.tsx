"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowRightIcon,
  CloseIcon,
  ExpandIcon,
} from "@/components/site/icons";
import type { CarImageRow } from "@/lib/supabase/types";

export default function VehicleGallery({
  images,
  title,
}: {
  images: CarImageRow[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const count = images.length;

  function next() {
    setActiveIndex((i) => (count ? (i + 1) % count : 0));
  }

  function prev() {
    setActiveIndex((i) => (count ? (i - 1 + count) % count : 0));
  }

  // Arrow keys move the active photo whether or not the lightbox is open;
  // Escape only makes sense once it is.
  useEffect(() => {
    if (count < 2 && !lightboxOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") setLightboxOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  return (
    <div>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-line bg-surface-2 ">
        {count > 0 ? (
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="Open photo"
            className="absolute inset-0 cursor-zoom-in"
          >
            <Image
              src={images[activeIndex].url}
              alt={`${title} — ${activeIndex + 1}/${count}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 62vw"
              className="object-cover "
            />
          </button>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ash">
            —
          </div>
        )}

        {count > 0 && (
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-ink/70 text-on-ink"
          >
            <ExpandIcon className="h-3.5 w-3.5" />
          </span>
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/70 text-on-ink transition-colors hover:bg-ink"
            >
              <ArrowRightIcon className="h-4 w-4 rotate-180" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/70 text-on-ink transition-colors hover:bg-ink"
            >
              <ArrowRightIcon className="h-4 w-4" />
            </button>
            <span
              aria-live="polite"
              className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-ink/70 px-3 py-1 font-num text-xs tabular-nums text-on-ink"
            >
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(count).padStart(2, "0")}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <ul className="rail mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, index) => (
            <li key={img.id} className="shrink-0">
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Photo ${index + 1}`}
                aria-current={index === activeIndex}
                className={`relative h-16 w-20 overflow-hidden rounded-lg border-2 transition-colors ${
                  index === activeIndex
                    ? "border-ink"
                    : "border-transparent hover:border-line"
                }`}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
                <span className="absolute bottom-0.5 right-1 font-num text-[9px] tabular-nums text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {lightboxOpen && count > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4 sm:p-8"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-on-ink/10 text-on-ink transition-colors hover:bg-on-ink/20"
          >
            <CloseIcon className="h-5 w-5" />
          </button>

          <div
            className="relative h-full max-h-[80vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeIndex].url}
              alt={`${title} — ${activeIndex + 1}/${count}`}
              fill
              sizes="100vw"
              className="rounded-xl object-contain"
            />

            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous photo"
                  className="absolute left-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-on-ink/10 text-on-ink transition-colors hover:bg-on-ink/20 sm:-left-4"
                >
                  <ArrowRightIcon className="h-5 w-5 rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next photo"
                  className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-on-ink/10 text-on-ink transition-colors hover:bg-on-ink/20 sm:-right-4"
                >
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {count > 1 && (
            <span
              aria-live="polite"
              className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-on-ink/10 px-3 py-1 font-num text-xs tabular-nums text-on-ink"
            >
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(count).padStart(2, "0")}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
