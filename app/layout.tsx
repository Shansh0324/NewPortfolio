import type { Metadata, Viewport } from "next";
import { Great_Vibes, Plus_Jakarta_Sans } from "next/font/google";
import InlineSvg from "@/components/InlineSvg";
import MotionProvider from "@/components/motion/MotionProvider";
import "lenis/dist/lenis.css";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["200", "400", "600", "700"],
  style: ["normal", "italic"],
});

const greatVibes = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Felix — Graphics • UI/UX",
  description:
    "Portfolio of Felix, a graphic, branding and UI/UX designer from Samarinda, Indonesia.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} ${greatVibes.variable}`}>
      <body>
        <MotionProvider loaderMark={<InlineSvg src="images/logo.svg" idPrefix="loader-mark" />}>
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
