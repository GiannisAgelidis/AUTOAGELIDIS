import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Image as IKImage } from "@imagekit/next";
import { Link } from "@/i18n/navigation";
import LocaleSwitcher from "./LocaleSwitcher";
import MobileNav from "./MobileNav";

export default async function Header() {
  const t = await getTranslations("nav");

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="shrink-0">
          <IKImage
            src="/AutoAgelidis/AUTO AGELIDIS-3.png"
            alt="Auto Agelidis"
            width={640}
            height={320}
            transformation={[{ width: 640 }]}
            className="h-24 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium uppercase tracking-wide text-paper/80 md:flex">
          <Link href="/#about" className="nav-link hover:text-amber">
            {t("about")}
          </Link>
          <Link href="/cars" className="nav-link hover:text-amber">
            {t("cars")}
          </Link>
          <Link
            href={{ pathname: "/cars", query: { vehicleType: "truck" } }}
            className="nav-link hover:text-amber"
          >
            {t("trucks")}
          </Link>
          <Link href="/#contact" className="nav-link hover:text-amber">
            {t("contact")}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Suspense fallback={null}>
            <LocaleSwitcher />
          </Suspense>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
