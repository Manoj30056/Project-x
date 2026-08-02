/**
 * Route Constants
 */

// Public routes
export const ROUTES = {
  home: "/",
  create: "/create",
  join: "/join",
  event: (id: string) => `/event/${id}`,
  eventGallery: (id: string) => `/event/${id}/gallery`,
  eventMembers: (id: string) => `/event/${id}/members`,
  eventSettings: (id: string) => `/event/${id}/settings`,
  eventAlbum: (id: string, albumId: string) => `/event/${id}/album/${albumId}`,
  media: (eventId: string, mediaId: string) => `/event/${eventId}/media/${mediaId}`,
  
  // Auth
  signIn: "/auth/signin",
  signUp: "/auth/signup",
  signOut: "/auth/signout",
  resetPassword: "/auth/reset-password",
  
  // User
  profile: "/profile",
  settings: "/settings",
  myEvents: "/my-events",
  
  // Legal
  privacy: "/privacy",
  terms: "/terms",
  cookies: "/cookies",
  
  // Support
  help: "/help",
  contact: "/contact",
  faq: "/faq",
} as const;

// API routes
export const API_ROUTES = {
  // Events
  events: "/api/events",
  event: (id: string) => `/api/events/${id}`,
  eventJoin: (id: string) => `/api/events/${id}/join`,
  eventQR: (id: string) => `/api/events/${id}/qr`,
  eventMembers: (id: string) => `/api/events/${id}/members`,
  eventMedia: (id: string) => `/api/events/${id}/media`,
  eventDownload: (id: string) => `/api/events/${id}/download`,
  eventSettings: (id: string) => `/api/events/${id}/settings`,
  
  // Media
  media: "/api/media",
  mediaItem: (id: string) => `/api/media/${id}`,
  mediaUpload: "/api/media/upload",
  mediaDelete: (id: string) => `/api/media/${id}`,
  
  // Albums
  albums: (eventId: string) => `/api/events/${eventId}/albums`,
  album: (eventId: string, albumId: string) => `/api/events/${eventId}/albums/${albumId}`,
  
  // Comments
  comments: (mediaId: string) => `/api/media/${mediaId}/comments`,
  comment: (mediaId: string, commentId: string) => `/api/media/${mediaId}/comments/${commentId}`,
  
  // AI
  analyze: "/api/ai/analyze",
  tags: "/api/ai/tags",
  faces: "/api/ai/faces",
  
  // Auth
  auth: "/api/auth",
  authSession: "/api/auth/session",
  authCallback: "/api/auth/callback",
  
  // User
  profile: "/api/profile",
  preferences: "/api/profile/preferences",
  
  // Health
  health: "/api/health",
} as const;

// External links
export const EXTERNAL_LINKS = {
  documentation: "https://docs.engram.app",
  status: "https://status.engram.app",
  changelog: "https://engram.app/changelog",
  github: "https://github.com/engram",
  twitter: "https://twitter.com/engramapp",
  discord: "https://discord.gg/engram",
} as const;

// Navigation items
export const NAV_ITEMS = [
  { label: "Features", href: "/#features" },
  { label: "How it Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
] as const;

export const FOOTER_LINKS = {
  product: [
    { label: "Features", href: "/#features" },
    { label: "How it Works", href: "/#how-it-works" },
    { label: "Security", href: "/#security" },
    { label: "Changelog", href: EXTERNAL_LINKS.changelog },
  ],
  resources: [
    { label: "Documentation", href: EXTERNAL_LINKS.documentation },
    { label: "API", href: `${EXTERNAL_LINKS.documentation}/api` },
    { label: "Community", href: EXTERNAL_LINKS.discord },
    { label: "Open Source", href: EXTERNAL_LINKS.github },
  ],
  legal: [
    { label: "Privacy Policy", href: ROUTES.privacy },
    { label: "Terms of Service", href: ROUTES.terms },
    { label: "Cookie Policy", href: ROUTES.cookies },
  ],
} as const;
