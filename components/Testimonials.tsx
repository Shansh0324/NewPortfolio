"use client";

import { useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { TESTIMONIALS } from "@/lib/testimonials";
import { ChevronLabel } from "./Links";
import Marquee from "./Marquee";
import { Flip, gsap, prefersReducedMotion, useGSAP } from "./motion/gsap";
import styles from "./Testimonials.module.css";

const POSITION_CLASS = [styles.pos0, styles.pos1, styles.pos2, styles.pos3];
const SWIPE_THRESHOLD = 50;

type TestimonialsProps = {
  /** Inline Evermos mark, traced when the card scrolls into view. */
  evermosLogo: ReactNode;
};

/**
 * Spotlight carousel: the first card is the large "featured" card with the
 * full quote; the rest queue behind it as shrinking tiles. Moving rotates the
 * queue and GSAP Flip animates every card to its new slot and size.
 */
export default function Testimonials({ evermosLogo }: TestimonialsProps) {
  const root = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  /** Cards that wrap around the queue; they travel hidden instead of sliding over the others. */
  const jumpers = useRef<string[]>([]);
  const swipeStart = useRef<number | null>(null);
  const busy = useRef(false);
  const [order, setOrder] = useState(() => TESTIMONIALS.map((_, i) => i));

  const active = order[0];
  const total = TESTIMONIALS.length;

  const rotateTo = (index: number) => {
    if (index === active || busy.current) return;
    const cards = trackRef.current?.querySelectorAll("[data-flip-id]");
    if (cards && !prefersReducedMotion()) flipState.current = Flip.getState(cards);
    const start = order.indexOf(index);
    // Moving forward, the leading cards wrap to the back; moving back, the trailing ones jump to the front.
    const forward = start <= total / 2;
    jumpers.current = (forward ? order.slice(0, start) : order.slice(start)).map((i) => TESTIMONIALS[i].id);
    setOrder([...order.slice(start), ...order.slice(0, start)]);
  };
  const next = () => rotateTo(order[1]);
  const prev = () => rotateTo(order[total - 1]);

  // After React re-orders the cards, animate them from their old slots.
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state) return;
    flipState.current = null;
    busy.current = true;

    const featured = trackRef.current?.querySelectorAll(`.${styles.pos0} [data-featured-part]`);
    gsap.set(featured ?? [], { autoAlpha: 0, y: 24 });

    const jumping = jumpers.current
      .map((id) => trackRef.current?.querySelector(`[data-flip-id="${id}"]`))
      .filter(Boolean);
    gsap.fromTo(
      jumping,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.45, delay: 0.6, ease: "power2.out" },
    );

    Flip.from(state, {
      duration: 0.95,
      ease: "expo.inOut",
      nested: true,
      prune: true,
      onComplete: () => {
        busy.current = false;
      },
    });
    gsap.to(featured ?? [], {
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
      ease: "expo.out",
      stagger: 0.07,
      delay: 0.55,
    });
  }, [order]);

  // First appearance: cards slide in one after another.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(trackRef.current?.children ?? [], {
        x: 140,
        autoAlpha: 0,
        duration: 1.3,
        ease: "expo.out",
        stagger: 0.1,
        clearProps: "transform",
        scrollTrigger: { trigger: trackRef.current, start: "top 85%", once: true },
      });
    },
    { scope: root },
  );

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  };

  const onPointerDown = (e: PointerEvent) => {
    swipeStart.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (dx < -SWIPE_THRESHOLD) next();
    else if (dx > SWIPE_THRESHOLD) prev();
  };

  const current = TESTIMONIALS[active];

  return (
    <section
      ref={root}
      className={styles.testimonial}
      id="testimonial"
      aria-labelledby="testimonial-title"
      aria-roledescription="carousel"
      onKeyDown={onKeyDown}
    >
      <h2 id="testimonial-title" className="srOnly">
        Testimonial
      </h2>
      <Marquee word="TESTIMONIAL" repeat={8} gap={20} reverse className={styles.marquee} />

      <div className={styles.viewport}>
        <ul
          ref={trackRef}
          className={styles.track}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipeStart.current = null)}
        >
          {order.map((index, position) => {
            const t = TESTIMONIALS[index];
            const isActive = position === 0;
            return (
              <li
                key={t.id}
                data-flip-id={t.id}
                className={`${styles.card} ${POSITION_CLASS[position] ?? styles.posRest}`}
                aria-roledescription="slide"
                aria-label={`${position + 1} of ${total}: ${t.company}`}
              >
                <div className={styles.featured} aria-hidden={!isActive}>
                  <div className={styles.logo} data-featured-part>
                    {t.id === "evermos" ? (
                      <div role="img" aria-label="Evermos logo" data-reveal="logo" className={styles.logoMark}>
                        {evermosLogo}
                      </div>
                    ) : (
                      <span className={styles.monogram} aria-hidden="true">
                        {t.company.charAt(0)}
                      </span>
                    )}
                  </div>
                  <blockquote className={styles.quote}>
                    <p className={styles.company} data-featured-part>
                      {t.company}
                    </p>
                    <p className={styles.body} data-featured-part>
                      {t.quote}
                    </p>
                    {t.author && (
                      <footer className={styles.author} data-featured-part>
                        — {t.author}
                      </footer>
                    )}
                  </blockquote>
                </div>

                <button
                  type="button"
                  className={styles.tile}
                  onClick={() => rotateTo(index)}
                  tabIndex={isActive ? -1 : 0}
                  aria-hidden={isActive}
                  aria-label={`Show ${t.company} testimonial`}
                >
                  <span>{t.company}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className={styles.fade} aria-hidden="true" />
      </div>

      {/* Progress + controls */}
      <div className={`container ${styles.controls}`}>
        <p className={styles.counter} aria-live="polite">
          <span className="srOnly">Showing testimonial from {current.company}, </span>
          {String(active + 1).padStart(2, "0")}
          <span className={styles.counterTotal}> / {String(total).padStart(2, "0")}</span>
        </p>
        <div className={styles.progress} aria-hidden="true">
          <span className={styles.progressFill} style={{ transform: `scaleX(${(active + 1) / total})` }} />
        </div>
        <div className={styles.arrows}>
          <button type="button" onClick={prev} aria-label="Previous testimonial">
            <ChevronLabel label="" direction="left" className={styles.arrow} />
          </button>
          <button type="button" onClick={next} aria-label="Next testimonial">
            <ChevronLabel label="" direction="right" className={styles.arrow} />
          </button>
        </div>
      </div>
    </section>
  );
}
