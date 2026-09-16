import { getTranslations } from "next-intl/server";
// ImageKit video import — only needed if the commented-out IKVideo attempt
// below is re-enabled (currently broken, see the comment at its usage site).
// import { Video as IKVideo } from "@imagekit/next";
import { Link } from "@/i18n/navigation";
import ScrollLink from "./ScrollLink";
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
        {/* ===== ImageKit-hosted 2k.mp4 — DOES NOT WORK, kept for reference ===== */}
        {/* 2k.mp4 (and 4k.mp4) are HEVC/QuickTime source files, not standard
            H.264 MP4 — most browsers can't decode HEVC in <video> directly.
            ImageKit can normally auto-transcode video on delivery via its
            /ik-video.mp4 path, but that's currently blocked on this account:
            GET .../2k.mp4/ik-video.mp4 -> 403 "ik-error: ELIMIT - Video
            transformations limit exceeded". Until the ImageKit plan's video
            transformation quota is raised (or the source is pre-converted to
            H.264 MP4 before upload), this will fail with
            MEDIA_ERR_SRC_NOT_SUPPORTED regardless of hosting. */}
        {/* <IKVideo
          src="/AutoAgelidis/2k.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
        /> */}
        {/* ===== END ImageKit attempt ===== */}

        {/* ===== ACTIVE: local video from public/video_assets (confirmed working) ===== */}
        {/* Swap src to "/video_assets/test6_crop.mp4" to compare the other clip.
            Note: 2k.mp4/4k.mp4 in this same folder are the same HEVC/QuickTime
            files as above and will NOT play either — only test1_crop.mp4 and
            test6_crop.mp4 are real H.264 MP4s. */}
        <video
          src="/video_assets/2k.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
        />
        {/* ===== END ACTIVE ===== */}
        <div className="absolute inset-0 bg-ink/50" />
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
          <ScrollLink
            targetId="contact"
            className="inline-flex items-center gap-2 border border-on-ink/30 px-6 py-3.5 font-mono text-xs uppercase tracking-[0.14em] text-on-ink transition-colors hover:border-on-ink"
          >
            {t("ctaSecondary")}
          </ScrollLink>
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
