import { getTranslations } from "next-intl/server";
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
    <section id="faq" className="texture-ink relative overflow-hidden bg-ink text-on-ink">
      <Reveal className="relative mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 py-24 md:grid-cols-2">
        {/* Mirrors the location section below: image on the left, text on the right. */}
        <div className="relative order-2 md:order-1">
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
          <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-white/5">
            {/* Placeholder — swap for a real image */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              className="h-16 w-16 text-on-ink-dim"
              aria-hidden
            >
              <rect x="3" y="4" width="18" height="16" rx="1.5" />
              <circle cx="8.5" cy="9.5" r="1.5" />
              <path d="M21 16l-5.5-5.5a1.5 1.5 0 0 0-2.12 0L4 19" />
            </svg>
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
