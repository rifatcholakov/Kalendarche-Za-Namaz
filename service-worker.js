self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('my-cache').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
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

self.addEventListener("activate", evt => {
    console.log('service worker has been activated');
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        }).catch(error => {
            console.error('Error in fetch handler:', error);
        })
    );
});