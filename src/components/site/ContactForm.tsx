"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import Tag from "./Tag";
import Reveal from "./Reveal";

const inputClass =
  "w-full rounded-md border border-ink/15 bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-amber focus:outline-none";
const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wider text-ink/60";

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
      <Reveal className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-20">
        <Tag>{t("title")}</Tag>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("title")}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            <p className="text-sm font-medium text-amber-dim">{t("success")}</p>
          )}
          {status === "error" && (
            <p className="text-sm font-medium text-red-600">{t("error")}</p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-fit rounded-md bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-wide text-paper transition-all hover:scale-[1.03] hover:bg-ink-soft active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
          >
            {t("send")}
          </button>
        </form>
      </Reveal>
    </section>
  );
}
