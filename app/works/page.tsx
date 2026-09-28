import type { Metadata } from "next";
import BackToTop from "@/components/BackToTop";
import Contact from "@/components/Contact";
import Header from "@/components/Header";
import InlineSvg from "@/components/InlineSvg";
import WorksExplorer, { type Filters } from "@/components/works/WorksExplorer";
import WorksHero from "@/components/works/WorksHero";

export const metadata: Metadata = {
  title: "Works — Felix",
  description: "Graphic, branding and UI/UX work by Felix, from client projects to personal explorations.",
};

const EXPERTISE = ["graphic", "branding", "uiux", "all"] as const;
const CATEGORY = ["client", "personal", "all"] as const;
const YEAR = ["2023", "2024", "all"] as const;

function pick<T extends string>(allowed: readonly T[], value: string | string[] | undefined): T | null {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

export default async function WorksPage({ searchParams }: PageProps<"/works">) {
  const params = await searchParams;
  const initialFilters: Filters = {
    expertise: pick(EXPERTISE, params.expertise),
    category: pick(CATEGORY, params.category),
    year: pick(YEAR, params.year),
  };

  return (
    <>
      <Header page="works" />
      <main>
        <WorksHero zigzag={<InlineSvg src="images/works/zigzag.svg" idPrefix="works-zigzag" />} />
        <WorksExplorer initialFilters={initialFilters} />
        <div className="gradientRule" aria-hidden="true" />
        <Contact />
      </main>
      <BackToTop />
    </>
  );
}
