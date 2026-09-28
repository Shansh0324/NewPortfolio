import Image from "next/image";
import type { Shot } from "@/lib/projects";
import styles from "./ShotFrame.module.css";

type ShotFrameProps = {
  shot: Shot;
  sizes: string;
  className?: string;
  /** object-position for uncropped images. */
  position?: string;
  priority?: boolean;
};

/**
 * One image in a clipped frame. Cropped shots are placed exactly like the
 * design (percentages of the frame); others cover the frame.
 */
export default function ShotFrame({ shot, sizes, className, position, priority }: ShotFrameProps) {
  const { src, alt, crop, bg } = shot;

  return (
    <div className={`${styles.frame} ${className ?? ""}`} style={{ background: bg }} data-shot>
      {crop ? (
        <Image
          src={src}
          alt={alt}
          sizes={sizes}
          placeholder="blur"
          priority={priority}
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
          placeholder="blur"
          priority={priority}
          className={styles.cover}
          style={position ? { objectPosition: position } : undefined}
        />
      )}
    </div>
  );
}
