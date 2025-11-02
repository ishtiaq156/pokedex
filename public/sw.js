const CACHE_VERSION = "v3";
const CACHES = {
  STATIC: `pokemon-static-${CACHE_VERSION}`,
  IMAGES: `pokemon-images-${CACHE_VERSION}`,
  DATA: `pokemon-data-${CACHE_VERSION}`,
  API: `pokemon-api-${CACHE_VERSION}`,
};

// Cache patterns
const IMAGE_URL_PATTERN =
  /(\.(png|jpg|jpeg|gif|webp|svg)(\?.*)?$|\/_next\/image\?)/i;
const DATA_URL_PATTERN = /\/data\//i;
const STATIC_URL_PATTERN = /\.(js|css|html|json)$/i;

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  "/",
  "/data/pokemon-details.json",
  "/manifest.json",
  "/pokedex.png",
];

// Install event - cache critical resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      // Cache critical resources
      caches
        .open(CACHES.STATIC)
        .then((cache) => cache.addAll(CRITICAL_RESOURCES)),
      // Cache Pokemon images in background
      preloadPokemonImages(),
    ]),
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Preload Pokemon images in background
async function preloadPokemonImages() {
  const imageCache = await caches.open(CACHES.IMAGES);
  const pokemonImages = [];

  // Generate Pokemon image URLs (first 50 for initial load)
  for (let i = 1; i <= 50; i++) {
    pokemonImages.push(
      `https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm${i}.icon.png`,
    );
  }

  // Cache images in batches to avoid overwhelming the browser
  const batchSize = 10;
  for (let i = 0; i < pokemonImages.length; i += batchSize) {
    const batch = pokemonImages.slice(i, i + batchSize);
    await Promise.allSettled(
      batch.map((url) =>
        fetch(url)
          .then((response) =>
            response.ok && response.status !== 206
              ? imageCache.put(url, response)
              : Promise.resolve(),
          )
          .catch(() => Promise.resolve()),
      ),
    );
  }
}

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches that don't match current version
          if (!Object.values(CACHES).includes(cacheName)) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  // Claim all clients immediately
  self.clients.claim();
});

// Fetch event - intelligent caching strategies
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== "GET") {
    return;
  }

  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  const url = request.url;

  // Strategy 1: Cache First (for static assets)
  if (STATIC_URL_PATTERN.test(url)) {
    return cacheFirst(request, CACHES.STATIC);
  }

  // Strategy 2: Cache First (for Pokemon data)
  if (DATA_URL_PATTERN.test(url)) {
    return cacheFirst(request, CACHES.DATA);
  }

  // Strategy 3: Stale While Revalidate (for images)
  if (IMAGE_URL_PATTERN.test(url)) {
    return staleWhileRevalidate(request, CACHES.IMAGES);
  }

  // Strategy 4: Network First (for API calls)
  if (url.includes("/api/")) {
    return networkFirst(request, CACHES.API);
  }

  // Default: Network First with cache fallback
  return networkFirst(request, CACHES.STATIC);
}

// Cache First Strategy
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok && networkResponse.status !== 206) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    // Return offline fallback if available
    return new Response("Offline - Resource not available", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  // Fetch from network in background
  const networkResponsePromise = fetch(request)
    .then((response) => {
      if (response.ok && response.status !== 206) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  // Return cached response immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }

  // If no cache, wait for network
  return (
    networkResponsePromise ||
    new Response("Image not available", {
      status: 404,
      statusText: "Not Found",
    })
  );
}

// Network First Strategy
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok && networkResponse.status !== 206) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response("Offline - Resource not available", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }
}
