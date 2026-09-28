import Image from "next/image";
import InlineSvg from "./InlineSvg";
import HeroMotion from "./motion/HeroMotion";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} id="top">
      <h1 className="srOnly">Halo, I’m Felix — Graphics • UI/UX designer</h1>

      <HeroMotion className={styles.stage}>
        <InlineSvg
          src="images/bg-arc.svg"
          idPrefix="hero-arc"
          className={styles.arc}
          data-anim="arc"
        />
        <InlineSvg
          src="images/hero-years.svg"
          idPrefix="hero-years"
          className={styles.years}
          data-anim="years"
        />
        <InlineSvg
          src="images/hero-skills.svg"
          idPrefix="hero-skills"
          className={styles.skills}
          data-anim="skills"
        />
        <Image
          src="/images/hero-felix.svg"
          alt=""
          width={1016}
          height={439}
          className={styles.felix}
          data-anim="felix"
          priority
        />

        <div className={styles.halo} data-anim="halo" aria-hidden="true">
          <p>
            <span className={styles.script}>H</span>a<span className={styles.script}>l</span>
            o, I’m<span className={styles.caret}>|</span>
          </p>
          <span className={`${styles.handle} ${styles.tl}`} data-handle />
          <span className={`${styles.handle} ${styles.tr}`} data-handle />
          <span className={`${styles.handle} ${styles.bl}`} data-handle />
          <span className={`${styles.handle} ${styles.br}`} data-handle />
        </div>

        <Image
          src="/images/hero-cursor.svg"
          alt=""
          width={48.3443}
          height={52.7063}
          className={styles.cursor}
          data-anim="cursor"
          aria-hidden="true"
        />
      </HeroMotion>
    </section>
  );
}
