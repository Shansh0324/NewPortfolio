"use client";

import { useLenis } from "lenis/react";
import { useRef } from "react";
import styles from "./ScrollProgress.module.css";

/** Hairline progress rail on the right edge — stands in for the hidden scrollbar. */
export default function ScrollProgress() {
  const barRef = useRef<HTMLSpanElement>(null);

  useLenis(({ progress }) => {
    if (barRef.current) barRef.current.style.transform = `scaleY(${progress})`;
  });

  return (
    <div className={styles.rail} aria-hidden="true">
      <span ref={barRef} className={styles.bar} />
    </div>
  );
}
