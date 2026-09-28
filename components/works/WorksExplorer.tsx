"use client";

import { useLenis } from "lenis/react";
import { useRef, useState } from "react";
import { ArrowLink, ChevronLabel } from "@/components/Links";
import Marquee from "@/components/Marquee";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/components/motion/gsap";
import {
  PROJECTS,
  type Category,
  type Expertise,
  type Project,
} from "@/lib/projects";
import FilterSelect, { type FilterOption } from "./FilterSelect";
import ProjectShowcase from "./ProjectShowcase";
import styles from "./WorksExplorer.module.css";

type ExpertiseValue = Expertise | "all";
type CategoryValue = Category | "all";
type YearValue = "2023" | "2024" | "all";

export type Filters = {
  expertise: ExpertiseValue | null;
  category: CategoryValue | null;
  year: YearValue | null;
};

const EXPERTISE_OPTIONS: FilterOption<ExpertiseValue>[] = [
  { value: "graphic", label: "Graphic" },
  { value: "branding", label: "Branding" },
  { value: "uiux", label: "UI/UX" },
  { value: "all", label: "View All" },
];

const CATEGORY_OPTIONS: FilterOption<CategoryValue>[] = [
  { value: "client", label: "Client Works" },
  { value: "personal", label: "Personal Works" },
  { value: "all", label: "Personal & Clients Works" },
];

const YEAR_OPTIONS: FilterOption<YearValue>[] = [
  { value: "2023", label: "2023" },
  { value: "2024", label: "2024" },
  { value: "all", label: "2023–2024" },
];

/** Projects shown before "Load More Works". */
const PAGE_SIZE = 4;

function matches(project: Project, { expertise, category, year }: Filters) {
  return (
    (!expertise || expertise === "all" || project.expertise === expertise) &&
    (!category || category === "all" || project.category === category) &&
    (!year || year === "all" || project.years.includes(Number(year)))
  );
}

function filtersToQuery({ expertise, category, year }: Filters) {
  const params = new URLSearchParams();
  if (expertise && expertise !== "all") params.set("expertise", expertise);
  if (category && category !== "all") params.set("category", category);
  if (year && year !== "all") params.set("year", year);
  const query = params.toString();
  return query ? `?${query}` : "";
}

type WorksExplorerProps = {
  initialFilters: Filters;
};

export default function WorksExplorer({ initialFilters }: WorksExplorerProps) {
  const lenis = useLenis();
  const root = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [draft, setDraft] = useState<Filters>(initialFilters);
  const [applied, setApplied] = useState<Filters>(initialFilters);
  const [openMenu, setOpenMenu] = useState<keyof Filters | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [version, setVersion] = useState(0);

  const results = PROJECTS.filter((p) => matches(p, applied));
  const shown = results.slice(0, visible);
  const canLoadMore = visible < results.length;

  // Filter rows + Apply ease in when the section enters.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      gsap.from(q("[data-filter-row], [data-apply]"), {
        y: 50,
        autoAlpha: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: q("[data-filters]")[0], start: "top 80%" },
      });
    },
    { scope: root },
  );

  const scrollToResults = () => {
    if (listRef.current) lenis?.scrollTo(listRef.current, { offset: -40, duration: 1.4 });
  };

  const apply = () => {
    setOpenMenu(null);
    const commit = () => {
      setApplied(draft);
      setVisible(PAGE_SIZE);
      setVersion((v) => v + 1); // remount the list so every project replays its entrance
      window.history.replaceState(null, "", `/works${filtersToQuery(draft)}`);
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        scrollToResults();
      });
    };

    if (prefersReducedMotion() || !listRef.current) {
      commit();
      return;
    }
    gsap.to(listRef.current, {
      autoAlpha: 0,
      y: 60,
      duration: 0.45,
      ease: "power3.in",
      onComplete: () => {
        commit();
        gsap.fromTo(
          listRef.current,
          { autoAlpha: 0, y: 60 },
          { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out", delay: 0.15 },
        );
      },
    });
  };

  const reset = () => {
    const cleared: Filters = { expertise: null, category: null, year: null };
    setDraft(cleared);
    setApplied(cleared);
    setVisible(PAGE_SIZE);
    setVersion((v) => v + 1);
    window.history.replaceState(null, "", "/works");
  };

  const menu = (key: keyof Filters) => ({
    open: openMenu === key,
    onOpenChange: (open: boolean) => setOpenMenu(open ? key : null),
  });

  return (
    <div ref={root}>
      {/* ---------- Filters ---------- */}
      <section className={styles.filters} aria-labelledby="filters-title">
        <h2 id="filters-title" className="srOnly">
          Filter works
        </h2>
        <div className={`container ${styles.filterInner}`} data-filters>
          <div className={styles.rows}>
            <div data-filter-row>
              <FilterSelect
                label="Expertise"
                placeholder="PICK YOUR POISON"
                options={EXPERTISE_OPTIONS}
                value={draft.expertise}
                onChange={(expertise) => setDraft((d) => ({ ...d, expertise }))}
                {...menu("expertise")}
              />
            </div>
            <div data-filter-row>
              <FilterSelect
                label="Category"
                placeholder="Personal & Clients Works"
                options={CATEGORY_OPTIONS}
                value={draft.category}
                onChange={(category) => setDraft((d) => ({ ...d, category }))}
                {...menu("category")}
              />
            </div>
            <div data-filter-row>
              <FilterSelect
                label="Year"
                placeholder="2023–2024"
                options={YEAR_OPTIONS}
                value={draft.year}
                onChange={(year) => setDraft((d) => ({ ...d, year }))}
                {...menu("year")}
              />
            </div>
          </div>
          <div className={styles.applyRow} data-apply>
            <button type="button" className={styles.apply} onClick={apply}>
              Apply
            </button>
          </div>
        </div>
      </section>

      {/* ---------- Projects ---------- */}
      <section className={styles.works} aria-label="Projects" id="results">
        <div className="container">
          <div ref={listRef} aria-live="polite">
            <div key={version} className={styles.list}>
              {shown.length ? (
                shown.map((project) => <ProjectShowcase key={project.slug} project={project} />)
              ) : (
                <div className={styles.empty}>
                  <p className={styles.emptyTitle}>Nothing here yet.</p>
                  <p className={styles.emptyText}>
                    No works match this combination — try another, or see everything.
                  </p>
                  <button type="button" onClick={reset}>
                    <ChevronLabel label="Reset Filters" direction="right" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ---------- End row ---------- */}
        <div className={`container ${styles.end}`}>
          <div className={styles.actions}>
            <button type="button" onClick={() => lenis?.scrollTo(0, { duration: 2 })}>
              <ChevronLabel label="Back to Top" direction="up" />
            </button>
            <button
              type="button"
              className={styles.loadMore}
              disabled={!canLoadMore}
              onClick={() => {
                setVisible((v) => v + PAGE_SIZE);
                requestAnimationFrame(() => ScrollTrigger.refresh());
              }}
            >
              <ChevronLabel
                label={canLoadMore ? "Load More Works" : "All Works Loaded"}
                direction="down"
              />
            </button>
            <ArrowLink href="#contact" label="Let’s Connect" />
          </div>
          <div className={styles.bigWords} aria-hidden="true">
            <Marquee word="WORKS" repeat={3} gap="0.3em" plain reverse duration={60} className={styles.bigMarquee} />
          </div>
        </div>
      </section>
    </div>
  );
}
