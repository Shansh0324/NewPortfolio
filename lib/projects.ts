import type { StaticImageData } from "next/image";
import type { Crop } from "@/components/Photo";

import evMacbook from "@/public/images/works/evermos/macbook.png";
import evIphone from "@/public/images/works/evermos/iphone.png";
import ev1 from "@/public/images/works/evermos/shot-1.png";
import ev2 from "@/public/images/works/evermos/shot-2.png";
import ev3 from "@/public/images/works/evermos/shot-3.png";
import ev4 from "@/public/images/works/evermos/shot-4.png";
import ev5 from "@/public/images/works/evermos/shot-5.png";
import ev6 from "@/public/images/works/evermos/shot-6.png";
import ev7 from "@/public/images/works/evermos/shot-7.png";
import ev8 from "@/public/images/works/evermos/shot-8.png";
import ev9 from "@/public/images/works/evermos/shot-9.png";
import ev10 from "@/public/images/works/evermos/shot-10.png";

import vitLeft from "@/public/images/works/vitalog/cover-left.png";
import vitCenter from "@/public/images/works/vitalog/cover-center.png";
import vitRight from "@/public/images/works/vitalog/cover-right.png";
import vit11 from "@/public/images/works/vitalog/shot-11.png";
import vit12 from "@/public/images/works/vitalog/shot-12.png";
import vit13 from "@/public/images/works/vitalog/shot-13.png";
import vit14 from "@/public/images/works/vitalog/shot-14.png";
import vit15 from "@/public/images/works/vitalog/shot-15.png";
import vit16 from "@/public/images/works/vitalog/shot-16.png";
import vit17 from "@/public/images/works/vitalog/shot-17.png";

import nudCover from "@/public/images/works/nudelriket/cover.png";
import nud20 from "@/public/images/works/nudelriket/shot-20.png";
import nud21 from "@/public/images/works/nudelriket/shot-21.png";
import nud22 from "@/public/images/works/nudelriket/shot-22.png";
import nud23 from "@/public/images/works/nudelriket/shot-23.png";
import nud24 from "@/public/images/works/nudelriket/shot-24.png";
import nud25 from "@/public/images/works/nudelriket/shot-25.png";
import nud26 from "@/public/images/works/nudelriket/shot-26.png";
import nud27 from "@/public/images/works/nudelriket/shot-27.png";
import nud28 from "@/public/images/works/nudelriket/shot-28.png";
import nud29 from "@/public/images/works/nudelriket/shot-29.png";

import domLeft from "@/public/images/works/dominos/cover-left.png";
import domCenter from "@/public/images/works/dominos/cover-center.png";
import domRight from "@/public/images/works/dominos/cover-right.png";
import dom18 from "@/public/images/works/dominos/shot-18.png";
import dom19 from "@/public/images/works/dominos/shot-19.png";
import dom20 from "@/public/images/works/dominos/shot-20.png";
import dom21 from "@/public/images/works/dominos/shot-21.png";
import dom22 from "@/public/images/works/dominos/shot-22.png";
import dom23 from "@/public/images/works/dominos/shot-23.png";

import hyperstackCover from "@/public/images/work-hyperstack.png";

export type Expertise = "graphic" | "branding" | "uiux";
export type Category = "client" | "personal";

/** One image placed in a frame. `crop` mirrors the design's crop; `bg` fills behind it. */
export type Shot = {
  src: StaticImageData;
  alt: string;
  crop?: Crop;
  bg?: string;
};

export type Cover =
  /** Evermos: MacBook + iPhone mockups composed inside one tall frame. */
  | { kind: "devices"; back: Shot; front: Shot }
  /** A single tall image. */
  | { kind: "single"; image: Shot; position?: string }
  /** Three panels side by side, the centre one wider. */
  | { kind: "triptych"; left: Shot; center: Shot; right: Shot };

export type Project = {
  slug: string;
  name: string;
  /** Years the project spans; used by the year filter. */
  years: number[];
  role: string;
  expertise: Expertise;
  category: Category;
  /** One-paragraph summary (home page cards). */
  summary: string;
  /** Full write-up (works list + detail page). */
  description: string;
  /** "split": text beside a tall cover. "stacked": text above a wide cover. */
  layout: "split" | "stacked";
  /** For split layouts: which side the cover sits on. */
  coverSide?: "left" | "right";
  cover: Cover;
  /** Two rows of thumbnails shown under the cover. */
  strips: [Shot[], Shot[]];
  // TODO: replace each placeholder with the real live site / case-study URL.
  link: { label: string; href: string };
};

export const EXPERTISE_LABELS: Record<Expertise, string> = {
  graphic: "Graphic",
  branding: "Branding",
  uiux: "UI/UX",
};

export const CATEGORY_LABELS: Record<Category, string> = {
  client: "Client Work",
  personal: "Personal Work",
};

export function yearLabel(years: number[]) {
  return years.length > 1 ? `${years[0]}–${years[years.length - 1]}` : String(years[0]);
}

const CROP_WIDE_SQUARE: Crop = { width: 133.33, height: 100, left: -16.67, top: 0 };

export const PROJECTS: Project[] = [
  {
    slug: "evermos",
    name: "Evermos",
    years: [2023, 2024],
    role: "Graphic/Web Designer Intern",
    expertise: "graphic",
    category: "client",
    summary:
      "Worked as a Graphic Designer Intern at a social commerce startup that connects brands, and consumers to sell everyday Muslim products. contributing to “Everpro,” a sub-brand offering solutions for online business growth.",
    description:
      "Worked as a Graphic Designer Intern at a social commerce startup that connects brands, and consumers to sell everyday Muslim products. contributing to \"Everpro,\" a sub-brand offering solutions for online business growth. During my time, I was tasked with not only designing ads, but also landing pages, websites, and iconography that caters to the User’s experience, interaction, and overall satisfaction.",
    layout: "split",
    coverSide: "right",
    cover: {
      kind: "devices",
      back: {
        src: evMacbook,
        alt: "Everpro Funnel landing page on a MacBook",
        crop: { width: 242.9, height: 114.11, left: -92.01, top: -1.53 },
      },
      front: {
        src: evIphone,
        alt: "Everpro CRM landing page on an iPhone",
        crop: { width: 200, height: 94.07, left: -45.84, top: 22.6 },
      },
    },
    strips: [
      [
        { src: ev7, alt: "Everpro ad design" },
        { src: ev6, alt: "Everpro social post: landing page builder" },
        { src: ev5, alt: "Everpro landing page sections", crop: CROP_WIDE_SQUARE },
        { src: ev4, alt: "Everpro online workshop poster" },
        { src: ev3, alt: "Everpro app on a phone mockup", bg: "#fff" },
        { src: ev2, alt: "Everpro CRM pricing comparison" },
        { src: ev1, alt: "Everpro page on a tablet", bg: "#d9d9d9" },
      ],
      [
        {
          src: ev10,
          alt: "Everpro email design",
          bg: "#fff",
          crop: { width: 61.52, height: 86.72, left: 13.44, top: 12.44 },
        },
        { src: ev9, alt: "Everpro Academy ad" },
        { src: ev8, alt: "Everpro Funnel long-form landing page" },
      ],
    ],
    link: { label: "View Project", href: "https://www.behance.net/" },
  },
  {
    slug: "vitalog",
    name: "Vitalog",
    years: [2024],
    role: "UI/UX Designer",
    expertise: "uiux",
    category: "client",
    summary:
      "Worked as a UI Designer under the wings of Vitalog, a user-friendly app designed to ensure you never miss your medication or supplements again. It offers customizable reminders and tracks your intake schedule, helping you maintain your health regimen effortlessly.",
    description:
      "Worked as a UI Designer under the wings of Vitalog, a user-friendly app designed to ensure you never miss your medication or supplements again. It offers customizable reminders and tracks your intake schedule, helping you maintain your health regimen effortlessly.",
    layout: "stacked",
    cover: {
      kind: "triptych",
      left: {
        src: vitLeft,
        alt: "Vitalog medication adherence screen",
        bg: "#bcd1e4",
        crop: { width: 385.2, height: 100.14, left: -148.66, top: 0.15 },
      },
      center: { src: vitCenter, alt: "Vitalog today’s medication screen" },
      right: {
        src: vitRight,
        alt: "Vitalog add medication screen",
        bg: "#9cbbd8",
        crop: { width: 396.87, height: 103.17, left: -185.06, top: 2.81 },
      },
    },
    strips: [
      [
        { src: vit11, alt: "Vitalog home screen mockup", bg: "#fff" },
        { src: vit12, alt: "Vitalog medication list mockup", bg: "#fff" },
        { src: vitLeft, alt: "Vitalog adherence calendar mockup", bg: "#fff", crop: CROP_WIDE_SQUARE },
        { src: vitRight, alt: "Vitalog medication detail mockup", bg: "#fff" },
        { src: vit13, alt: "Vitalog settings mockup", bg: "#fff" },
        { src: vit14, alt: "Vitalog add medication flow" },
      ],
      [
        { src: vit15, alt: "Vitalog screen set: medication", bg: "#fff" },
        { src: vit16, alt: "Vitalog screen set: statistics" },
        { src: vit17, alt: "Vitalog screen set: settings" },
      ],
    ],
    link: { label: "View Project", href: "https://dribbble.com/" },
  },
  {
    slug: "nudelriket",
    name: "Nudelriket",
    years: [2024],
    role: "Brand Designer",
    expertise: "branding",
    category: "client",
    summary:
      "Had the incredible opportunity to collaborate with Nudelriket, a newly-established instant noodle shop based in Sweden, building a brand rooted in Indonesian culture.",
    description:
      "Had the incredible opportunity to collaborate with Nudelriket, a newly-established instant noodle shop based in Sweden. The brand has its roots in Indonesia, and the owner was eager to incorporate elements into the branding that would immediately evoke and be associated with Indonesian culture. The name Nudelriket, which translates to \"Noodle Kingdom,\" was chosen to represent the company’s vision of becoming the leading instant noodle retailer not only in Sweden but eventually across all of Europe. By combining Indonesian influences with the shop's bold aspirations, we aimed to create a brand that stands out and resonates with both local and international customers.",
    layout: "split",
    coverSide: "left",
    cover: {
      kind: "single",
      image: {
        src: nudCover,
        alt: "Nudelriket logo badges",
        bg: "#fff",
        crop: { width: 116.81, height: 82.15, left: -3.22, top: 11.31 },
      },
    },
    strips: [
      [
        { src: nud20, alt: "Nudelriket colour scheme" },
        { src: nud21, alt: "Nudelriket typography" },
        { src: nud22, alt: "Nudelriket logo spacing", crop: CROP_WIDE_SQUARE },
        { src: nud23, alt: "Nudelriket logo variation #3" },
        { src: nud24, alt: "Nudelriket logo variation #2", bg: "#fff" },
        { src: nud25, alt: "Nudelriket complete main logo" },
        { src: nud26, alt: "Nudelriket brand guideline page", bg: "#d9d9d9" },
      ],
      [
        { src: nud27, alt: "Nudelriket colour usage #3", bg: "#fff" },
        { src: nud28, alt: "Nudelriket colour usage #2" },
        { src: nud29, alt: "Nudelriket brand guideline cover" },
      ],
    ],
    link: { label: "View Project", href: "https://www.behance.net/" },
  },
  {
    slug: "dominos-pizza",
    name: "Domino’s Pizza",
    years: [2024],
    role: "UI/UX Exploration",
    expertise: "uiux",
    category: "personal",
    summary:
      "A brief case study I conducted on the Domino’s Pizza mobile app, focusing on three primary screens that I believe are extremely crucial to how users interact, engage, and experience the app as a whole.",
    description:
      "Since the release of Domino's Pizza App in Indonesia dating back to 2015, Users have been patiently waiting for an extensive update on the overall UI, Easier ways to track your orders, and quality of life updates that could really change how Users interact and make their way through the app. This is a brief case study I conducted on the Domino’s Pizza mobile app, focusing on three primary screens that I believe are extremely crucial to how users interact, engage, and experience the app as a whole.",
    layout: "stacked",
    cover: {
      kind: "triptych",
      left: {
        src: domLeft,
        alt: "Domino’s value deals screen held in hand",
        bg: "#bcd1e4",
        crop: { width: 447.17, height: 103.35, left: -166.35, top: -1.67 },
      },
      center: {
        src: domCenter,
        alt: "Domino’s home screen on a red background",
        crop: { width: 221.57, height: 100, left: -61.9, top: 0 },
      },
      right: {
        src: domRight,
        alt: "Domino’s order tracking screen",
        bg: "#9cbbd8",
        crop: { width: 384.66, height: 100, left: -181.34, top: 0 },
      },
    },
    strips: [
      [
        { src: dom18, alt: "Domino’s redesign overview", bg: "#fff" },
        { src: dom19, alt: "Domino’s home and promo screens", bg: "#fff" },
        { src: dom20, alt: "Domino’s tracking map screens", bg: "#fff", crop: CROP_WIDE_SQUARE },
        { src: dom21, alt: "Domino’s checkout screens", bg: "#fff" },
        {
          src: dom22,
          alt: "Domino’s screen collage",
          bg: "#fff",
          crop: { width: 172.34, height: 106.06, left: -36.86, top: -23.56 },
        },
        { src: dom23, alt: "Domino’s app held in hand" },
      ],
      [
        { src: domRight, alt: "Domino’s tracking screen mockup", bg: "#fff" },
        { src: domCenter, alt: "Domino’s home screen mockup" },
        { src: dom18, alt: "Domino’s value deals screens" },
      ],
    ],
    link: { label: "View Case Study", href: "https://www.behance.net/" },
  },
  {
    slug: "hyperstack-cloud",
    name: "Hyperstack Cloud",
    years: [2024],
    role: "UI/UX Designer",
    expertise: "uiux",
    category: "client",
    summary:
      "Was hired to re-design their login and sign-up system. They wanted a clearer and more precisely designed system that not only reflected the feel of their product but also functioned just as effectively.",
    description:
      "Was hired to re-design their login and sign-up system. They wanted a clearer and more precisely designed system that not only reflected the feel of their product but also functioned just as effectively.",
    layout: "split",
    coverSide: "right",
    cover: {
      kind: "single",
      image: { src: hyperstackCover, alt: "Hyperstack sign-in page on a laptop" },
      position: "12% 50%",
    },
    strips: [[], []],
    link: { label: "View Project", href: "https://www.hyperstack.cloud/" },
  },
];

export function getProject(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}

/** The project after `slug`, wrapping around — used for "Next Project". */
export function getNextProject(slug: string) {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  return PROJECTS[(i + 1) % PROJECTS.length];
}

/** Every distinct image of a project, for the detail-page gallery. */
export function getGallery(project: Project): Shot[] {
  const seen = new Set<string>();
  return project.strips.flat().filter((shot) => {
    if (seen.has(shot.src.src)) return false;
    seen.add(shot.src.src);
    return true;
  });
}
