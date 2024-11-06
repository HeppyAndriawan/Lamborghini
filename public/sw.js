const isGithubActions = process.env.GITHUB_ACTIONS;
export const baseurl = isGithubActions
  ? "./"
  : process.env.NODE_ENV === "development"
  ? "/"
  : "./";

const CACHE_NAME = "lamborghini-assets-cache";
const ASSET_FOLDER = baseurl === "/" ? "/asset" : "/Lamborghini/asset";
let totalAssets = 0;
let cachedAssets = 0;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Fetch the asset list and cache them
      return fetch("/asset-list.json")
        .then((response) => response.json())
        .then((assets) => {
          const assetUrls = assets.filter((url) =>
            url.startsWith(ASSET_FOLDER)
          );
          totalAssets = assetUrls.length;

          return Promise.all(
            assetUrls.map((url) =>
              cache.add(url).then(() => {
                cachedAssets += 1;
                const progress = Math.round((cachedAssets / totalAssets) * 100);

                // Send progress update to all clients
                self.clients.matchAll().then((clients) => {
                  clients.forEach((client) => {
                    client.postMessage({
                      type: "CACHE_PROGRESS",
                      progress: progress,
                    });
                  });
                });
              })
            )
          );
        })
        .catch((error) => {
          console.error("Failed to fetch asset list:", error);
        });
    })
  );
});

self.addEventListener("fetch", (event) => {
  // Only handle requests for assets in the asset folder
  if (event.request.url.includes(ASSET_FOLDER)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // Return cached response if available
        if (cachedResponse) {
          return cachedResponse;
        }

        // Fetch from network and cache it
        return fetch(event.request)
          .then((networkResponse) => {
            // Only cache successful responses
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
              });
            }
            return networkResponse; // Return the network response
          })
          .catch((error) => {
            console.error("Fetching failed:", error);
            // Handle fetch failure, return fallback content if necessary
            return caches.match("/offline.html"); // Optional fallback for offline usage
          });
      })
    );
  }
});
