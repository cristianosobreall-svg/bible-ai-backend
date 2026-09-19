const CACHE_NAME = "bible-intelligence-v4";
const APP_SHELL = [
  "/",
  "/manifest.webmanifest",
  "/apple-touch-icon.png",
  "/icon-192.png",
  "/icon-512.png"
  ,"/background-waterfall.jpg"
  ,"/background-mountains.jpg"
  ,"/background-ocean.jpg"
];

self.addEventListener("install",function(event){
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache){
        return cache.addAll(APP_SHELL);
      })
      .then(function(){
        return self.skipWaiting();
      })
  );
});

self.addEventListener("activate",function(event){
  event.waitUntil(
    caches.keys()
      .then(function(keys){
        return Promise.all(
          keys
            .filter(function(key){
              return key !== CACHE_NAME;
            })
            .map(function(key){
              return caches.delete(key);
            })
        );
      })
      .then(function(){
        return self.clients.claim();
      })
  );
});

self.addEventListener("fetch",function(event){
  const request = event.request;
  const url = new URL(request.url);

  if(
    request.method !== "GET" ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith("/api/")
  ){
    return;
  }

  event.respondWith(
    fetch(request)
      .then(function(response){
        if(response.ok){
          const copy = response.clone();
          caches.open(CACHE_NAME).then(function(cache){
            cache.put(request,copy);
          });
        }
        return response;
      })
      .catch(function(){
        return caches.match(request).then(function(cached){
          return cached || caches.match("/");
        });
      })
  );
});
