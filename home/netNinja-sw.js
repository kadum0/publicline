
const staticCacheName = 'sitestatic-v1';
const dynamicCacheName = 'sitedynamic-v1';
const assets = [
  '/',
  './index.html',
  './style.css',
  './script.js',
];



// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install event
self.addEventListener('install', evt => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  //console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// fetch events

// old; 
self.addEventListener('fetch', evt => {
  // if(evt.request.url.indexOf('firestore.googleapis.com') === -1){
    evt.respondWith(
      caches.match(evt.request).then(cacheRes => {
        
        return cacheRes || fetch(evt.request).then(fetchRes => {
          return caches.open(dynamicCacheName).then(cache => {
            cache.put(evt.request.url, fetchRes.clone());
            // check cached items size
            limitCacheSize(dynamicCacheName, 15);
            return fetchRes;
          })
        });
      }).catch(() => {
        if(evt.request.url.indexOf('.html') > -1){
          return caches.match('/pages/fallback.html');
        } 
      })
    );
  // }
});



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


