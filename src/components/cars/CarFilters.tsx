"use client";

import { useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
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
  "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink transition-colors focus:border-ink focus:outline-none";
const labelClass =
  "mb-1 block font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ash";

// Fixed dropdown steps for the range filters.
const PRICE_OPTIONS = Array.from({ length: 30 }, (_, i) => (i + 1) * 1000); // 1.000 – 30.000
const YEAR_OPTIONS = Array.from(
  { length: 2026 - 1999 + 1 },
  (_, i) => 2026 - i,
); // 2026 – 1999 (newest first)
const MILEAGE_OPTIONS = Array.from({ length: 50 }, (_, i) => (i + 1) * 10000); // 10.000 – 500.000

export default function CarFilters({
  availableMakes,
}: {
  availableMakes: string[];
}) {
  const t = useTranslations("cars.filters");
  const tEnums = useTranslations("enums");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const groupNum = (n: number) =>
    n.toLocaleString(locale === "el" ? "el-GR" : "en-US");

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

  const rangeSelect = (
    param: string,
    options: number[],
    format: (n: number) => string,
  ) => (
    <select
      className={inputClass}
      value={searchParams.get(param) ?? ""}
      onChange={(e) => setParam(param, e.target.value)}
    >
      <option value="">—</option>
      {options.map((n) => (
        <option key={n} value={n}>
          {format(n)}
        </option>
      ))}
    </select>
  );

  return (
    <div className="mb-8 rounded-xl border border-line bg-surface p-5 lg:mb-0 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink">
          {t("title")}
        </h2>
        <button
          type="button"
          onClick={() => router.push(pathname, { scroll: false })}
          className={`font-mono uppercase text-ash underline underline-offset-4 transition-colors hover:text-ink ${
            locale === "el"
              ? "text-[8.5px] tracking-[0.02em]"
              : "text-[10px] tracking-[0.14em]"
          }`}
        >
          {t("reset")}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-1">
        <div>
          <label className={labelClass}>{t("sort")}</label>
          <select
            className={inputClass}
            value={searchParams.get("sort") ?? "date_desc"}
            onChange={(e) => setParam("sort", e.target.value)}
          >
            <option value="date_desc">{t("sortDateDesc")}</option>
            <option value="date_asc">{t("sortDateAsc")}</option>
            <option value="price_asc">{t("sortPriceAsc")}</option>
            <option value="price_desc">{t("sortPriceDesc")}</option>
            <option value="mileage_asc">{t("sortMileageAsc")}</option>
            <option value="mileage_desc">{t("sortMileageDesc")}</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>{t("vehicleType")}</label>
          <select
            className={inputClass}
            value={vehicleType}
            onChange={(e) => setParam("vehicleType", e.target.value)}
          >
            <option value="">{t("allVehicleTypes")}</option>
            {VEHICLE_TYPES.map((v) => (
              <option key={v} value={v}>
                {tEnums(`vehicleType.${v}`)}
              </option>
            ))}
          </select>
        </div>

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
          {rangeSelect("priceMin", PRICE_OPTIONS, (n) => `${groupNum(n)} €`)}
        </div>
        <div>
          <label className={labelClass}>{t("priceMax")}</label>
          {rangeSelect("priceMax", PRICE_OPTIONS, (n) => `${groupNum(n)} €`)}
        </div>

        <div>
          <label className={labelClass}>{t("yearMin")}</label>
          {rangeSelect("yearMin", YEAR_OPTIONS, (n) => String(n))}
        </div>
        <div>
          <label className={labelClass}>{t("yearMax")}</label>
          {rangeSelect("yearMax", YEAR_OPTIONS, (n) => String(n))}
        </div>

        <div>
          <label className={labelClass}>{t("mileageMin")}</label>
          {rangeSelect("mileageMin", MILEAGE_OPTIONS, (n) => `${groupNum(n)} km`)}
        </div>
        <div>
          <label className={labelClass}>{t("mileageMax")}</label>
          {rangeSelect("mileageMax", MILEAGE_OPTIONS, (n) => `${groupNum(n)} km`)}
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
