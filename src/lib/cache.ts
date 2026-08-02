/**
 * In-Memory Cache with TTL
 * 
 * Simple caching layer for reducing database queries
 * and API calls. Suitable for single-server deployments.
 * 
 * For distributed systems, replace with Redis.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private cleanupInterval: NodeJS.Timeout | null = null;
  
  constructor() {
    // Cleanup expired entries every minute
    if (typeof setInterval !== "undefined") {
      this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
    }
  }
  
  /**
   * Get a value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) return null;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.value;
  }
  
  /**
   * Set a value in cache with TTL (in seconds)
   */
  set<T>(key: string, value: T, ttlSeconds: number = 300): void {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }
  
  /**
   * Delete a key from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }
  
  /**
   * Delete all keys matching a pattern
   */
  deletePattern(pattern: string): number {
    let deleted = 0;
    const regex = new RegExp(pattern.replace(/\*/g, ".*"));
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        deleted++;
      }
    }
    
    return deleted;
  }
  
  /**
   * Clear all cached entries
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Get cache statistics
   */
  stats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
  
  /**
   * Remove expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Stop cleanup interval (for graceful shutdown)
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

// Singleton instance
const globalForCache = globalThis as typeof globalThis & {
  __engramCache?: MemoryCache;
};

export const cache = globalForCache.__engramCache ?? new MemoryCache();

if (process.env.NODE_ENV !== "production") {
  globalForCache.__engramCache = cache;
}

/**
 * Cache decorator for async functions
 */
export function withCache<T>(
  keyGenerator: (...args: unknown[]) => string,
  ttlSeconds: number = 300
) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: unknown[]) {
      const cacheKey = keyGenerator(...args);
      const cached = cache.get<T>(cacheKey);
      
      if (cached !== null) {
        return cached;
      }
      
      const result = await originalMethod.apply(this, args);
      cache.set(cacheKey, result, ttlSeconds);
      return result;
    };
    
    return descriptor;
  };
}

/**
 * Helper to generate cache keys
 */
export function cacheKey(...parts: (string | number | undefined)[]): string {
  return parts.filter(Boolean).join(":");
}
