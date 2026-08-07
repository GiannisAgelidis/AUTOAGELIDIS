import { getTranslations } from "next-intl/server";
import { Image as IKImage } from "@imagekit/next";
import Tag from "./Tag";
import Reveal from "./Reveal";

export default async function About() {
  const t = await getTranslations("about");
  const points = ["inspected", "tradeIn", "local"] as const;

  return (
    <section id="about" className="relative overflow-hidden bg-paper text-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[40%] items-center justify-end pr-6 md:flex"
      >
        {/* <IKImage
          src="/AutoAgelidis/AUTOAGELIDIS.png"
          alt=""
          width={640}
          height={320}
          transformation={[{ width: 960 }]}
          className="ambient-mark w-full max-w-[480px] opacity-[0.08]"
        /> */}
        {/* uncomment this part to show second logo watermark */}
      </div>

      <Reveal className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-20">
        <Tag>{t("eyebrow")}</Tag>

        <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {t("title")}
        </h2>

        <p className="max-w-xl text-lg leading-relaxed text-ink/75">
          {t("body")}
        </p>

        <ul className="mt-4 flex max-w-xl flex-col gap-3">
          {points.map((point) => (
            <li key={point} className="flex items-center gap-3 text-sm font-medium">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
              {t(`points.${point}`)}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
