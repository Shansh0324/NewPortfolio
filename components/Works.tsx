import Image, { type StaticImageData } from "next/image";
import { ChevronLabel, ViewLink } from "./Links";
import TransitionLink from "./motion/TransitionLink";
import Photo, { type Crop } from "./Photo";
import styles from "./Works.module.css";
import workEvermos from "@/public/images/work-evermos.png";
import workVitalog from "@/public/images/work-vitalog.png";
import workHyperstack from "@/public/images/work-hyperstack.png";
import photoMapApp from "@/public/images/photo-map-app.png";

type Work = {
  slug: string;
  title: string;
  role: string;
  description: string;
  image: StaticImageData;
  alt: string;
  crop: Crop;
};

const TOP_ROW: Work[] = [
  {
    slug: "evermos",
    title: "Evermos",
    role: "Graphic/Web Designer Intern",
    description:
      "Worked as a Graphic Designer Intern at a social commerce startup that connects brands, and consumers to sell everyday Muslim products. contributing to “Everpro,” a sub-brand offering solutions for online business growth.",
    image: workEvermos,
    alt: "Tablet on a wooden desk showing an Everpro landing page",
    crop: { width: 200.83, height: 100, left: -51.77, top: 0 },
  },
  {
    slug: "vitalog",
    title: "Vitalog",
    role: "UI/UX Designer",
    description:
      "Worked as a UI Designer under the wings of Vitalog, a user-friendly app designed to ensure you never miss your medication or supplements again. It offers customizable reminders and tracks your intake schedule, helping you maintain your health regimen effortlessly.",
    image: workVitalog,
    alt: "Phone showing the Vitalog medication tracker",
    crop: { width: 225.91, height: 100, left: -62.95, top: 0 },
  },
];

const BOTTOM_ROW: Work[] = [
  {
    slug: "hyperstack-cloud",
    title: "Hyperstack Cloud",
    role: "UI/UX Designer",
    description:
      "Was hired to re-design their login and sign-up system. They wanted a clearer and more precisely designed system that not only reflected the feel of their product but also functioned just as effectively.",
    image: workHyperstack,
    alt: "Laptop showing the Hyperstack sign-in page",
    crop: { width: 234.45, height: 103.78, left: -16.25, top: -1.89 },
  },
  {
    slug: "dominos-pizza",
    title: "Domino’s Pizza",
    role: "UI/UX Case Study",
    description:
      "A brief case study I conducted on the Domino’s Pizza mobile app, focusing on three primary screens that I believe are extremely crucial to how users interact, engage, and experience the app as a whole.",
    image: photoMapApp,
    alt: "Phone showing a delivery tracking map",
    crop: { width: 231.22, height: 115.13, left: -84.68, top: -15.13 },
  },
];

const IMAGE_SIZES = "(max-width: 639px) 230vw, (max-width: 1099px) 110vw, 760px";

function WorkCard({ work, reverse }: { work: Work; reverse?: boolean }) {
  return (
    <article className={`${styles.card} ${reverse ? styles.reverse : ""}`} data-reveal="card">
      <Photo
        src={work.image}
        alt={work.alt}
        sizes={IMAGE_SIZES}
        crop={work.crop}
        className={styles.image}
        reveal
      />
      <div className={styles.text} data-reveal-text>
        <div className={styles.title}>
          <h3>{work.title}</h3>
          <p className={styles.role}>{work.role}</p>
        </div>
        <div className={styles.desc}>
          <p>{work.description}</p>
          <ViewLink href={`/works/${work.slug}`} transitionLabel={work.title} />
        </div>
      </div>
    </article>
  );
}

export default function Works() {
  return (
    <section className={styles.works} id="works" aria-labelledby="works-title">
      <div className={styles.bgWrap} aria-hidden="true">
        <Image
          src="/images/works-bg.svg"
          alt=""
          width={1667.8}
          height={370.8}
          className={styles.bg}
          data-parallax-x="7"
        />
      </div>

      <div className={`container ${styles.inner}`}>
        <div className={styles.head}>
          <h2 id="works-title" className="sectionTitle" data-reveal="split">
            Works
          </h2>
          <TransitionLink
            href="/works?expertise=uiux"
            transitionLabel="UI/UX Works"
            className={styles.filterLink}
            aria-label="See UI/UX works"
            data-reveal="up"
          >
            <ChevronLabel label="UI/UX" direction="down" className={styles.filter} />
          </TransitionLink>
        </div>

        <div className={styles.rows}>
          <div className={`${styles.row} ${styles.rowTop}`}>
            {TOP_ROW.map((work) => (
              <WorkCard key={work.title} work={work} />
            ))}
          </div>
          <div className={`${styles.row} ${styles.rowBottom}`}>
            {BOTTOM_ROW.map((work) => (
              <WorkCard key={work.title} work={work} reverse />
            ))}
          </div>
        </div>

        <TransitionLink href="/works" transitionLabel="Works" className={styles.more} data-reveal="up">
          See More
        </TransitionLink>
      </div>
    </section>
  );
}
