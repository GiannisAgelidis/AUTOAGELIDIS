import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Tag from "@/components/site/Tag";
import VehicleGallery from "@/components/cars/VehicleGallery";
import AskAboutVehicle from "@/components/cars/AskAboutVehicle";
import { ArrowRightIcon, CarIcon } from "@/components/site/icons";
import type { CarWithImages } from "@/lib/supabase/types";

const ADDRESS = "Εθνάρχου Μακαρίου 10, Κομοτηνή 69100";
const LANDLINE_DISPLAY = "25310 29470";
const LANDLINE_HREF = "+302531029470";
const MOBILE_DISPLAY = "693 223 2929";
const MOBILE_HREF = "+306932232929";
const MAP_QUERY = encodeURIComponent(ADDRESS);

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

async function getCar(id: string): Promise<CarWithImages | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cars")
    .select("*, car_images(*)")
    .eq("id", id)
    .single();
  return data ?? null;
}

function vehicleTitle(car: CarWithImages, locale: string) {
  return locale === "el"
    ? [car.make, car.model, car.trim_gr].filter(Boolean).join(" ")
    : [car.make, car.model, car.trim_en].filter(Boolean).join(" ");
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const car = await getCar(id);
  if (!car) return { title: "Auto Agelidis" };

  const title = vehicleTitle(car, locale);
  const price = car.price ? `${Number(car.price).toLocaleString()} €` : "";
  return {
    title: [title, price].filter(Boolean).join(" — ") + " | Auto Agelidis",
  };
}

function SpecRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex justify-between gap-4 border-b border-line py-3 text-sm last:border-none">
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ash">
        {label}
      </span>
      <span className="text-right font-num font-medium text-ink">{value}</span>
    </div>
  );
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const car = await getCar(id);
  if (!car) notFound();

  const t = await getTranslations("carDetail");
  const tFields = await getTranslations("carDetail.fields");
  const tEnums = await getTranslations("enums");
  const tCard = await getTranslations("cars.card");
  const tLocation = await getTranslations("location");

  const title = vehicleTitle(car, locale);
  const description = locale === "el" ? car.description_gr : car.description_en;
  const images = [...(car.car_images ?? [])].sort(
    (a, b) => a.position - b.position,
  );
  const priceLabel = car.price
    ? `${Number(car.price).toLocaleString()} €`
    : tCard("priceOnRequest");

  return (
    <>
      <Header />
      <main className="flex-1 bg-paper text-ink">
        <div className="mx-auto w-full max-w-6xl px-6 py-10">
          <Link
            href="/vehicles"
            className="group mb-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ash transition-colors hover:text-ink"
          >
            <ArrowRightIcon className="h-3.5 w-3.5 rotate-180 transition-transform group-hover:-translate-x-1" />
            {t("backToVehicles")}
          </Link>

          <div className="vehicle-grid">
            <div className="vg-gallery">
              <VehicleGallery images={images} title={title} />
            </div>

            <aside className="vg-sidebar">
              <div className="rounded-xl border border-line bg-surface p-6">
                <p className="text-lg font-medium leading-tight text-ink">
                  {title}
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-ash">
                  {tEnums(`condition.${car.condition}`)} ·{" "}
                  {car.year}
                  {car.month ? `/${car.month}` : ""}
                </p>

                <div className="mt-5 inline-flex items-center rounded-full border border-mint-line bg-mint px-4 py-2 font-num text-2xl font-semibold tabular-nums text-mint-ink">
                  {priceLabel}
                </div>

                <div className="mt-6 flex flex-col gap-2.5">
                  <a
                    href={`tel:${LANDLINE_HREF}`}
                    className="flex items-center justify-center gap-2 bg-ink px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-on-ink transition-colors hover:bg-ink-2"
                  >
                    {t("call")} — {LANDLINE_DISPLAY}
                  </a>
                  <a
                    href={`tel:${MOBILE_HREF}`}
                    className="flex items-center justify-center gap-2 border border-line px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink"
                  >
                    {MOBILE_DISPLAY}
                  </a>
                  {car.cargr_url && (
                    <a
                      href={car.cargr_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 border border-line px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink"
                    >
                      <CarIcon className="h-4 w-4 shrink-0" />
                      {t("viewOnCargr")}
                    </a>
                  )}
                  <AskAboutVehicle />
                </div>

                <div className="mt-6 border-t border-line pt-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash">
                    {tLocation("addressLabel")}
                  </p>
                  <p className="mt-1 text-sm text-ink">{ADDRESS}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-2 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-ink transition-colors hover:text-ash"
                  >
                    {tLocation("directions")}
                    <ArrowRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </aside>

            <div className="vg-details">
              <div className="border-b border-line pb-5">
                <Tag>{tEnums(`category.${car.category}`)}</Tag>
                <h1 className="mt-3 text-2xl font-normal tracking-[-0.02em] sm:text-3xl">
                  {title}
                </h1>
              </div>

              <section className="border-b border-line py-6">
                <h2 className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ash">
                  {t("specs")}
                </h2>
                <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
                  <SpecRow
                    label={tFields("condition")}
                    value={tEnums(`condition.${car.condition}`)}
                  />
                  <SpecRow
                    label={tFields("category")}
                    value={tEnums(`category.${car.category}`)}
                  />
                  <SpecRow
                    label={tFields("yearMonth")}
                    value={car.month ? `${car.month}/${car.year}` : car.year}
                  />
                  <SpecRow
                    label={tFields("mileage")}
                    value={`${car.mileage_km.toLocaleString()} km`}
                  />
                  <SpecRow
                    label={tFields("fuelType")}
                    value={tEnums(`fuelType.${car.fuel_type}`)}
                  />
                  <SpecRow
                    label={tFields("engineCc")}
                    value={
                      car.engine_cc ? `${car.engine_cc.toLocaleString()} cc` : null
                    }
                  />
                  <SpecRow
                    label={tFields("horsepower")}
                    value={car.horsepower ? `${car.horsepower} hp` : null}
                  />
                  <SpecRow
                    label={tFields("transmission")}
                    value={tEnums(`transmission.${car.transmission}`)}
                  />
                  <SpecRow
                    label={tFields("driveType")}
                    value={
                      car.drive_type ? tEnums(`driveType.${car.drive_type}`) : null
                    }
                  />
                  <SpecRow
                    label={tFields("color")}
                    value={car.color ? tEnums(`color.${car.color}`) : null}
                  />
                  <SpecRow
                    label={tFields("upholstery")}
                    value={
                      car.upholstery
                        ? tEnums(`upholstery.${car.upholstery}`)
                        : null
                    }
                  />
                  <SpecRow
                    label={tFields("plateStatus")}
                    value={tEnums(`plateStatus.${car.plate_status}`)}
                  />
                  <SpecRow label={tFields("airbags")} value={car.airbags} />
                  <SpecRow label={tFields("doors")} value={car.doors} />
                  <SpecRow label={tFields("seats")} value={car.seats} />
                </div>
              </section>

              {car.features.length > 0 && (
                <section className="border-b border-line py-6">
                  <h2 className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ash">
                    {t("features")}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {car.features.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-full border border-line bg-surface-2 px-3 py-1 font-mono text-[11px] text-ink"
                      >
                        {tEnums(`features.${feature}`)}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {description && (
                <section className="py-6">
                  <h2 className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ash">
                    {t("description")}
                  </h2>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-graphite">
                    {description}
                  </p>
                </section>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
