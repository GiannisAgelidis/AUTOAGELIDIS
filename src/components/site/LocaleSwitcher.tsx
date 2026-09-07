"use client";

import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  return (
    <div className="flex items-center rounded-full border border-on-dark-line p-0.5 font-mono text-[11px] uppercase tracking-[0.12em]">
      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href={query ? { pathname, query: Object.fromEntries(searchParams) } : pathname}
          locale={loc}
          className={
            loc === locale
              ? "rounded-full bg-signal px-2.5 py-1 text-white"
              : "rounded-full px-2.5 py-1 text-on-dark/55 transition-colors hover:text-on-dark"
          }
        >
          {loc}
        </Link>
      ))}
    </div>
  );
}
