const cacheName = 'my-cache-v1';
const dynamicCache = 'my-dynamic-cache-v1';

const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(() => {
          limitCacheSize(name, size);
        });
      }
    });
  });
};

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/fallback.html',
        '/style.css',
        '/script.js',
        '/gotse-delchev-time.json',
        '/sofia-time.json'
      ]).catch(error => {
        console.error('Caching failed:', error);
      });
    })
  );
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== cacheName && key !== dynamicCache).map(key => {
          return caches.delete(key);
        })
      );
    })
  );
});

self.addEventListener('fetch', evt => {
  const requestUrl = new URL(evt.request.url);

  if (requestUrl.protocol === 'http:' || requestUrl.protocol === 'https:') {
    evt.respondWith(
      caches.match(evt.request).then(response => {
        return response || fetch(evt.request).then(fetchRes => {
          return caches.open(dynamicCache).then(cache => {
            cache.put(evt.request.url, fetchRes.clone());
            limitCacheSize(dynamicCache, 50);
            return fetchRes;
          });
        });
      }).catch(() => {
        if (evt.request.url.endsWith('.html')) {
          return caches.match('/fallback.html');
        }
      })
    );
  }
});