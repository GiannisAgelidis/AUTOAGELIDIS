"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRightIcon } from "@/components/site/icons";
import type { CarImageRow } from "@/lib/supabase/types";

export default function VehicleGallery({
  images,
  title,
}: {
  images: CarImageRow[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const count = images.length;

  function next() {
    setActiveIndex((i) => (count ? (i + 1) % count : 0));
  }

  function prev() {
    setActiveIndex((i) => (count ? (i - 1 + count) % count : 0));
  }

  useEffect(() => {
    if (count < 2) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <div>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-line bg-surface-2">
        {count > 0 ? (
          <Image
            src={images[activeIndex].url}
            alt={`${title} — ${activeIndex + 1}/${count}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 62vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ash">
            —
          </div>
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/70 text-on-ink transition-colors hover:bg-ink"
            >
              <ArrowRightIcon className="h-4 w-4 rotate-180" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/70 text-on-ink transition-colors hover:bg-ink"
            >
              <ArrowRightIcon className="h-4 w-4" />
            </button>
            <span
              aria-live="polite"
              className="absolute bottom-3 right-3 rounded-full bg-ink/70 px-3 py-1 font-num text-xs tabular-nums text-on-ink"
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
    </div>
  );
}
