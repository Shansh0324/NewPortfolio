"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import Magnetic from "./motion/Magnetic";
import Marquee from "./Marquee";
import styles from "./Testimonials.module.css";

const OTHERS = [
  { name: "Vitalog", size: "lg" },
  { name: "Nudelriket", size: "md" },
  { name: "Hypercloud", size: "sm" },
] as const;

type TestimonialsProps = {
  /** Inline Evermos mark, traced when the card scrolls into view. */
  evermosLogo: ReactNode;
};

export default function Testimonials({ evermosLogo }: TestimonialsProps) {
  const trackRef = useRef<HTMLUListElement>(null);

  const scrollNext = () => {
    const track = trackRef.current;
    if (!track) return;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + track.clientWidth * 0.6 });
  };

  return (
    <section className={styles.testimonial} id="testimonial" aria-labelledby="testimonial-title">
      <h2 id="testimonial-title" className="srOnly">
        Testimonial
      </h2>
      <Marquee word="TESTIMONIAL" repeat={8} gap={20} reverse className={styles.marquee} />

      <div className={styles.viewport}>
        <ul className={styles.track} ref={trackRef} data-reveal="stagger-x" data-lenis-prevent-horizontal>
          <li className={styles.featured}>
            <div className={styles.logo} role="img" aria-label="Evermos logo" data-reveal="logo">
              {evermosLogo}
            </div>
            <blockquote className={styles.quote}>
              <p className={styles.company}>Evermos</p>
              <p className={styles.body}>
                A breath of fresh air, Felix’s ability as a designer to seamlessly integrate with
                the team has significantly boosted our individual and collective productivity.
                He&apos;s definitely a great addition to the team!
              </p>
            </blockquote>
          </li>
          {OTHERS.map((item) => (
            <li key={item.name} className={`${styles.tile} ${styles[item.size]}`}>
              <span>{item.name}</span>
            </li>
          ))}
        </ul>

        <div className={styles.fade} aria-hidden="true" />
        <Magnetic className={styles.nextWrap}>
          <button
            type="button"
            className={styles.next}
            onClick={scrollNext}
            aria-label="Next testimonial"
          >
            <Image src="/images/testimonial-arrow.svg" alt="" width={15.6317} height={25.493} />
          </button>
        </Magnetic>
      </div>
    </section>
  );
}
