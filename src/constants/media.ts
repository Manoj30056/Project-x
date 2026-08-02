/**
 * Media Constants
 */

// File sizes (in bytes)
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_IMAGE_SIZE = 25 * 1024 * 1024; // 25MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_TOTAL_UPLOAD_SIZE = 500 * 1024 * 1024; // 500MB per session

// Image dimensions
export const IMAGE_THUMBNAIL_SIZE = 400;
export const IMAGE_MEDIUM_SIZE = 1200;
export const IMAGE_LARGE_SIZE = 2400;
export const IMAGE_MAX_DIMENSION = 4096;

// Image quality (1-100)
export const IMAGE_QUALITY_THUMBNAIL = 70;
export const IMAGE_QUALITY_OPTIMIZED = 85;
export const IMAGE_QUALITY_ORIGINAL = 95;

// Video
export const VIDEO_THUMBNAIL_TIME = 1; // seconds
export const VIDEO_PREVIEW_DURATION = 3; // seconds
export const VIDEO_MAX_DURATION = 300; // 5 minutes

// Accepted file types
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

export const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
] as const;

export const ACCEPTED_MEDIA_TYPES = [
  ...ACCEPTED_IMAGE_TYPES,
  ...ACCEPTED_VIDEO_TYPES,
] as const;

// File extensions
export const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"];
export const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".avi"];

// Upload
export const MAX_CONCURRENT_UPLOADS = 3;
export const UPLOAD_CHUNK_SIZE = 1024 * 1024; // 1MB chunks for resumable uploads
export const UPLOAD_RETRY_ATTEMPTS = 3;
export const UPLOAD_RETRY_DELAY = 1000; // 1 second

// Gallery
export const GALLERY_COLUMNS = {
  mobile: 2,
  tablet: 3,
  desktop: 4,
  wide: 5,
} as const;

export const GALLERY_GAP = 12; // pixels
export const GALLERY_MIN_ITEM_WIDTH = 200; // pixels

// Lightbox
export const LIGHTBOX_PRELOAD_COUNT = 2; // Preload adjacent images

// AI
export const AI_MIN_CONFIDENCE = 0.5;
export const AI_MAX_TAGS = 10;
export const AI_FACE_MIN_SIZE = 50; // minimum face size in pixels

// Storage paths
export const STORAGE_PATHS = {
  originals: "originals",
  optimized: "optimized",
  thumbnails: "thumbnails",
  videos: "videos",
  previews: "previews",
  exports: "exports",
} as const;

// MIME to extension mapping
export const MIME_TO_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "video/x-msvideo": "avi",
};
