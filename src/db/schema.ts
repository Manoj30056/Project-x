import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  varchar,
  jsonb,
  real,
  index,
} from "drizzle-orm/pg-core";

// ============================================
// USERS & PROFILES
// ============================================

// Profiles table links to Supabase Auth.users
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // This will match auth.users.id
  email: text("email"),
  username: text("username").unique(),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  isGuest: boolean("is_guest").default(false).notNull(),
  preferences: jsonb("preferences").default({
    theme: "system",
    language: "en",
    notifications: true,
  }).notNull(),
  storageUsed: integer("storage_used").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("profiles_username_idx").on(table.username),
]);

// ============================================
// EVENTS
// ============================================

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  coverImage: text("cover_image"),
  coverColor: varchar("cover_color", { length: 7 }).default("#6366f1"),
  eventCode: varchar("event_code", { length: 12 }).notNull().unique(),
  organizerId: uuid("organizer_id").references(() => profiles.id, { onDelete: "set null" }),
  organizerName: text("organizer_name").notNull().default("Organizer"),
  organizerEmail: text("organizer_email"),
  passwordHash: text("password_hash"),
  visibility: varchar("visibility", { length: 20 }).default("public").notNull(), // public, private, hidden
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }),
  timezone: text("timezone").default("UTC"),
  locationName: text("location_name"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  guestCount: integer("guest_count").default(0).notNull(),
  mediaCount: integer("media_count").default(0).notNull(),
  settings: jsonb("settings").default({
    allowGuestUploads: true,
    requireApproval: false,
    isOnline: false,
  }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("events_event_code_idx").on(table.eventCode),
  index("events_organizer_idx").on(table.organizerId),
  index("events_start_date_idx").on(table.startDate),
]);

export const eventMembers = pgTable("event_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "set null" }),
  role: varchar("role", { length: 20 }).default("guest").notNull(), // organizer, co-organizer, photographer, guest, viewer
  isGuestAccount: boolean("is_guest_account").default(false).notNull(),
  permissions: jsonb("permissions").default({}).notNull(),
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("event_members_event_idx").on(table.eventId),
  index("event_members_user_idx").on(table.userId),
]);

// ============================================
// MEDIA
// ============================================

export const albums = pgTable("albums", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  coverPhotoId: uuid("cover_photo_id"),
  sortOrder: integer("sort_order").default(0),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("albums_event_idx").on(table.eventId),
]);

export const photos = pgTable("photos", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" }).notNull(),
  albumId: uuid("album_id").references(() => albums.id, { onDelete: "set null" }),
  uploaderId: uuid("uploader_id").references(() => profiles.id, { onDelete: "set null" }),
  uploaderName: text("uploader_name").notNull(),
  originalUrl: text("original_url").notNull(),
  optimizedUrl: text("optimized_url"),
  thumbnailUrl: text("thumbnail_url"),
  width: integer("width"),
  height: integer("height"),
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type", { length: 50 }),
  metadata: jsonb("metadata").default({}).notNull(),
  aiTags: jsonb("ai_tags").default([]).notNull(),
  faceIds: jsonb("face_ids").default([]).notNull(),
  caption: text("caption"),
  isFavorite: boolean("is_favorite").default(false).notNull(),
  isApproved: boolean("is_approved").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  takenAt: timestamp("taken_at", { withTimezone: true }),
}, (table) => [
  index("photos_event_idx").on(table.eventId),
  index("photos_album_idx").on(table.albumId),
  index("photos_uploader_idx").on(table.uploaderId),
  index("photos_created_idx").on(table.createdAt),
]);

export const videos = pgTable("videos", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" }).notNull(),
  albumId: uuid("album_id").references(() => albums.id, { onDelete: "set null" }),
  uploaderId: uuid("uploader_id").references(() => profiles.id, { onDelete: "set null" }),
  uploaderName: text("uploader_name").notNull(),
  originalUrl: text("original_url").notNull(),
  optimizedUrl: text("optimized_url"),
  thumbnailUrl: text("thumbnail_url"),
  previewUrl: text("preview_url"),
  duration: integer("duration"), // seconds
  width: integer("width"),
  height: integer("height"),
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type", { length: 50 }),
  metadata: jsonb("metadata").default({}).notNull(),
  aiTags: jsonb("ai_tags").default([]).notNull(),
  isFavorite: boolean("is_favorite").default(false).notNull(),
  isApproved: boolean("is_approved").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  recordedAt: timestamp("recorded_at", { withTimezone: true }),
}, (table) => [
  index("videos_event_idx").on(table.eventId),
  index("videos_album_idx").on(table.albumId),
  index("videos_uploader_idx").on(table.uploaderId),
]);

// Legacy media table for compatibility
export const media = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" }).notNull(),
  guestId: uuid("guest_id").references(() => eventMembers.id, { onDelete: "set null" }),
  guestName: text("guest_name"),
  type: varchar("type", { length: 10 }).notNull().default("image"),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  width: integer("width"),
  height: integer("height"),
  fileSize: integer("file_size"),
  aiTags: jsonb("ai_tags").default([]),
  isFavorite: boolean("is_favorite").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("media_event_idx").on(table.eventId),
]);

// ============================================
// SOCIAL
// ============================================

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  mediaId: uuid("media_id").notNull(),
  mediaType: varchar("media_type", { length: 10 }).notNull(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "set null" }),
  guestName: text("guest_name").notNull(),
  content: text("content").notNull(),
  parentId: uuid("parent_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("comments_media_idx").on(table.mediaId),
]);

export const likes = pgTable("likes", {
  id: uuid("id").defaultRandom().primaryKey(),
  mediaId: uuid("media_id").notNull(),
  mediaType: varchar("media_type", { length: 10 }).notNull(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "set null" }),
  guestName: text("guest_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("likes_media_idx").on(table.mediaId),
]);

// ============================================
// FACE RECOGNITION (Opt-in)
// ============================================

export const faceProfiles = pgTable("face_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" }).notNull(),
  name: text("name"),
  embedding: jsonb("embedding").default([]).notNull(),
  samplePhotoIds: jsonb("sample_photo_ids").default([]).notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("face_profiles_event_idx").on(table.eventId),
]);

// ============================================
// NOTIFICATIONS
// ============================================

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  data: jsonb("data").default({}).notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("notifications_user_idx").on(table.userId),
  index("notifications_read_idx").on(table.isRead),
]);

// ============================================
// ACTIVITY & AUDIT
// ============================================

export const activityLogs = pgTable("activity_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "set null" }),
  guestName: text("guest_name"),
  action: varchar("action", { length: 50 }).notNull(),
  details: jsonb("details").default({}).notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("activity_logs_event_idx").on(table.eventId),
  index("activity_logs_action_idx").on(table.action),
]);

// ============================================
// QR CODES & INVITATIONS
// ============================================

export const qrCodes = pgTable("qr_codes", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" }).notNull(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  type: varchar("type", { length: 20 }).default("join").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  usageCount: integer("usage_count").default(0).notNull(),
  maxUsage: integer("max_usage"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("qr_codes_event_idx").on(table.eventId),
  index("qr_codes_code_idx").on(table.code),
]);

export const invitations = pgTable("invitations", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" }).notNull(),
  email: text("email"),
  phone: text("phone"),
  code: varchar("code", { length: 20 }).notNull().unique(),
  role: varchar("role", { length: 20 }).default("guest").notNull(),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  sentAt: timestamp("sent_at", { withTimezone: true }).defaultNow().notNull(),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
}, (table) => [
  index("invitations_event_idx").on(table.eventId),
  index("invitations_code_idx").on(table.code),
]);

// ============================================
// DOWNLOADS
// ============================================

export const downloads = pgTable("downloads", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "set null" }),
  guestName: text("guest_name"),
  type: varchar("type", { length: 20 }).notNull(), // single, album, all
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  fileUrl: text("file_url"),
  mediaIds: jsonb("media_ids").default([]).notNull(),
  fileSize: integer("file_size"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  readyAt: timestamp("ready_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
}, (table) => [
  index("downloads_event_idx").on(table.eventId),
]);

// ============================================
// LOCATIONS
// ============================================

export const locations = pgTable("locations", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  radius: integer("radius").default(100),
  mediaCount: integer("media_count").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("locations_event_idx").on(table.eventId),
]);

// ============================================
// GUESTS (legacy compatibility)
// ============================================

export const guests = pgTable("guests", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("guests_event_idx").on(table.eventId),
]);

// ============================================
// TYPE EXPORTS
// ============================================

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type EventMember = typeof eventMembers.$inferSelect;
export type NewEventMember = typeof eventMembers.$inferInsert;
export type Album = typeof albums.$inferSelect;
export type NewAlbum = typeof albums.$inferInsert;
export type Photo = typeof photos.$inferSelect;
export type NewPhoto = typeof photos.$inferInsert;
export type Video = typeof videos.$inferSelect;
export type NewVideo = typeof videos.$inferInsert;
export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type Like = typeof likes.$inferSelect;
export type NewLike = typeof likes.$inferInsert;
export type FaceProfile = typeof faceProfiles.$inferSelect;
export type NewFaceProfile = typeof faceProfiles.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type QRCode = typeof qrCodes.$inferSelect;
export type NewQRCode = typeof qrCodes.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
export type Download = typeof downloads.$inferSelect;
export type NewDownload = typeof downloads.$inferInsert;
export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;
export type Guest = typeof guests.$inferSelect;
export type NewGuest = typeof guests.$inferInsert;
