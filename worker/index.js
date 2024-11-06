// Service Worker (sw.js)

const CACHE_NAME = "lamborghini-assets-cache";
const ASSET_FOLDER = "/Lamborghini/asset";
let totalAssets = 0;
let cachedAssets = 0;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Retrieve assets list dynamically or add a predefined list here.
      return fetch("/asset-list.json")
        .then((response) => response.json())
        .then((assets) => {
          const assetUrls = assets.filter((url) => url.startsWith(ASSET_FOLDER));
          totalAssets = assetUrls.length;

          return Promise.all(
            assetUrls.map((url) =>
              cache.add(url).then(() => {
                cachedAssets += 1;
                const progress = Math.round((cachedAssets / totalAssets) * 100);

                // Send progress to client(s)
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
        });
    })
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.url.includes(ASSET_FOLDER)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  }
});
