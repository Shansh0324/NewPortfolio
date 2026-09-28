"use client";

import { useLenis } from "lenis/react";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger, SplitText, useGSAP } from "./gsap";
import styles from "./Preloader.module.css";

const COLUMNS = 10;
const MAX_WAIT_MS = 3500;

type PreloaderProps = {
  mark: ReactNode;
  onComplete: () => void;
};

/** Resolves when fonts and the initial page assets are in (capped so it never hangs). */
function pageAssetsReady() {
  const loaded = new Promise<void>((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", () => resolve(), { once: true });
  });
  const timeout = new Promise<void>((resolve) => setTimeout(resolve, MAX_WAIT_MS));
  return Promise.race([Promise.all([loaded, document.fonts.ready]), timeout]);
}

export default function Preloader({ mark, onComplete }: PreloaderProps) {
  const root = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    lenisRef.current = lenis;
    onCompleteRef.current = onComplete;
  });

  // Always start at the top, and hold scrolling until the intro has played.
  useEffect(() => {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!lenis) return;
    lenis.stop();
    return () => lenis.start();
  }, [lenis]);

  useGSAP(
    () => {
      const finish = () => {
        lenisRef.current?.start();
        ScrollTrigger.refresh();
        onCompleteRef.current();
      };

      if (prefersReducedMotion()) {
        pageAssetsReady().then(() => {
          gsap.to(root.current, { autoAlpha: 0, duration: 0.4, onComplete: finish });
        });
        return;
      }

      const q = gsap.utils.selector(root);
      const counter = { value: 0 };
      const countEl = q(`.${styles.count}`)[0];
      const renderCount = () => {
        countEl.textContent = String(Math.round(counter.value)).padStart(3, "0");
      };
      const tagline = SplitText.create(q(`.${styles.tagline}`), { type: "chars", mask: "chars" });
      const markPath = q(`.${styles.mark} path`);

      gsap.set(markPath, { drawSVG: "0%", fillOpacity: 0 });

      // 1. Draw the selection box, then trace and fill the pixel "F".
      const intro = gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from(q(`.${styles.handle}`), {
          scale: 0,
          duration: 0.6,
          ease: "back.out(3)",
          stagger: 0.07,
        })
        .from(q(`.${styles.edgeH}`), { scaleX: 0, duration: 1, ease: "expo.inOut" }, 0.15)
        .from(q(`.${styles.edgeV}`), { scaleY: 0, duration: 1, ease: "expo.inOut" }, 0.15)
        .to(markPath, { drawSVG: "100%", duration: 1.5, ease: "power2.inOut" }, 0.45)
        .to(markPath, { fillOpacity: 1, duration: 0.5, ease: "power2.out" }, ">-0.25")
        .from(tagline.chars, { yPercent: 110, duration: 0.8, stagger: 0.025 }, 0.6)
        .from(q(`.${styles.meta}`), { autoAlpha: 0, y: 12, duration: 0.8, stagger: 0.1 }, 0.5)
        .to(counter, { value: 86, duration: 2, ease: "power2.inOut", onUpdate: renderCount }, 0.3)
        .to(q(`.${styles.barFill}`), { scaleX: 0.86, duration: 2, ease: "power2.inOut" }, 0.3);

      // 2. Once assets are in, finish the count and wipe away in pixel columns.
      const outro = () =>
        gsap
          .timeline()
          .to(counter, { value: 100, duration: 0.5, ease: "power2.out", onUpdate: renderCount })
          .to(q(`.${styles.barFill}`), { scaleX: 1, duration: 0.5, ease: "power2.out" }, "<")
          .to(q(`.${styles.box}`), { scale: 1.08, duration: 0.5, ease: "power2.in" }, "+=0.1")
          .to(
            q(`.${styles.content}`),
            { autoAlpha: 0, yPercent: -12, duration: 0.55, ease: "power3.in" },
            "<",
          )
          .to(q(`.${styles.bar}`), { scaleX: 0, transformOrigin: "right", duration: 0.5 }, "<")
          .to(
            q(`.${styles.column}`),
            {
              yPercent: -100,
              duration: 1.05,
              ease: "expo.inOut",
              stagger: { each: 0.045, from: "edges" },
            },
            "-=0.1",
          )
          .call(finish, [], "-=0.7")
          .set(root.current, { display: "none" });

      Promise.all([pageAssetsReady(), intro.then()]).then(outro);
    },
    { scope: root },
  );

  return (
    <div className={styles.preloader} ref={root} role="status" aria-label="Loading">
      <div className={styles.columns} aria-hidden="true">
        {Array.from({ length: COLUMNS }, (_, i) => (
          <span key={i} className={styles.column} />
        ))}
      </div>

      <div className={styles.content} aria-hidden="true">
        <div className={styles.box}>
          <span className={`${styles.edgeH} ${styles.top}`} />
          <span className={`${styles.edgeH} ${styles.bottom}`} />
          <span className={`${styles.edgeV} ${styles.left}`} />
          <span className={`${styles.edgeV} ${styles.right}`} />
          <span className={`${styles.handle} ${styles.tl}`} />
          <span className={`${styles.handle} ${styles.tr}`} />
          <span className={`${styles.handle} ${styles.bl}`} />
          <span className={`${styles.handle} ${styles.br}`} />
          <div className={styles.mark}>{mark}</div>
        </div>
        <p className={styles.tagline}>GRAPHICS • UI/UX</p>
      </div>

      <div className={styles.footer} aria-hidden="true">
        <span className={styles.meta}>Felix — Portfolio</span>
        <span className={styles.meta}>
          <span className={styles.count}>000</span>
        </span>
      </div>
      <div className={styles.bar} aria-hidden="true">
        <span className={styles.barFill} />
      </div>
    </div>
  );
}
