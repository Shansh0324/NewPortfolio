import fs from "node:fs";
import path from "node:path";
import type { SVGProps } from "react";

type InlineSvgProps = Omit<SVGProps<SVGSVGElement>, "dangerouslySetInnerHTML"> & {
  /** Path inside /public, e.g. "images/bg-arc.svg". */
  src: string;
  /** Namespaces the SVG's internal ids so inlined copies never collide. */
  idPrefix: string;
};

/**
 * Renders an SVG asset from /public inline (server-side, at build time) so its
 * paths can be animated with GSAP. The artwork is used exactly as exported.
 */
export default function InlineSvg({ src, idPrefix, ...props }: InlineSvgProps) {
  const raw = fs.readFileSync(path.join(process.cwd(), "public", src), "utf8");
  const match = raw.match(/<svg([^>]*)>([\s\S]*)<\/svg>/);
  if (!match) throw new Error(`InlineSvg: could not parse ${src}`);

  const [, rootAttrs, inner] = match;
  const attr = (name: string) => rootAttrs.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

  const ids = [...new Set([...inner.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))];
  const body = ids.reduce(
    (html, id, i) =>
      html
        .split(`id="${id}"`)
        .join(`id="${idPrefix}-${i}"`)
        .split(`url(#${id})`)
        .join(`url(#${idPrefix}-${i})`),
    inner,
  );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={attr("viewBox")}
      width={attr("width")}
      height={attr("height")}
      preserveAspectRatio={attr("preserveAspectRatio")}
      fill="none"
      overflow="visible"
      aria-hidden="true"
      focusable="false"
      {...props}
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}
