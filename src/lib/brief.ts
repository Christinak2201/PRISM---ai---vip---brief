import { z } from "zod";

export const CONTACT_CATEGORIES = [
  "Journalist",
  "Influencer",
  "Celebrity",
  "Stylist",
  "VIP Client",
  "Other",
] as const;

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().default("");

// What the PR professional submits from the form.
export const BriefRequestSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(200),
  category: z.enum(CONTACT_CATEGORIES),
  roleOrOutlet: optionalText(300),
  relationshipHistory: optionalText(4000),
  eventContext: optionalText(2000),
  notes: optionalText(4000),
});

export type BriefRequest = z.infer<typeof BriefRequestSchema>;

// The structured brief Claude must return. The API enforces this shape.
export const VipBriefSchema = z.object({
  name: z.string(),
  role_or_media_outlet: z.string(),
  relationship_history: z.string(),
  event_relevance: z.string(),
  key_notes: z.array(z.string()),
  missing_information: z.array(z.string()),
  recommended_pr_action: z.string(),
});

export type VipBrief = z.infer<typeof VipBriefSchema>;
