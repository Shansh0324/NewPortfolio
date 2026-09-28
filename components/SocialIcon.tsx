import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import type { SocialKind } from "@/lib/site";

const ICONS = {
  linkedin: IconBrandLinkedin,
  instagram: IconBrandInstagram,
  email: IconMail,
  phone: IconPhone,
} satisfies Record<SocialKind, unknown>;

type SocialIconProps = {
  kind: SocialKind;
  size?: number;
  className?: string;
};

/** Outline brand/contact icon, drawn with a hairline stroke to match the site's rules. */
export default function SocialIcon({ kind, size = 20, className }: SocialIconProps) {
  const Icon = ICONS[kind];
  return <Icon size={size} stroke={1.25} className={className} aria-hidden="true" />;
}
