/**
 * Media Service
 * 
 * API calls for media upload and management.
 */

import { api } from "./api";
import { API_ROUTES } from "@/constants/routes";
import type { Photo, Video } from "@/types/database";
import type { DownloadRequest, DownloadResponse } from "@/types/api";

export interface UploadMediaParams {
  eventId: string;
  file: File;
  guestId?: string;
  guestName: string;
  albumId?: string;
  onProgress?: (progress: number) => void;
}

export const mediaService = {
  /**
   * Upload a media file
   */
  async upload({
    eventId,
    file,
    guestId,
    guestName,
    albumId,
    onProgress,
  }: UploadMediaParams) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("guestName", guestName);
    if (guestId) formData.append("guestId", guestId);
    if (albumId) formData.append("albumId", albumId);
    
    return api.upload<{ media: Photo | Video }>(
      API_ROUTES.eventMedia(eventId),
      formData,
      onProgress
    );
  },
  
  /**
   * Get all media for an event
   */
  async getByEvent(eventId: string) {
    return api.get<{ media: (Photo | Video)[] }>(API_ROUTES.eventMedia(eventId));
  },
  
  /**
   * Get single media item
   */
  async getById(id: string) {
    return api.get<{ media: Photo | Video }>(API_ROUTES.mediaItem(id));
  },
  
  /**
   * Delete media
   */
  async delete(id: string) {
    return api.delete<{ success: boolean }>(API_ROUTES.mediaDelete(id));
  },
  
  /**
   * Toggle favorite
   */
  async toggleFavorite(id: string) {
    return api.patch<{ media: Photo | Video }>(API_ROUTES.mediaItem(id), {
      toggleFavorite: true,
    });
  },
  
  /**
   * Request download
   */
  async requestDownload(data: DownloadRequest) {
    return api.post<DownloadResponse>(API_ROUTES.eventDownload(data.eventId), data);
  },
  
  /**
   * Get download status
   */
  async getDownloadStatus(eventId: string, downloadId: string) {
    return api.get<DownloadResponse>(
      `${API_ROUTES.eventDownload(eventId)}/${downloadId}`
    );
  },
  
  /**
   * Batch upload multiple files
   */
  async batchUpload(
    params: Omit<UploadMediaParams, "file" | "onProgress"> & { files: File[] },
    onFileProgress?: (fileIndex: number, progress: number) => void,
    onFileComplete?: (fileIndex: number, media: Photo | Video) => void,
    onFileError?: (fileIndex: number, error: string) => void
  ) {
    const results: Array<{ success: boolean; media?: Photo | Video; error?: string }> = [];
    
    for (let i = 0; i < params.files.length; i++) {
      const file = params.files[i];
      
      const response = await this.upload({
        eventId: params.eventId,
        file,
        guestId: params.guestId,
        guestName: params.guestName,
        albumId: params.albumId,
        onProgress: (progress) => onFileProgress?.(i, progress),
      });
      
      if (response.data) {
        results.push({ success: true, media: response.data.media });
        onFileComplete?.(i, response.data.media);
      } else {
        const error = response.error?.message || "Upload failed";
        results.push({ success: false, error });
        onFileError?.(i, error);
      }
    }
    
    return results;
  },
};
