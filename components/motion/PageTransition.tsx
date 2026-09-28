"use client";

import { useLenis } from "lenis/react";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { gsap, prefersReducedMotion, ScrollTrigger, SplitText } from "./gsap";
import styles from "./PageTransition.module.css";

const COLUMNS = 10;

type Navigate = (href: string, label?: string) => void;

const TransitionContext = createContext<Navigate>(() => {});

/** Navigate to another route with the pixel-column wipe. */
export function usePageTransition() {
  return useContext(TransitionContext);
}

type PageTransitionProps = {
  children: ReactNode;
  /** Reports whether the overlay is covering the page (intro animations wait for it). */
  onCoveringChange: (covering: boolean) => void;
};

export default function PageTransition({ children, onCoveringChange }: PageTransitionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const overlayRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const pending = useRef<URL | null>(null);
  const labelSplit = useRef<SplitText | null>(null);
  const busy = useRef(false);

  const scrollToHash = useCallback(
    (hash: string, immediate: boolean) => {
      const target = hash ? document.querySelector(hash) : null;
      if (lenis) lenis.scrollTo(target instanceof HTMLElement ? target : 0, { immediate, force: true });
      else window.scrollTo(0, target instanceof HTMLElement ? target.offsetTop : 0);
    },
    [lenis],
  );

  const navigate = useCallback<Navigate>(
    (href, label) => {
      const url = new URL(href, window.location.href);

      // Same page: just glide to the section.
      if (url.pathname === window.location.pathname) {
        if (url.hash) scrollToHash(url.hash, false);
        else lenis?.scrollTo(0, { duration: 1.6 });
        return;
      }
      if (busy.current) return;
      busy.current = true;
      router.prefetch(url.pathname);

      const go = () => {
        pending.current = url;
        router.push(url.pathname + url.search + url.hash, { scroll: false });
      };

      if (prefersReducedMotion()) {
        onCoveringChange(true);
        go();
        return;
      }

      const overlay = overlayRef.current!;
      const q = gsap.utils.selector(overlay);
      // Revert the previous split first: SplitText restores an element's original
      // markup when it is split again, which would bring back the old label.
      labelSplit.current?.revert();
      if (labelRef.current) labelRef.current.textContent = label ?? "";
      const split = SplitText.create(labelRef.current, { type: "chars", mask: "chars" });
      labelSplit.current = split;

      lenis?.stop();
      onCoveringChange(true);
      gsap
        .timeline({ onComplete: go })
        .set(overlay, { visibility: "visible" })
        .set(q(`.${styles.column}`), { yPercent: 100 })
        .to(q(`.${styles.light}`), {
          yPercent: 0,
          duration: 0.7,
          ease: "expo.inOut",
          stagger: { each: 0.035, from: "start" },
        })
        .to(
          q(`.${styles.dark}`),
          { yPercent: 0, duration: 0.7, ease: "expo.inOut", stagger: { each: 0.035, from: "start" } },
          0.12,
        )
        .fromTo(
          split.chars,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.6, ease: "expo.out", stagger: 0.03 },
          0.55,
        )
        .fromTo(
          q(`.${styles.line}`),
          { scaleX: 0 },
          { scaleX: 1, duration: 0.6, ease: "expo.inOut" },
          0.55,
        );
    },
    [lenis, router, scrollToHash, onCoveringChange],
  );

  // After the new route renders: jump to its top (or #hash) and lift the overlay.
  useEffect(() => {
    const url = pending.current;
    if (!url) return;
    pending.current = null;

    const frame = requestAnimationFrame(() => {
      lenis?.start();
      scrollToHash(url.hash, true);
      ScrollTrigger.refresh();

      const overlay = overlayRef.current!;
      const q = gsap.utils.selector(overlay);
      const done = () => {
        busy.current = false;
        gsap.set(overlay, { visibility: "hidden" });
        gsap.set(q(`.${styles.column}`), { yPercent: 100 });
      };

      if (prefersReducedMotion()) {
        onCoveringChange(false);
        done();
        return;
      }

      gsap
        .timeline({ onComplete: done })
        .to(q(`.${styles.label}, .${styles.line}`), {
          autoAlpha: 0,
          y: -30,
          duration: 0.45,
          ease: "power3.in",
        })
        .set(q(`.${styles.light}`), { yPercent: -100 })
        .call(() => onCoveringChange(false))
        .to(q(`.${styles.dark}`), {
          yPercent: -100,
          duration: 0.9,
          ease: "expo.inOut",
          stagger: { each: 0.04, from: "edges" },
        })
        .set(q(`.${styles.label}, .${styles.line}`), { autoAlpha: 1, y: 0 });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, lenis, scrollToHash, onCoveringChange]);

  return (
    <TransitionContext value={navigate}>
      {children}
      <div className={styles.overlay} ref={overlayRef} aria-hidden="true">
        <div className={styles.columns}>
          {Array.from({ length: COLUMNS }, (_, i) => (
            <span key={`l${i}`} className={`${styles.column} ${styles.light}`} />
          ))}
        </div>
        <div className={styles.columns}>
          {Array.from({ length: COLUMNS }, (_, i) => (
            <span key={`d${i}`} className={`${styles.column} ${styles.dark}`} />
          ))}
        </div>
        <div className={styles.center}>
          <p className={styles.label} ref={labelRef} />
          <span className={styles.line} />
        </div>
      </div>
    </TransitionContext>
  );
}
