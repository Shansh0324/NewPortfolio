"use client";

import { useLenis } from "lenis/react";
import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowLink } from "./Links";
import { gsap, prefersReducedMotion, useGSAP } from "./motion/gsap";
import Magnetic from "./motion/Magnetic";
import { useIntroReady } from "./motion/MotionProvider";
import TransitionLink from "./motion/TransitionLink";
import styles from "./Header.module.css";

export const NAV_ITEMS = [
  { id: "about", label: "ABOUT" },
  { id: "clients", label: "CLIENTS" },
  { id: "works", label: "WORKS" },
  { id: "services", label: "SERVICES" },
  { id: "testimonial", label: "TESTIMONIAL" },
  { id: "contact", label: "CONTACT" },
] as const;

type HeaderProps = {
  /** Set on sub-pages; nav links then route back to the home page sections. */
  page?: "works";
};

export default function Header({ page }: HeaderProps) {
  const isHome = !page;
  const [active, setActive] = useState<string>(page ?? "about");
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const ready = useIntroReady();

  // Slide the bar in with the hero intro.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(headerRef);
      const items = q("[data-header-item]");
      if (!ready) {
        gsap.set(items, { autoAlpha: 0, y: -24 });
        return;
      }
      gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.06,
        delay: 0.5,
      });
    },
    { scope: headerRef, dependencies: [ready] },
  );

  // Highlight the nav item for the section currently in view (home page only).
  useEffect(() => {
    if (!isHome) return;
    const sections = NAV_ITEMS.map(({ id }) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    lenis?.stop();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, lenis]);

  const goTo = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (!lenis) return;
    e.preventDefault();
    setMenuOpen(false);
    lenis.start();
    lenis.scrollTo(`#${id}`, { duration: 1.6 });
  };

  const links = NAV_ITEMS.map(({ id, label }) => {
    const className = `${styles.link} ${active === id ? styles.active : ""}`;
    const current = active === id ? ("page" as const) : undefined;
    return (
      <li key={id}>
        {isHome ? (
          <a href={`#${id}`} className={className} aria-current={current} onClick={(e) => goTo(e, id)}>
            {label}
          </a>
        ) : (
          <TransitionLink
            href={id === "works" ? "/works" : `/#${id}`}
            transitionLabel={id === "works" ? "Works" : "Home"}
            className={className}
            aria-current={current}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </TransitionLink>
        )}
      </li>
    );
  });

  const logo = (
    <Image src="/images/logo.svg" alt="" width={53} height={35} priority />
  );

  return (
    <header className={styles.header} ref={headerRef}>
      <Image src="/images/header-bg.png" alt="" fill priority sizes="100vw" className={styles.bg} />

      <div className={styles.inner}>
        <div className={styles.left} data-header-item>
          {isHome ? (
            <a href="#top" className={styles.logo} aria-label="Felix — back to top">
              {logo}
            </a>
          ) : (
            <TransitionLink
              href="/"
              transitionLabel="Home"
              className={styles.logo}
              aria-label="Felix — home"
            >
              {logo}
            </TransitionLink>
          )}
        </div>

        <nav className={styles.nav} aria-label="Primary" data-header-item>
          <ul>{links}</ul>
        </nav>

        <div className={styles.right} data-header-item>
          <Magnetic strength={0.25} className={styles.ctaWrap}>
            <ArrowLink href="#contact" label="Let’s Connect" className={styles.cta} />
          </Magnetic>
          <button
            type="button"
            className={styles.burger}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className={menuOpen ? styles.burgerOpen : ""} />
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`${styles.menu} ${menuOpen ? styles.menuOpen : ""}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <nav aria-label="Mobile">
          <ul>{links}</ul>
        </nav>
        <ArrowLink href="#contact" label="Let’s Connect" className={styles.menuCta} />
      </div>
    </header>
  );
}
