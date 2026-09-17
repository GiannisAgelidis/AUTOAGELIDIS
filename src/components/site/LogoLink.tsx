"use client";

import type { MouseEvent, ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";

/**
 * Same root cause as ScrollLink: Next's Link only resets scroll on an
 * actual route change. Clicking the logo while already on "/" was a no-op
 * — nothing to navigate to, so nothing scrolled back up to the hero either.
 */
export default function LogoLink({
  className,
  ariaLabel,
  children,
}: {
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <Link href="/" onClick={handleClick} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
