import { getTranslations } from "next-intl/server";
import { Image as IKImage } from "@imagekit/next";
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
    <section className="relative overflow-hidden bg-slate text-on-dark">
      {/* Radial wash from slate into near-black */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 15% 0%, #26344a 0%, #1e293b 42%, #0f172a 100%)",
        }}
      />

      {/* Large ghosted wordmark */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 bottom-[-8%] hidden w-[52%] justify-end sm:flex"
      >
        <IKImage
          src="/AutoAgelidis/AUTO AGELIDIS-3.png"
          alt=""
          width={960}
          height={480}
          transformation={[{ width: 1100 }]}
          className="ambient-mark w-full max-w-[620px] opacity-[0.06]"
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-9 px-6 pb-24 pt-16 md:pt-24">
        <Tag
          tone="on-ink"
          className="hero-enter"
          style={{ "--enter-delay": "0ms" } as React.CSSProperties}
        >
          {t("eyebrow")}
        </Tag>

        <h1
          className="hero-enter max-w-4xl whitespace-pre-line text-[2.5rem] font-extrabold leading-[1.03] tracking-[-0.02em] sm:text-6xl md:text-[4.25rem]"
          style={{ "--enter-delay": "90ms" } as React.CSSProperties}
        >
          {t("title")}
        </h1>

        <p
          className="hero-enter max-w-xl text-lg leading-relaxed text-on-dark-muted"
          style={{ "--enter-delay": "180ms" } as React.CSSProperties}
        >
          {t("subtitle")}
        </p>

        <div
          className="hero-enter flex flex-wrap items-center gap-4"
          style={{ "--enter-delay": "270ms" } as React.CSSProperties}
        >
          <Link
            href="/cars"
            className="group inline-flex items-center gap-2 rounded-lg bg-signal px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-all hover:bg-signal-700 active:scale-[0.98]"
          >
            {t("cta")}
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-lg border border-on-dark/25 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-on-dark transition-all hover:border-on-dark/70 active:scale-[0.98]"
          >
            {t("ctaSecondary")}
          </Link>
        </div>

        <dl
          className="hero-enter mt-6 grid max-w-2xl grid-cols-1 gap-px overflow-hidden rounded-xl border border-on-dark-line bg-on-dark-line font-mono sm:grid-cols-3"
          style={{ "--enter-delay": "360ms" } as React.CSSProperties}
        >
          {stats.map((s) => (
            <div key={s.k} className="bg-slate/60 px-4 py-4 sm:py-5">
              <dt className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-on-dark-muted">
                <span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-signal" />
                {s.label}
              </dt>
              <dd className="mt-1.5 text-xl font-semibold tabular-nums text-on-dark">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div
        aria-hidden
        className="scroll-cue pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-on-dark-muted md:block"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M6 13l6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}
