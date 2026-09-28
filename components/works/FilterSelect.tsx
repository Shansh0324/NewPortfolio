"use client";

import { useEffect, useId, useRef } from "react";
import { ChevronLabel } from "@/components/Links";
import styles from "./FilterSelect.module.css";

export type FilterOption<T extends string> = { value: T; label: string };

type FilterSelectProps<T extends string> = {
  label: string;
  placeholder: string;
  options: FilterOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** "EXPERTISE ______ PICK YOUR POISON ⌄" row with its drop-down list. */
export default function FilterSelect<T extends string>({
  label,
  placeholder,
  options,
  value,
  onChange,
  open,
  onOpenChange,
}: FilterSelectProps<T>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const current = options.find((o) => o.value === value)?.label ?? placeholder;

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) onOpenChange(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  return (
    <div
      ref={rootRef}
      className={`${styles.row} ${open ? styles.open : ""} ${value ? styles.selected : ""}`}
    >
      <span className={`sectionTitle ${styles.label}`} id={`${listId}-label`}>
        {label}
      </span>

      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${listId}-label ${listId}-value`}
        onClick={() => onOpenChange(!open)}
      >
        <span id={`${listId}-value`} className={styles.value}>
          {current}
        </span>
        <ChevronLabel label="" direction={open ? "up" : "down"} className={styles.chevron} />
      </button>

      <div className={styles.panel} aria-hidden={!open}>
        <button
          type="button"
          className={styles.panelHead}
          tabIndex={open ? 0 : -1}
          onClick={() => onOpenChange(false)}
        >
          <ChevronLabel label={current} direction="up" className={styles.headLabel} />
        </button>
        <ul id={listId} role="listbox" aria-labelledby={`${listId}-label`}>
          {options.map((option, i) => (
            <li key={option.value} style={{ "--i": i } as React.CSSProperties}>
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                tabIndex={open ? 0 : -1}
                className={`${styles.option} ${i % 2 ? styles.alignRight : ""}`}
                onClick={() => {
                  onChange(option.value);
                  onOpenChange(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
