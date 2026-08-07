import { getTranslations } from "next-intl/server";
import { Image as IKImage } from "@imagekit/next";
import { Link } from "@/i18n/navigation";
import Tag from "./Tag";

export default async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--color-paper) 0, var(--color-paper) 1px, transparent 1px, transparent 96px)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[40%] items-center justify-end pr-6 lg:flex"
      >
        <IKImage
          src="/AutoAgelidis/AUTO AGELIDIS-3.png"
          alt=""
          width={640}
          height={320}
          transformation={[{ width: 960 }]}
          className="ambient-mark w-full max-w-[520px] opacity-[0.12]"
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-20 pt-16 md:pt-24">
        <Tag tone="on-ink" className="hero-enter" style={{ "--enter-delay": "0ms" } as React.CSSProperties}>
          {t("eyebrow")}
        </Tag>

        <h1
          className="hero-enter max-w-3xl whitespace-pre-line text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
          style={{ "--enter-delay": "90ms" } as React.CSSProperties}
        >
          {t("title")}
        </h1>

        <p
          className="hero-enter max-w-xl text-lg leading-relaxed text-paper/75"
          style={{ "--enter-delay": "180ms" } as React.CSSProperties}
        >
          {t("subtitle")}
        </p>

        <div
          className="hero-enter flex flex-wrap gap-4"
          style={{ "--enter-delay": "270ms" } as React.CSSProperties}
        >
          <Link
            href="/cars"
            className="rounded-md bg-amber px-6 py-3 text-sm font-semibold uppercase tracking-wide text-ink transition-all hover:scale-[1.03] hover:bg-amber-dim active:scale-[0.98]"
          >
            {t("cta")}
          </Link>
          <Link
            href="/#contact"
            className="rounded-md border border-paper/25 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-paper transition-all hover:scale-[1.03] hover:border-paper/60 active:scale-[0.98]"
          >
            {t("ctaSecondary")}
          </Link>
        </div>

        <dl
          className="hero-enter mt-6 grid max-w-xl grid-cols-3 gap-6 border-t border-line pt-6 font-mono"
          style={{ "--enter-delay": "360ms" } as React.CSSProperties}
        >
          <div>
            <dt className="text-xs uppercase tracking-wider text-steel">
              {t("stats.since")}
            </dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">
              {t("stats.sinceValue")}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-steel">
              {t("stats.experience")}
            </dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">
              {t("stats.experienceValue")}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-steel">
              {t("stats.location")}
            </dt>
            <dd className="mt-1 text-2xl font-semibold">
              {t("stats.locationValue")}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
