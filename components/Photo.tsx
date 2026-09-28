import Image, { type StaticImageData } from "next/image";
import PixelCover from "./motion/PixelCover";
import styles from "./Photo.module.css";

/** Percent-based image placement copied from the design's crop frames. */
export type Crop = { width: number; height: number; left: number; top: number };

type PhotoProps = {
  alt: string;
  sizes: string;
  className?: string;
  /** Marks the frame as the media wipe target of a `data-reveal="card"` parent. */
  reveal?: boolean;
  /** Load behind a pixel cover that dissolves once the image is in and in view. */
  pixelReveal?: boolean;
  /** Load eagerly (use for the page's largest above-the-fold image). */
  priority?: boolean;
} & (
  | { src: string; crop?: undefined }
  // Cropped images are statically imported so their intrinsic size is known.
  | { src: StaticImageData; crop: Crop }
);

/**
 * A white-backed image frame. Without `crop` the image covers the frame;
 * with `crop` it is positioned exactly like the design's crop, in percentages,
 * so it scales with the frame at any size.
 */
export default function Photo({
  src,
  alt,
  sizes,
  crop,
  className,
  reveal,
  pixelReveal,
  priority,
}: PhotoProps) {
  return (
    <div className={`${styles.frame} ${className ?? ""}`} data-reveal-media={reveal || undefined}>
      {crop ? (
        <Image
          src={src}
          alt={alt}
          sizes={sizes}
          preload={priority}
          loading={priority ? "eager" : undefined}
          className={styles.cropped}
          style={{
            width: `${crop.width}%`,
            height: `${crop.height}%`,
            left: `${crop.left}%`,
            top: `${crop.top}%`,
          }}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          preload={priority}
          loading={priority ? "eager" : undefined}
          className={styles.cover}
        />
      )}
      {pixelReveal && <PixelCover when="view" cell={16} />}
    </div>
  );
}
