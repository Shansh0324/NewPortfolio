"use client";

import { useLenis } from "lenis/react";
import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { SOCIALS } from "@/lib/site";
import { ArrowLink } from "./Links";
import { gsap, prefersReducedMotion, useGSAP } from "./motion/gsap";
import Magnetic from "./motion/Magnetic";
import SocialIcon from "./SocialIcon";
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
  const burgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const burgerTl = useRef<gsap.core.Timeline>(null);
  const menuTl = useRef<gsap.core.Timeline>(null);
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

  // Burger morph + menu reveal, built once and played forwards / backwards.
  useGSAP(
    () => {
      const q = gsap.utils.selector(headerRef);
      const [top, bottom] = q("[data-burger-line]");

      // Lines meet in the middle, then turn into an X.
      burgerTl.current = gsap
        .timeline({
          paused: true,
          // Hand the lines back to CSS so the hover stretch works again.
          onReverseComplete: () => gsap.set([top, bottom], { clearProps: "all" }),
        })
        .to([top, bottom], { y: 0, duration: 0.3, ease: "power3.inOut" })
        .to(bottom, { width: 18, duration: 0.3, ease: "power3.inOut" }, 0)
        .to(top, { rotate: 45, duration: 0.55, ease: "expo.out" }, 0.28)
        .to(bottom, { rotate: -45, duration: 0.55, ease: "expo.out" }, 0.28);

      // Menu grows as a circle from the burger, then its content rises in.
      const origin = () => {
        const r = burgerRef.current?.getBoundingClientRect();
        const x = r ? r.left + r.width / 2 : window.innerWidth;
        const y = r ? r.top + r.height / 2 : 0;
        const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
        return { x, y, radius };
      };

      // `extra` enlarges a circle by a fixed amount at every point of the tween.
      const circleFrom = (extra: number) => () => {
        const { x, y } = origin();
        return `circle(${extra}px at ${x}px ${y}px)`;
      };
      const circleTo = (extra: number) => () => {
        const { x, y, radius } = origin();
        return `circle(${radius + extra}px at ${x}px ${y}px)`;
      };
      const RING = 2; // px of white showing around the black circle
      const layers = [flashRef.current, menuRef.current];

      menuTl.current = gsap
        .timeline({
          paused: true,
          onReverseComplete: () => gsap.set(layers, { visibility: "hidden" }),
        })
        .set(layers, { visibility: "visible" })
        // A white circle, always RING px wider than the black one, draws a hairline
        // that sweeps out from the burger.
        .fromTo(
          flashRef.current,
          { clipPath: circleFrom(RING) },
          { clipPath: circleTo(RING), duration: 0.95, ease: "power4.inOut" },
          0,
        )
        .fromTo(
          menuRef.current,
          { clipPath: circleFrom(0) },
          { clipPath: circleTo(0), duration: 0.95, ease: "power4.inOut" },
          0,
        )
        .fromTo(
          q("[data-menu-rule]"),
          { scaleX: 0 },
          { scaleX: 1, duration: 1.1, ease: "expo.inOut", stagger: 0.05 },
          0.3,
        )
        .fromTo(
          q("[data-menu-word]"),
          { yPercent: 115, rotate: 5 },
          { yPercent: 0, rotate: 0, duration: 1, ease: "expo.out", stagger: 0.06 },
          0.45,
        )
        .fromTo(
          q("[data-menu-index]"),
          { autoAlpha: 0, x: -12 },
          { autoAlpha: 1, x: 0, duration: 0.8, ease: "expo.out", stagger: 0.06 },
          0.55,
        )
        .fromTo(
          q("[data-menu-fade]"),
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.08 },
          0.7,
        )
        // Social icons pop in one by one while their rings trace around them.
        .fromTo(
          q("[data-menu-social]"),
          { autoAlpha: 0, scale: 0.6, y: 14 },
          { autoAlpha: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(2)", stagger: 0.06 },
          0.8,
        )
        .fromTo(
          q("[data-menu-social] circle"),
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 1, ease: "power2.inOut", stagger: 0.06 },
          0.85,
        );
    },
    { scope: headerRef },
  );

  // Drive both timelines from the open state; closing plays back a little faster.
  useEffect(() => {
    const burger = burgerTl.current;
    const menu = menuTl.current;
    if (!burger || !menu) return;

    if (prefersReducedMotion()) {
      burger.progress(menuOpen ? 1 : 0);
      menu.progress(menuOpen ? 1 : 0);
      if (!menuOpen) gsap.set(menuRef.current, { visibility: "hidden" });
      return;
    }

    if (menuOpen) {
      if (menu.progress() === 0) menu.invalidate(); // re-measure the burger position
      burger.timeScale(1).play();
      menu.timeScale(1).play();
    } else {
      burger.timeScale(1.2).reverse();
      menu.timeScale(1.6).reverse();
    }
  }, [menuOpen]);

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

  // While open: hold the page, close on Escape, move focus into the menu.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    const burger = burgerRef.current;
    const menu = menuRef.current;
    lenis?.stop();
    window.addEventListener("keydown", onKey);
    const focusTimer = setTimeout(() => menu?.focus({ preventScroll: true }), 400);
    return () => {
      clearTimeout(focusTimer);
      lenis?.start();
      window.removeEventListener("keydown", onKey);
      if (menu?.contains(document.activeElement)) burger?.focus();
    };
  }, [menuOpen, lenis]);

  // Close automatically if the viewport grows into the desktop layout.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 900px)");
    const onChange = () => desktop.matches && setMenuOpen(false);
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  const goTo = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (!lenis) return;
    e.preventDefault();
    setMenuOpen(false);
    lenis.start();
    lenis.scrollTo(`#${id}`, { duration: 1.6 });
  };

  const navLink = (id: string, label: string, className: string, children: ReactNode) => {
    const current = active === id ? ("page" as const) : undefined;
    return isHome ? (
      <a href={`#${id}`} className={className} aria-current={current} onClick={(e) => goTo(e, id)}>
        {children}
      </a>
    ) : (
      <TransitionLink
        href={id === "works" ? "/works" : `/#${id}`}
        transitionLabel={id === "works" ? "Works" : "Home"}
        className={className}
        aria-current={current}
        onClick={() => setMenuOpen(false)}
      >
        {children}
      </TransitionLink>
    );
  };

  const logo = <Image src="/images/logo.svg" alt="" width={53} height={35} priority />;

  return (
    <header className={`${styles.header} ${menuOpen ? styles.headerMenuOpen : ""}`} ref={headerRef}>
      <Image src="/images/header-bg.png" alt="" fill priority sizes="100vw" className={styles.bg} />

      <div className={styles.inner}>
        <div className={styles.left} data-header-item>
          {isHome ? (
            <a href="#top" className={styles.logo} aria-label="Felix — back to top">
              {logo}
            </a>
          ) : (
            <TransitionLink href="/" transitionLabel="Home" className={styles.logo} aria-label="Felix — home">
              {logo}
            </TransitionLink>
          )}
        </div>

        <nav className={styles.nav} aria-label="Primary" data-header-item>
          <ul>
            {NAV_ITEMS.map(({ id, label }) => (
              <li key={id}>
                {navLink(id, label, `${styles.link} ${active === id ? styles.active : ""}`, label)}
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.right} data-header-item>
          <Magnetic strength={0.25} className={styles.ctaWrap}>
            <ArrowLink href="#contact" label="Let’s Connect" className={styles.cta} />
          </Magnetic>
        </div>
      </div>

      {/* ---------- Mobile menu ---------- */}
      <div ref={flashRef} className={styles.menuFlash} aria-hidden="true" />
      <div
        id="mobile-menu"
        ref={menuRef}
        className={styles.menu}
        tabIndex={-1}
        aria-label="Site menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className={styles.menuInner}>
          <p className={styles.menuEyebrow} data-menu-fade>
            Navigation
          </p>

          <nav aria-label="Mobile">
            <ul className={styles.menuList}>
              {NAV_ITEMS.map(({ id, label }, i) => (
                <li key={id} className={styles.menuItem}>
                  {navLink(
                    id,
                    label,
                    `${styles.menuLink} ${active === id ? styles.menuActive : ""}`,
                    <>
                      <span className={styles.menuIndex} data-menu-index>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={styles.menuMask}>
                        <span className={styles.menuWord} data-menu-word>
                          {label}
                        </span>
                      </span>
                    </>,
                  )}
                  <span className={styles.menuRule} data-menu-rule aria-hidden="true" />
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.menuFooter}>
            <div data-menu-fade>
              <ArrowLink href="#contact" label="Let’s Connect" />
            </div>
            <ul className={styles.menuSocials} aria-label="Social links">
              {SOCIALS.map((s) => (
                <li key={s.kind} data-menu-social>
                  <a
                    href={s.href}
                    className={styles.social}
                    aria-label={s.label}
                    title={s.label}
                    {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <svg className={styles.socialRing} viewBox="0 0 44 44" aria-hidden="true">
                      <circle cx="22" cy="22" r="21.5" />
                    </svg>
                    <SocialIcon kind={s.kind} className={styles.socialIcon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Floating burger (phones / small tablets), always reachable while scrolling. */}
      <button
        ref={burgerRef}
        type="button"
        className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ""}`}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        onClick={() => setMenuOpen((o) => !o)}
        data-header-item
      >
        <svg className={styles.ring} viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="23.25" />
        </svg>
        <span className={styles.lines} aria-hidden="true">
          <span className={`${styles.line} ${styles.lineTop}`} data-burger-line />
          <span className={`${styles.line} ${styles.lineBottom}`} data-burger-line />
        </span>
      </button>
    </header>
  );
}
