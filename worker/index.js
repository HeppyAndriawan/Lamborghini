self.addEventListener('install', (event) => {
    const filesToCache = [
      // Add your files here
      '/Lamborghini/asset/**',
    ];
  
    event.waitUntil(
      (async () => {
        const cache = await caches.open('v1');
        let cachedCount = 0;
  
        await Promise.all(filesToCache.map(async (file) => {
          const response = await fetch(file);
          await cache.put(file, response);
          cachedCount += 1;
          self.clients.matchAll().then(clients => {
            clients.forEach(client => client.postMessage({
              type: 'CACHE_PROGRESS',
              progress: (cachedCount / filesToCache.length) * 100
            }));
          });
        }));
      })()
    );
  });