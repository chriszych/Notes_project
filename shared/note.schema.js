import { z } from "zod";

export const noteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Note title is required")
    .max(100, "Note title is too long"),
  content: z
    .string()
    .trim()
    .min(1, "Note content is required")
    .max(2000, "Note content is too long"),
});