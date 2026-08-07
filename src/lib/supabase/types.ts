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

// Keep every type in this file a `type` alias, not an `interface` — with the
// installed @supabase/supabase-js version, referencing an `interface` as a
// table's Row/Insert/Update breaks the client's generic inference and every
// .insert()/.update() call falls back to a `never` parameter type.
export type CarRow = {
  id: string;
  vehicle_type: VehicleType;
  make: string;
  model: string;
  trim_en: string | null;
  trim_gr: string | null;
  price: number;
  condition: Condition;
  category: Category;
  year: number;
  month: number | null;
  mileage_km: number;
  fuel_type: FuelType;
  engine_cc: number | null;
  horsepower: number | null;
  transmission: Transmission;
  color: Color | null;
  color_metallic: boolean;
  upholstery: Upholstery | null;
  plate_status: PlateStatus;
  drive_type: DriveType | null;
  airbags: number | null;
  doors: number | null;
  seats: number | null;
  description_en: string | null;
  description_gr: string | null;
  features: Feature[];
  created_at: string;
  updated_at: string;
};

export type CarImageRow = {
  id: string;
  car_id: string;
  imagekit_file_id: string;
  url: string;
  position: number;
  created_at: string;
};

export type CarWithImages = CarRow & {
  car_images: CarImageRow[];
};

export type Database = {
  public: {
    Tables: {
      cars: {
        Row: CarRow;
        Insert: Omit<CarRow, "id" | "created_at" | "updated_at"> &
          Partial<Pick<CarRow, "id">>;
        Update: Partial<Omit<CarRow, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      car_images: {
        Row: CarImageRow;
        Insert: Omit<CarImageRow, "id" | "created_at"> &
          Partial<Pick<CarImageRow, "id">>;
        Update: Partial<Omit<CarImageRow, "id" | "created_at">>;
        Relationships: [
          {
            foreignKeyName: "car_images_car_id_fkey";
            columns: ["car_id"];
            isOneToOne: false;
            referencedRelation: "cars";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
