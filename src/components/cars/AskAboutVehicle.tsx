"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import Tag from "@/components/site/Tag";
import ContactFormFields from "@/components/site/ContactFormFields";
import { ArrowRightIcon, CloseIcon } from "@/components/site/icons";

/**
 * "Ask about this vehicle" trigger + the contact form in a modal, so
 * asking about a car doesn't leave its page. Same form as the homepage
 * #contact section (ContactFormFields), just framed differently.
 */
export default function AskAboutVehicle() {
  const t = useTranslations("carDetail");
  const tContact = useTranslations("contact");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex items-center justify-center gap-2 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ash underline underline-offset-4 transition-colors hover:text-ink"
      >
        {t("contactAboutThis")}
        <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </button>

      {/* Portaled to <body> — this component can render inside the vehicle
          page's sticky sidebar (position: sticky), which forms its own
          stacking context. That trapped the modal's z-index inside a
          context that lost to the gallery's z-10 arrows, despite the
          modal's own z-index being higher. Rendering at the document root
          sidesteps that entirely (same fix as Toast.tsx). */}
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4"
            onClick={() => setOpen(false)}
          >
            <div
              className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-line bg-surface p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("close")}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink text-on-ink transition-colors hover:bg-ink-2"
              >
                <CloseIcon className="h-4 w-4" />
              </button>

              <div className="mb-6 flex flex-col gap-3 pr-10">
                <Tag>{tContact("title")}</Tag>
                <h2 className="text-2xl font-normal tracking-[-0.02em]">
                  {tContact("title")}
                </h2>
              </div>

              <ContactFormFields />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
