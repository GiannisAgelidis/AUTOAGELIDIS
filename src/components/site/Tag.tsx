import type { ReactNode } from "react";

/**
 * Recurring label style used for section eyebrows and the price display —
 * a plain rectangular banner with an amber accent edge.
 */
export default function Tag({
  children,
  tone = "on-paper",
  size = "sm",
  interactive = false,
  className = "",
  style,
}: {
  children: ReactNode;
  tone?: "on-paper" | "on-ink";
  size?: "sm" | "lg";
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const bg = tone === "on-ink" ? "bg-paper text-ink" : "bg-ink text-paper";
  const padding = size === "lg" ? "py-2 pl-4 pr-5" : "py-1.5 pl-3 pr-4";
  const textSize = size === "lg" ? "text-base" : "text-xs";

  return (
    <span
      className={`inline-flex items-center gap-2 border-l-2 border-amber font-mono uppercase tracking-wider ${textSize} ${padding} ${bg} ${interactive ? "tag-interactive" : ""} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}
