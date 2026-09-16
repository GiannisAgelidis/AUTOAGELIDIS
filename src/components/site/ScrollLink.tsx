"use client";

import type { MouseEvent, ReactNode } from "react";
import { Link } from "@/i18n/navigation";

/**
 * Same-page section link. Next.js's Link only reliably scrolls to a hash
 * target on a real pathname change — clicking a hash link while already on
 * that route (e.g. a second click, or any click after the first) can be a
 * no-op. Scrolling manually here makes every click work the same way,
 * regardless of what the router already considers "current".
 */
export default function ScrollLink({
  targetId,
  className,
  onClick,
  children,
}: {
  targetId: string;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      if (window.location.hash !== `#${targetId}`) {
        window.history.pushState(null, "", `#${targetId}`);
      }
    }
    onClick?.();
  }

  return (
    <Link href={`/#${targetId}`} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
