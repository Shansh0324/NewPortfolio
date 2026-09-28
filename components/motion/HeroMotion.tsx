"use client";

import { useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion, SplitText, useGSAP } from "./gsap";
import { useIntroReady } from "./MotionProvider";

type HeroMotionProps = {
  className?: string;
  children: ReactNode;
};

/**
 * Plays the hero entrance once the preloader clears, then adds scroll parallax.
 * Targets children by their `data-anim` attribute.
 */
export default function HeroMotion({ className, children }: HeroMotionProps) {
  const root = useRef<HTMLDivElement>(null);
  const ready = useIntroReady();

  // Hide everything up front (the preloader is covering the page at this point).
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      gsap.set(q("[data-anim]"), { autoAlpha: 0 });
      gsap.set(q("[data-anim=arc] path"), { drawSVG: "50% 50%" });

      // Depth on scroll: each layer drifts at its own speed as the hero leaves.
      const layers: [string, number][] = [
        ["skills", -18],
        ["years", -10],
        ["felix", -26],
        ["halo", -40],
        ["cursor", -60],
      ];
      layers.forEach(([name, yPercent]) => {
        gsap.to(q(`[data-anim=${name}]`), {
          yPercent,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (!ready || prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const haloText = q("[data-anim=halo] p");
      const split = SplitText.create(haloText, { type: "chars" });

      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .set(q("[data-anim]"), { autoAlpha: 1 })
        // Arc sweeps outward from the centre.
        .to(q("[data-anim=arc] path"), { drawSVG: "0% 100%", duration: 2.4, ease: "power3.inOut" }, 0)
        // Background rows cascade in letter by letter.
        .from(
          q("[data-anim=skills] g g path"),
          { autoAlpha: 0, y: 60, duration: 1.1, stagger: 0.008 },
          0.1,
        )
        .from(
          q("[data-anim=years] g g path"),
          { autoAlpha: 0, y: -50, duration: 1.1, stagger: 0.025 },
          0.2,
        )
        // Pixel name wipes in with stepped (pixel-snapped) timing, then flickers on.
        .fromTo(
          q("[data-anim=felix]"),
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "steps(22)" },
          0.35,
        )
        .fromTo(
          q("[data-anim=felix]"),
          { opacity: 0.35 },
          { opacity: 1, duration: 0.08, repeat: 4, yoyo: true, ease: "none" },
          1.6,
        )
        // Selection box is "dragged" out from its top-left corner.
        .from(
          q("[data-anim=halo]"),
          { scale: 0.15, transformOrigin: "0% 0%", duration: 1.1, ease: "expo.inOut" },
          0.15,
        )
        .from(
          q("[data-anim=halo] [data-handle]"),
          { scale: 0, duration: 0.5, ease: "back.out(4)", stagger: 0.06 },
          0.9,
        )
        .from(
          split.chars,
          { yPercent: 80, autoAlpha: 0, rotate: 8, duration: 0.9, stagger: 0.04 },
          0.95,
        )
        // Cursor flies in and "clicks" the box.
        .from(
          q("[data-anim=cursor]"),
          { x: "30vw", y: "22vh", rotate: -25, duration: 1.4, ease: "power4.out" },
          0.9,
        )
        .to(
          q("[data-anim=cursor]"),
          { scale: 0.78, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.inOut" },
          ">-0.2",
        );
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
