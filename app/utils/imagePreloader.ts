// Image preloading utility for better performance with offline support
import { cacheManager } from "./cacheManager";

export class ImagePreloader {
  private static instance: ImagePreloader;
  private preloadedImages = new Set<string>();
  private preloadPromises = new Map<string, Promise<void>>();

  static getInstance(): ImagePreloader {
    if (!ImagePreloader.instance) {
      ImagePreloader.instance = new ImagePreloader();
    }
    return ImagePreloader.instance;
  }

  private failedImages = new Set<string>();

  async preloadImage(src: string): Promise<void> {
    if (this.preloadedImages.has(src) || this.failedImages.has(src)) {
      return;
    }

    if (this.preloadPromises.has(src)) {
      return this.preloadPromises.get(src)!;
    }

    const promise = new Promise<void>(async (resolve) => {
      try {
        // Check if image is already cached
        const cachedResponse = await cacheManager.getCachedResponse(src);
        if (cachedResponse) {
          this.preloadedImages.add(src);
          this.preloadPromises.delete(src);
          resolve();
          return;
        }

        // If online, fetch and cache the image
        if (cacheManager.isOnline()) {
          const response = await fetch(src);
          if (response.ok) {
            await cacheManager.cacheResponse(
              src,
              response,
              "pokemon-images-v2",
            );
            this.preloadedImages.add(src);
          } else {
            // Mark as failed so we don't retry, but don't throw an error (expected for unreleased Pokemon)
            this.failedImages.add(src);
          }
        } else {
          // If offline and not cached, we can't preload it
          this.failedImages.add(src);
        }
      } catch (error) {
        // Network failure or other error, mark as failed
        this.failedImages.add(src);
      } finally {
        this.preloadPromises.delete(src);
        resolve();
      }
    });

    this.preloadPromises.set(src, promise);
    return promise;
  }

  async preloadImages(urls: string[]): Promise<void> {
    // Preload in batches to avoid overwhelming the browser
    const batchSize = 10;
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      await Promise.allSettled(
        batch.map((url) => this.preloadImage(url).catch(console.warn)),
      );
    }
  }

  isPreloaded(src: string): boolean {
    return this.preloadedImages.has(src);
  }

  async isCached(src: string): Promise<boolean> {
    return await cacheManager.isCached(src);
  }

  clearCache(): void {
    this.preloadedImages.clear();
    this.preloadPromises.clear();
    this.failedImages.clear();
  }
}

export const imagePreloader = ImagePreloader.getInstance();
