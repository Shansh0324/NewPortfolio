"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "./motion/gsap";
import Marquee from "./Marquee";
import Photo from "./Photo";
import photoDashboard from "@/public/images/photo-dashboard.png";
import photoMapApp from "@/public/images/photo-map-app.png";
import styles from "./About.module.css";

export default function About() {
  const windowRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  // The paragraph is taller than its fading window: scrub it with the page so
  // the whole bio passes through the bright middle of the window.
  useGSAP(() => {
    const win = windowRef.current;
    const text = textRef.current;
    if (!win || !text || prefersReducedMotion()) return;

    gsap.fromTo(
      text,
      { y: () => win.clientHeight * 0.3 },
      {
        y: () => -(text.offsetHeight - win.clientHeight * 0.45),
        ease: "none",
        scrollTrigger: {
          trigger: win,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      },
    );
  });

  return (
    <section className={styles.about} id="about" aria-labelledby="about-title">
      <h2 id="about-title" className="srOnly">
        About
      </h2>
      <Marquee word="ABOUT" repeat={12} gap={25} revealOnIntro={1.2} className={styles.marquee} />

      <div className={`container ${styles.grid}`}>
        <div className={styles.textWindow} ref={windowRef}>
          <p className={styles.text} ref={textRef}>
            <span className={styles.dim}>
              Felix is an undergraduate student from Universitas Mulawarman, majoring in
              Informatics—also known as Computer Science.
            </span>{" "}
            His journey into the world of designs started many moons ago, driven by a passion
            for creativity and an eye for perfection.{" "}
            <span className={styles.dim}>
              Over the years, Felix honed his skills, mastering the art of detail and developing
              an impressive flair for design. In the last two years, his growth skyrocketed as he
              collaborated with clients and companies, turning creative visions into polished
              realities. Now, Felix stands at the peak of his potential, combining his technical
              expertise and artistic talent to deliver designs that are not just aesthetically
              pleasing, but also impactful.
            </span>
          </p>
          <a href="#clients" className={styles.marker} aria-label="Scroll to clients">
            <Image src="/images/scroll-marker.svg" alt="" width={36.693} height={39.8317} />
          </a>
        </div>

        <div className={styles.photoWindow}>
          <div className={styles.photos} data-parallax="7">
            <Photo
              src={photoDashboard}
              alt="Laptop showing a dashboard design"
              sizes="(max-width: 767px) 50vw, 380px"
              crop={{ width: 160.92, height: 120.69, left: -16.67, top: -10.34 }}
              className={styles.photoSmall}
              pixelReveal
            />
            <Photo
              src="/images/photo-login-app.png"
              alt="Phone showing a login screen design"
              sizes="(max-width: 767px) 40vw, 300px"
              className={styles.photoLarge}
              pixelReveal
              priority
            />
            <Photo
              src={photoMapApp}
              alt="Phone showing a delivery tracking map design"
              sizes="(max-width: 767px) 50vw, 380px"
              crop={{ width: 158.79, height: 119.1, left: -39.29, top: -17.39 }}
              className={styles.photoSmall}
              pixelReveal
            />
          </div>
        </div>
      </div>
    </section>
  );
}
