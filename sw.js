// service-worker.js

const CACHE_NAME = "peer-cache-v12";

// Installations-Ereignis: Basis-Assets cachen
self.addEventListener("install", (event) => {
  event.waitUntil(
    fetch("cache.php") // Die JSON-Datei abrufen
      .then((response) => response.json())
      .then(async (files) => {
        const cache = await caches.open(CACHE_NAME);
        return await Promise.all(
          files.map(async (file) => {
            try {
              return await cache.add(file);
            } catch (error) {
              console.error("Fehler beim Cachen der Datei:", file, error);
            }
          })
        );
      })
  );
});

// Aktivierungs-Ereignis: Alte Caches löschen
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch Event - Handle Requests
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    /* If we don't block the event as shown below, then the request will go to
           the network as usual.
        */
    /*  console.log('WORKER: fetch event ignored.', event.request.method, event.request.url); */
    return;
  }
  const request = event.request;
  // Network-First für den Service Worker
  if (request.url.includes("sw.js")) {
    event.respondWith(fetch(request).catch(() => caches.match(request)));
    return;
  }

  // Stale-While-Revalidate für PHP, JS, CSS
  if (request.url.endsWith(".php") || request.url.includes(".js") || request.url.includes(".css")) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }
  // if (event.request.url.endsWith(".mp3")) {
  //   event.respondWith(fetchAndProcessAudio(event.request));
  //   return;
  // }
  // Cache-First für alle anderen Dateien
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(request).then((networkResponse) => {
          // Netzwerkantwort zum Cache hinzufügen
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        })
      );
    })
  );
});
async function fetchAndProcessAudio(request) {
  const response = await fetch(request);
  const audioArrayBuffer = await response.arrayBuffer();

  // Hier kannst du den Audio-Puffer verarbeiten, falls nötig.
  return new Response(audioArrayBuffer, {
    headers: { "Content-Type": "audio/mpeg" },
  });
}
