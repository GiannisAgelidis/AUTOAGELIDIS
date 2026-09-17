"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type RevealDirection = "up" | "left" | "right";
export type RevealMode = "replay" | "timed";

const OFFSET: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 20 },
  left: { x: -56, y: 0 },
  right: { x: 56, y: 0 },
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Reveal({
  children,
  delay = 150,
  direction = "up",
  mode = "replay",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  direction?: RevealDirection;
  /**
   * "replay" (default) fades and slides the section in every time it
   * crosses ~30% into view, and reverses back out if the visitor scrolls
   * away — the same threshold/toggle/easing as the reference collage demo,
   * so the motion replays each time a section is revisited rather than
   * locking in place after the first entrance.
   * "timed" is the legacy trigger-once-then-animate-on-a-clock behaviour,
   * kept for above-the-fold content (e.g. the hero) that should play its
   * entrance choreography on load rather than wait on scroll position.
   */
  mode?: RevealMode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(() => mode === "replay" && prefersReducedMotion());

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (mode === "timed") {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.15 },
      );

      observer.observe(el);
      return () => observer.disconnect();
    }

    if (prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [mode]);

  if (mode === "timed") {
    const directionClass =
      direction === "left" ? "reveal-left" : direction === "right" ? "reveal-right" : "reveal";

    return (
      <div
        ref={ref}
        className={`${directionClass} ${visible ? "is-visible" : ""} ${className}`}
        style={{ transitionDelay: visible ? `${delay}ms` : undefined }}
      >
        {children}
      </div>
    );
  }

  const { x, y } = OFFSET[direction];

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate3d(0, 0, 0)" : `translate3d(${x}px, ${y}px, 0)`,
        transition: "opacity 1.1s ease, transform 1.1s cubic-bezier(0.22, 0.61, 0.36, 1)",
        transitionDelay: visible ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}
