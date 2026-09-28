import type { Cover } from "@/lib/projects";
import ShotFrame from "./ShotFrame";
import styles from "./ProjectCover.module.css";

type ProjectCoverProps = {
  cover: Cover;
  className?: string;
  priority?: boolean;
};

/** The large visual of a project: device mockups, one tall image, or a triptych. */
export default function ProjectCover({ cover, className, priority }: ProjectCoverProps) {
  if (cover.kind === "triptych") {
    return (
      <div className={`${styles.triptych} ${className ?? ""}`} data-cover="triptych">
        <ShotFrame shot={cover.left} sizes="(max-width: 767px) 100vw, 1300px" priority={priority} />
        <ShotFrame
          shot={cover.center}
          sizes="(max-width: 767px) 100vw, 1400px"
          priority={priority}
          className={styles.center}
        />
        <ShotFrame shot={cover.right} sizes="(max-width: 767px) 100vw, 1300px" priority={priority} />
      </div>
    );
  }

  if (cover.kind === "devices") {
    return (
      <div className={`${styles.tall} ${styles.devices} ${className ?? ""}`} data-cover="devices">
        <ShotFrame
          shot={cover.back}
          sizes="(max-width: 767px) 250vw, 1500px"
          priority={priority}
          className={styles.layer}
        />
        <ShotFrame
          shot={cover.front}
          sizes="(max-width: 767px) 200vw, 1230px"
          priority={priority}
          className={styles.layer}
        />
      </div>
    );
  }

  return (
    <ShotFrame
      shot={cover.image}
      position={cover.position}
      sizes="(max-width: 767px) 100vw, 640px"
      priority={priority}
      className={`${styles.tall} ${className ?? ""}`}
    />
  );
}
