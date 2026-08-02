/**
 * Validation Constants
 */

// Event
export const EVENT_NAME_MIN = 2;
export const EVENT_NAME_MAX = 100;
export const EVENT_DESCRIPTION_MAX = 500;
export const EVENT_LOCATION_MAX = 200;

// User
export const USER_NAME_MIN = 1;
export const USER_NAME_MAX = 50;
export const USER_BIO_MAX = 300;

// Comment
export const COMMENT_MIN = 1;
export const COMMENT_MAX = 500;

// Album
export const ALBUM_NAME_MIN = 1;
export const ALBUM_NAME_MAX = 50;
export const ALBUM_DESCRIPTION_MAX = 200;

// Regex patterns
export const PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\+?[1-9]\d{1,14}$/,
  accessCode: /^[A-Z0-9]{6}$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  color: /^#[0-9A-Fa-f]{6}$/,
  url: /^https?:\/\/.+/,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  required: "This field is required",
  invalidEmail: "Please enter a valid email address",
  invalidPhone: "Please enter a valid phone number",
  tooShort: (min: number) => `Must be at least ${min} characters`,
  tooLong: (max: number) => `Must be no more than ${max} characters`,
  invalidFormat: "Invalid format",
  invalidDate: "Please enter a valid date",
  datePast: "Date cannot be in the past",
  fileTooLarge: (max: string) => `File must be smaller than ${max}`,
  invalidFileType: "This file type is not supported",
  accessCodeInvalid: "Invalid access code",
  eventNotFound: "Event not found",
  uploadFailed: "Upload failed. Please try again.",
  networkError: "Network error. Please check your connection.",
  serverError: "Something went wrong. Please try again later.",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  eventCreated: "Event created successfully!",
  eventUpdated: "Event updated successfully!",
  eventDeleted: "Event deleted successfully!",
  photoUploaded: "Photo uploaded successfully!",
  videoUploaded: "Video uploaded successfully!",
  uploadComplete: "All uploads complete!",
  linkCopied: "Link copied to clipboard!",
  codeCopied: "Access code copied!",
  downloadStarted: "Download started...",
  settingsSaved: "Settings saved!",
} as const;
