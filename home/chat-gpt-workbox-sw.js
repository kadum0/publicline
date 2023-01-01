
// Import Workbox
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

// Set up a CacheFirst strategy for files
workbox.routing.registerRoute(
  /\.(?:html|css|js|png)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'static-resources',
  })
);

// Set up a NetworkFirst strategy for Mapbox map tile images
workbox.routing.registerRoute(
  /https:\/\/api\.mapbox\.com/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'map-tiles',
  })
);

workbox.routing.registerRoute(
    /https:\/\/unpkg\.com\/leaflet-control-geocoder/,
    new workbox.strategies.NetworkFirst({
      cacheName: 'map-leaflet',
    })
  );
  
