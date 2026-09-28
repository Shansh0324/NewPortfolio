"use client";

import { useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion, SplitText, useGSAP } from "@/components/motion/gsap";
import { useIntroReady } from "@/components/motion/MotionProvider";

type DetailHeroMotionProps = {
  className?: string;
  children: ReactNode;
};

/** Entrance for a project page's hero, played once the page transition lifts. */
export default function DetailHeroMotion({ className, children }: DetailHeroMotionProps) {
  const root = useRef<HTMLElement>(null);
  const ready = useIntroReady();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);

      if (!ready) {
        gsap.set(q("[data-anim=title], [data-anim=meta]"), { autoAlpha: 0 });
        gsap.set(q("[data-anim=zigzag] path"), { drawSVG: "0%" });
        return;
      }

      const title = SplitText.create(q("[data-anim=title]"), { type: "lines,chars", mask: "lines" });
      gsap
        .timeline({ defaults: { ease: "expo.out" }, delay: 0.1 })
        .set(q("[data-anim=title]"), { autoAlpha: 1 })
        .from(title.chars, { yPercent: 115, duration: 1.3, stagger: 0.035 })
        .to(q("[data-anim=meta]"), { autoAlpha: 1, duration: 1 }, 0.4)
        .from(q("[data-anim=meta]"), { y: 24, duration: 1, stagger: 0.08 }, 0.4)
        .to(q("[data-anim=zigzag] path"), { drawSVG: "100%", duration: 2, ease: "power2.inOut" }, 0.5);
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section ref={root} className={className}>
      {children}
    </section>
  );
}
