/**
 * Database Types
 * 
 * TypeScript interfaces for all database tables.
 * These mirror the Drizzle schema but provide clean interfaces for use in components.
 */

// Base types
export type UUID = string;
export type Timestamp = Date | string;

// User & Profile
export interface User {
  id: UUID;
  email: string;
  phone?: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastSignInAt?: Timestamp | null;
  isAnonymous: boolean;
}

export interface Profile {
  id: UUID;
  userId: UUID;
  displayName: string;
  avatarUrl?: string | null;
  bio?: string | null;
  preferences: UserPreferences;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  notifications: boolean;
  emailDigest: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
}

// Events
export interface Event {
  id: UUID;
  title: string;
  description?: string | null;
  coverImage?: string | null;
  coverColor: string;
  eventCode: string;
  organizerId?: UUID | null;
  passwordHash?: string | null;
  visibility: "public" | "private" | "hidden";
  startDate: Timestamp;
  endDate?: Timestamp | null;
  timezone: string;
  locationName?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  guestCount: number;
  mediaCount: number;
  settings: EventSettings;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface EventSettings {
  allowGuestUploads: boolean;
  requireApproval: boolean;
  allowComments: boolean;
  allowDownloads: boolean;
  watermark: boolean;
  faceRecognition: boolean;
  locationTracking: boolean;
  maxFileSize: number; // in MB
  allowedFileTypes: string[];
}

export interface EventMember {
  id: UUID;
  eventId: UUID;
  userId?: UUID | null;
  guestName: string;
  role: "organizer" | "admin" | "member" | "guest";
  joinedAt: Timestamp;
  invitedBy?: UUID | null;
  status: "active" | "pending" | "removed";
}

// Media
export interface Photo {
  id: UUID;
  eventId: UUID;
  albumId?: UUID | null;
  uploaderId?: UUID | null;
  uploaderName: string;
  originalUrl: string;
  optimizedUrl?: string | null;
  thumbnailUrl?: string | null;
  width: number;
  height: number;
  fileSize: number;
  mimeType: string;
  metadata: PhotoMetadata;
  aiTags: string[];
  faceIds: UUID[];
  isFavorite: boolean;
  isApproved: boolean;
  createdAt: Timestamp;
  takenAt?: Timestamp | null;
}

export interface PhotoMetadata {
  camera?: string | null;
  lens?: string | null;
  aperture?: string | null;
  shutterSpeed?: string | null;
  iso?: number | null;
  focalLength?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  altitude?: number | null;
}

export interface Video {
  id: UUID;
  eventId: UUID;
  albumId?: UUID | null;
  uploaderId?: UUID | null;
  uploaderName: string;
  originalUrl: string;
  optimizedUrl?: string | null;
  thumbnailUrl?: string | null;
  previewUrl?: string | null;
  duration: number; // in seconds
  width: number;
  height: number;
  fileSize: number;
  mimeType: string;
  metadata: VideoMetadata;
  aiTags: string[];
  isFavorite: boolean;
  isApproved: boolean;
  createdAt: Timestamp;
  recordedAt?: Timestamp | null;
}

export interface VideoMetadata {
  codec?: string | null;
  bitrate?: number | null;
  frameRate?: number | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface Album {
  id: UUID;
  eventId: UUID;
  name: string;
  description?: string | null;
  coverPhotoId?: UUID | null;
  sortOrder: number;
  isDefault: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Social
export interface Comment {
  id: UUID;
  mediaId: UUID;
  mediaType: "photo" | "video";
  userId?: UUID | null;
  guestName: string;
  content: string;
  parentId?: UUID | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Like {
  id: UUID;
  mediaId: UUID;
  mediaType: "photo" | "video";
  userId?: UUID | null;
  guestName: string;
  createdAt: Timestamp;
}

// Face Recognition (Opt-in)
export interface FaceProfile {
  id: UUID;
  eventId: UUID;
  name?: string | null;
  embedding: number[];
  samplePhotoIds: UUID[];
  isVerified: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Notifications
export interface Notification {
  id: UUID;
  userId: UUID;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: Timestamp;
}

export type NotificationType =
  | "event_invite"
  | "new_upload"
  | "comment"
  | "like"
  | "event_ended"
  | "download_ready"
  | "system";

// Activity
export interface ActivityLog {
  id: UUID;
  eventId: UUID;
  userId?: UUID | null;
  guestName?: string | null;
  action: ActivityAction;
  details?: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Timestamp;
}

export type ActivityAction =
  | "event_created"
  | "event_updated"
  | "event_ended"
  | "member_joined"
  | "member_left"
  | "photo_uploaded"
  | "video_uploaded"
  | "media_deleted"
  | "album_created"
  | "comment_added"
  | "download_started";

// QR Codes
export interface QRCode {
  id: UUID;
  eventId: UUID;
  code: string;
  type: "join" | "upload" | "view";
  expiresAt?: Timestamp | null;
  usageCount: number;
  maxUsage?: number | null;
  createdAt: Timestamp;
}

// Invitations
export interface Invitation {
  id: UUID;
  eventId: UUID;
  email?: string | null;
  phone?: string | null;
  code: string;
  role: "admin" | "member" | "guest";
  status: "pending" | "accepted" | "declined" | "expired";
  sentAt: Timestamp;
  acceptedAt?: Timestamp | null;
  expiresAt: Timestamp;
}

// Downloads
export interface Download {
  id: UUID;
  eventId: UUID;
  userId?: UUID | null;
  guestName?: string | null;
  type: "single" | "album" | "all";
  status: "pending" | "processing" | "ready" | "expired" | "failed";
  fileUrl?: string | null;
  mediaIds: UUID[];
  fileSize?: number | null;
  createdAt: Timestamp;
  readyAt?: Timestamp | null;
  expiresAt?: Timestamp | null;
}

// Locations
export interface Location {
  id: UUID;
  eventId: UUID;
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
  mediaCount: number;
  createdAt: Timestamp;
}

// Settings
export interface GlobalSettings {
  id: UUID;
  key: string;
  value: unknown;
  updatedAt: Timestamp;
}
