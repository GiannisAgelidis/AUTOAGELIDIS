import { getTranslations } from "next-intl/server";
import Tag from "./Tag";
import Reveal from "./Reveal";

const ADDRESS = "Εθνάρχου Μακαρίου 10, Κομοτηνή 69100";
const PHONE = "2531029470";
const PHONE_HREF = "+302531029470";
const PERSONAL_PHONE = "693 223 2929";
const PERSONAL_PHONE_HREF = "+306932232929"
const MAP_QUERY = encodeURIComponent(ADDRESS);

export default async function Location() {
  const t = await getTranslations("location");

  return (
    <section id="location" className="bg-ink text-paper">
      <Reveal className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 py-20 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Tag tone="on-ink">{t("eyebrow")}</Tag>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>

          <dl className="flex flex-col gap-4 text-sm">
            <div>
              <dt className="uppercase tracking-wider text-steel">
                {t("addressLabel")}
              </dt>
              <dd className="mt-1 text-base">{ADDRESS}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-wider text-steel">
                {t("phoneLabel")}
              </dt>
              <dd className="mt-1 text-base">
                <a href={`tel:${PHONE_HREF}`} className="hover:text-amber">
                  {PHONE}
                </a>
              </dd>
              <dd className="mt-1 text-base">
                <a href={`tel:${PERSONAL_PHONE_HREF}`} className="hover:text-amber">
                  {PERSONAL_PHONE}
                </a>
              </dd>
            </div>
            <div>
              <dt className="uppercase tracking-wider text-steel">
                {t("hoursLabel")}
              </dt>
              <dd className="mt-1 text-base">{t("hoursValue")}</dd>
            </div>
          </dl>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex w-fit items-center gap-2 rounded-md border border-paper/25 px-5 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors hover:border-amber hover:text-amber"
          >
            {t("directions")} →
          </a>
        </div>

        <div className="min-h-[280px] overflow-hidden rounded-lg border border-line">
          <iframe
            title={t("title")}
            src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: 280 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Reveal>
    </section>
  );
}
