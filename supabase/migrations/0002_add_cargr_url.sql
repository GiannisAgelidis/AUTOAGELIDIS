-- Auto Agelidis: optional car.gr listing link per vehicle
--
-- Admins can paste the matching car.gr listing URL when they add/edit a
-- vehicle; the public vehicle detail page shows it (when present) next to
-- the price. Nullable — most listings won't have one. No index: never
-- filtered or sorted on, only read back by id alongside the rest of the row.

alter table cars
  add column if not exists cargr_url text;

comment on column cars.cargr_url is
  'Optional car.gr listing URL for this vehicle, set by admins.';
