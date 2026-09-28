"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { usePageTransition } from "./PageTransition";

type TransitionLinkProps = ComponentProps<typeof Link> & {
  href: string;
  /** Text shown on the transition overlay (e.g. the destination's name). */
  transitionLabel?: string;
};

/** A Next.js link that routes through the page-transition wipe. */
export default function TransitionLink({
  href,
  transitionLabel,
  onClick,
  ...props
}: TransitionLinkProps) {
  const navigate = usePageTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      props.target === "_blank"
    ) {
      return;
    }
    e.preventDefault();
    navigate(href, transitionLabel);
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
