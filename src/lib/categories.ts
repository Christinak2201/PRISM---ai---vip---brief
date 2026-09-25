export const CONTACT_CATEGORIES = [
  "Journalist",
  "Influencer",
  "Celebrity",
  "Stylist",
  "VIP Client",
  "Other",
] as const;

export type ContactCategory = (typeof CONTACT_CATEGORIES)[number];
