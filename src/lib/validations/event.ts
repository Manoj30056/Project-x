import { z } from "zod";
import {
  EVENT_NAME_MIN,
  EVENT_NAME_MAX,
  EVENT_DESCRIPTION_MAX,
  EVENT_LOCATION_MAX,
  PATTERNS,
  ERROR_MESSAGES,
} from "@/constants/validation";

/**
 * Create event schema
 */
export const createEventSchema = z.object({
  name: z
    .string()
    .min(EVENT_NAME_MIN, ERROR_MESSAGES.tooShort(EVENT_NAME_MIN))
    .max(EVENT_NAME_MAX, ERROR_MESSAGES.tooLong(EVENT_NAME_MAX))
    .trim(),
  
  description: z
    .string()
    .max(EVENT_DESCRIPTION_MAX, ERROR_MESSAGES.tooLong(EVENT_DESCRIPTION_MAX))
    .trim()
    .optional()
    .or(z.literal("")),
  
  date: z
    .string()
    .min(1, ERROR_MESSAGES.required)
    .refine((val) => !isNaN(Date.parse(val)), ERROR_MESSAGES.invalidDate),
  
  endDate: z
    .string()
    .refine((val) => val === "" || !isNaN(Date.parse(val)), ERROR_MESSAGES.invalidDate)
    .optional()
    .or(z.literal("")),
  
  location: z
    .string()
    .max(EVENT_LOCATION_MAX, ERROR_MESSAGES.tooLong(EVENT_LOCATION_MAX))
    .trim()
    .optional()
    .or(z.literal("")),
  
  organizerName: z
    .string()
    .min(1, ERROR_MESSAGES.required)
    .max(50, ERROR_MESSAGES.tooLong(50))
    .trim(),
  
  organizerEmail: z
    .string()
    .email(ERROR_MESSAGES.invalidEmail)
    .optional()
    .or(z.literal("")),
  
  coverColor: z
    .string()
    .regex(PATTERNS.color, ERROR_MESSAGES.invalidFormat)
    .optional()
    .default("#6366f1"),
  
  isPublic: z.boolean().optional().default(false),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

/**
 * Update event schema
 */
export const updateEventSchema = createEventSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export type UpdateEventInput = z.infer<typeof updateEventSchema>;

/**
 * Join event schema
 */
export const joinEventSchema = z.object({
  accessCode: z
    .string()
    .length(6, "Access code must be 6 characters")
    .regex(PATTERNS.accessCode, "Invalid access code format")
    .transform((val) => val.toUpperCase()),
  
  guestName: z
    .string()
    .min(1, ERROR_MESSAGES.required)
    .max(50, ERROR_MESSAGES.tooLong(50))
    .trim(),
});

export type JoinEventInput = z.infer<typeof joinEventSchema>;

/**
 * Event settings schema
 */
export const eventSettingsSchema = z.object({
  allowGuestUploads: z.boolean().default(true),
  requireApproval: z.boolean().default(false),
  allowComments: z.boolean().default(true),
  allowDownloads: z.boolean().default(true),
  watermark: z.boolean().default(false),
  faceRecognition: z.boolean().default(false),
  locationTracking: z.boolean().default(false),
  maxFileSize: z.number().min(1).max(100).default(50),
  allowedFileTypes: z.array(z.string()).default(["image/*", "video/*"]),
});

export type EventSettingsInput = z.infer<typeof eventSettingsSchema>;
