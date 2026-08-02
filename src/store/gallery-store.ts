import { create } from "zustand";
import type { MediaItem, GalleryViewMode } from "@/types";

interface GalleryState {
  // Media
  media: MediaItem[];
  filteredMedia: MediaItem[];
  selectedMedia: Set<string>;
  
  // View
  viewMode: GalleryViewMode;
  sortBy: "date" | "oldest" | "likes" | "downloads" | "uploader" | "ai_category";
  sortOrder: "asc" | "desc";
  
  // Filters
  showPhotos: boolean;
  showVideos: boolean;
  onlyFavorites: boolean;
  timeRange: "all" | "today" | "week" | "month";
  aiTaggedOnly: boolean;
  uploaderFilter: string | null;
  albumFilter: string | null;
  tagFilter: string[];
  locationFilter: string | null;
  searchQuery: string;
  
  // Lightbox
  lightboxIndex: number | null;
  
  // Selection
  isSelectMode: boolean;
  
  // Loading
  isLoading: boolean;
  hasMore: boolean;
  page: number;
  
  // Actions
  setMedia: (media: MediaItem[]) => void;
  appendMedia: (media: MediaItem[]) => void;
  addMediaItem: (item: MediaItem) => void;
  removeMediaItem: (id: string) => void;
  updateMediaItem: (id: string, updates: Partial<MediaItem>) => void;
  
  setViewMode: (mode: GalleryViewMode) => void;
  setSortBy: (sortBy: GalleryState["sortBy"]) => void;
  setSortOrder: (order: "asc" | "desc") => void;
  
  setShowPhotos: (show: boolean) => void;
  setShowVideos: (show: boolean) => void;
  setOnlyFavorites: (only: boolean) => void;
  setTimeRange: (range: "all" | "today" | "week" | "month") => void;
  setAiTaggedOnly: (only: boolean) => void;
  setUploaderFilter: (uploader: string | null) => void;
  setAlbumFilter: (albumId: string | null) => void;
  setTagFilter: (tags: string[]) => void;
  setLocationFilter: (location: string | null) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  
  setLightboxIndex: (index: number | null) => void;
  nextImage: () => void;
  prevImage: () => void;
  
  toggleSelectMode: () => void;
  selectItem: (id: string) => void;
  deselectItem: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  toggleSelection: (id: string) => void;
  
  setLoading: (loading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  loadMore: () => void;
  
  applyFilters: () => void;
  reset: () => void;
}

const initialFilters: {
  showPhotos: boolean;
  showVideos: boolean;
  onlyFavorites: boolean;
  timeRange: "all" | "today" | "week" | "month";
  aiTaggedOnly: boolean;
  uploaderFilter: string | null;
  albumFilter: string | null;
  tagFilter: string[];
  locationFilter: string | null;
  searchQuery: string;
} = {
  showPhotos: true,
  showVideos: true,
  onlyFavorites: false,
  timeRange: "all",
  aiTaggedOnly: false,
  uploaderFilter: null,
  albumFilter: null,
  tagFilter: [],
  locationFilter: null,
  searchQuery: "",
};

const applyFiltersToMedia = (
  media: MediaItem[],
  filters: typeof initialFilters,
  sortBy: GalleryState["sortBy"],
  sortOrder: GalleryState["sortOrder"]
): MediaItem[] => {
  let filtered = [...media];
  
  // Type filter
  if (!filters.showPhotos) {
    filtered = filtered.filter((m) => m.type !== "image");
  }
  if (!filters.showVideos) {
    filtered = filtered.filter((m) => m.type !== "video");
  }
  
  // Favorites
  if (filters.onlyFavorites) {
    filtered = filtered.filter((m) => m.isFavorite);
  }

  // Time Range
  if (filters.timeRange !== "all") {
    const now = new Date();
    let start: Date;
    if (filters.timeRange === "today") {
      start = new Date(now.setHours(0, 0, 0, 0));
    } else if (filters.timeRange === "week") {
      start = new Date(now.setDate(now.getDate() - 7));
    } else {
      start = new Date(now.setMonth(now.getMonth() - 1));
    }
    filtered = filtered.filter((m) => new Date(m.createdAt) >= start);
  }

  // AI Tagged
  if (filters.aiTaggedOnly) {
    filtered = filtered.filter((m) => m.aiTags.length > 0);
  }
  
  // Uploader
  if (filters.uploaderFilter) {
    filtered = filtered.filter((m) => m.uploaderId === filters.uploaderFilter);
  }
  
  // Album
  if (filters.albumFilter) {
    filtered = filtered.filter((m) => m.albumId === filters.albumFilter);
  }

  // Location
  if (filters.locationFilter) {
    // Basic filter for now
    filtered = filtered.filter((m) => m.uploaderName.includes(filters.locationFilter!));
  }
  
  // Tags
  if (filters.tagFilter.length > 0) {
    filtered = filtered.filter((m) =>
      filters.tagFilter.some((tag) => m.aiTags.includes(tag))
    );
  }
  
  // Search
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.uploaderName.toLowerCase().includes(query) ||
        m.aiTags.some((tag) => tag.toLowerCase().includes(query))
    );
  }
  
  // Sort
  filtered.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case "date":
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case "oldest":
        comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        break;
      case "uploader":
        comparison = a.uploaderName.localeCompare(b.uploaderName);
        break;
      case "likes":
        // Fallback since we don't have real likes in types yet
        comparison = 0;
        break;
      case "downloads":
        comparison = 0;
        break;
      case "ai_category":
        comparison = (a.aiTags[0] || "").localeCompare(b.aiTags[0] || "");
        break;
    }
    
    return sortOrder === "asc" ? comparison : -comparison;
  });
  
  return filtered;
};

export const useGalleryStore = create<GalleryState>((set, get) => ({
  media: [],
  filteredMedia: [],
  selectedMedia: new Set(),
  viewMode: "masonry",
  sortBy: "date",
  sortOrder: "desc",
  ...initialFilters,
  lightboxIndex: null,
  isSelectMode: false,
  isLoading: false,
  hasMore: true,
  page: 1,
  
  setMedia: (media) => {
    set({ media });
    get().applyFilters();
  },
  
  appendMedia: (newMedia) => {
    set((state) => ({ media: [...state.media, ...newMedia], page: state.page + 1 }));
    get().applyFilters();
  },
  
  addMediaItem: (item) => {
    set((state) => ({ media: [item, ...state.media] }));
    get().applyFilters();
  },
  
  removeMediaItem: (id) => {
    set((state) => ({
      media: state.media.filter((m) => m.id !== id),
      selectedMedia: new Set([...state.selectedMedia].filter((i) => i !== id)),
    }));
    get().applyFilters();
  },
  
  updateMediaItem: (id, updates) => {
    set((state) => ({
      media: state.media.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));
    get().applyFilters();
  },
  
  setViewMode: (viewMode) => set({ viewMode }),
  setSortBy: (sortBy) => {
    set({ sortBy });
    get().applyFilters();
  },
  setSortOrder: (sortOrder) => {
    set({ sortOrder });
    get().applyFilters();
  },
  
  setShowPhotos: (showPhotos) => {
    set({ showPhotos });
    get().applyFilters();
  },
  setShowVideos: (showVideos) => {
    set({ showVideos });
    get().applyFilters();
  },
  setOnlyFavorites: (onlyFavorites) => {
    set({ onlyFavorites });
    get().applyFilters();
  },
  setUploaderFilter: (uploaderFilter) => {
    set({ uploaderFilter });
    get().applyFilters();
  },
  setAlbumFilter: (albumFilter) => {
    set({ albumFilter });
    get().applyFilters();
  },
  setTagFilter: (tagFilter) => {
    set({ tagFilter });
    get().applyFilters();
  },
  setSearchQuery: (searchQuery) => {
    set({ searchQuery });
    get().applyFilters();
  },
  clearFilters: () => {
    set(initialFilters);
    get().applyFilters();
  },
  
  setLightboxIndex: (lightboxIndex) => set({ lightboxIndex }),
  nextImage: () => {
    const { lightboxIndex, filteredMedia } = get();
    if (lightboxIndex !== null) {
      set({ lightboxIndex: (lightboxIndex + 1) % filteredMedia.length });
    }
  },
  prevImage: () => {
    const { lightboxIndex, filteredMedia } = get();
    if (lightboxIndex !== null) {
      set({ lightboxIndex: (lightboxIndex - 1 + filteredMedia.length) % filteredMedia.length });
    }
  },
  
  toggleSelectMode: () => set((state) => ({
    isSelectMode: !state.isSelectMode,
    selectedMedia: new Set(),
  })),
  selectItem: (id) => set((state) => ({
    selectedMedia: new Set([...state.selectedMedia, id]),
  })),
  deselectItem: (id) => set((state) => ({
    selectedMedia: new Set([...state.selectedMedia].filter((i) => i !== id)),
  })),
  selectAll: () => set((state) => ({
    selectedMedia: new Set(state.filteredMedia.map((m) => m.id)),
  })),
  deselectAll: () => set({ selectedMedia: new Set() }),
  toggleSelection: (id) => {
    const { selectedMedia } = get();
    if (selectedMedia.has(id)) {
      get().deselectItem(id);
    } else {
      get().selectItem(id);
    }
  },
  
  setLoading: (isLoading) => set({ isLoading }),
  setHasMore: (hasMore) => set({ hasMore }),
  loadMore: () => set((state) => ({ page: state.page + 1 })),
  
  setTimeRange: (timeRange) => {
    set({ timeRange });
    get().applyFilters();
  },
  setAiTaggedOnly: (aiTaggedOnly) => {
    set({ aiTaggedOnly });
    get().applyFilters();
  },
  setLocationFilter: (locationFilter) => {
    set({ locationFilter });
    get().applyFilters();
  },
  
  applyFilters: () => {
    const state = get();
    const filtered = applyFiltersToMedia(
      state.media,
      {
        showPhotos: state.showPhotos,
        showVideos: state.showVideos,
        onlyFavorites: state.onlyFavorites,
        timeRange: state.timeRange,
        aiTaggedOnly: state.aiTaggedOnly,
        uploaderFilter: state.uploaderFilter,
        albumFilter: state.albumFilter,
        tagFilter: state.tagFilter,
        locationFilter: state.locationFilter,
        searchQuery: state.searchQuery,
      },
      state.sortBy,
      state.sortOrder
    );
    set({ filteredMedia: filtered });
  },
  
  reset: () => set({
    media: [],
    filteredMedia: [],
    selectedMedia: new Set(),
    showPhotos: true,
    showVideos: true,
    onlyFavorites: false,
    timeRange: "all",
    aiTaggedOnly: false,
    uploaderFilter: null as string | null,
    albumFilter: null as string | null,
    tagFilter: [] as string[],
    locationFilter: null as string | null,
    searchQuery: "",
    lightboxIndex: null,
    isSelectMode: false,
    isLoading: false,
    hasMore: true,
    page: 1,
  }),
}));
