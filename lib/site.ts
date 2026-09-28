export type SocialKind = "linkedin" | "instagram" | "email" | "phone";

// Replace the hrefs with Felix's real profiles.
export const SOCIALS: { kind: SocialKind; label: string; href: string }[] = [
  { kind: "linkedin", label: "Linkedin", href: "https://www.linkedin.com/" },
  { kind: "instagram", label: "Instagram", href: "https://www.instagram.com/" },
  { kind: "email", label: "Email", href: "mailto:hello@example.com" },
  { kind: "phone", label: "Phone", href: "tel:+620000000000" },
];
