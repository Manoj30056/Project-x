/**
 * Media Types
 * 
 * Types for media processing, upload, and display.
 */

// Media type
export type MediaType = "image" | "video";

// Media item (unified for gallery display)
export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  optimizedUrl?: string;
  width?: number;
  height?: number;
  fileSize?: number;
  duration?: number; // For videos
  uploaderName: string;
  uploaderId?: string;
  eventId: string;
  albumId?: string;
  isFavorite: boolean;
  aiTags: string[];
  createdAt: string;
}

// Upload
export interface FileToUpload {
  id: string;
  file: File;
  preview?: string;
  status: UploadStatus;
  progress: number;
  error?: string;
  mediaId?: string;
}

export type UploadStatus =
  | "pending"
  | "queued"
  | "uploading"
  | "processing"
  | "complete"
  | "error"
  | "cancelled";

export interface UploadQueueItem {
  id: string;
  file: File;
  eventId: string;
  albumId?: string;
  guestName: string;
  guestId?: string;
  priority: number;
  retryCount: number;
  addedAt: number;
}

export interface UploadConfig {
  maxFileSize: number; // bytes
  allowedTypes: string[];
  maxConcurrentUploads: number;
  chunkSize: number; // For resumable uploads
  retryAttempts: number;
  retryDelay: number; // ms
}

// Image processing
export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: "jpeg" | "webp" | "avif" | "png";
  preserveExif?: boolean;
}

export interface ProcessedImage {
  original: Blob;
  optimized: Blob;
  thumbnail: Blob;
  dimensions: ImageDimensions;
  exif?: ImageExif;
}

export interface ImageExif {
  make?: string;
  model?: string;
  dateTime?: string;
  gps?: {
    latitude: number;
    longitude: number;
    altitude?: number;
  };
  orientation?: number;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: number;
}

// Video processing
export interface VideoProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: "low" | "medium" | "high";
  generateThumbnail?: boolean;
  thumbnailTime?: number; // seconds
}

export interface ProcessedVideo {
  original: Blob;
  optimized?: Blob;
  thumbnail: Blob;
  preview?: Blob;
  duration: number;
  dimensions: ImageDimensions;
}

// AI Analysis
export interface AIAnalysisResult {
  tags: AITag[];
  faces: FaceDetection[];
  objects: ObjectDetection[];
  scene: SceneClassification;
  quality: QualityMetrics;
  colors: ColorAnalysis;
}

export interface AITag {
  label: string;
  confidence: number;
  category: "scene" | "object" | "activity" | "emotion" | "style";
}

export interface FaceDetection {
  id: string;
  boundingBox: BoundingBox;
  landmarks?: FaceLandmarks;
  embedding?: number[];
  attributes?: FaceAttributes;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FaceLandmarks {
  leftEye: Point;
  rightEye: Point;
  nose: Point;
  leftMouth: Point;
  rightMouth: Point;
}

export interface Point {
  x: number;
  y: number;
}

export interface FaceAttributes {
  age?: number;
  gender?: "male" | "female";
  expression?: string;
  confidence: number;
}

export interface ObjectDetection {
  label: string;
  confidence: number;
  boundingBox: BoundingBox;
}

export interface SceneClassification {
  primary: string;
  secondary?: string;
  indoor: boolean;
  confidence: number;
}

export interface QualityMetrics {
  blur: number; // 0-1, higher is sharper
  brightness: number; // 0-1
  contrast: number; // 0-1
  noise: number; // 0-1, lower is better
  overall: number; // 0-1
}

export interface ColorAnalysis {
  dominant: string[];
  palette: Array<{ color: string; percentage: number }>;
  temperature: "warm" | "neutral" | "cool";
  saturation: "low" | "medium" | "high";
}

// Gallery display
export interface GalleryLayoutItem {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface MasonryConfig {
  columns: number;
  gap: number;
  minItemWidth: number;
}
