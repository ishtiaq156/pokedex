// Cache management utility for offline support
export class CacheManager {
  private static instance: CacheManager;
  private cacheNames = {
    STATIC: "pokemon-static-v2",
    IMAGES: "pokemon-images-v2",
    DATA: "pokemon-data-v2",
    API: "pokemon-api-v2",
  };

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  // Check if we're online
  isOnline(): boolean {
    return navigator.onLine;
  }

  // Get cache size
  async getCacheSize(): Promise<number> {
    if (!("caches" in window)) return 0;

    let totalSize = 0;
    const cacheNames = await caches.keys();

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      totalSize += keys.length;
    }

    return totalSize;
  }

  // Clear all caches
  async clearAllCaches(): Promise<void> {
    if (!("caches" in window)) return;

    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
  }

  // Clear specific cache
  async clearCache(cacheName: string): Promise<void> {
    if (!("caches" in window)) return;
    await caches.delete(cacheName);
  }

  // Preload critical resources
  async preloadCriticalResources(): Promise<void> {
    if (!("caches" in window)) return;

    const criticalResources = [
      "/",
      "/data/pokemon-details.json",
      "/manifest.json",
      "/pokedex.png",
    ];

    const cache = await caches.open(this.cacheNames.STATIC);
    await cache.addAll(criticalResources);
  }

  // Preload Pokemon images in batches
  async preloadPokemonImages(
    startId: number = 1,
    endId: number = 50,
  ): Promise<void> {
    if (!("caches" in window)) return;

    const cache = await caches.open(this.cacheNames.IMAGES);
    const imageUrls = [];

    for (let i = startId; i <= endId; i++) {
      imageUrls.push(
        `https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm${i}.icon.png`,
      );
    }

    // Cache images in batches to avoid overwhelming the browser
    const batchSize = 10;
    for (let i = 0; i < imageUrls.length; i += batchSize) {
      const batch = imageUrls.slice(i, i + batchSize);
      await Promise.allSettled(
        batch.map((url) =>
          fetch(url)
            .then((response) =>
              response.ok ? cache.put(url, response) : Promise.resolve(),
            )
            .catch(() => Promise.resolve()),
        ),
      );
    }
  }

  // Check if resource is cached
  async isCached(url: string): Promise<boolean> {
    if (!("caches" in window)) return false;

    const cacheNames = await caches.keys();
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const response = await cache.match(url);
      if (response) return true;
    }
    return false;
  }

  // Get cached response
  async getCachedResponse(url: string): Promise<Response | null> {
    if (!("caches" in window)) return null;

    const cacheNames = await caches.keys();
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const response = await cache.match(url);
      if (response) return response;
    }
    return null;
  }

  // Cache response
  async cacheResponse(
    url: string,
    response: Response,
    cacheName: string,
  ): Promise<void> {
    if (!("caches" in window)) return;

    const cache = await caches.open(cacheName);
    await cache.put(url, response.clone());
  }

  // Get cache statistics
  async getCacheStats(): Promise<{
    totalCaches: number;
    totalEntries: number;
    cacheNames: string[];
  }> {
    if (!("caches" in window)) {
      return { totalCaches: 0, totalEntries: 0, cacheNames: [] };
    }

    const cacheNames = await caches.keys();
    let totalEntries = 0;

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      totalEntries += keys.length;
    }

    return {
      totalCaches: cacheNames.length,
      totalEntries,
      cacheNames,
    };
  }
}

export const cacheManager = CacheManager.getInstance();
