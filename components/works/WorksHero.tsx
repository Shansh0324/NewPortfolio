import Image from "next/image";
import type { ReactNode } from "react";
import Marquee from "@/components/Marquee";
import heroBanner from "@/public/images/works/hero-banner.png";
import WorksHeroMotion from "./WorksHeroMotion";
import styles from "./WorksHero.module.css";

type WorksHeroProps = {
  /** Inline zigzag rule (drawn on entrance). */
  zigzag: ReactNode;
};

export default function WorksHero({ zigzag }: WorksHeroProps) {
  return (
    <WorksHeroMotion className={styles.hero}>
      <h1 className="srOnly">Works</h1>

      <div className="container">
        <div className={styles.banner} data-anim="banner">
          <Image
            src={heroBanner}
            alt="Laptop held up against a blue sky"
            sizes="(max-width: 1440px) 100vw, 1340px"
            placeholder="blur"
            priority
            className={styles.bannerImage}
          />
        </div>
      </div>

      <div className={styles.bigWords} data-anim="words" aria-hidden="true">
        <div data-anim="words-inner">
          <Marquee word="WORKS" repeat={3} gap="0.3em" plain duration={60} className={styles.bigMarquee} />
        </div>
      </div>

      <div className={styles.zigzag} data-anim="zigzag" aria-hidden="true">
        {zigzag}
      </div>
    </WorksHeroMotion>
  );
}
