"use client";

import { useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/components/motion/gsap";
import { useIntroReady } from "@/components/motion/MotionProvider";

type WorksHeroMotionProps = {
  className?: string;
  children: ReactNode;
};

/** Entrance for the Works hero, played once the page transition lifts. */
export default function WorksHeroMotion({ className, children }: WorksHeroMotionProps) {
  const root = useRef<HTMLElement>(null);
  const ready = useIntroReady();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);

      if (!ready) {
        gsap.set(q("[data-anim=banner]"), { clipPath: "inset(50% 0% 50% 0%)" });
        gsap.set(q("[data-anim=words-inner]"), { yPercent: 105 });
        gsap.set(q("[data-anim=zigzag] path"), { drawSVG: "0%" });
        return;
      }

      gsap
        .timeline({ defaults: { ease: "expo.out" }, delay: 0.15 })
        .to(q("[data-anim=banner]"), { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" })
        .from(q("[data-anim=banner] img"), { scale: 1.4, duration: 2 }, 0.2)
        .to(q("[data-anim=words-inner]"), { yPercent: 0, duration: 1.5 }, 0.45)
        .to(q("[data-anim=zigzag] path"), { drawSVG: "100%", duration: 2, ease: "power2.inOut" }, 0.7);

      // Banner drifts slower than the page for a little depth.
      gsap.to(q("[data-anim=banner] img"), {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section ref={root} className={className}>
      {children}
    </section>
  );
}
