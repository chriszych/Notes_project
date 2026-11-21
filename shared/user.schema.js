import { z } from "zod";

export const registerUserSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Email address is invalid"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
});

export const loginUserSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Email address is invalid"),
  password: z
    .string()
    .min(1, "Passweord is required"),
});