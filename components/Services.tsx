import Image, { type StaticImageData } from "next/image";
import { ArrowLink, ViewLink } from "./Links";
import Photo, { type Crop } from "./Photo";
import styles from "./Services.module.css";
import photoDashboard from "@/public/images/photo-dashboard.png";
import servicesLogos from "@/public/images/services-logos.png";

type CollagePhoto = {
  alt: string;
  /** Position/size as % of the collage box (from the design's px layout). */
  box: { left: number; top: number; width: number; height: number };
} & ({ src: string; crop?: undefined } | { src: StaticImageData; crop: Crop });

type Service = {
  key: "graphic" | "branding" | "uiux";
  /** Plain-text name for the page-transition label. */
  label: string;
  title: React.ReactNode;
  items: string[];
  photos: CollagePhoto[];
};

const SERVICES: Service[] = [
  {
    key: "graphic",
    label: "Graphic",
    title: (
      <>
        Graphic
        <br />
        Design
      </>
    ),
    items: ["Ads", "Graphics", "Illustration"],
    photos: [
      {
        src: "/images/graphic-1.png",
        alt: "Everpro Funnel social media ad",
        box: { left: 0, top: 0, width: 47.58, height: 57.19 },
      },
      {
        src: "/images/graphic-2.png",
        alt: "Character illustration with sneakers",
        box: { left: 16.79, top: 42.81, width: 47.58, height: 57.19 },
      },
      {
        src: "/images/graphic-3.png",
        alt: "Japanese manga-style poster",
        box: { left: 52.16, top: 7.03, width: 47.84, height: 76.45 },
      },
    ],
  },
  {
    key: "branding",
    label: "Branding",
    title: "Branding",
    items: ["Logo", "Visual Identity", "Brand Identity"],
    photos: [
      {
        src: "/images/branding-1.png",
        alt: "Pink brand identity merchandise",
        box: { left: 0, top: 0, width: 50.07, height: 50 },
      },
      {
        src: "/images/branding-2.png",
        alt: "Lime green brand typography sheet",
        box: { left: 25.03, top: 27.01, width: 50.07, height: 50 },
      },
      {
        src: "/images/branding-3.png",
        alt: "Orange brand guideline pages",
        box: { left: 49.93, top: 50, width: 50.07, height: 50 },
      },
    ],
  },
  {
    key: "uiux",
    label: "UI/UX",
    title: "UI/UX",
    items: ["UI Design", "Prototyping"],
    photos: [
      {
        src: "/images/photo-login-app.png",
        alt: "Phone showing a login screen design",
        box: { left: 39.29, top: 0, width: 60.71, height: 45.72 },
      },
      {
        src: "/images/uiux-2.png",
        alt: "Phone showing a finance app design",
        box: { left: 0, top: 31.54, width: 60.71, height: 45.72 },
      },
      {
        src: photoDashboard,
        alt: "Laptop showing a dashboard design",
        box: { left: 33.44, top: 54.28, width: 60.71, height: 45.72 },
        crop: { width: 160.52, height: 120.39, left: -16.67, top: -10.19 },
      },
    ],
  },
];

export default function Services() {
  return (
    <section className={styles.services} id="services" aria-labelledby="services-title">
      <div className={`container ${styles.inner}`}>
        <h2
          id="services-title"
          className={`sectionTitle ${styles.heading}`}
          data-reveal="split"
        >
          Services
        </h2>

        <div className={styles.top}>
          <div className={styles.intro} data-reveal="stagger">
            <p>
              Providing a variety of creative solutions to help take your brand to the next
              level. Whether you need graphic designs, branding, UI/UX or something in between,
              we’ve got you covered with services tailored to fit your business perfectly.
            </p>
            <ArrowLink href="#contact" label="Contact Me" />
          </div>

          <div className={styles.pill} data-reveal="pill">
            <div className={styles.logos}>
              <Image
                src={servicesLogos}
                alt="Selection of logos designed by Felix"
                sizes="(max-width: 899px) 90vw, 613px"
                className={styles.logosImage}
              />
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <span
            className={`${styles.dashed} ${styles.dashed1}`}
            aria-hidden="true"
            data-reveal="line"
          >
            <Image src="/images/services-dashed-line.svg" alt="" fill />
          </span>
          <span
            className={`${styles.dashed} ${styles.dashed2}`}
            aria-hidden="true"
            data-reveal="line"
          >
            <Image src="/images/services-dashed-line.svg" alt="" fill />
          </span>

          {SERVICES.map((service) => (
            <article key={service.key} className={`${styles.service} ${styles[service.key]}`}>
              <div className={styles.serviceHead}>
                <h3 className={styles.serviceTitle} data-reveal="split">
                  {service.title}
                </h3>
                <div className={styles.serviceMeta} data-reveal="up">
                  <ul className={styles.items}>
                    {service.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <ViewLink
                    href={`/works?expertise=${service.key}`}
                    transitionLabel={`${service.label} Works`}
                  />
                </div>
              </div>

              <div className={styles.collage} data-reveal="collage">
                {service.photos.map((photo) => (
                  <div
                    key={photo.alt}
                    className={styles.collageItem}
                    style={{
                      left: `${photo.box.left}%`,
                      top: `${photo.box.top}%`,
                      width: `${photo.box.width}%`,
                      height: `${photo.box.height}%`,
                    }}
                  >
                    <Photo
                      {...(photo.crop
                        ? { src: photo.src, crop: photo.crop }
                        : { src: photo.src })}
                      alt={photo.alt}
                      sizes="(max-width: 767px) 60vw, 300px"
                      className={styles.collagePhoto}
                    />
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
