import { create } from "zustand";
import type { FileToUpload, UploadStatus } from "@/types/media";

interface UploadState {
  // Queue
  queue: FileToUpload[];
  currentUploads: FileToUpload[];
  completedUploads: FileToUpload[];
  failedUploads: FileToUpload[];
  
  // Config
  maxConcurrent: number;
  isPaused: boolean;
  
  // Stats
  totalFiles: number;
  totalSize: number;
  uploadedSize: number;
  
  // Actions
  addFiles: (files: File[], eventId: string) => void;
  removeFile: (id: string) => void;
  updateFileProgress: (id: string, progress: number) => void;
  updateFileStatus: (id: string, status: UploadStatus, error?: string) => void;
  setFilMediaId: (id: string, mediaId: string) => void;
  startUpload: () => void;
  pauseUpload: () => void;
  resumeUpload: () => void;
  cancelUpload: (id: string) => void;
  cancelAll: () => void;
  retryFailed: () => void;
  clearCompleted: () => void;
  reset: () => void;
}

const createFileToUpload = (file: File): FileToUpload => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  file,
  preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
  status: "pending",
  progress: 0,
});

export const useUploadStore = create<UploadState>((set, get) => ({
  queue: [],
  currentUploads: [],
  completedUploads: [],
  failedUploads: [],
  maxConcurrent: 3,
  isPaused: false,
  totalFiles: 0,
  totalSize: 0,
  uploadedSize: 0,
  
  addFiles: (files) => {
    const newFiles = files.map(createFileToUpload);
    const totalSize = files.reduce((acc, f) => acc + f.size, 0);
    
    set((state) => ({
      queue: [...state.queue, ...newFiles],
      totalFiles: state.totalFiles + files.length,
      totalSize: state.totalSize + totalSize,
    }));
  },
  
  removeFile: (id) => {
    set((state) => {
      const file = [...state.queue, ...state.currentUploads].find((f) => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return {
        queue: state.queue.filter((f) => f.id !== id),
        currentUploads: state.currentUploads.filter((f) => f.id !== id),
        totalFiles: state.totalFiles - 1,
        totalSize: state.totalSize - (file?.file.size ?? 0),
      };
    });
  },
  
  updateFileProgress: (id, progress) => {
    set((state) => ({
      currentUploads: state.currentUploads.map((f) =>
        f.id === id ? { ...f, progress } : f
      ),
    }));
  },
  
  updateFileStatus: (id, status, error) => {
    set((state) => {
      const file = [...state.queue, ...state.currentUploads].find((f) => f.id === id);
      if (!file) return state;
      
      const updatedFile = { ...file, status, error };
      
      if (status === "complete") {
        return {
          queue: state.queue.filter((f) => f.id !== id),
          currentUploads: state.currentUploads.filter((f) => f.id !== id),
          completedUploads: [...state.completedUploads, updatedFile],
          uploadedSize: state.uploadedSize + file.file.size,
        };
      }
      
      if (status === "error") {
        return {
          queue: state.queue.filter((f) => f.id !== id),
          currentUploads: state.currentUploads.filter((f) => f.id !== id),
          failedUploads: [...state.failedUploads, updatedFile],
        };
      }
      
      if (status === "uploading") {
        return {
          queue: state.queue.filter((f) => f.id !== id),
          currentUploads: [...state.currentUploads.filter((f) => f.id !== id), updatedFile],
        };
      }
      
      return {
        queue: state.queue.map((f) => (f.id === id ? updatedFile : f)),
        currentUploads: state.currentUploads.map((f) => (f.id === id ? updatedFile : f)),
      };
    });
  },
  
  setFilMediaId: (id, mediaId) => {
    set((state) => ({
      completedUploads: state.completedUploads.map((f) =>
        f.id === id ? { ...f, mediaId } : f
      ),
    }));
  },
  
  startUpload: () => set({ isPaused: false }),
  
  pauseUpload: () => set({ isPaused: true }),
  
  resumeUpload: () => set({ isPaused: false }),
  
  cancelUpload: (id) => {
    const state = get();
    const file = [...state.queue, ...state.currentUploads].find((f) => f.id === id);
    if (file?.preview) {
      URL.revokeObjectURL(file.preview);
    }
    set({
      queue: state.queue.filter((f) => f.id !== id),
      currentUploads: state.currentUploads.filter((f) => f.id !== id),
    });
  },
  
  cancelAll: () => {
    const state = get();
    [...state.queue, ...state.currentUploads].forEach((f) => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });
    set({
      queue: [],
      currentUploads: [],
      isPaused: true,
    });
  },
  
  retryFailed: () => {
    set((state) => ({
      queue: [
        ...state.queue,
        ...state.failedUploads.map((f) => ({ ...f, status: "pending" as const, error: undefined, progress: 0 })),
      ],
      failedUploads: [],
    }));
  },
  
  clearCompleted: () => {
    const state = get();
    state.completedUploads.forEach((f) => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });
    set({ completedUploads: [] });
  },
  
  reset: () => {
    const state = get();
    [...state.queue, ...state.currentUploads, ...state.completedUploads, ...state.failedUploads].forEach((f) => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });
    set({
      queue: [],
      currentUploads: [],
      completedUploads: [],
      failedUploads: [],
      isPaused: false,
      totalFiles: 0,
      totalSize: 0,
      uploadedSize: 0,
    });
  },
}));
