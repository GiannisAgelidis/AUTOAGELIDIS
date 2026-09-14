import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { ArrowRightIcon } from "@/components/site/icons";

export default async function VehicleNotFound() {
  const t = await getTranslations("carDetail.notFound");

  return (
    <>
      <Header />
      <main className="flex flex-1 items-center bg-paper text-ink">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-4 px-6 py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ash">
            404
          </p>
          <h1 className="text-3xl font-normal tracking-[-0.02em] sm:text-4xl">
            {t("title")}
          </h1>
          <p className="max-w-md text-graphite">{t("body")}</p>
          <Link
            href="/vehicles"
            className="group mt-4 inline-flex items-center gap-2 bg-ink px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-on-ink transition-colors hover:bg-ink-2"
          >
            {t("cta")}
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
