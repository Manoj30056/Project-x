import { z } from "zod";
import {
  USER_NAME_MIN,
  USER_NAME_MAX,
  USER_BIO_MAX,
  PATTERNS,
  ERROR_MESSAGES,
} from "@/constants/validation";

/**
 * Profile schema
 */
export const profileSchema = z.object({
  displayName: z
    .string()
    .min(USER_NAME_MIN, ERROR_MESSAGES.tooShort(USER_NAME_MIN))
    .max(USER_NAME_MAX, ERROR_MESSAGES.tooLong(USER_NAME_MAX))
    .trim(),
  
  bio: z
    .string()
    .max(USER_BIO_MAX, ERROR_MESSAGES.tooLong(USER_BIO_MAX))
    .trim()
    .optional()
    .or(z.literal("")),
  
  avatarUrl: z
    .string()
    .url(ERROR_MESSAGES.invalidFormat)
    .optional()
    .or(z.literal("")),
});

export type ProfileInput = z.infer<typeof profileSchema>;

/**
 * User preferences schema
 */
export const preferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system"),
  notifications: z.boolean().default(true),
  emailDigest: z.boolean().default(true),
  reducedMotion: z.boolean().default(false),
  highContrast: z.boolean().default(false),
});

export type PreferencesInput = z.infer<typeof preferencesSchema>;

/**
 * Guest name schema (for joining events)
 */
export const guestNameSchema = z.object({
  name: z
    .string()
    .min(USER_NAME_MIN, ERROR_MESSAGES.required)
    .max(USER_NAME_MAX, ERROR_MESSAGES.tooLong(USER_NAME_MAX))
    .trim(),
});

export type GuestNameInput = z.infer<typeof guestNameSchema>;

/**
 * Email schema
 */
export const emailSchema = z.object({
  email: z
    .string()
    .min(1, ERROR_MESSAGES.required)
    .email(ERROR_MESSAGES.invalidEmail),
});

export type EmailInput = z.infer<typeof emailSchema>;

/**
 * Phone schema
 */
export const phoneSchema = z.object({
  phone: z
    .string()
    .min(1, ERROR_MESSAGES.required)
    .regex(PATTERNS.phone, ERROR_MESSAGES.invalidPhone),
});

export type PhoneInput = z.infer<typeof phoneSchema>;
