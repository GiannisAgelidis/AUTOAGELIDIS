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
    <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em]">
      {routing.locales.map((loc, index) => (
        <span key={loc} className="flex items-center gap-2">
          {index > 0 && <span className="text-on-ink-dim">/</span>}
          <Link
            href={query ? { pathname, query: Object.fromEntries(searchParams) } : pathname}
            locale={loc}
            className={
              loc === locale
                ? "text-on-ink underline underline-offset-4"
                : "text-on-ink-dim transition-colors hover:text-on-ink"
            }
          >
            {loc}
          </Link>
        </span>
      ))}
    </div>
  );
}
