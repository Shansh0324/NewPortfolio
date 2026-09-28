"use client";

import Image from "next/image";
import { useRef } from "react";
import { ViewLink } from "@/components/Links";
import { gsap, SplitText, useGSAP } from "@/components/motion/gsap";
import TransitionLink from "@/components/motion/TransitionLink";
import { yearLabel, type Project, type Shot } from "@/lib/projects";
import ProjectCover from "./ProjectCover";
import ShotFrame from "./ShotFrame";
import styles from "./ProjectShowcase.module.css";

const THUMB_SIZES = "(max-width: 767px) 140px, 210px";

type StripProps = {
  shots: Shot[];
  divider: "short" | "tall";
  /** Stacked projects lead with the divider; split projects end with it. */
  dividerFirst: boolean;
  className: string;
};

function Strip({ shots, divider, dividerFirst, className }: StripProps) {
  const rule = (
    <span className={`${styles.divider} ${styles[divider]}`} aria-hidden="true" data-divider>
      <Image
        src={`/images/works/divider-${divider}.svg`}
        alt=""
        width={1}
        height={divider === "short" ? 250 : 565}
      />
    </span>
  );

  return (
    <div className={`${styles.strip} ${className}`}>
      <div className={styles.stripTrack} data-strip>
        {dividerFirst && rule}
        {shots.map((shot, i) => (
          <ShotFrame key={`${shot.src.src}-${i}`} shot={shot} sizes={THUMB_SIZES} className={styles.thumb} />
        ))}
        {!dividerFirst && rule}
      </div>
    </div>
  );
}

type ProjectShowcaseProps = {
  project: Project;
};

/** One project on the Works page: title, write-up, cover and two photo strips. */
export default function ProjectShowcase({ project }: ProjectShowcaseProps) {
  const root = useRef<HTMLElement>(null);
  const href = `/works/${project.slug}`;
  const isSplit = project.layout === "split";
  const hasStrips = project.strips.some((s) => s.length > 0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const conditions = {
        motion: "(prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 768px)",
      };
      mm.add(conditions, (ctx) => {
        const { motion, desktop } = ctx.conditions as Record<keyof typeof conditions, boolean>;
        if (!motion) return;
        const q = gsap.utils.selector(root);
        const enter = { trigger: root.current, start: "top 75%", toggleActions: "play none none reverse" };

        const title = SplitText.create(q("[data-title]"), { type: "chars", mask: "chars" });
        const desc = SplitText.create(q("[data-desc]"), { type: "lines", mask: "lines" });

        gsap
          .timeline({ scrollTrigger: enter, defaults: { ease: "expo.out" } })
          .from(title.chars, { yPercent: 110, duration: 1.1, stagger: 0.035 })
          .from(q("[data-meta]"), { autoAlpha: 0, y: 24, duration: 1, stagger: 0.08 }, 0.2)
          .from(desc.lines, { yPercent: 100, duration: 1, stagger: 0.05 }, 0.3)
          .from(q("[data-cta]"), { autoAlpha: 0, y: 20, duration: 0.8 }, 0.6);

        // Cover: panels wipe open from the bottom while the imagery settles from a zoom.
        const coverRoot = q("[data-cover-wrap] > :first-child")[0];
        const panels =
          coverRoot?.dataset.cover === "triptych" ? gsap.utils.toArray(coverRoot.children) : [coverRoot];
        gsap
          .timeline({
            scrollTrigger: { trigger: q("[data-cover-wrap]")[0], start: "top 80%", toggleActions: "play none none reverse" },
          })
          .fromTo(
            panels,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut", stagger: 0.12 },
          )
          .from(q("[data-cover-wrap] img"), { scale: 1.25, duration: 2, ease: "expo.out" }, 0.3);

        // Strips drift sideways with the scroll; row two runs the other way.
        q("[data-strip]").forEach((track, i) => {
          const dir = (i % 2 === 0 ? 1 : -1) * (isSplit ? 1 : -1);
          if (desktop) {
            gsap.fromTo(
              track,
              { x: -120 * dir },
              {
                x: 160 * dir,
                ease: "none",
                scrollTrigger: { trigger: track, start: "top bottom", end: "bottom top", scrub: 0.8 },
              },
            );
          }
          gsap.from(track.querySelectorAll("[data-shot]"), {
            autoAlpha: 0,
            y: 60,
            scale: 0.92,
            duration: 1,
            ease: "expo.out",
            stagger: 0.05,
            scrollTrigger: { trigger: track, start: "top 88%", toggleActions: "play none none reverse" },
          });
        });

        gsap.fromTo(
          q("[data-divider]"),
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: { trigger: q("[data-strips]")[0], start: "top 85%", end: "center 55%", scrub: 0.6 },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const title = (
    <div className={styles.title}>
      <div className={styles.titleRow}>
        <h2 className={styles.name}>
          <TransitionLink href={href} transitionLabel={project.name} data-title>
            {project.name}
          </TransitionLink>
        </h2>
        <p className={styles.year} data-meta>
          ({yearLabel(project.years)})
        </p>
      </div>
      <p className={styles.role} data-meta>
        {project.role}
      </p>
    </div>
  );

  const description = (
    <div className={styles.descBlock}>
      <p className={styles.desc} data-desc>
        {project.description}
      </p>
      <span data-cta>
        <ViewLink href={href} label="View Project" transitionLabel={project.name} />
      </span>
    </div>
  );

  const cover = (
    <TransitionLink
      href={href}
      transitionLabel={project.name}
      className={styles.coverLink}
      aria-label={`View ${project.name}`}
      data-cover-wrap
    >
      <ProjectCover cover={project.cover} className={styles.cover} />
      <span className={styles.coverHint} aria-hidden="true">
        View
      </span>
    </TransitionLink>
  );

  return (
    <article
      ref={root}
      className={`${styles.project} ${isSplit ? styles.split : styles.stacked} ${
        project.coverSide === "left" ? styles.coverLeft : ""
      }`}
    >
      {isSplit ? (
        <div className={styles.top}>
          <div className={styles.text}>
            {title}
            {description}
          </div>
          <div className={styles.coverCol}>{cover}</div>
        </div>
      ) : (
        <div className={styles.top}>
          <div className={styles.text}>
            {title}
            {description}
          </div>
          {cover}
        </div>
      )}

      {hasStrips && (
        <div className={styles.strips} data-strips>
          <Strip
            shots={project.strips[0]}
            divider="short"
            dividerFirst={!isSplit}
            className={styles.strip1}
          />
          <Strip
            shots={project.strips[1]}
            divider="tall"
            dividerFirst={!isSplit}
            className={styles.strip2}
          />
        </div>
      )}
    </article>
  );
}
