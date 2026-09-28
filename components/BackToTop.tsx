"use client";

import { useLenis } from "lenis/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Magnetic from "./motion/Magnetic";
import styles from "./BackToTop.module.css";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`${styles.wrap} ${visible ? styles.visible : ""}`}>
      <Magnetic>
        <button
          type="button"
          className={styles.button}
          onClick={() => (lenis ? lenis.scrollTo(0, { duration: 2 }) : window.scrollTo({ top: 0 }))}
          aria-label="Back to top"
          tabIndex={visible ? 0 : -1}
        >
          <Image src="/images/back-to-top.svg" alt="" width={150} height={150} />
        </button>
      </Magnetic>
    </div>
  );
}
