const CACHE_NAME = 'bbqr-maker-v4-21baiwan';
const urlsToCache = [
  './',
  './index.html',
  './dist/bbqr-maker.bundle.js',
  './manifest.json',
  './icon/icon-192.png',
  './icon/icon-512.png',
  './fonts/JetBrainsMono-Regular.woff2',
  './fonts/JetBrainsMono-Bold.woff2'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Service Worker: Caching files', urlsToCache);
        return cache.addAll(urlsToCache);
      })
      .then(function() {
        console.log('Service Worker: All files cached successfully');
      })
      .catch(function(error) {
        console.error('Service Worker: Failed to cache files', error);
        // Try to cache files individually to identify which one is failing
        return caches.open(CACHE_NAME).then(function(cache) {
          return Promise.allSettled(
            urlsToCache.map(url => 
              cache.add(url).catch(err => {
                console.error(`Service Worker: Failed to cache ${url}:`, err);
                throw err;
              })
            )
          );
        });
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
}); 