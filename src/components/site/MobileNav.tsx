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

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center text-paper"
      >
        {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
      </button>

      {open && (
        <nav className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-line bg-ink px-6 py-4 text-sm font-medium uppercase tracking-wide text-paper/80">
          <Link href="/#about" onClick={close} className="rounded-md px-2 py-2.5 hover:bg-paper/5 hover:text-amber">
            {t("about")}
          </Link>
          <Link href="/cars" onClick={close} className="rounded-md px-2 py-2.5 hover:bg-paper/5 hover:text-amber">
            {t("cars")}
          </Link>
          <Link
            href={{ pathname: "/cars", query: { vehicleType: "truck" } }}
            onClick={close}
            className="rounded-md px-2 py-2.5 hover:bg-paper/5 hover:text-amber"
          >
            {t("trucks")}
          </Link>
          <Link href="/#contact" onClick={close} className="rounded-md px-2 py-2.5 hover:bg-paper/5 hover:text-amber">
            {t("contact")}
          </Link>
        </nav>
      )}
    </div>
  );
}
