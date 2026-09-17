import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Image as IKImage } from "@imagekit/next";
import { Link } from "@/i18n/navigation";
import LocaleSwitcher from "./LocaleSwitcher";
import LogoLink from "./LogoLink";
import MobileNav from "./MobileNav";
import ScrollLink from "./ScrollLink";

const LANDLINE_DISPLAY = "25310 29470";
const LANDLINE_HREF = "+302531029470";

export default async function Header() {
  const t = await getTranslations("nav");

  return (
    <header className="sticky top-0 z-40 border-b border-line-dark bg-ink text-on-ink  ">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-3">
        <LogoLink className="flex shrink-0 items-center" ariaLabel="Auto Agelidis">
          <IKImage
            src="/AutoAgelidis/UTO AGELIDIS-6.png"
            alt="Auto Agelidis"
            width={1200}
            height={275}
            transformation={[
              { x: 3121, y: 1882, width: 1597, height: 366, cropMode: "extract" },
              { width: 1200 },
            ]}
            className="h-8 w-auto"
          />
        </LogoLink>

        <nav className="hidden items-center gap-9 font-sans text-[11px] uppercase tracking-[0.16em] text-on-ink/70 md:flex">
          <ScrollLink targetId="about" className="nav-link transition-colors hover:text-on-ink">
            {t("about")}
          </ScrollLink>
          <Link href="/vehicles" className="nav-link transition-colors hover:text-on-ink">
            {t("vehicles")}
          </Link>
          <ScrollLink targetId="contact" className="nav-link transition-colors hover:text-on-ink">
            {t("contact")}
          </ScrollLink>
        </nav>

        <div className="flex items-center gap-5">
          <a
            href={`tel:${LANDLINE_HREF}`}
            className="hidden whitespace-nowrap border border-line-dark px-3 py-2 font-mono text-[11px] tracking-[0.12em] text-on-ink/80 transition-colors hover:border-on-ink hover:text-on-ink lg:block"
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
