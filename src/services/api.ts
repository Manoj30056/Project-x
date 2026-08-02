/**
 * Base API Service
 * 
 * Handles all HTTP requests with error handling, retries, and caching.
 */

import type { ApiResponse, ApiError } from "@/types/api";

interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

const DEFAULT_TIMEOUT = 30000; // 30 seconds
const DEFAULT_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000;

class ApiService {
  private baseUrl: string;
  
  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
  }
  
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = DEFAULT_TIMEOUT,
      retries = DEFAULT_RETRIES,
      retryDelay = DEFAULT_RETRY_DELAY,
      ...fetchConfig
    } = config;
    
    const url = `${this.baseUrl}${endpoint}`;
    
    let lastError: ApiError | null = null;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch(url, {
          ...fetchConfig,
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            ...fetchConfig.headers,
          },
        });
        
        clearTimeout(timeoutId);
        
        const data = await response.json();
        
        if (!response.ok) {
          throw {
            code: `HTTP_${response.status}`,
            message: data.error || data.message || "Request failed",
            details: data.details,
          } as ApiError;
        }
        
        return { data };
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          lastError = {
            code: "TIMEOUT",
            message: "Request timed out",
          };
        } else if (error instanceof TypeError) {
          lastError = {
            code: "NETWORK_ERROR",
            message: "Network error. Please check your connection.",
          };
        } else {
          lastError = error as ApiError;
        }
        
        // Don't retry on client errors (4xx)
        if (lastError.code?.startsWith("HTTP_4")) {
          break;
        }
        
        // Wait before retrying
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay * (attempt + 1)));
        }
      }
    }
    
    return { error: lastError! };
  }
  
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }
  
  async post<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }
  
  async put<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }
  
  async patch<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }
  
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }
  
  /**
   * Upload file with progress tracking
   */
  async upload<T>(
    endpoint: string,
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });
      
      xhr.addEventListener("load", () => {
        try {
          const data = JSON.parse(xhr.responseText);
          
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({ data });
          } else {
            resolve({
              error: {
                code: `HTTP_${xhr.status}`,
                message: data.error || "Upload failed",
              },
            });
          }
        } catch {
          resolve({
            error: {
              code: "PARSE_ERROR",
              message: "Failed to parse response",
            },
          });
        }
      });
      
      xhr.addEventListener("error", () => {
        resolve({
          error: {
            code: "NETWORK_ERROR",
            message: "Upload failed. Please check your connection.",
          },
        });
      });
      
      xhr.addEventListener("abort", () => {
        resolve({
          error: {
            code: "ABORTED",
            message: "Upload cancelled",
          },
        });
      });
      
      xhr.open("POST", `${this.baseUrl}${endpoint}`);
      xhr.send(formData);
    });
  }
}

// Singleton instance
export const api = new ApiService();
