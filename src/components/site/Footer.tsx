import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MailIcon, PhoneIcon, InstagramIcon, FacebookIcon } from "./icons";

const EMAIL = "info@autoagelidis.gr";
const MOBILE_DISPLAY = "693 223 2929";
const MOBILE_HREF = "+306932232929";
const LANDLINE_DISPLAY = "25310 29470";
const LANDLINE_HREF = "+302531029470";

// Placeholders — swap in the real profile URLs once the pages exist.
const INSTAGRAM_URL = "#";
const FACEBOOK_URL = "#";

const columnHeading = "mb-4 font-mono text-xs uppercase tracking-wider text-paper/40";
const linkRow = "flex items-center gap-2.5 hover:text-amber";
const linkGroup = "flex flex-col items-start gap-3";

export default async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tBrand = await getTranslations("brand");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-ink text-paper/70">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 justify-center gap-10 px-6 py-14 text-sm sm:grid-cols-[repeat(3,max-content)] sm:gap-42">
        <div className="flex flex-col items-start">
          <h3 className={columnHeading}>{t("contactHeading")}</h3>
          <div className={linkGroup}>
            <a href={`mailto:${EMAIL}`} className={linkRow}>
              <MailIcon className="h-4 w-4 shrink-0" />
              {EMAIL}
            </a>
            <a href={`tel:${LANDLINE_HREF}`} className={linkRow}>
              <PhoneIcon className="h-4 w-4 shrink-0" />
              {LANDLINE_DISPLAY}
            </a>
            <a href={`tel:${MOBILE_HREF}`} className={linkRow}>
              <PhoneIcon className="h-4 w-4 shrink-0" />
              {MOBILE_DISPLAY}
            </a>
          </div>
        </div>

        <div className="flex flex-col items-start">
          <h3 className={columnHeading}>{t("navHeading")}</h3>
          <nav className={linkGroup}>
            <Link href="/cars" className="hover:text-amber">
              {tNav("cars")}
            </Link>
            <Link href="/#about" className="hover:text-amber">
              {tNav("about")}
            </Link>
            <Link href="/#contact" className="hover:text-amber">
              {tNav("contact")}
            </Link>
          </nav>
        </div>

        <div className="flex flex-col items-start">
          <h3 className={columnHeading}>{t("followHeading")}</h3>
          <div className={linkGroup}>
            <a href={INSTAGRAM_URL} className={linkRow}>
              <InstagramIcon className="h-4 w-4 shrink-0" />
              Instagram
            </a>
            <a href={FACEBOOK_URL} className={linkRow}>
              <FacebookIcon className="h-4 w-4 shrink-0" />
              Facebook
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-line px-6 py-5">
        <p className="mx-auto max-w-6xl text-center font-mono text-xs text-paper/40">
          © {year} {tBrand("name")}. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
