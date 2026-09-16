"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ScrollLink from "./ScrollLink";
import { MenuIcon, CloseIcon } from "./icons";

export default function MobileNav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  const itemClass =
    "border-b border-line-dark px-1 py-3.5 font-sans text-xs uppercase tracking-[0.16em] text-on-ink/75 transition-colors hover:text-on-ink last:border-b-0";

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center text-on-ink"
      >
        {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
      </button>

      {open && (
        <nav className="absolute inset-x-0 top-full flex flex-col border-b border-line-dark bg-ink px-6 py-2">
          <ScrollLink targetId="about" onClick={close} className={itemClass}>
            {t("about")}
          </ScrollLink>
          <Link href="/vehicles" onClick={close} className={itemClass}>
            {t("vehicles")}
          </Link>
          <ScrollLink targetId="contact" onClick={close} className={itemClass}>
            {t("contact")}
          </ScrollLink>
        </nav>
      )}
    </div>
  );
}
