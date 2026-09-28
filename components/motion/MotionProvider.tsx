"use client";

import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "./gsap";
import PageTransition from "./PageTransition";
import Preloader from "./Preloader";
import ScrollAnimations from "./ScrollAnimations";
import ScrollProgress from "./ScrollProgress";

const IntroContext = createContext(false);

/**
 * True when a page's entrance animation may play: after the first-load
 * preloader, and once any page-transition overlay has started to lift.
 */
export function useIntroReady() {
  return useContext(IntroContext);
}

/** Keeps ScrollTrigger in step with Lenis' virtual scroll. */
function ScrollTriggerSync() {
  useLenis(() => ScrollTrigger.update());
  return null;
}

type MotionProviderProps = {
  children: ReactNode;
  /** Inline SVG mark drawn by the preloader. */
  loaderMark: ReactNode;
};

export default function MotionProvider({ children, loaderMark }: MotionProviderProps) {
  const lenisRef = useRef<LenisRef>(null);
  const pathname = usePathname();
  const [loaded, setLoaded] = useState(false);
  const [covering, setCovering] = useState(false);
  const onCoveringChange = useCallback((value: boolean) => setCovering(value), []);

  // Drive Lenis from GSAP's ticker so smooth scroll and animations share one frame loop.
  useEffect(() => {
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{ autoRaf: false, anchors: true, lerp: 0.09, smoothWheel: true }}
    >
      <ScrollTriggerSync />
      <IntroContext value={loaded && !covering}>
        <PageTransition onCoveringChange={onCoveringChange}>
          <Preloader mark={loaderMark} onComplete={() => setLoaded(true)} />
          {children}
          <ScrollAnimations key={pathname} />
          <ScrollProgress />
        </PageTransition>
      </IntroContext>
    </ReactLenis>
  );
}
