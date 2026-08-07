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
  "w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900";
const labelClass = "mb-1 block text-xs font-medium text-zinc-500";

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
    <div className="mb-8 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">{t("title")}</h2>
        <button
          type="button"
          onClick={() => router.push(pathname, { scroll: false })}
          className="text-xs text-zinc-500 underline hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          {t("reset")}
        </button>
      </div>

      <div className="mb-3 flex gap-2">
        {["", ...VEHICLE_TYPES].map((v) => (
          <button
            key={v || "all"}
            type="button"
            onClick={() => setParam("vehicleType", v)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              vehicleType === v
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                : "border border-zinc-300 dark:border-zinc-700"
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
