const staticCacheName = 'site-static';

const assets = [
    '/',
    '/index.html',
    '/script.js',
    '/style.css',
    '/time.json',
    '/css/styles.css',
    '/css/materialize.min.css',
    '/img/dish.png'
]

self.addEventListener('install', evt => {
    console.log('service worker has been installed');
    evt.waitUnit(
        caches.open(staticCacheName).then(cache => {
            cache.addAll(assets);
        })
    );
});

self.addEventListener("activate", evt => {
    console.log('service worker has been activated');
});

// self.addEventListener('fetch', evt => {
//     console.log('fetch event', evt)
// });