export const VEHICLE_TYPES = ["car", "truck"] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

export const CONDITIONS = ["new", "used"] as const;
export type Condition = (typeof CONDITIONS)[number];

export const CATEGORIES = [
  "hatchback",
  "sedan",
  "wagon",
  "suv",
  "coupe",
  "cabrio",
  "van",
  "pickup",
  "truck_3_5",
  "truck_7_5",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const TRUCK_CATEGORIES: Category[] = ["truck_3_5", "truck_7_5"];

export const FUEL_TYPES = [
  "petrol",
  "diesel",
  "hybrid",
  "electric",
  "lpg",
  "cng",
] as const;
export type FuelType = (typeof FUEL_TYPES)[number];

export const TRANSMISSIONS = ["manual", "automatic", "semi_automatic"] as const;
export type Transmission = (typeof TRANSMISSIONS)[number];

export const DRIVE_TYPES = ["fwd", "rwd", "awd"] as const;
export type DriveType = (typeof DRIVE_TYPES)[number];

export const COLORS = [
  "white",
  "black",
  "silver",
  "grey",
  "blue",
  "red",
  "green",
  "yellow",
  "orange",
  "brown",
  "beige",
  "gold",
  "purple",
  "other",
] as const;
export type Color = (typeof COLORS)[number];

export const UPHOLSTERIES = ["fabric", "leather", "part_leather"] as const;
export type Upholstery = (typeof UPHOLSTERIES)[number];

export const PLATE_STATUSES = [
  "with_plates",
  "without_plates",
  "unknown",
] as const;
export type PlateStatus = (typeof PLATE_STATUSES)[number];

export const FEATURES = [
  "abs",
  "airbags",
  "ac",
  "alloy_wheels",
  "bluetooth",
  "central_locking",
  "cruise_control",
  "electric_mirrors",
  "electric_windows",
  "immobilizer",
  "navigation",
  "parking_sensors",
  "power_steering",
  "rear_camera",
  "service_book",
  "sunroof",
  "turbo",
  "leather_seats",
  "no_accident",
  "trade_in_accepted",
] as const;
export type Feature = (typeof FEATURES)[number];
