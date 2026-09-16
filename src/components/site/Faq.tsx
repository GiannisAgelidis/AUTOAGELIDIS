import { getTranslations } from "next-intl/server";
import { Image as IKImage } from "@imagekit/next";
import ScrollLink from "./ScrollLink";
import Tag from "./Tag";
import Reveal from "./Reveal";
import { ArrowRightIcon } from "./icons";

interface FaqEntry {
  q: string;
  a: string;
}

export default async function Faq() {
  const t = await getTranslations("faq");
  const questions = t.raw("questions") as FaqEntry[];

  return (
    <section id="faq" className="relative overflow-hidden bg-ink text-on-ink">
      <IKImage
        src="/AutoAgelidis/FAQ.jpg"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div aria-hidden className="absolute inset-0 bg-ink/70" />

      <Reveal className="relative mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 py-24 md:grid-cols-2">
        {/* Mirrors the location section below: image on the left, text on the right. */}
        <div className="relative order-2 h-full md:order-1">
          {/* Soft backlight, matching the map treatment in the location section */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-12"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255,255,255,0.18), rgba(255,255,255,0.05) 45%, transparent 72%)",
              filter: "blur(28px)",
            }}
          />
          <div className="relative h-full min-h-[300px] overflow-hidden rounded-xl border border-white/15">
            <IKImage
              src="/AutoAgelidis/faq3.jpg"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="order-1 flex flex-col gap-6 md:order-2">
          <Tag tone="on-ink">{t("eyebrow")}</Tag>
          <h2 className="text-3xl font-normal tracking-[-0.02em] sm:text-4xl">
            {t("title")}
          </h2>

          <dl className="divide-y divide-line-dark border-y border-line-dark">
            {questions.map((entry, i) => (
              <div key={i} className="py-4">
                <dt className="text-base font-medium text-on-ink">{entry.q}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-on-ink-dim">
                  {entry.a}
                </dd>
              </div>
            ))}
          </dl>

          <ScrollLink
            targetId="contact"
            className="group inline-flex w-fit items-center gap-2 border border-on-ink/30 px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-on-ink transition-colors hover:border-on-ink"
          >
            {t("cta")}
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </ScrollLink>
        </div>
      </Reveal>
    </section>
  );
}
