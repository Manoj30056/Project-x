/**
 * API Types
 * 
 * Request/Response types for API endpoints.
 */

import type { Event, Photo, Video, EventMember, Album } from "./database";

// Generic API Response
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface ApiMeta {
  page?: number;
  pageSize?: number;
  total?: number;
  hasMore?: boolean;
}

// Pagination
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Event API
export interface CreateEventRequest {
  name: string;
  description?: string;
  date: string;
  endDate?: string;
  location?: string;
  organizerName: string;
  organizerEmail?: string;
  coverColor?: string;
  isPublic?: boolean;
  settings?: Partial<Event["settings"]>;
}

export interface CreateEventResponse {
  event: Event;
  qrCode: string;
  accessCode: string;
}

export interface UpdateEventRequest {
  name?: string;
  description?: string;
  date?: string;
  endDate?: string;
  location?: string;
  coverColor?: string;
  isActive?: boolean;
  isPublic?: boolean;
  settings?: Partial<Event["settings"]>;
}

export interface GetEventResponse {
  event: Event;
  members: EventMember[];
  albums: Album[];
  recentMedia: (Photo | Video)[];
  stats: EventStats;
}

export interface EventStats {
  photoCount: number;
  videoCount: number;
  memberCount: number;
  albumCount: number;
  storageUsed: number; // in bytes
}

// Join Event
export interface JoinEventRequest {
  accessCode: string;
  guestName: string;
}

export interface JoinEventResponse {
  event: Event;
  member: EventMember;
  sessionToken: string;
}

// Media Upload
export interface UploadMediaRequest {
  file: File;
  eventId: string;
  albumId?: string;
  guestName: string;
  guestId?: string;
}

export interface UploadMediaResponse {
  media: Photo | Video;
  uploadUrl?: string; // For resumable uploads
}

export interface UploadProgress {
  id: string;
  filename: string;
  progress: number; // 0-100
  status: "pending" | "uploading" | "processing" | "complete" | "error";
  error?: string;
}

// QR Code
export interface GenerateQRResponse {
  qr: string; // Data URL
  joinUrl: string;
  accessCode: string;
  expiresAt?: string;
}

// Download
export interface DownloadRequest {
  eventId: string;
  mediaIds?: string[];
  albumId?: string;
  type: "single" | "album" | "all";
}

export interface DownloadResponse {
  downloadId: string;
  status: "pending" | "processing" | "ready";
  downloadUrl?: string;
  estimatedSize?: number;
  expiresAt?: string;
}

// Search
export interface SearchRequest {
  query: string;
  eventId: string;
  filters?: SearchFilters;
  pagination?: PaginationParams;
}

export interface SearchFilters {
  mediaType?: "photo" | "video" | "all";
  dateFrom?: string;
  dateTo?: string;
  uploaderName?: string;
  albumId?: string;
  tags?: string[];
  hasFaces?: boolean;
  isFavorite?: boolean;
}

export interface SearchResponse {
  results: (Photo | Video)[];
  facets: SearchFacets;
  meta: ApiMeta;
}

export interface SearchFacets {
  uploaders: Array<{ name: string; count: number }>;
  tags: Array<{ tag: string; count: number }>;
  dates: Array<{ date: string; count: number }>;
}
