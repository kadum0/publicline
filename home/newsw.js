importScripts('https://cdnjs.cloudflare.com/ajax/libs/workbox-sw/6.5.4/workbox-sw.js')

workbox.routing.registerRoute(
    /\.(?:html|css|js)$/,
    new workbox.strategies.StaleWhileRevalidate({
        'cacheName': 'files'
    })
)

workbox.routing.registerRoute(
    /\.(?:png|jpg)$/,
    new workbox.strategies.StaleWhileRevalidate({
        'cacheName': 'images'
    })
)

