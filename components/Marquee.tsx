"use client";

import { useLenis } from "lenis/react";
import { useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "./motion/gsap";
import styles from "./Marquee.module.css";

type MarqueeProps = {
  word: string;
  /** How many copies make up one loop; should overflow the widest screen. */
  repeat?: number;
  /** Space between words: px number or any CSS length (e.g. "0.3em"). */
  gap?: number | string;
  /** Run right-to-left (default) or left-to-right. */
  reverse?: boolean;
  /** Drop the top/bottom rules (used for the giant "WORKS" bands). */
  plain?: boolean;
  /** Seconds for one full loop at rest. */
  duration?: number;
  className?: string;
};

/**
 * The bordered, endlessly scrolling word band ("ABOUT ABOUT …").
 * It speeds up with scroll velocity and follows the scroll direction.
 */
export default function Marquee({
  word,
  repeat = 12,
  gap = 25,
  reverse,
  plain,
  duration = 40,
  className,
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const state = useRef({ x: 0, direction: 1, boost: 0 });
  const words = Array.from({ length: repeat }, () => word);

  useLenis(({ velocity }) => {
    if (velocity === 0) return;
    state.current.direction = velocity > 0 ? 1 : -1;
    state.current.boost = Math.min(Math.abs(velocity) * 0.8, 14);
  });

  useGSAP(() => {
    if (prefersReducedMotion() || !trackRef.current) return;
    const setX = gsap.quickSetter(trackRef.current, "xPercent");
    const sign = reverse ? -1 : 1;
    const speed = 50 / (duration * 1000); // % of the track per ms

    const tick = (_time: number, deltaMs: number) => {
      const s = state.current;
      s.boost *= 0.92;
      s.x -= speed * deltaMs * (1 + s.boost) * s.direction * sign;
      if (s.x <= -50) s.x += 50;
      if (s.x > 0) s.x -= 50;
      setX(s.x);
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  });

  return (
    <div
      className={`${styles.band} ${plain ? styles.plain : ""} ${className ?? ""}`}
      style={{ "--gap": typeof gap === "number" ? `${gap}px` : gap } as React.CSSProperties}
      aria-hidden="true"
    >
      <div className={styles.track} ref={trackRef}>
        {[0, 1].map((copy) => (
          <div className={styles.group} key={copy}>
            {words.map((w, i) => (
              <span key={i}>{w}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
