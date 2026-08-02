/**
 * Event Types
 * 
 * Types specific to event management and real-time features.
 */

import type { Event, EventMember, Photo, Video } from "./database";

// Event state
export interface EventState {
  event: Event | null;
  members: EventMember[];
  isLoading: boolean;
  error: string | null;
  isOrganizer: boolean;
  currentMember: EventMember | null;
}

// Event actions
export type EventAction =
  | { type: "SET_EVENT"; payload: Event }
  | { type: "SET_MEMBERS"; payload: EventMember[] }
  | { type: "ADD_MEMBER"; payload: EventMember }
  | { type: "REMOVE_MEMBER"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "UPDATE_STATS"; payload: Partial<Event> };

// Real-time events
export type RealtimeEventType =
  | "member_joined"
  | "member_left"
  | "media_uploaded"
  | "media_deleted"
  | "event_updated"
  | "event_ended"
  | "comment_added"
  | "like_added";

export interface RealtimeEvent<T = unknown> {
  type: RealtimeEventType;
  eventId: string;
  payload: T;
  timestamp: string;
  senderId?: string;
}

export interface MemberJoinedPayload {
  member: EventMember;
}

export interface MemberLeftPayload {
  memberId: string;
  memberName: string;
}

export interface MediaUploadedPayload {
  media: Photo | Video;
  uploaderName: string;
}

export interface MediaDeletedPayload {
  mediaId: string;
  mediaType: "photo" | "video";
}

export interface EventUpdatedPayload {
  changes: Partial<Event>;
}

export interface CommentAddedPayload {
  mediaId: string;
  comment: {
    id: string;
    content: string;
    guestName: string;
    createdAt: string;
  };
}

// Event timeline
export interface TimelineEntry {
  id: string;
  type: TimelineEntryType;
  title: string;
  description?: string;
  timestamp: string;
  mediaId?: string;
  memberId?: string;
  memberName?: string;
  thumbnailUrl?: string;
}

export type TimelineEntryType =
  | "event_started"
  | "member_joined"
  | "first_upload"
  | "milestone_photos"
  | "milestone_guests"
  | "popular_photo"
  | "event_ended";

// Event summary
export interface EventSummary {
  totalPhotos: number;
  totalVideos: number;
  totalGuests: number;
  totalDownloads: number;
  storageUsed: number;
  mostActiveUploader: {
    name: string;
    count: number;
  };
  peakUploadHour: {
    hour: number;
    count: number;
  };
  topTags: Array<{ tag: string; count: number }>;
  timeline: TimelineEntry[];
}

// Event sharing
export interface ShareOptions {
  type: "qr" | "link" | "email" | "sms";
  role?: "admin" | "member" | "guest";
  expiresIn?: number; // hours
  maxUses?: number;
  message?: string;
}

export interface ShareResult {
  url: string;
  code?: string;
  qrDataUrl?: string;
  expiresAt?: string;
}

// Event creation wizard
export interface EventCreationStep {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
  isActive: boolean;
}

export interface EventCreationData {
  step: number;
  basicInfo: {
    name: string;
    description: string;
    date: string;
    endDate?: string;
    location?: string;
  };
  organizer: {
    name: string;
    email?: string;
  };
  settings: {
    coverColor: string;
    isPublic: boolean;
    allowGuestUploads: boolean;
    requireApproval: boolean;
    faceRecognition: boolean;
  };
}

// Event permissions
export interface EventPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canInvite: boolean;
  canModerate: boolean;
  canUpload: boolean;
  canComment: boolean;
  canDownload: boolean;
  canViewMembers: boolean;
  canViewSettings: boolean;
}

export function getPermissions(role: EventMember["role"]): EventPermissions {
  switch (role) {
    case "organizer":
      return {
        canEdit: true,
        canDelete: true,
        canInvite: true,
        canModerate: true,
        canUpload: true,
        canComment: true,
        canDownload: true,
        canViewMembers: true,
        canViewSettings: true,
      };
    case "admin":
      return {
        canEdit: true,
        canDelete: false,
        canInvite: true,
        canModerate: true,
        canUpload: true,
        canComment: true,
        canDownload: true,
        canViewMembers: true,
        canViewSettings: true,
      };
    case "member":
      return {
        canEdit: false,
        canDelete: false,
        canInvite: false,
        canModerate: false,
        canUpload: true,
        canComment: true,
        canDownload: true,
        canViewMembers: true,
        canViewSettings: false,
      };
    case "guest":
    default:
      return {
        canEdit: false,
        canDelete: false,
        canInvite: false,
        canModerate: false,
        canUpload: true,
        canComment: false,
        canDownload: false,
        canViewMembers: false,
        canViewSettings: false,
      };
  }
}
