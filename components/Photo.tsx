import Image, { type StaticImageData } from "next/image";
import styles from "./Photo.module.css";

/** Percent-based image placement copied from the design's crop frames. */
export type Crop = { width: number; height: number; left: number; top: number };

type PhotoProps = {
  alt: string;
  sizes: string;
  className?: string;
  /** Marks the frame as the media wipe target of a `data-reveal="card"` parent. */
  reveal?: boolean;
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
export default function Photo({ src, alt, sizes, crop, className, reveal }: PhotoProps) {
  return (
    <div className={`${styles.frame} ${className ?? ""}`} data-reveal-media={reveal || undefined}>
      {crop ? (
        <Image
          src={src}
          alt={alt}
          sizes={sizes}
          className={styles.cropped}
          style={{
            width: `${crop.width}%`,
            height: `${crop.height}%`,
            left: `${crop.left}%`,
            top: `${crop.top}%`,
          }}
        />
      ) : (
        <Image src={src} alt={alt} fill sizes={sizes} className={styles.cover} />
      )}
    </div>
  );
}
