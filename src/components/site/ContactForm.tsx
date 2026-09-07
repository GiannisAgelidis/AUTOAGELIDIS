"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import Tag from "./Tag";
import Reveal from "./Reveal";

const inputClass =
  "w-full border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ash/60 transition-colors focus:border-ink focus:outline-none";
const labelClass =
  "mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ash";

export default function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("failed");

      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="bg-paper text-ink">
      <Reveal className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-24">
        <div className="flex flex-col gap-4">
          <Tag>{t("title")}</Tag>
          <h2 className="text-3xl font-normal tracking-[-0.02em] sm:text-4xl">
            {t("title")}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 border border-line bg-surface p-6 sm:p-8"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="name">
                {t("name")}
              </label>
              <input id="name" name="name" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="phone">
                {t("phone")}
              </label>
              <input id="phone" name="phone" className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="email">
              {t("email")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="message">
              {t("message")}
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className={inputClass}
            />
          </div>

          {status === "sent" && (
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-ink">
              {t("success")}
            </p>
          )}
          {status === "error" && (
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-ash">
              {t("error")}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-fit bg-ink px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-on-ink transition-colors hover:bg-ink-2 disabled:opacity-50"
          >
            {t("send")}
          </button>
        </form>
      </Reveal>
    </section>
  );
}
