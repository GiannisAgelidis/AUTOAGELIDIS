"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MenuIcon, CloseIcon } from "./icons";

export default function MobileNav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  const itemClass =
    "rounded-lg px-3 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-on-dark/80 transition-colors hover:bg-white/5 hover:text-signal";

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center text-on-dark"
      >
        {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
      </button>

      {open && (
        <nav className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-on-dark-line bg-slate px-6 py-4">
          <Link href="/#about" onClick={close} className={itemClass}>
            {t("about")}
          </Link>
          <Link href="/cars" onClick={close} className={itemClass}>
            {t("cars")}
          </Link>
          <Link
            href={{ pathname: "/cars", query: { vehicleType: "truck" } }}
            onClick={close}
            className={itemClass}
          >
            {t("trucks")}
          </Link>
          <Link href="/#contact" onClick={close} className={itemClass}>
            {t("contact")}
          </Link>
        </nav>
      )}
    </div>
  );
}
