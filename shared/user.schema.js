import { z } from "zod";

export const registerUserSchema = z.object({
  email: z.email("Email address is invalid").trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
});

export const loginUserSchema = z.object({
  email: z.email("Email address is invalid").trim(),
  password: z.string().min(1, "Password is required"),
});

export const changePasswordSchema = z.object({
  password: z.string().min(1, "Password is required"),
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
});

export const changeEmailSchema = z.object({
  newEmail: z.email("Email address is invalid").trim(),
  password: z.string().min(1, "Password is required"),
});
