"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "./gsap";
import { useIntroReady } from "./MotionProvider";
import styles from "./PixelCover.module.css";

type PixelCoverProps = {
  /** "intro": reveal when the page intro plays. "view": reveal when scrolled into view. */
  when?: "intro" | "view";
  /** Seconds to wait after the trigger. */
  delay?: number;
  /** Pixel block size in CSS px. */
  cell?: number;
  /** Seconds for the dissolve. */
  duration?: number;
};

type Cell = { x: number; y: number; t: number; cleared: boolean };

const EDGE = 0.07; // width of the lighter "scan" edge, in progress units

/**
 * A canvas of black pixel blocks laid over its parent (which must be
 * `position: relative`). While the parent's images load the blocks shimmer;
 * once loaded and triggered they dissolve away in a left-to-right sweep.
 */
export default function PixelCover({ when = "view", delay = 0, cell = 18, duration = 1.1 }: PixelCoverProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ready = useIntroReady();
  const triggered = useRef<() => void>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !parent || !ctx) return;

    if (prefersReducedMotion()) {
      canvas.style.display = "none";
      return;
    }

    let cells: Cell[] = [];
    let size = { w: 0, h: 0, cw: cell, ch: cell };
    let revealing = false;
    let disposed = false;

    const layout = () => {
      const { width, height } = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.ceil(width * dpr);
      canvas.height = Math.ceil(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cols = Math.max(1, Math.ceil(width / cell));
      const rows = Math.max(1, Math.ceil(height / cell));
      size = { w: width, h: height, cw: width / cols, ch: height / rows };
      cells = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Mostly random, with a left-to-right bias so it reads as a sweep.
          cells.push({ x: c, y: r, t: Math.random() * 0.65 + (c / cols) * 0.35, cleared: false });
        }
      }
    };

    const fillCell = (c: Cell, color: string) => {
      ctx.fillStyle = color;
      // +0.5 overlap hides hairline seams between blocks.
      ctx.fillRect(c.x * size.cw, c.y * size.ch, size.cw + 0.5, size.ch + 0.5);
    };

    // Loading state: faint pixel static.
    const shimmer = () => {
      ctx.clearRect(0, 0, size.w, size.h);
      for (const c of cells) {
        const v = Math.random() < 0.12 ? 12 + Math.floor(Math.random() * 16) : 0;
        fillCell(c, `rgb(${v},${v},${v})`);
      }
    };

    layout();
    shimmer();

    // Only animate the loading static while the cover is on screen.
    let onScreen = false;
    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    visibility.observe(parent);

    let last = 0;
    const tick = (time: number) => {
      if (onScreen && time - last > 0.12) {
        last = time;
        shimmer();
      }
    };
    gsap.ticker.add(tick);

    const resizeObserver = new ResizeObserver(() => {
      if (revealing) return;
      layout();
      shimmer();
    });
    resizeObserver.observe(parent);

    // Wait for every image in the parent to finish loading.
    const imagesLoaded = Promise.all(
      [...parent.querySelectorAll("img")].map((img) =>
        img.complete && img.naturalWidth > 0
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              img.addEventListener("load", () => resolve(), { once: true });
              img.addEventListener("error", () => resolve(), { once: true });
            }),
      ),
    );

    const trigger = new Promise<void>((resolve) => {
      if (when === "intro") {
        triggered.current = resolve;
      } else {
        ScrollTrigger.create({ trigger: parent, start: "top 90%", once: true, onEnter: () => resolve() });
      }
    });

    let tween: gsap.core.Tween | undefined;
    Promise.all([imagesLoaded, trigger]).then(() => {
      if (disposed) return;
      revealing = true;
      gsap.ticker.remove(tick);
      // Redraw solid before dissolving.
      ctx.clearRect(0, 0, size.w, size.h);
      cells.forEach((c) => fillCell(c, "#000"));

      const state = { p: 0 };
      tween = gsap.to(state, {
        p: 1 + EDGE,
        duration,
        delay,
        ease: "power1.inOut",
        onUpdate: () => {
          for (const c of cells) {
            if (c.cleared) continue;
            if (c.t <= state.p - EDGE) {
              ctx.clearRect(c.x * size.cw, c.y * size.ch, size.cw + 0.5, size.ch + 0.5);
              c.cleared = true;
            } else if (c.t <= state.p) {
              ctx.clearRect(c.x * size.cw, c.y * size.ch, size.cw + 0.5, size.ch + 0.5);
              fillCell(c, "rgba(255,255,255,0.14)"); // brief light pixel at the sweep's edge
            }
          }
        },
        onComplete: () => {
          canvas.style.display = "none";
        },
      });
    });

    return () => {
      disposed = true;
      tween?.kill();
      gsap.ticker.remove(tick);
      resizeObserver.disconnect();
      visibility.disconnect();
    };
  }, [when, delay, cell, duration]);

  // Intro mode: release the reveal once the page intro is allowed to play.
  useEffect(() => {
    if (ready) triggered.current?.();
  }, [ready]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
