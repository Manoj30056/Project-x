import { z } from "zod";
import {
  MAX_FILE_SIZE,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
  COMMENT_MIN,
  COMMENT_MAX,
  ALBUM_NAME_MIN,
  ALBUM_NAME_MAX,
  ALBUM_DESCRIPTION_MAX,
} from "@/constants";
import { ERROR_MESSAGES } from "@/constants/validation";

/**
 * File validation schema
 */
export const fileSchema = z.object({
  name: z.string(),
  size: z.number().max(MAX_FILE_SIZE, ERROR_MESSAGES.fileTooLarge("50MB")),
  type: z.string().refine(
    (type) =>
      [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES].includes(type as typeof ACCEPTED_IMAGE_TYPES[number] | typeof ACCEPTED_VIDEO_TYPES[number]),
    ERROR_MESSAGES.invalidFileType
  ),
});

/**
 * Image file validation
 */
export const imageFileSchema = fileSchema.extend({
  size: z.number().max(MAX_IMAGE_SIZE, ERROR_MESSAGES.fileTooLarge("25MB")),
  type: z.string().refine(
    (type) => ACCEPTED_IMAGE_TYPES.includes(type as typeof ACCEPTED_IMAGE_TYPES[number]),
    ERROR_MESSAGES.invalidFileType
  ),
});

/**
 * Video file validation
 */
export const videoFileSchema = fileSchema.extend({
  size: z.number().max(MAX_VIDEO_SIZE, ERROR_MESSAGES.fileTooLarge("100MB")),
  type: z.string().refine(
    (type) => ACCEPTED_VIDEO_TYPES.includes(type as typeof ACCEPTED_VIDEO_TYPES[number]),
    ERROR_MESSAGES.invalidFileType
  ),
});

/**
 * Comment schema
 */
export const commentSchema = z.object({
  content: z
    .string()
    .min(COMMENT_MIN, ERROR_MESSAGES.tooShort(COMMENT_MIN))
    .max(COMMENT_MAX, ERROR_MESSAGES.tooLong(COMMENT_MAX))
    .trim(),
  
  mediaId: z.string().uuid(),
  
  parentId: z.string().uuid().optional(),
});

export type CommentInput = z.infer<typeof commentSchema>;

/**
 * Album schema
 */
export const albumSchema = z.object({
  name: z
    .string()
    .min(ALBUM_NAME_MIN, ERROR_MESSAGES.tooShort(ALBUM_NAME_MIN))
    .max(ALBUM_NAME_MAX, ERROR_MESSAGES.tooLong(ALBUM_NAME_MAX))
    .trim(),
  
  description: z
    .string()
    .max(ALBUM_DESCRIPTION_MAX, ERROR_MESSAGES.tooLong(ALBUM_DESCRIPTION_MAX))
    .trim()
    .optional()
    .or(z.literal("")),
  
  eventId: z.string().uuid(),
});

export type AlbumInput = z.infer<typeof albumSchema>;

/**
 * Download request schema
 */
export const downloadRequestSchema = z.object({
  eventId: z.string().uuid(),
  type: z.enum(["single", "album", "all"]),
  mediaIds: z.array(z.string().uuid()).optional(),
  albumId: z.string().uuid().optional(),
});

export type DownloadRequestInput = z.infer<typeof downloadRequestSchema>;

/**
 * Validate a file before upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: ERROR_MESSAGES.fileTooLarge("50MB") };
  }
  
  // Check type
  const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type as typeof ACCEPTED_IMAGE_TYPES[number]);
  const isVideo = ACCEPTED_VIDEO_TYPES.includes(file.type as typeof ACCEPTED_VIDEO_TYPES[number]);
  
  if (!isImage && !isVideo) {
    return { valid: false, error: ERROR_MESSAGES.invalidFileType };
  }
  
  // Additional size checks for specific types
  if (isImage && file.size > MAX_IMAGE_SIZE) {
    return { valid: false, error: ERROR_MESSAGES.fileTooLarge("25MB") };
  }
  
  if (isVideo && file.size > MAX_VIDEO_SIZE) {
    return { valid: false, error: ERROR_MESSAGES.fileTooLarge("100MB") };
  }
  
  return { valid: true };
}

/**
 * Validate multiple files
 */
export function validateFiles(files: File[]): Array<{ file: File; valid: boolean; error?: string }> {
  return files.map((file) => ({
    file,
    ...validateFile(file),
  }));
}
