const CACHE_NAME = "pokemon-images-v1";
// Cache all images (png, jpg, jpeg, gif, webp, svg) and Next.js image URLs
const IMAGE_URL_PATTERN =
  /(\.(png|jpg|jpeg|gif|webp|svg)(\?.*)?$|\/_next\/image\?)/i;

// Install event - cache the service worker itself
self.addEventListener("install", (event) => {
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  // Claim all clients immediately
  self.clients.claim();
});

// Fetch event - intercept and cache all images
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // Only handle GET requests for images
  if (event.request.method !== "GET" || !IMAGE_URL_PATTERN.test(url)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached response
        return cachedResponse;
      }

      // Fetch from network and cache
      return fetch(event.request)
        .then((response) => {
          // Check if response is valid
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response (Response can only be read once)
          const responseToCache = response.clone();

          // Cache the response
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch((error) => {
          // If network fails, try to return a cached response (stale-while-revalidate)
          return caches.match(event.request);
        });
    }),
  );
});
