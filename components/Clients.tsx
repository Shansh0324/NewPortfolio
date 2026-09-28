"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { ViewLink } from "./Links";
import styles from "./Clients.module.css";

// `width` is each row's design width at the 80px display size.
const CLIENTS = [
  { name: "Evermos", width: 653, line: "evermos", href: "/works/evermos" },
  { name: "Vitalog", width: 347, line: "vitalog", href: "/works/vitalog" },
  { name: "Nudelriket", width: 471, line: "nudelriket", href: "/works/nudelriket" },
  { name: "Hyperstack", width: 518, line: "hyperstack", href: "/works/hyperstack-cloud" },
  { name: "BEM FT UNMUL", width: 646, line: "hyperstack", href: "/works" },
  { name: "Nexus", width: 306, line: "nexus", href: "/works" },
];

type ClientsProps = {
  /** Inline angled rule (drawn with the scroll) bridging About and Clients. */
  angleLine: ReactNode;
};

export default function Clients({ angleLine }: ClientsProps) {
  const [active, setActive] = useState(0);

  return (
    <section className={styles.clients} id="clients" aria-labelledby="clients-title">
      <div className={styles.angleLine} data-draw>
        {angleLine}
      </div>

      <div className={`container ${styles.inner}`}>
        <h2 id="clients-title" className="sectionTitle" data-reveal="split">
          Clients
        </h2>

        <ul className={styles.list} data-reveal="stagger">
          {CLIENTS.map((client, i) => (
            <li
              key={client.name}
              className={`${styles.client} ${active === i ? styles.active : ""}`}
              style={{ "--w": client.width / 80 } as React.CSSProperties}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className={styles.name}>{client.name}</span>
              <span className={styles.line} aria-hidden="true" data-reveal="line">
                <span>
                  <Image src={`/images/client-line-${client.line}.svg`} alt="" fill />
                </span>
              </span>
              <ViewLink
                href={client.href}
                transitionLabel={client.href === "/works" ? "Works" : client.name}
                className={styles.view}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
