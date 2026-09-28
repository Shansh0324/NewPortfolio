"use client";

import { useEffect } from "react";
import { gsap, REDUCED_MOTION, ScrollTrigger, SplitText } from "./gsap";

/**
 * Declarative scroll animations. Sections opt in with data attributes:
 *
 *   data-reveal="split"     heading characters rise out of a mask
 *   data-reveal="words"     words brighten one by one as the text scrolls through
 *   data-reveal="up"        element fades up
 *   data-reveal="stagger"   direct children fade up one after another
 *   data-reveal="stagger-x" direct children slide in from the right
 *   data-reveal="card"      [data-reveal-media] wipes open, [data-reveal-text] children fade up
 *   data-reveal="collage"   photos tumble into place
 *   data-reveal="pill"      rounded frame opens from the centre
 *   data-reveal="line"      rule draws left → right with the scroll
 *   data-reveal="logo"      SVG mark is traced, then filled
 *   data-draw               SVG strokes draw with the scroll
 *   data-parallax="12"      drifts vertically by ±12% while in view
 *   data-parallax-x="8"     drifts horizontally by ±8% while in view
 */
export default function ScrollAnimations() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    let cancelled = false;

    // Split text only after webfonts are in, so character metrics are final.
    document.fonts.ready.then(() => {
      if (cancelled) return;

      mm.add(`not all and ${REDUCED_MOTION}`, () => {
        const all = <T extends Element = HTMLElement>(sel: string) =>
          gsap.utils.toArray<T>(sel);
        // clamp() keeps triggers reachable for content near the end of the page.
        const enter = (trigger: Element, start = "top 85%") => ({
          trigger,
          start: `clamp(${start})`,
          toggleActions: "play none none reverse",
        });

        all("[data-reveal=split]").forEach((el) => {
          SplitText.create(el, {
            type: "lines,chars",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.chars, {
                yPercent: 110,
                duration: 1,
                ease: "expo.out",
                stagger: 0.03,
                scrollTrigger: enter(el, "top 90%"),
              }),
          });
        });

        all("[data-reveal=words]").forEach((el) => {
          SplitText.create(el, {
            type: "words",
            autoSplit: true,
            onSplit: (self) =>
              gsap.fromTo(
                self.words,
                { opacity: 0.18 },
                {
                  opacity: 1,
                  ease: "none",
                  stagger: 0.1,
                  scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.6 },
                },
              ),
          });
        });

        all("[data-reveal=up]").forEach((el) => {
          gsap.from(el, {
            y: 50,
            autoAlpha: 0,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: enter(el),
          });
        });

        all("[data-reveal=stagger]").forEach((el) => {
          gsap.from(el.children, {
            y: 60,
            autoAlpha: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.09,
            scrollTrigger: enter(el),
          });
        });

        all("[data-reveal=stagger-x]").forEach((el) => {
          gsap.from(el.children, {
            x: 140,
            autoAlpha: 0,
            duration: 1.3,
            ease: "expo.out",
            stagger: 0.1,
            scrollTrigger: enter(el),
          });
        });

        all("[data-reveal=card]").forEach((card) => {
          const media = card.querySelector("[data-reveal-media]");
          const text = card.querySelector("[data-reveal-text]");
          const tl = gsap.timeline({ scrollTrigger: enter(card, "top 80%") });
          if (media) {
            tl.fromTo(
              media,
              { clipPath: "inset(100% 0% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" },
            ).from(
              media.querySelector("img"),
              { scale: 1.35, duration: 1.8, ease: "expo.out" },
              0.2,
            );
          }
          if (text) {
            tl.from(
              text.children,
              { y: 40, autoAlpha: 0, duration: 1, ease: "expo.out", stagger: 0.08 },
              0.5,
            );
          }
        });

        all("[data-reveal=collage]").forEach((el) => {
          const photos = gsap.utils.toArray<HTMLElement>(el.querySelectorAll(":scope > * > *"));
          gsap.from(photos, {
            y: 140,
            rotate: () => gsap.utils.random(-14, 14),
            scale: 0.8,
            autoAlpha: 0,
            duration: 1.3,
            ease: "expo.out",
            stagger: 0.12,
            scrollTrigger: enter(el, "top 88%"),
          });
        });

        all("[data-reveal=pill]").forEach((el) => {
          gsap
            .timeline({ scrollTrigger: enter(el) })
            .fromTo(
              el,
              { clipPath: "inset(0% 50% 0% 50% round 200px)" },
              { clipPath: "inset(0% 0% 0% 0% round 200px)", duration: 1.4, ease: "expo.inOut" },
            )
            .from(el.children, { xPercent: -8, autoAlpha: 0, duration: 1.2, ease: "expo.out" }, 0.5);
        });

        all("[data-reveal=line]").forEach((el) => {
          gsap.fromTo(
            el,
            { scaleX: 0 },
            {
              scaleX: 1,
              transformOrigin: "left center",
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 95%", end: "top 45%", scrub: 0.6 },
            },
          );
        });

        all("[data-reveal=logo]").forEach((el) => {
          const paths = el.querySelectorAll("path");
          gsap
            .timeline({ scrollTrigger: enter(el) })
            .fromTo(paths, { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.6, ease: "power2.inOut" })
            .fromTo(paths, { fillOpacity: 0 }, { fillOpacity: 1, duration: 0.6 }, ">-0.3");
        });

        all("[data-draw]").forEach((el) => {
          gsap.fromTo(
            el.querySelectorAll("path"),
            { drawSVG: "0%" },
            {
              drawSVG: "100%",
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 90%", end: "bottom 40%", scrub: 0.8 },
            },
          );
        });

        all("[data-parallax]").forEach((el) => {
          const amount = Number(el.dataset.parallax) || 10;
          gsap.fromTo(
            el,
            { yPercent: amount },
            {
              yPercent: -amount,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });

        all("[data-parallax-x]").forEach((el) => {
          const amount = Number(el.dataset.parallaxX) || 8;
          gsap.fromTo(
            el,
            { xPercent: amount },
            {
              xPercent: -amount,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });

      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      mm.revert();
    };
  }, []);

  return null;
}
