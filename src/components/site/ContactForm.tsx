import { getTranslations } from "next-intl/server";
import Tag from "./Tag";
import Reveal from "./Reveal";
import ContactFormFields from "./ContactFormFields";

export default async function ContactForm() {
  const t = await getTranslations("contact");

  return (
    <section id="contact" className="bg-paper text-ink">
      <Reveal className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-24">
        <div className="flex flex-col gap-4">
          <Tag>{t("title")}</Tag>
          <h2 className="text-3xl font-normal tracking-[-0.02em] sm:text-4xl">
            {t("title")}
          </h2>
        </div>

        <ContactFormFields className="rounded-xl border border-line bg-surface p-6 sm:p-8" />
      </Reveal>
    </section>
  );
}
