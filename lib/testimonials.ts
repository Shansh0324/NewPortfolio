export type Testimonial = {
  id: string;
  company: string;
  quote: string;
  /** Who said it; omitted where the design shows none. */
  author?: string;
  /** True for placeholder copy that still needs the real client quote. */
  placeholder?: boolean;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "evermos",
    company: "Evermos",
    quote:
      "A breath of fresh air, Felix\u2019s ability as a designer to seamlessly integrate with the team has significantly boosted our individual and collective productivity. He's definitely a great addition to the team!",
  },
  // TODO: replace the three placeholder quotes below with the real client testimonials.
  {
    id: "vitalog",
    company: "Vitalog",
    quote:
      "Felix turned a complicated medication flow into screens that feel effortless. Testers set up their first reminder in seconds, and the interface finally has the calm, friendly tone we wanted.",
    author: "Product Lead, Vitalog",
    placeholder: true,
  },
  {
    id: "nudelriket",
    company: "Nudelriket",
    quote:
      "He captured the spirit of Indonesia in a brand that still feels at home in Sweden. People recognise our badge from across the street — exactly what a brand-new noodle shop needs.",
    author: "Founder, Nudelriket",
    placeholder: true,
  },
  {
    id: "hypercloud",
    company: "Hypercloud",
    quote:
      "Our new sign-in and sign-up experience is clearer, faster and unmistakably ours. Felix balanced our technical constraints with genuinely thoughtful design decisions.",
    author: "Engineering Manager, Hyperstack",
    placeholder: true,
  },
];
