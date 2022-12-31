importScripts('https://cdnjs.cloudflare.com/ajax/libs/workbox-sw/6.5.4/workbox-sw.js')


let dynamicCacheName = 'dynamicCaching'

workbox.routing.registerRoute(
    /\.(?:html|css|js)$/,
    new workbox.strategies.cacheFirst({
        'cacheName': 'files'
    })
)

workbox.routing.registerRoute(
    /\.(?:png|jpg)$/,
    new workbox.strategies.cacheFirst({
        'cacheName': 'images'
    })
)




