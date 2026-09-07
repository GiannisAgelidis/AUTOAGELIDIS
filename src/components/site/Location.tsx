import { getTranslations } from "next-intl/server";
import Tag from "./Tag";
import Reveal from "./Reveal";
import { MapPinIcon, PhoneIcon, ClockIcon, ArrowRightIcon } from "./icons";

const ADDRESS = "Εθνάρχου Μακαρίου 10, Κομοτηνή 69100";
const PHONE = "2531029470";
const PHONE_HREF = "+302531029470";
const PERSONAL_PHONE = "693 223 2929";
const PERSONAL_PHONE_HREF = "+306932232929";
const MAP_QUERY = encodeURIComponent(ADDRESS);

export default async function Location() {
  const t = await getTranslations("location");

  return (
    <section id="location" className="bg-slate text-on-dark">
      <Reveal className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 py-24 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Tag tone="on-ink">{t("eyebrow")}</Tag>
          <h2 className="text-3xl font-extrabold tracking-[-0.02em] sm:text-4xl">
            {t("title")}
          </h2>

          <dl className="flex flex-col divide-y divide-on-dark-line overflow-hidden rounded-xl border border-on-dark-line">
            <div className="flex gap-4 px-4 py-4">
              <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-signal" />
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-on-dark-muted">
                  {t("addressLabel")}
                </dt>
                <dd className="mt-1 text-base text-on-dark">{ADDRESS}</dd>
              </div>
            </div>

            <div className="flex gap-4 px-4 py-4">
              <PhoneIcon className="mt-0.5 h-5 w-5 shrink-0 text-signal" />
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-on-dark-muted">
                  {t("phoneLabel")}
                </dt>
                <dd className="mt-1 text-base">
                  <a href={`tel:${PHONE_HREF}`} className="text-on-dark transition-colors hover:text-signal">
                    {PHONE}
                  </a>
                </dd>
                <dd className="mt-1 text-base">
                  <a href={`tel:${PERSONAL_PHONE_HREF}`} className="text-on-dark transition-colors hover:text-signal">
                    {PERSONAL_PHONE}
                  </a>
                </dd>
              </div>
            </div>

            <div className="flex gap-4 px-4 py-4">
              <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-signal" />
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-on-dark-muted">
                  {t("hoursLabel")}
                </dt>
                <dd className="mt-1 text-base text-on-dark">{t("hoursValue")}</dd>
              </div>
            </div>
          </dl>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-fit items-center gap-2 rounded-lg bg-signal px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-signal-700"
          >
            {t("directions")}
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="min-h-[300px] overflow-hidden rounded-xl border border-on-dark-line">
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
