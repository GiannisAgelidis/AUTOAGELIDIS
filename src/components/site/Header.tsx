import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Image as IKImage } from "@imagekit/next";
import { Link } from "@/i18n/navigation";
import LocaleSwitcher from "./LocaleSwitcher";
import MobileNav from "./MobileNav";
import { PhoneIcon } from "./icons";

const LANDLINE_DISPLAY = "25310 29470";
const LANDLINE_HREF = "+302531029470";

export default async function Header() {
  const t = await getTranslations("nav");

  return (
    <header className="sticky top-0 z-40 border-b border-on-dark-line bg-slate/95 text-on-dark backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-3">
        <Link href="/" className="shrink-0" aria-label="Auto Agelidis">
          <IKImage
            src="/AutoAgelidis/AUTO AGELIDIS-3.png"
            alt="Auto Agelidis"
            width={640}
            height={320}
            transformation={[{ width: 480 }]}
            className="h-14 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-9 text-[13px] font-semibold uppercase tracking-[0.12em] text-on-dark/75 md:flex">
          <Link href="/#about" className="nav-link transition-colors hover:text-white">
            {t("about")}
          </Link>
          <Link href="/cars" className="nav-link transition-colors hover:text-white">
            {t("cars")}
          </Link>
          <Link
            href={{ pathname: "/cars", query: { vehicleType: "truck" } }}
            className="nav-link transition-colors hover:text-white"
          >
            {t("trucks")}
          </Link>
          <Link href="/#contact" className="nav-link transition-colors hover:text-white">
            {t("contact")}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={`tel:${LANDLINE_HREF}`}
            className="hidden items-center gap-2 rounded-full bg-signal px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-signal-700 lg:inline-flex"
          >
            <PhoneIcon className="h-4 w-4" />
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
