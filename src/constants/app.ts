/**
 * Application Constants
 */

export const APP_NAME = "ENGRAM";
export const APP_TAGLINE = "One QR. Every Memory. Forever.";
export const APP_DESCRIPTION =
  "Create an event, share a QR code, and let every guest contribute photos and videos into one stunning AI-organized gallery.";

export const APP_VERSION = "1.0.0";

export const SUPPORT_EMAIL = "support@engram.app";

// Theme
export const DEFAULT_THEME = "dark" as const;

// Locale
export const DEFAULT_LOCALE = "en-US";
export const SUPPORTED_LOCALES = ["en-US", "es-ES", "fr-FR", "de-DE", "ja-JP"] as const;

// Colors
export const THEME_COLORS = [
  { value: "#6366f1", name: "Indigo" },
  { value: "#8b5cf6", name: "Violet" },
  { value: "#ec4899", name: "Pink" },
  { value: "#f59e0b", name: "Amber" },
  { value: "#10b981", name: "Emerald" },
  { value: "#3b82f6", name: "Blue" },
  { value: "#ef4444", name: "Red" },
  { value: "#0a0a0a", name: "Black" },
] as const;

export const DEFAULT_COVER_COLOR = "#6366f1";

// Timing
export const DEBOUNCE_MS = 300;
export const THROTTLE_MS = 100;
export const TOAST_DURATION_MS = 5000;
export const ANIMATION_DURATION_MS = 300;

// Pagination
export const DEFAULT_PAGE_SIZE = 24;
export const MAX_PAGE_SIZE = 100;

// Search
export const MIN_SEARCH_LENGTH = 2;
export const SEARCH_DEBOUNCE_MS = 300;

// Cache
export const CACHE_TTL_SHORT = 60; // 1 minute
export const CACHE_TTL_MEDIUM = 300; // 5 minutes
export const CACHE_TTL_LONG = 3600; // 1 hour

// QR Code
export const QR_CODE_SIZE = 512;
export const QR_CODE_ERROR_CORRECTION = "H" as const;

// Access code
export const ACCESS_CODE_LENGTH = 6;
export const ACCESS_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

// Feature flags
export const FEATURES = {
  faceRecognition: false, // Opt-in only
  locationTracking: false, // Requires permission
  aiTagging: true,
  comments: true,
  downloads: true,
  realtime: true,
  offlineMode: true,
} as const;

// Social
export const SOCIAL_LINKS = {
  twitter: "https://twitter.com/engramapp",
  github: "https://github.com/engram",
  discord: "https://discord.gg/engram",
} as const;
