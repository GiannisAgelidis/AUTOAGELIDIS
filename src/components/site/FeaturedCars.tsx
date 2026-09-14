import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import Tag from "./Tag";
import Reveal from "./Reveal";
import FeaturedCarousel from "./FeaturedCarousel";
import { ArrowRightIcon } from "./icons";

export default async function FeaturedCars() {
  const t = await getTranslations("featured");

  const supabase = await createClient();
  const { data: cars } = await supabase
    .from("cars")
    .select("*, car_images(*)")
    .order("created_at", { ascending: false })
    .limit(12);

  const featured = cars ?? [];

  return (
    <section className="bg-surface-2 text-ink">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-24">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-4">
            <Tag>{t("eyebrow")}</Tag>
            <h2 className="text-3xl font-normal tracking-[-0.02em] sm:text-4xl">
              {t("title")}
            </h2>
          </div>
          <Link
            href="/vehicles"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink transition-colors hover:text-ash"
          >
            {t("viewAll")}
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>

        {featured.length === 0 ? (
          <p className="text-ash">{t("empty")}</p>
        ) : (
          <Reveal>
            <FeaturedCarousel cars={featured} />
          </Reveal>
        )}
      </div>
    </section>
  );
}
