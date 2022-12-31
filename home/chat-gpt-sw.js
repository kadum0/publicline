
self.addEventListener('install', function(event) {
    event.waitUntil(
    caches.open('my-cache').then(function(cache) {
        return cache.addAll([
        './index.html',
        './style.css',
        './script.js'
        ]);
    })
    );
});

// // self.addEventListener('fetch', function(event) {
// //     event.respondWith(
// //     caches.match(event.request).then(function(response) {
// //         if (response) {
// //         return response;
// //         }
// //         return fetch(event.request).then(function(response) {
// //           // Check if we received a valid response
// //         if (!response || response.status !== 200 || response.type !== 'basic') {
// //             return response;
// //         }
// //           // Clone the response. A response is a stream and can only be consumed once.
// //           // Because we are consuming this once by cache and once by the browser for fetch,
// //           // we need to clone the response.
// //         var responseToCache = response.clone();
// //         caches.open('my-tile-cache').then(function(cache) {
// //             cache.put(event.request, responseToCache);
// //         });
// //         return response;
// //         });
// //     })
// //     );
// // });



// // second try; 
// // Register the service worker
navigator.serviceWorker.register('./chat-gpt-sw.js').then(function(registration) {
    console.log('Service worker registered:', registration);
  });
  
//   // Listen for install event and cache files
//   self.addEventListener('install', function(event) {
//     event.waitUntil(
//       caches.open('my-cache').then(function(cache) {
//         // Cache files
//         return cache.addAll([
//           './index.html',
//           './style.css',
//           './script.js',
//           './imgs/*'
//         ]);
//       })
//     );
//   });
  
//   // Listen for fetch event and return cached files
//   self.addEventListener('fetch', function(event) {
//     event.respondWith(
//       caches.match(event.request).then(function(response) {
//         // Return cached file or make a network request
//         return response || fetch(event.request);
//       })
//     );
//   });

//   // Listen for message event and cache map tile layers
//   self.addEventListener('message', function(event) {
//     if (event.data.action === 'cacheTileLayers') {
//       event.waitUntil(
//         caches.open('my-tile-cache').then(function(cache) {
//           // Cache tile layers
//           return cache.addAll(event.data.tileLayerUrls);
//         })
//       );
//     }
// });



// third try; 


// Create a new cache
const mapTileCache = new Cache();

// Listen for fetch events
self.addEventListener('fetch', event => {
  // Get the request URL
  const requestUrl = new URL(event.request.url);

  // If the request is for a map tile image
  if (requestUrl.pathname.startsWith('/path/to/map-tiles/')) {
    // Respond with the image from the cache, if available
    event.respondWith(
      mapTileCache.match(event.request).then(response => {
        // If the image is in the cache, return it
        if (response) {
          return response;
        }

        // If the image is not in the cache, fetch it from the server
        return fetch(event.request).then(response => {
          // If the response is successful, clone it and add it to the cache
          if (response.ok) {
            response.clone().then(responseClone => {
              mapTileCache.put(event.request, responseClone);
            });
          }
          return response;
        });
      })
    );
  }
});


