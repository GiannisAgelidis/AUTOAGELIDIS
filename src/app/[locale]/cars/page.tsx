import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import CarFilters from "@/components/cars/CarFilters";
import CarCard from "@/components/cars/CarCard";
import CarDetailModal from "@/components/cars/CarDetailModal";
import type { CarWithImages } from "@/lib/supabase/types";

type SearchParams = { [key: string]: string | undefined };

function filterCars(cars: CarWithImages[], params: SearchParams) {
  return cars.filter((car) => {
    if (params.vehicleType && car.vehicle_type !== params.vehicleType)
      return false;
    if (params.category && car.category !== params.category) return false;
    if (params.make && car.make !== params.make) return false;
    if (params.fuelType && car.fuel_type !== params.fuelType) return false;
    if (params.transmission && car.transmission !== params.transmission)
      return false;
    if (params.priceMin && car.price < Number(params.priceMin)) return false;
    if (params.priceMax && car.price > Number(params.priceMax)) return false;
    if (params.yearMin && car.year < Number(params.yearMin)) return false;
    if (params.yearMax && car.year > Number(params.yearMax)) return false;
    if (params.mileageMin && car.mileage_km < Number(params.mileageMin))
      return false;
    if (params.mileageMax && car.mileage_km > Number(params.mileageMax))
      return false;
    return true;
  });
}

export default async function CarsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("cars");

  const supabase = await createClient();
  const { data: cars } = await supabase
    .from("cars")
    .select("*, car_images(*)")
    .order("created_at", { ascending: false });

  const allCars = cars ?? [];
  const availableMakes = Array.from(
    new Set(allCars.map((car) => car.make)),
  ).sort();
  const filteredCars = filterCars(allCars, resolvedSearchParams);
  const selectedCarId = resolvedSearchParams.car;
  const selectedCar = selectedCarId
    ? allCars.find((car) => car.id === selectedCarId)
    : undefined;

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 text-ink">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">
          {t("pageTitle")}
        </h1>

        <CarFilters availableMakes={availableMakes} />

        <p className="mb-4 text-sm text-ink/60">
          {t("resultsCount", { count: filteredCars.length })}
        </p>

        {filteredCars.length === 0 ? (
          <p className="text-sm text-ink/60">{t("noResults")}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}

        {selectedCar && <CarDetailModal car={selectedCar} />}
      </main>
      <Footer />
    </>
  );
}
