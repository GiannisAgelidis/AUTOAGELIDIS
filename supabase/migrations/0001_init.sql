-- Auto Agelidis: initial schema for vehicle inventory

create extension if not exists pgcrypto;

create table if not exists cars (
  id uuid primary key default gen_random_uuid(),

  vehicle_type text not null check (vehicle_type in ('car', 'truck')),
  make text not null,
  model text not null,
  trim_en text,
  trim_gr text,

  price numeric(10, 2) not null,
  condition text not null check (condition in ('new', 'used')),
  category text not null check (category in (
    'hatchback', 'sedan', 'wagon', 'suv', 'coupe', 'cabrio',
    'van', 'pickup', 'truck_3_5', 'truck_7_5'
  )),

  year smallint not null,
  month smallint check (month between 1 and 12),

  mileage_km integer not null default 0,
  fuel_type text not null check (fuel_type in (
    'petrol', 'diesel', 'hybrid', 'electric', 'lpg', 'cng'
  )),
  engine_cc integer,
  horsepower integer,
  transmission text not null check (transmission in (
    'manual', 'automatic', 'semi_automatic'
  )),

  color text check (color in (
    'white', 'black', 'silver', 'grey', 'blue', 'red', 'green',
    'yellow', 'orange', 'brown', 'beige', 'gold', 'purple', 'other'
  )),
  color_metallic boolean not null default false,
  upholstery text check (upholstery in ('fabric', 'leather', 'part_leather')),
  plate_status text not null default 'unknown' check (plate_status in (
    'with_plates', 'without_plates', 'unknown'
  )),
  drive_type text check (drive_type in ('fwd', 'rwd', 'awd')),

  airbags smallint,
  doors smallint,
  seats smallint,

  description_en text,
  description_gr text,

  features text[] not null default '{}',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cars_vehicle_type_idx on cars (vehicle_type);
create index if not exists cars_category_idx on cars (category);
create index if not exists cars_make_idx on cars (make);
create index if not exists cars_price_idx on cars (price);
create index if not exists cars_year_idx on cars (year);
create index if not exists cars_mileage_idx on cars (mileage_km);
create index if not exists cars_fuel_type_idx on cars (fuel_type);
create index if not exists cars_transmission_idx on cars (transmission);

create table if not exists car_images (
  id uuid primary key default gen_random_uuid(),
  car_id uuid not null references cars (id) on delete cascade,
  imagekit_file_id text not null,
  url text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists car_images_car_id_idx on car_images (car_id);
create unique index if not exists car_images_car_id_position_idx on car_images (car_id, position);

-- Keep updated_at current on every row change
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists cars_set_updated_at on cars;
create trigger cars_set_updated_at
  before update on cars
  for each row
  execute function set_updated_at();

-- RLS: public (anon) can read; all writes go through the server using the
-- service role key (admin routes are gated by Supabase Auth at the app layer),
-- so no anon insert/update/delete policies are defined.
alter table cars enable row level security;
alter table car_images enable row level security;

drop policy if exists "Public read access to cars" on cars;
create policy "Public read access to cars"
  on cars for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read access to car_images" on car_images;
create policy "Public read access to car_images"
  on car_images for select
  to anon, authenticated
  using (true);
