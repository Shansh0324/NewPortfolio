import Image from "next/image";
import type { ReactNode } from "react";
import TransitionLink from "./motion/TransitionLink";
import styles from "./Links.module.css";

type LinkProps = {
  href: string;
  label?: string;
  className?: string;
  external?: boolean;
  /** Text for the page-transition overlay when `href` is another route. */
  transitionLabel?: string;
};

type SmartLinkProps = Omit<LinkProps, "label"> & { children: ReactNode };

/**
 * Routes ("/works") go through the page transition, in-page anchors ("#contact")
 * are left to Lenis, and external links open in a new tab.
 */
function SmartLink({ href, className, external, transitionLabel, children }: SmartLinkProps) {
  if (href.startsWith("/")) {
    return (
      <TransitionLink href={href} className={className} transitionLabel={transitionLabel}>
        {children}
      </TransitionLink>
    );
  }
  const extra = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a href={href} className={className} {...extra}>
      {children}
    </a>
  );
}

/** Underlined "View ↗" link used across Clients, Works, Services and Contact. */
export function ViewLink({ label = "View", className, ...props }: LinkProps) {
  return (
    <SmartLink className={`${styles.view} ${className ?? ""}`} {...props}>
      <span>{label}</span>
      <Image
        src="/images/arrow-up-right.svg"
        alt=""
        width={11.9635}
        height={11.6211}
        className={styles.viewIcon}
      />
    </SmartLink>
  );
}

/** Underlined "Label →" link used for "Let’s Connect" and "Contact Me". */
export function ArrowLink({ label, className, ...props }: LinkProps & { label: string }) {
  return (
    <SmartLink className={`${styles.arrow} ${className ?? ""}`} {...props}>
      <span>{label}</span>
      <Image
        src="/images/arrow-right.svg"
        alt=""
        width={24.7515}
        height={24.7465}
        className={styles.arrowIcon}
      />
    </SmartLink>
  );
}

type ChevronLinkProps = {
  label: string;
  direction: "up" | "down" | "left" | "right";
  className?: string;
};

/** Underlined "Label ⌄" control (dropdowns, "Load More", "Back to Top"). */
export function ChevronLabel({ label, direction, className }: ChevronLinkProps) {
  return (
    <span className={`${styles.chevronLabel} ${className ?? ""}`}>
      <span>{label}</span>
      <span className={`${styles.chevron} ${styles[direction]}`} aria-hidden="true">
        <Image src="/images/chevron.svg" alt="" width={15.6317} height={25.493} />
      </span>
    </span>
  );
}
