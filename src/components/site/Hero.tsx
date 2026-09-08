import { getTranslations } from "next-intl/server";
import { Video as IKVideo } from "@imagekit/next";
import { Link } from "@/i18n/navigation";
import Tag from "./Tag";
import { ArrowRightIcon } from "./icons";

export default async function Hero() {
  const t = await getTranslations("hero");

  const stats = [
    { k: "since", label: t("stats.since"), value: t("stats.sinceValue") },
    {
      k: "experience",
      label: t("stats.experience"),
      value: t("stats.experienceValue"),
    },
    { k: "location", label: t("stats.location"), value: t("stats.locationValue") },
  ];

  return (
    <section className="relative overflow-hidden bg-ink text-on-ink">
      <div aria-hidden className="absolute inset-0">
        <IKVideo
          src="/AutoAgelidis/2.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/20" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-24 pt-16 md:pt-28">
        <Tag
          tone="on-ink"
          className="hero-enter"
          style={{ "--enter-delay": "0ms" } as React.CSSProperties}
        >
          {t("eyebrow")}
        </Tag>

        <h1
          className="hero-enter max-w-4xl whitespace-pre-line text-[2.75rem] font-normal leading-[1.04] tracking-[-0.03em] sm:text-6xl md:text-[4.5rem]"
          style={{ "--enter-delay": "80ms" } as React.CSSProperties}
        >
          {t("title")}
        </h1>

        <p
          className="hero-enter max-w-xl text-lg leading-relaxed text-on-ink-dim text-white/70"
          style={{ "--enter-delay": "160ms" } as React.CSSProperties}
        >
          {t("subtitle")}
        </p>

        <div
          className="hero-enter flex flex-wrap items-center gap-3"
          style={{ "--enter-delay": "240ms" } as React.CSSProperties}
        >
          <Link
            href="/cars"
            className="group inline-flex items-center gap-2 bg-on-ink px-6 py-3.5 font-mono text-xs uppercase tracking-[0.14em] text-ink transition-colors hover:bg-on-ink-dim"
          >
            {t("cta")}
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 border border-on-ink/30 px-6 py-3.5 font-mono text-xs uppercase tracking-[0.14em] text-on-ink transition-colors hover:border-on-ink"
          >
            {t("ctaSecondary")}
          </Link>
        </div>

        <dl
          className="hero-enter mt-6 grid max-w-2xl grid-cols-1 border-t border-line-dark font-mono sm:grid-cols-3 sm:divide-x sm:divide-line-dark"
          style={{ "--enter-delay": "320ms" } as React.CSSProperties}
        >
          {stats.map((s) => (
            <div
              key={s.k}
              className="border-b border-line-dark py-5 sm:border-b-0 sm:px-5 sm:first:pl-0"
            >
              <dt className="text-[10px] uppercase tracking-[0.18em] text-on-ink-dim">
                {s.label}
              </dt>
              <dd className="mt-2 text-xl font-medium tabular-nums text-on-ink">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
