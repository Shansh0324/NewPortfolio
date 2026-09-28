import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BackToTop from "@/components/BackToTop";
import Contact from "@/components/Contact";
import Header from "@/components/Header";
import InlineSvg from "@/components/InlineSvg";
import ProjectDetail from "@/components/works/ProjectDetail";
import { getProject, PROJECTS } from "@/lib/projects";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/works/[slug]">): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: `${project.name} — Felix`,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: PageProps<"/works/[slug]">) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  return (
    <>
      <Header page="works" />
      <main>
        <ProjectDetail
          project={project}
          zigzag={<InlineSvg src="images/works/zigzag.svg" idPrefix={`zigzag-${project.slug}`} />}
        />
        <div className="gradientRule" aria-hidden="true" />
        <Contact />
      </main>
      <BackToTop />
    </>
  );
}
