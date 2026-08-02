/**
 * Media Compression Utilities
 * 
 * Optimizes images and videos for storage efficiency
 * while preserving quality. Reduces bandwidth and storage costs.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-100
  format?: "jpeg" | "webp" | "avif";
  generateThumbnail?: boolean;
  thumbnailSize?: number;
}

export interface CompressionResult {
  buffer: Buffer;
  width: number;
  height: number;
  format: string;
  originalSize: number;
  compressedSize: number;
  savings: number; // percentage saved
  thumbnail?: {
    buffer: Buffer;
    width: number;
    height: number;
  };
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxWidth: 2400,
  maxHeight: 2400,
  quality: 85,
  format: "jpeg",
  generateThumbnail: true,
  thumbnailSize: 400,
};

/**
 * Compress an image buffer
 * 
 * Note: In production, use 'sharp' for real compression.
 * This is a placeholder that returns the original for now.
 * Install sharp: npm install sharp
 */
export async function compressImage(
  buffer: Buffer,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Placeholder - returns original buffer
  // In production with sharp:
  // const sharp = require('sharp');
  // const metadata = await sharp(buffer).metadata();
  // const compressed = await sharp(buffer)
  //   .resize(opts.maxWidth, opts.maxHeight, { fit: 'inside', withoutEnlargement: true })
  //   .jpeg({ quality: opts.quality })
  //   .toBuffer();
  
  const originalSize = buffer.length;
  
  return {
    buffer,
    width: 0, // Would be from metadata
    height: 0,
    format: opts.format || "jpeg",
    originalSize,
    compressedSize: buffer.length,
    savings: 0,
  };
}

/**
 * Generate a thumbnail from an image buffer
 */
export async function generateThumbnail(
  buffer: Buffer,
  size: number = 400
): Promise<Buffer> {
  // Placeholder - returns original
  // In production with sharp:
  // return sharp(buffer)
  //   .resize(size, size, { fit: 'cover' })
  //   .jpeg({ quality: 80 })
  //   .toBuffer();
  
  return buffer;
}

/**
 * Estimate file size after compression
 */
export function estimateCompressedSize(
  originalSize: number,
  format: "jpeg" | "webp" | "avif" = "jpeg"
): number {
  const compressionRatios: Record<string, number> = {
    jpeg: 0.7,
    webp: 0.5,
    avif: 0.4,
  };
  
  return Math.round(originalSize * compressionRatios[format]);
}

/**
 * Get optimal format based on browser support
 */
export function getOptimalFormat(
  acceptHeader?: string
): "avif" | "webp" | "jpeg" {
  if (!acceptHeader) return "jpeg";
  
  if (acceptHeader.includes("image/avif")) return "avif";
  if (acceptHeader.includes("image/webp")) return "webp";
  return "jpeg";
}

/**
 * Check if file is an image
 */
export function isImage(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

/**
 * Check if file is a video
 */
export function isVideo(mimeType: string): boolean {
  return mimeType.startsWith("video/");
}

/**
 * Get file extension from mime type
 */
export function getExtension(mimeType: string): string {
  const extensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
    "image/gif": "gif",
    "image/heic": "heic",
    "image/heif": "heif",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov",
  };
  
  return extensions[mimeType] || "bin";
}
