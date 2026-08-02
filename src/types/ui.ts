/**
 * UI Types
 * 
 * Types for UI components and state.
 */

import type { ReactNode } from "react";

// Theme
export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

// Button variants
export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

// Toast
export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: ToastAction;
}

export interface ToastAction {
  label: string;
  onClick: () => void;
}

// Modal
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

// Gallery
export type GalleryViewMode = "grid" | "masonry" | "timeline" | "list" | "large";

export interface GalleryFilters {
  viewMode: GalleryViewMode;
  sortBy: "date" | "oldest" | "likes" | "downloads" | "uploader" | "ai_category";
  sortOrder: "asc" | "desc";
  showVideos: boolean;
  showPhotos: boolean;
  onlyFavorites: boolean;
  timeRange: "all" | "today" | "week" | "month";
  aiTaggedOnly: boolean;
  uploaderId?: string;
  albumId?: string;
  location?: string;
}

// Form
export interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
}

// Navigation
export interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
  badge?: string | number;
  children?: NavItem[];
  external?: boolean;
}

// Tabs
export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

// Dropdown
export interface DropdownItem {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  separator?: boolean;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error?: string;
  progress?: number;
}

// Pagination
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Selection
export interface SelectionState<T = string> {
  selected: Set<T>;
  lastSelected?: T;
  isSelectMode: boolean;
}

// Responsive
export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

// Animation
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  ease?: string | number[];
  staggerChildren?: number;
}

// Accessibility
export interface A11yProps {
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-expanded"?: boolean;
  "aria-selected"?: boolean;
  "aria-pressed"?: boolean;
  "aria-disabled"?: boolean;
  "aria-hidden"?: boolean;
  role?: string;
  tabIndex?: number;
}
