const CACHE_NAME = "nsd-creations-v1";

const PRECACHE_ASSETS = [
  "/",
  "/services",
  "/portfolio",
  "/pricing",
  "/process",
  "/meet-the-founder",
  "/contact",
  "/nsdlogo.png",
  "/founder.png",
  "/icon.png",
  "/apple-icon.png",
  "/favicon.ico"
];

// Install Service Worker and cache core static routes
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("[SW] Pre-caching partial failure, continuing...", err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Service Worker and clean up legacy caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[SW] Clearing old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercept network requests for full offline support
self.addEventListener("fetch", (event) => {
  const request = event.request;
  
  // Skip non-GET requests or browser extension requests
  if (request.method !== "GET" || !request.url.startsWith("http")) {
    return;
  }

  // Handle HTML Page Navigation requests (Network First, fallback to Cache)
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(async () => {
          // Network failed (offline) -> Return matching cached page or root fallback
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          const rootCached = await caches.match("/");
          if (rootCached) {
            return rootCached;
          }
          return new Response(
            "<!DOCTYPE html><html><head><title>Offline - NSD Creations</title></head><body style='font-family:sans-serif;text-align:center;padding:40px;background:#09090b;color:#fff;'><h1>NSD Creations</h1><p>You are currently offline. Please reconnect to access new content.</p></body></html>",
            { headers: { "Content-Type": "text/html" } }
          );
        })
    );
    return;
  }

  // Handle static assets & images (Cache First with Stale-While-Revalidate)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached asset immediately and update in background if online
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {/* Ignore network errors while background updating */});
        return cachedResponse;
      }

      // If not in cache, fetch from network and store in cache
      return fetch(request).then((networkResponse) => {
        if (networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return networkResponse;
      });
    })
  );
});
