import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Image as IKImage } from "@imagekit/next";
import { Link } from "@/i18n/navigation";
import LocaleSwitcher from "./LocaleSwitcher";
import MobileNav from "./MobileNav";

const LANDLINE_DISPLAY = "25310 29470";
const LANDLINE_HREF = "+302531029470";

export default async function Header() {
  const t = await getTranslations("nav");

  return (
    <header className="sticky top-0 z-40 border-b border-line-dark bg-ink text-on-ink">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-3">
        <Link href="/" className="shrink-0" aria-label="Auto Agelidis">
          <IKImage
            src="/AutoAgelidis/AUTO AGELIDIS-3.png"
            alt="Auto Agelidis"
            width={640}
            height={320}
            transformation={[{ width: 480 }]}
            className="h-12 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-9 font-mono text-[11px] uppercase tracking-[0.16em] text-on-ink/70 md:flex">
          <Link href="/#about" className="nav-link transition-colors hover:text-on-ink">
            {t("about")}
          </Link>
          <Link href="/cars" className="nav-link transition-colors hover:text-on-ink">
            {t("cars")}
          </Link>
          <Link
            href={{ pathname: "/cars", query: { vehicleType: "truck" } }}
            className="nav-link transition-colors hover:text-on-ink"
          >
            {t("trucks")}
          </Link>
          <Link href="/#contact" className="nav-link transition-colors hover:text-on-ink">
            {t("contact")}
          </Link>
        </nav>

        <div className="flex items-center gap-5">
          <a
            href={`tel:${LANDLINE_HREF}`}
            className="hidden border border-line-dark px-3 py-2 font-mono text-[11px] tracking-[0.12em] text-on-ink/80 transition-colors hover:border-on-ink hover:text-on-ink lg:block"
          >
            {LANDLINE_DISPLAY}
          </a>
          <Suspense fallback={null}>
            <LocaleSwitcher />
          </Suspense>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
