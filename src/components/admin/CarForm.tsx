"use client";

import { useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  VEHICLE_TYPES,
  CONDITIONS,
  CATEGORIES,
  TRUCK_CATEGORIES,
  FUEL_TYPES,
  TRANSMISSIONS,
  DRIVE_TYPES,
  COLORS,
  UPHOLSTERIES,
  PLATE_STATUSES,
  FEATURES,
  type VehicleType,
  type Condition,
  type Category,
  type FuelType,
  type Transmission,
  type DriveType,
  type Color,
  type Upholstery,
  type PlateStatus,
  type Feature,
} from "@/lib/enums";
import { uploadCarImage } from "@/lib/imagekit/upload";
import {
  createCar,
  updateCar,
  removeUploadedImage,
} from "@/app/[locale]/admin/cars/actions";
import type { CarWithImages } from "@/lib/supabase/types";

interface ImageItem {
  key: string;
  file?: File;
  previewUrl: string;
  status: "uploading" | "done" | "error";
  progress: number;
  fileId?: string;
  url?: string;
  preexisting?: boolean;
}

const inputClass =
  "w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900";
const labelClass = "mb-1 block text-sm font-medium";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
      <legend className="px-2 text-sm font-semibold">{title}</legend>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </fieldset>
  );
}

export default function CarForm({
  initialCar,
}: {
  initialCar?: CarWithImages;
}) {
  const t = useTranslations("admin.form");
  const tFields = useTranslations("carDetail.fields");
  const tEnums = useTranslations("enums");
  const router = useRouter();
  const isEditing = !!initialCar;

  const [carId] = useState(() => initialCar?.id ?? crypto.randomUUID());
  const [vehicleType, setVehicleType] = useState<VehicleType>(
    initialCar?.vehicle_type ?? "car",
  );
  const [make, setMake] = useState(initialCar?.make ?? "");
  const [model, setModel] = useState(initialCar?.model ?? "");
  const [trimEn, setTrimEn] = useState(initialCar?.trim_en ?? "");
  const [trimGr, setTrimGr] = useState(initialCar?.trim_gr ?? "");
  const [price, setPrice] = useState(initialCar?.price?.toString() ?? "");
  const [condition, setCondition] = useState<Condition>(
    initialCar?.condition ?? "used",
  );
  const [category, setCategory] = useState<Category>(
    initialCar?.category ?? "hatchback",
  );
  const [year, setYear] = useState(initialCar?.year?.toString() ?? "");
  const [month, setMonth] = useState(initialCar?.month?.toString() ?? "");
  const [mileageKm, setMileageKm] = useState(
    initialCar?.mileage_km?.toString() ?? "",
  );
  const [fuelType, setFuelType] = useState<FuelType>(
    initialCar?.fuel_type ?? "petrol",
  );
  const [engineCc, setEngineCc] = useState(
    initialCar?.engine_cc?.toString() ?? "",
  );
  const [horsepower, setHorsepower] = useState(
    initialCar?.horsepower?.toString() ?? "",
  );
  const [transmission, setTransmission] = useState<Transmission>(
    initialCar?.transmission ?? "manual",
  );
  const [color, setColor] = useState<Color | "">(initialCar?.color ?? "");
  const [colorMetallic, setColorMetallic] = useState(
    initialCar?.color_metallic ?? false,
  );
  const [upholstery, setUpholstery] = useState<Upholstery | "">(
    initialCar?.upholstery ?? "",
  );
  const [plateStatus, setPlateStatus] = useState<PlateStatus>(
    initialCar?.plate_status ?? "unknown",
  );
  const [driveType, setDriveType] = useState<DriveType | "">(
    initialCar?.drive_type ?? "",
  );
  const [airbags, setAirbags] = useState(initialCar?.airbags?.toString() ?? "");
  const [doors, setDoors] = useState(initialCar?.doors?.toString() ?? "");
  const [seats, setSeats] = useState(initialCar?.seats?.toString() ?? "");
  const [descriptionEn, setDescriptionEn] = useState(
    initialCar?.description_en ?? "",
  );
  const [descriptionGr, setDescriptionGr] = useState(
    initialCar?.description_gr ?? "",
  );
  const [features, setFeatures] = useState<Set<Feature>>(
    () => new Set(initialCar?.features ?? []),
  );
  const [images, setImages] = useState<ImageItem[]>(() =>
    (initialCar?.car_images ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((img) => ({
        key: crypto.randomUUID(),
        previewUrl: img.url,
        status: "done" as const,
        progress: 100,
        fileId: img.imagekit_file_id,
        url: img.url,
        preexisting: true,
      })),
  );
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableCategories = CATEGORIES.filter((c) =>
    vehicleType === "truck"
      ? TRUCK_CATEGORIES.includes(c)
      : !TRUCK_CATEGORIES.includes(c),
  );

  function toggleFeature(feature: Feature) {
    setFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(feature)) next.delete(feature);
      else next.add(feature);
      return next;
    });
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const files = Array.from(fileList);

    const newItems: ImageItem[] = files.map((file) => ({
      key: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      status: "uploading",
      progress: 0,
    }));

    setImages((prev) => [...prev, ...newItems]);

    newItems.forEach((item) => {
      uploadCarImage(item.file!, carId, (percent) => {
        setImages((prev) =>
          prev.map((img) =>
            img.key === item.key ? { ...img, progress: percent } : img,
          ),
        );
      })
        .then(({ fileId, url }) => {
          setImages((prev) =>
            prev.map((img) =>
              img.key === item.key
                ? { ...img, status: "done", fileId, url, progress: 100 }
                : img,
            ),
          );
        })
        .catch(() => {
          setImages((prev) =>
            prev.map((img) =>
              img.key === item.key ? { ...img, status: "error" } : img,
            ),
          );
        });
    });
  }

  function removeImage(key: string) {
    setImages((prev) => {
      const target = prev.find((img) => img.key === key);
      // Pre-existing (already-saved) photos are only detached from local
      // state here; updateCar() reconciles the DB + ImageKit deletion once
      // the edit is actually submitted, so a cancelled edit doesn't lose them.
      if (target?.fileId && !target.preexisting) {
        removeUploadedImage(target.fileId).catch(() => {});
      }
      return prev.filter((img) => img.key !== key);
    });
  }

  function handleDrop(index: number) {
    if (dragIndex === null || dragIndex === index) return;
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (images.some((img) => img.status === "uploading")) {
      setError(t("uploading", { percent: 0 }));
      return;
    }

    setSubmitting(true);

    const action = isEditing ? updateCar : createCar;
    const result = await action({
      id: carId,
      vehicleType,
      make,
      model,
      trimEn: trimEn || null,
      trimGr: trimGr || null,
      price: Number(price),
      condition,
      category,
      year: Number(year),
      month: month ? Number(month) : null,
      mileageKm: Number(mileageKm || 0),
      fuelType,
      engineCc: engineCc ? Number(engineCc) : null,
      horsepower: horsepower ? Number(horsepower) : null,
      transmission,
      color: color || null,
      colorMetallic,
      upholstery: upholstery || null,
      plateStatus,
      driveType: driveType || null,
      airbags: airbags ? Number(airbags) : null,
      doors: doors ? Number(doors) : null,
      seats: seats ? Number(seats) : null,
      descriptionEn: descriptionEn || null,
      descriptionGr: descriptionGr || null,
      features: Array.from(features),
      images: images
        .filter((img) => img.status === "done" && img.fileId && img.url)
        .map((img, index) => ({
          fileId: img.fileId!,
          url: img.url!,
          position: index,
        })),
    });

    setSubmitting(false);

    if (result.error) {
      setError(t("createError"));
      return;
    }

    router.push("/admin");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Section title={t("sectionBasic")}>
        <Field label={t("vehicleType")}>
          <select
            className={inputClass}
            value={vehicleType}
            onChange={(e) => {
              const nextType = e.target.value as VehicleType;
              setVehicleType(nextType);
              const validCategories = CATEGORIES.filter((c) =>
                nextType === "truck"
                  ? TRUCK_CATEGORIES.includes(c)
                  : !TRUCK_CATEGORIES.includes(c),
              );
              if (!validCategories.includes(category)) {
                setCategory(validCategories[0]);
              }
            }}
          >
            {VEHICLE_TYPES.map((v) => (
              <option key={v} value={v}>
                {tEnums(`vehicleType.${v}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t("make")}>
          <input
            required
            className={inputClass}
            value={make}
            onChange={(e) => setMake(e.target.value)}
          />
        </Field>
        <Field label={t("model")}>
          <input
            required
            className={inputClass}
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </Field>
        <Field label={t("trimEn")}>
          <input
            className={inputClass}
            value={trimEn}
            onChange={(e) => setTrimEn(e.target.value)}
          />
        </Field>
        <Field label={t("trimGr")}>
          <input
            className={inputClass}
            value={trimGr}
            onChange={(e) => setTrimGr(e.target.value)}
          />
        </Field>
        <Field label={tFields("price")}>
          <input
            required
            type="number"
            min={0}
            step="0.01"
            className={inputClass}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Field>
        <Field label={tFields("condition")}>
          <select
            className={inputClass}
            value={condition}
            onChange={(e) => setCondition(e.target.value as Condition)}
          >
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {tEnums(`condition.${c}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={tFields("category")}>
          <select
            className={inputClass}
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                {tEnums(`category.${c}`)}
              </option>
            ))}
          </select>
        </Field>
      </Section>

      <Section title={t("sectionSpecs")}>
        <Field label={t("year")}>
          <input
            required
            type="number"
            min={1900}
            max={2100}
            className={inputClass}
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </Field>
        <Field label={t("month")}>
          <input
            type="number"
            min={1}
            max={12}
            className={inputClass}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </Field>
        <Field label={tFields("mileage")}>
          <input
            type="text"
            inputMode="numeric"
            className={inputClass}
            value={mileageKm ? Number(mileageKm).toLocaleString("el-GR") : ""}
            onChange={(e) => {
              const digitsOnly = e.target.value.replace(/\D/g, "");
              const clamped = digitsOnly
                ? String(Math.min(Number(digitsOnly), 500000))
                : "";
              setMileageKm(clamped);
            }}
          />
        </Field>
        <Field label={tFields("fuelType")}>
          <select
            className={inputClass}
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value as FuelType)}
          >
            {FUEL_TYPES.map((f) => (
              <option key={f} value={f}>
                {tEnums(`fuelType.${f}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={tFields("engineCc")}>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={engineCc}
            onChange={(e) => setEngineCc(e.target.value)}
          />
        </Field>
        <Field label={tFields("horsepower")}>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={horsepower}
            onChange={(e) => setHorsepower(e.target.value)}
          />
        </Field>
        <Field label={tFields("transmission")}>
          <select
            className={inputClass}
            value={transmission}
            onChange={(e) => setTransmission(e.target.value as Transmission)}
          >
            {TRANSMISSIONS.map((tr) => (
              <option key={tr} value={tr}>
                {tEnums(`transmission.${tr}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={tFields("driveType")}>
          <select
            className={inputClass}
            value={driveType}
            onChange={(e) => setDriveType(e.target.value as DriveType | "")}
          >
            <option value="">{t("select")}</option>
            {DRIVE_TYPES.map((d) => (
              <option key={d} value={d}>
                {tEnums(`driveType.${d}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={tFields("airbags")}>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={airbags}
            onChange={(e) => setAirbags(e.target.value)}
          />
        </Field>
        <Field label={tFields("doors")}>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={doors}
            onChange={(e) => setDoors(e.target.value)}
          />
        </Field>
        <Field label={tFields("seats")}>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
          />
        </Field>
      </Section>

      <Section title={t("sectionAppearance")}>
        <Field label={tFields("color")}>
          <select
            className={inputClass}
            value={color}
            onChange={(e) => setColor(e.target.value as Color | "")}
          >
            <option value="">{t("select")}</option>
            {COLORS.map((c) => (
              <option key={c} value={c}>
                {tEnums(`color.${c}`)}
              </option>
            ))}
          </select>
        </Field>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={colorMetallic}
              onChange={(e) => setColorMetallic(e.target.checked)}
            />
            {t("colorMetallic")}
          </label>
        </div>
        <Field label={tFields("upholstery")}>
          <select
            className={inputClass}
            value={upholstery}
            onChange={(e) => setUpholstery(e.target.value as Upholstery | "")}
          >
            <option value="">{t("select")}</option>
            {UPHOLSTERIES.map((u) => (
              <option key={u} value={u}>
                {tEnums(`upholstery.${u}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={tFields("plateStatus")}>
          <select
            className={inputClass}
            value={plateStatus}
            onChange={(e) => setPlateStatus(e.target.value as PlateStatus)}
          >
            {PLATE_STATUSES.map((p) => (
              <option key={p} value={p}>
                {tEnums(`plateStatus.${p}`)}
              </option>
            ))}
          </select>
        </Field>
      </Section>

      <Section title={t("sectionDescription")}>
        <div className="sm:col-span-2 lg:col-span-3">
          <label className={labelClass}>{t("descriptionEn")}</label>
          <textarea
            rows={4}
            className={inputClass}
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <label className={labelClass}>{t("descriptionGr")}</label>
          <textarea
            rows={4}
            className={inputClass}
            value={descriptionGr}
            onChange={(e) => setDescriptionGr(e.target.value)}
          />
        </div>
      </Section>

      <fieldset className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
        <legend className="px-2 text-sm font-semibold">
          {t("sectionFeatures")}
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <label key={feature} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={features.has(feature)}
                onChange={() => toggleFeature(feature)}
              />
              {tEnums(`features.${feature}`)}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
        <legend className="px-2 text-sm font-semibold">
          {t("sectionPhotos")}
        </legend>
        <p className="mb-3 text-xs text-zinc-500">{t("dragToReorder")}</p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleFiles(e.target.files)
          }
          className="mb-4 text-sm"
        />
        <div className="flex flex-wrap gap-3">
          {images.map((img, index) => (
            <div
              key={img.key}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e: DragEvent) => e.preventDefault()}
              onDrop={() => handleDrop(index)}
              className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-700"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.previewUrl}
                alt=""
                className="h-full w-full object-cover"
              />
              {index === 0 && (
                <span className="absolute left-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white">
                  ★
                </span>
              )}
              {img.status === "uploading" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs text-white">
                  {img.progress}%
                </div>
              )}
              {img.status === "error" && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-900/70 text-xs text-white">
                  !
                </div>
              )}
              <button
                type="button"
                onClick={() => removeImage(img.key)}
                className="absolute right-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white"
              >
                {t("removePhoto")}
              </button>
            </div>
          ))}
        </div>
      </fieldset>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {t("save")}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="rounded-md border border-zinc-300 px-6 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}
