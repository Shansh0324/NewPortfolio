import Image from "next/image";
import type { ReactNode } from "react";
import { ChevronLabel } from "@/components/Links";
import Magnetic from "@/components/motion/Magnetic";
import TransitionLink from "@/components/motion/TransitionLink";
import {
  CATEGORY_LABELS,
  EXPERTISE_LABELS,
  getGallery,
  getNextProject,
  PROJECTS,
  yearLabel,
  type Project,
} from "@/lib/projects";
import DetailHeroMotion from "./DetailHeroMotion";
import ProjectCover from "./ProjectCover";
import ShotFrame from "./ShotFrame";
import styles from "./ProjectDetail.module.css";

type ProjectDetailProps = {
  project: Project;
  /** Inline zigzag rule under the hero. */
  zigzag: ReactNode;
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function ProjectDetail({ project, zigzag }: ProjectDetailProps) {
  const index = PROJECTS.findIndex((p) => p.slug === project.slug);
  const next = getNextProject(project.slug);
  const gallery = getGallery(project);
  const isSplit = project.layout === "split";

  const facts = [
    { label: "Expertise", value: EXPERTISE_LABELS[project.expertise] },
    { label: "Category", value: CATEGORY_LABELS[project.category] },
    { label: "Year", value: yearLabel(project.years) },
    { label: "Role", value: project.role },
  ];

  return (
    <article>
      {/* ---------- Hero ---------- */}
      <DetailHeroMotion className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.topbar}>
            <TransitionLink href="/works" transitionLabel="Works" data-anim="meta">
              <ChevronLabel label="All Works" direction="left" />
            </TransitionLink>
            <span className={styles.counter} data-anim="meta">
              {pad(index + 1)} / {pad(PROJECTS.length)}
            </span>
          </div>

          <h1 className={styles.title} data-anim="title">
            {project.name}
          </h1>

          <div className={styles.sub}>
            <p className={styles.role} data-anim="meta">
              {project.role}
            </p>
            <p className={styles.year} data-anim="meta">
              ({yearLabel(project.years)})
            </p>
          </div>
        </div>
        <div className={styles.zigzag} data-anim="zigzag" aria-hidden="true">
          {zigzag}
        </div>
      </DetailHeroMotion>

      {/* ---------- Facts ---------- */}
      <section className={`container ${styles.facts}`} aria-label="Project details">
        <dl className={styles.factList} data-reveal="stagger">
          {facts.map((fact) => (
            <div key={fact.label} className={styles.fact}>
              <dt className={`sectionTitle ${styles.factLabel}`}>{fact.label}</dt>
              <dd className={styles.factValue}>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------- Overview + cover ---------- */}
      <section
        className={`container ${styles.overview} ${isSplit ? styles.overviewSplit : styles.overviewStacked} ${
          project.coverSide === "left" ? styles.coverLeft : ""
        }`}
        aria-labelledby="overview-title"
        data-reveal="card"
      >
        <div className={styles.overviewText}>
          <h2 id="overview-title" className="sectionTitle" data-reveal="split">
            Overview
          </h2>
          <p className={styles.overviewBody} data-reveal="words">
            {project.description}
          </p>
        </div>
        <div className={styles.coverWrap} data-reveal-media>
          <ProjectCover cover={project.cover} />
        </div>
      </section>

      {/* ---------- Gallery ---------- */}
      {gallery.length > 0 && (
        <section className={`container ${styles.gallery}`} aria-labelledby="gallery-title">
          <div className={styles.galleryHead}>
            <h2 id="gallery-title" className="sectionTitle" data-reveal="split">
              Gallery
            </h2>
            <span className={styles.counter} data-reveal="up">
              {pad(gallery.length)} images
            </span>
          </div>
          <ul className={styles.galleryGrid} data-reveal="stagger">
            {gallery.map((shot, i) => (
              <li key={`${shot.src.src}-${i}`} className={styles.galleryItem}>
                <ShotFrame shot={shot} sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 330px" />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---------- Visit ---------- */}
      <section className={`container ${styles.visit}`} aria-label="View the project">
        <p className={styles.visitEyebrow} data-reveal="up">
          Like what you see? Take a closer look.
        </p>
        <div data-reveal="up">
          <Magnetic strength={0.2}>
            <a
              href={project.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.visitLink}
            >
              <span>{project.link.label}</span>
              <Image
                src="/images/arrow-up-right.svg"
                alt=""
                width={11.9635}
                height={11.6211}
                className={styles.visitIcon}
              />
            </a>
          </Magnetic>
        </div>
      </section>

      {/* ---------- Next ---------- */}
      <section className={styles.next} aria-label="Next project">
        <TransitionLink
          href={`/works/${next.slug}`}
          transitionLabel={next.name}
          className={`container ${styles.nextLink}`}
        >
          <span className={`sectionTitle ${styles.nextLabel}`} data-reveal="up">
            Next Project
          </span>
          <span className={styles.nextName} data-reveal="up">
            {next.name}
          </span>
          <span className={styles.nextMeta} data-reveal="up">
            {next.role} ({yearLabel(next.years)})
            <ChevronLabel label="" direction="right" className={styles.nextChevron} />
          </span>
        </TransitionLink>
      </section>
    </article>
  );
}
