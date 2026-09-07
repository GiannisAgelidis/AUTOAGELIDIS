"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  VEHICLE_TYPES,
  CATEGORIES,
  TRUCK_CATEGORIES,
  FUEL_TYPES,
  TRANSMISSIONS,
} from "@/lib/enums";

const inputClass =
  "w-full border border-line bg-surface px-3 py-2 text-sm text-ink transition-colors focus:border-ink focus:outline-none";
const labelClass =
  "mb-1 block font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ash";

export default function CarFilters({
  availableMakes,
}: {
  availableMakes: string[];
}) {
  const t = useTranslations("cars.filters");
  const tEnums = useTranslations("enums");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const vehicleType = searchParams.get("vehicleType") ?? "";
  const category = searchParams.get("category") ?? "";
  const availableCategories = CATEGORIES.filter((c) =>
    vehicleType === "truck"
      ? TRUCK_CATEGORIES.includes(c)
      : vehicleType === "car"
        ? !TRUCK_CATEGORIES.includes(c)
        : true,
  );

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return (
    <div className="mb-8 border border-line bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink">
          {t("title")}
        </h2>
        <button
          type="button"
          onClick={() => router.push(pathname, { scroll: false })}
          className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash underline underline-offset-4 transition-colors hover:text-ink"
        >
          {t("reset")}
        </button>
      </div>

      {/* Segmented control — vehicle type */}
      <div className="mb-4 inline-flex border border-line">
        {["", ...VEHICLE_TYPES].map((v, i) => (
          <button
            key={v || "all"}
            type="button"
            onClick={() => setParam("vehicleType", v)}
            className={`px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${
              i > 0 ? "border-l border-line" : ""
            } ${
              vehicleType === v
                ? "bg-ink text-on-ink"
                : "bg-surface text-ash hover:text-ink"
            }`}
          >
            {v ? tEnums(`vehicleType.${v}`) : t("allVehicleTypes")}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <div>
          <label className={labelClass}>{t("category")}</label>
          <select
            className={inputClass}
            value={category}
            onChange={(e) => setParam("category", e.target.value)}
          >
            <option value="">{t("allCategories")}</option>
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                {tEnums(`category.${c}`)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>{t("make")}</label>
          <select
            className={inputClass}
            value={searchParams.get("make") ?? ""}
            onChange={(e) => setParam("make", e.target.value)}
          >
            <option value="">{t("allMakes")}</option>
            {availableMakes.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>{t("priceMin")}</label>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={searchParams.get("priceMin") ?? ""}
            onChange={(e) => setParam("priceMin", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>{t("priceMax")}</label>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={searchParams.get("priceMax") ?? ""}
            onChange={(e) => setParam("priceMax", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>{t("yearMin")}</label>
          <input
            type="number"
            min={1900}
            className={inputClass}
            value={searchParams.get("yearMin") ?? ""}
            onChange={(e) => setParam("yearMin", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>{t("yearMax")}</label>
          <input
            type="number"
            min={1900}
            className={inputClass}
            value={searchParams.get("yearMax") ?? ""}
            onChange={(e) => setParam("yearMax", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>{t("mileageMin")}</label>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={searchParams.get("mileageMin") ?? ""}
            onChange={(e) => setParam("mileageMin", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>{t("mileageMax")}</label>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={searchParams.get("mileageMax") ?? ""}
            onChange={(e) => setParam("mileageMax", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>{t("fuelType")}</label>
          <select
            className={inputClass}
            value={searchParams.get("fuelType") ?? ""}
            onChange={(e) => setParam("fuelType", e.target.value)}
          >
            <option value="">{t("allFuelTypes")}</option>
            {FUEL_TYPES.map((f) => (
              <option key={f} value={f}>
                {tEnums(`fuelType.${f}`)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>{t("transmission")}</label>
          <select
            className={inputClass}
            value={searchParams.get("transmission") ?? ""}
            onChange={(e) => setParam("transmission", e.target.value)}
          >
            <option value="">{t("allTransmissions")}</option>
            {TRANSMISSIONS.map((tr) => (
              <option key={tr} value={tr}>
                {tEnums(`transmission.${tr}`)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
