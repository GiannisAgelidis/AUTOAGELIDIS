import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MailIcon, PhoneIcon, InstagramIcon, FacebookIcon, CarIcon } from "./icons";

const EMAIL = "info@autoagelidis.gr";
const MOBILE_DISPLAY = "693 223 2929";
const MOBILE_HREF = "+306932232929";
const LANDLINE_DISPLAY = "25310 29470";
const LANDLINE_HREF = "+302531029470";

const INSTAGRAM_URL = "https://www.instagram.com/auto_agelidis/";
// Placeholder — swap in the real Facebook page URL once it exists.
const FACEBOOK_URL = "#";
const CARGR_URL = "https://auto-importagelidis.car.gr/cars/";
const CARGR_DISPLAY = " Car.gr  ";

/**
 * Geist Mono only loads the `latin` subset (see layout.tsx) — Greek
 * headings silently fall back to a taller-looking system font at the same
 * declared size, making the real Geist Mono glyphs used for English look
 * noticeably smaller by comparison. Bump the English size to match the
 * Greek fallback's rendered cap-height instead of shrinking Greek.
 */
function columnHeading(locale: string) {
  return `mb-4 text-center font-mono uppercase tracking-[0.18em] text-on-ink-dim ${
    locale === "el" ? "text-[10px]" : "text-[13px]"
  }`;
}
const linkRow =
  "flex items-center gap-2.5 text-on-ink/65 transition-colors hover:text-on-ink";
const linkGroup = "flex flex-col items-center gap-3 text-center text-sm";

export default async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tBrand = await getTranslations("brand");
  const locale = await getLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line-dark bg-ink text-on-ink">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 py-16 sm:grid-cols-3">
        <div>
          <h3 className={columnHeading(locale)}>{t("contactHeading")}</h3>
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

        <div>
          <h3 className={columnHeading(locale)}>{t("navHeading")}</h3>
          <nav className={linkGroup}>
            <Link href="/vehicles" className="text-on-ink/65 transition-colors hover:text-on-ink">
              {tNav("vehicles")}
            </Link>
            <Link href="/#about" className="text-on-ink/65 transition-colors hover:text-on-ink">
              {tNav("about")}
            </Link>
            <Link href="/#contact" className="text-on-ink/65 transition-colors hover:text-on-ink">
              {tNav("contact")}
            </Link>
          </nav>
        </div>

        <div>
          <h3 className={columnHeading(locale)}>{t("followHeading")}</h3>
          <div className={linkGroup}>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={linkRow}
            >
              <InstagramIcon className="h-4 w-4 shrink-0" />
              Instagram
            </a>
            <a href={FACEBOOK_URL} className={linkRow}>
              <FacebookIcon className="h-4 w-4 shrink-0" />
              Facebook
            </a>
            <a
              href={CARGR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={linkRow}
            >
              <CarIcon className="h-4 w-4 shrink-0" />
              {CARGR_DISPLAY}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-line-dark px-6 py-5">
        <p className="mx-auto max-w-6xl text-center font-mono text-[10px] uppercase tracking-[0.14em] text-on-ink-dim">
          © {year} {tBrand("name")}. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
