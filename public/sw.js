// public/service-worker.js
const CACHE_NAME = "asset-cache-v1";
const ASSET_FOLDER = `/Lamborghini/asset`; //change "/Lamborghini/asset" for production
const ASSETS = [
  `${ASSET_FOLDER}/lamborghini_centenario_lp-770_interior_sdc.glb`,
  `${ASSET_FOLDER}/logo.svg`,
  // Add other assets here
];

// Install and cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        ASSETS.map((asset) => {
          return cache.add(asset).catch((error) => {
            console.error(`Failed to cache ${asset}:`, error);
          });
        })
      );
    })
  );
  self.skipWaiting();
});


// Activate the service worker and immediately check the cache status
self.addEventListener("activate", (event) => {
  // console.log("[Service Worker] Activating...");
  event.waitUntil(self.clients.claim());
  broadcastProgress(); // Send progress on activation, e.g., after a refresh
});

// Handle fetch requests and update progress
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);
  if (ASSETS.includes(requestUrl.pathname)) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          return (
            cachedResponse ||
            fetch(event.request)
              .then((networkResponse) => {
                cache.put(event.request, networkResponse.clone());
                broadcastProgress();
                return networkResponse;
              })
              .catch((error) => {
                console.error(`Network request failed for ${event.request.url}:`, error);
                return new Response("Network error occurred", { status: 408 });
              })
          );
        });
      })
    );
  }
});


// Listen for messages from clients requesting cache status
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CHECK_CACHE_STATUS") {
    // console.log("[Service Worker] Received cache status check request");
    broadcastProgress(); // Send current cache status to the requesting client
  }
});

function broadcastProgress() {
  caches.open(CACHE_NAME).then((cache) => {
    cache.keys().then((cachedRequests) => {
      const cachedCount = cachedRequests.length;
      const totalAssets = ASSETS.length;
      const progress = Math.floor((cachedCount / totalAssets) * 100);

      if (cachedCount === totalAssets) {
        // All assets are cached, so broadcast CACHE_COMPLETE
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: "CACHE_COMPLETE",
              progress: 100,
            });
          });
        });
      } else {
        // Broadcast the current progress
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: "CACHE_PROGRESS",
              progress: progress,
            });
          });
        });
      }
    });
  });
}
