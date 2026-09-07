import { getTranslations } from "next-intl/server";
import Tag from "./Tag";
import Reveal from "./Reveal";
import { CheckIcon } from "./icons";

export default async function About() {
  const t = await getTranslations("about");
  const points = ["inspected", "tradeIn", "local"] as const;

  return (
    <section id="about" className="bg-bg text-ink">
      <Reveal className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 py-24 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div className="flex flex-col gap-6">
          <Tag>{t("eyebrow")}</Tag>

          <h2 className="max-w-xl text-3xl font-extrabold leading-tight tracking-[-0.02em] sm:text-4xl">
            {t("title")}
          </h2>

          <p className="max-w-xl text-lg leading-relaxed text-muted">
            {t("body")}
          </p>
        </div>

        <ul className="flex flex-col gap-3 rounded-2xl border border-hairline bg-surface p-6 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_12px_32px_-12px_rgba(15,23,42,0.12)]">
          {points.map((point) => (
            <li
              key={point}
              className="flex items-start gap-3 border-b border-hairline pb-3 text-sm font-medium last:border-none last:pb-0"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-signal/10 text-signal">
                <CheckIcon className="h-3 w-3" />
              </span>
              {t(`points.${point}`)}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
