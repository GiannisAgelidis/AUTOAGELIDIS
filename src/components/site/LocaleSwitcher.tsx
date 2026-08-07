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
    <div className="flex items-center gap-1 text-xs font-mono uppercase tracking-wider">
      {routing.locales.map((loc, index) => (
        <span key={loc} className="flex items-center gap-1">
          {index > 0 && <span className="text-steel">/</span>}
          <Link
            href={query ? { pathname, query: Object.fromEntries(searchParams) } : pathname}
            locale={loc}
            className={
              loc === locale
                ? "text-amber"
                : "text-paper/60 transition-colors hover:text-paper"
            }
          >
            {loc}
          </Link>
        </span>
      ))}
    </div>
  );
}
