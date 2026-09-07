import type { ReactNode } from "react";

/**
 * Section eyebrow — a short signal-red rule followed by a mono, uppercase label.
 * Used to open every section and to badge small pieces of metadata.
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
  const text = tone === "on-ink" ? "text-on-dark" : "text-ink";
  const textSize = size === "lg" ? "text-sm" : "text-xs";

  return (
    <span
      className={`inline-flex items-center gap-3 font-mono uppercase tracking-[0.18em] ${textSize} ${text} ${
        interactive ? "transition-colors" : ""
      } ${className}`}
      style={style}
    >
      <span aria-hidden className="h-px w-8 shrink-0 bg-signal" />
      {children}
    </span>
  );
}
