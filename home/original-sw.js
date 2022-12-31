

const staticCacheName = 'site-files-v1';
const dynamicCacheName = 'map-layers-v1';
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




self.addEventListener('fetch', (ev) => {
    // ev.request each time the webpage asks for any resource.
    //Extendable Event
    console.log(`fetch request for: ${ev.request.url}`);
    /*                  */
    // version 1 - pass thru
    // ev.respondWith(fetch(ev.request));
    /*                  */
    // version 2 - check the caches first for the file. If missing do a fetch
    ev.respondWith(
    caches.match(ev.request).then((cacheRes) => {
        // if (cacheRes == undefined) {
        // console.log(`MISSING ${ev.request.url}`);
        // }
        console.log(ev.request, ev.request.url, 'to continue')
        console.log("includes the map; ", ev.request.url.indexOf('mapbox'), ev.request.url.indexOf('mapbox') != -1 )
        return cacheRes || fetch(ev.request);
    })
    );
    /*                  */
    //version 3 - check cache. fetch if missing. then add response to cache



    ev.respondWith(
      caches.match(ev.request).then((cacheRes) => {

        return (
          cacheRes ||
          fetch(ev.request).then((fetchResponse) => {

            // let type = fetchResponse.headers.get('content-type');
            
            if (
            //   (type && type.match(/^text\/css/i)) ||
            //   ev.request.url.match(/fonts.googleapis.com/i)
            ev.request.url.indexOf('mapbox') != -1             
            ) {
              //css to save in dynamic cache
              console.log(`save a map layer ${ev.request.url}`);
              return caches.open(dynamicCacheName).then((cache) => {
                cache.put(ev.request, fetchResponse.clone());
                return fetchResponse;
              });
            }
            
            
            // 
            
            // else if (
            //   (type && type.match(/^font\//i)) ||
            //   ev.request.url.match(/fonts.gstatic.com/i)
            // ) {
            //   console.log(`save a FONT file ${ev.request.url}`);
            //   return caches.open(fontName).then((cache) => {
            //     cache.put(ev.request, fetchResponse.clone());
            //     return fetchResponse;
            //   });
            // } else if (type && type.match(/^image\//i)) {
            //   //save in image cache
            //   console.log(`save an IMAGE file ${ev.request.url}`);
            //   return caches.open(imageName).then((cache) => {
            //     cache.put(ev.request, fetchResponse.clone());
            //     return fetchResponse;
            //   });
            // } else {
            //   //save in dynamic cache
            //   console.log(`OTHER save ${ev.request.url}`);
            //   return caches.open(dynamicName).then((cache) => {
            //     cache.put(ev.request, fetchResponse.clone());
            //     return fetchResponse;
            //   });
            // }


          })
        );

      })
    );
  });
  
  

