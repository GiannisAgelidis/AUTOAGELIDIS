import { getTranslations } from "next-intl/server";
import Tag from "./Tag";
import Reveal from "./Reveal";

export default async function About() {
  const t = await getTranslations("about");
  const points = ["inspected", "tradeIn", "local"] as const;

  return (
    <section id="about" className="bg-paper text-ink">
      <Reveal className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 py-24 md:grid-cols-[1.1fr_0.9fr] md:items-start">
        <div className="flex flex-col gap-6">
          <Tag>{t("eyebrow")}</Tag>

          <h2 className="max-w-xl text-3xl font-normal leading-[1.15] tracking-[-0.02em] sm:text-4xl">
            {t("title")}
          </h2>

          <p className="max-w-xl text-lg leading-relaxed text-graphite">
            {t("body")}
          </p>
        </div>

        <ul className="divide-y divide-line border-y border-line">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-4 py-4 text-sm">
              <span
                aria-hidden
                className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-ink"
              />
              <span className="font-medium">{t(`points.${point}`)}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
