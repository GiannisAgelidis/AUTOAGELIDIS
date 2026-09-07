import { getTranslations } from "next-intl/server";
import Tag from "./Tag";
import Reveal from "./Reveal";
import { ArrowRightIcon } from "./icons";

const ADDRESS = "Εθνάρχου Μακαρίου 10, Κομοτηνή 69100";
const PHONE = "2531029470";
const PHONE_HREF = "+302531029470";
const PERSONAL_PHONE = "693 223 2929";
const PERSONAL_PHONE_HREF = "+306932232929";
const MAP_QUERY = encodeURIComponent(ADDRESS);

export default async function Location() {
  const t = await getTranslations("location");

  const rows = [
    { label: t("addressLabel"), body: <span>{ADDRESS}</span> },
    {
      label: t("phoneLabel"),
      body: (
        <span className="flex flex-col gap-1">
          <a href={`tel:${PHONE_HREF}`} className="transition-colors hover:text-on-ink-dim">
            {PHONE}
          </a>
          <a
            href={`tel:${PERSONAL_PHONE_HREF}`}
            className="transition-colors hover:text-on-ink-dim"
          >
            {PERSONAL_PHONE}
          </a>
        </span>
      ),
    },
    { label: t("hoursLabel"), body: <span>{t("hoursValue")}</span> },
  ];

  return (
    <section id="location" className="bg-ink text-on-ink">
      <Reveal className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 py-24 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Tag tone="on-ink">{t("eyebrow")}</Tag>
          <h2 className="text-3xl font-normal tracking-[-0.02em] sm:text-4xl">
            {t("title")}
          </h2>

          <dl className="divide-y divide-line-dark border-y border-line-dark">
            {rows.map((row, i) => (
              <div key={i} className="grid grid-cols-[7rem_1fr] gap-4 py-4 text-sm">
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-on-ink-dim">
                  {row.label}
                </dt>
                <dd className="text-base text-on-ink">{row.body}</dd>
              </div>
            ))}
          </dl>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-fit items-center gap-2 border border-on-ink/30 px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-on-ink transition-colors hover:border-on-ink"
          >
            {t("directions")}
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="min-h-[300px] overflow-hidden border border-line-dark grayscale">
          <iframe
            title={t("title")}
            src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: 300 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Reveal>
    </section>
  );
}
