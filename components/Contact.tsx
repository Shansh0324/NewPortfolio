import { ViewLink } from "./Links";
import styles from "./Contact.module.css";

// Replace the hrefs with Felix's real profiles.
const SOCIALS = [
  { label: "Linkedin", href: "https://www.linkedin.com/" },
  { label: "Dribbble", href: "https://dribbble.com/" },
  { label: "Behance", href: "https://www.behance.net/" },
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "Email", href: "mailto:hello@example.com" },
  { label: "Phone", href: "tel:+620000000000" },
];

export default function Contact() {
  return (
    <section className={styles.contact} id="contact" aria-labelledby="contact-title">
      <div className={`container ${styles.inner}`}>
        <h2
          id="contact-title"
          className={`sectionTitle ${styles.heading}`}
          data-reveal="split"
        >
          Contact
        </h2>

        <div className={styles.info} data-reveal="stagger">
          <p className={styles.blurb}>
            Bringing creative visions to life through design - Available for freelance projects
            and collaborations.
          </p>
          <ul className={styles.services}>
            <li>Graphics</li>
            <li>Branding</li>
            <li>UI/UX</li>
          </ul>
          <address className={styles.address}>
            <span>Address :</span>
            <span className={styles.addressLine}>
              Jl. Ade Irma Suryani No.10-11A, 75117, Kota Samarinda, Kalimantan Timur, Indonesia.
            </span>
          </address>
        </div>

        <ul className={styles.socials} data-reveal="stagger">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <ViewLink href={s.href} label={s.label} external={s.href.startsWith("http")} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
