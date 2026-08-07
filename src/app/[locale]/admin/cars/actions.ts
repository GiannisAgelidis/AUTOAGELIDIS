"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteImageKitFile, deleteImageKitFiles } from "@/lib/imagekit/admin";
import type {
  Category,
  Color,
  Condition,
  DriveType,
  Feature,
  FuelType,
  PlateStatus,
  Transmission,
  Upholstery,
  VehicleType,
} from "@/lib/enums";

export interface CarImageInput {
  fileId: string;
  url: string;
  position: number;
}

export interface CarFormInput {
  id: string;
  vehicleType: VehicleType;
  make: string;
  model: string;
  trimEn: string | null;
  trimGr: string | null;
  price: number;
  condition: Condition;
  category: Category;
  year: number;
  month: number | null;
  mileageKm: number;
  fuelType: FuelType;
  engineCc: number | null;
  horsepower: number | null;
  transmission: Transmission;
  color: Color | null;
  colorMetallic: boolean;
  upholstery: Upholstery | null;
  plateStatus: PlateStatus;
  driveType: DriveType | null;
  airbags: number | null;
  doors: number | null;
  seats: number | null;
  descriptionEn: string | null;
  descriptionGr: string | null;
  features: Feature[];
  images: CarImageInput[];
}

export interface CarActionResult {
  error?: string;
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function createCar(
  input: CarFormInput,
): Promise<CarActionResult> {
  const user = await requireAdmin();
  if (!user) {
    return { error: "unauthorized" };
  }

  const admin = createAdminClient();

  const { error: carError } = await admin.from("cars").insert({
    id: input.id,
    vehicle_type: input.vehicleType,
    make: input.make,
    model: input.model,
    trim_en: input.trimEn,
    trim_gr: input.trimGr,
    price: input.price,
    condition: input.condition,
    category: input.category,
    year: input.year,
    month: input.month,
    mileage_km: input.mileageKm,
    fuel_type: input.fuelType,
    engine_cc: input.engineCc,
    horsepower: input.horsepower,
    transmission: input.transmission,
    color: input.color,
    color_metallic: input.colorMetallic,
    upholstery: input.upholstery,
    plate_status: input.plateStatus,
    drive_type: input.driveType,
    airbags: input.airbags,
    doors: input.doors,
    seats: input.seats,
    description_en: input.descriptionEn,
    description_gr: input.descriptionGr,
    features: input.features,
  });

  if (carError) {
    return { error: carError.message };
  }

  if (input.images.length > 0) {
    const { error: imagesError } = await admin.from("car_images").insert(
      input.images.map((image) => ({
        car_id: input.id,
        imagekit_file_id: image.fileId,
        url: image.url,
        position: image.position,
      })),
    );

    if (imagesError) {
      return { error: imagesError.message };
    }
  }

  revalidatePath("/admin");
  return {};
}

export async function updateCar(
  input: CarFormInput,
): Promise<CarActionResult> {
  const user = await requireAdmin();
  if (!user) {
    return { error: "unauthorized" };
  }

  const admin = createAdminClient();

  const { error: carError } = await admin
    .from("cars")
    .update({
      vehicle_type: input.vehicleType,
      make: input.make,
      model: input.model,
      trim_en: input.trimEn,
      trim_gr: input.trimGr,
      price: input.price,
      condition: input.condition,
      category: input.category,
      year: input.year,
      month: input.month,
      mileage_km: input.mileageKm,
      fuel_type: input.fuelType,
      engine_cc: input.engineCc,
      horsepower: input.horsepower,
      transmission: input.transmission,
      color: input.color,
      color_metallic: input.colorMetallic,
      upholstery: input.upholstery,
      plate_status: input.plateStatus,
      drive_type: input.driveType,
      airbags: input.airbags,
      doors: input.doors,
      seats: input.seats,
      description_en: input.descriptionEn,
      description_gr: input.descriptionGr,
      features: input.features,
    })
    .eq("id", input.id);

  if (carError) {
    return { error: carError.message };
  }

  const { data: existingImages, error: fetchError } = await admin
    .from("car_images")
    .select("id, imagekit_file_id")
    .eq("car_id", input.id);

  if (fetchError) {
    return { error: fetchError.message };
  }

  const keptFileIds = new Set(input.images.map((img) => img.fileId));
  const removed = (existingImages ?? []).filter(
    (img) => !keptFileIds.has(img.imagekit_file_id),
  );

  if (removed.length > 0) {
    await deleteImageKitFiles(removed.map((img) => img.imagekit_file_id));
  }

  const { error: deleteAllError } = await admin
    .from("car_images")
    .delete()
    .eq("car_id", input.id);

  if (deleteAllError) {
    return { error: deleteAllError.message };
  }

  if (input.images.length > 0) {
    const { error: insertError } = await admin.from("car_images").insert(
      input.images.map((image) => ({
        car_id: input.id,
        imagekit_file_id: image.fileId,
        url: image.url,
        position: image.position,
      })),
    );

    if (insertError) {
      return { error: insertError.message };
    }
  }

  revalidatePath("/admin");
  return {};
}

export async function deleteCar(id: string): Promise<CarActionResult> {
  const user = await requireAdmin();
  if (!user) {
    return { error: "unauthorized" };
  }

  const admin = createAdminClient();

  const { data: images, error: fetchError } = await admin
    .from("car_images")
    .select("imagekit_file_id")
    .eq("car_id", id);

  if (fetchError) {
    return { error: fetchError.message };
  }

  if (images && images.length > 0) {
    await deleteImageKitFiles(images.map((img) => img.imagekit_file_id));
  }

  const { error: deleteError } = await admin.from("cars").delete().eq("id", id);

  if (deleteError) {
    return { error: deleteError.message };
  }

  revalidatePath("/admin");
  return {};
}

export async function removeUploadedImage(
  fileId: string,
): Promise<CarActionResult> {
  const user = await requireAdmin();
  if (!user) {
    return { error: "unauthorized" };
  }

  try {
    await deleteImageKitFile(fileId);
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "unknown_error" };
  }
}
