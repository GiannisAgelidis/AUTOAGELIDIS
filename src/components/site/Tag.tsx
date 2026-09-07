import type { ReactNode } from "react";

/**
 * Section eyebrow — a small solid square followed by a mono, uppercase label.
 * Monochrome: the marker is current text colour, no accent hue.
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
  const text = tone === "on-ink" ? "text-on-ink" : "text-ink";
  const textSize = size === "lg" ? "text-sm" : "text-[11px]";

  return (
    <span
      className={`inline-flex items-center gap-3 font-mono uppercase tracking-[0.22em] ${textSize} ${text} ${
        interactive ? "transition-colors" : ""
      } ${className}`}
      style={style}
    >
      <span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-current" />
      {children}
    </span>
  );
}
