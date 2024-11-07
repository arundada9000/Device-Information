self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("my-cache-name").then((cache) => {
      return cache.addAll(["/", "/index.html", "/styles.css", "/script.js"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// Inside your service worker file

const BACKGROUND_SYNC_QUEUE = "background-sync-queue";

self.addEventListener("sync", (event) => {
  if (event.tag === BACKGROUND_SYNC_QUEUE) {
    event.waitUntil(
      (async () => {
        const requests = await getAllPendingRequests(BACKGROUND_SYNC_QUEUE);
        for (const request of requests) {
          try {
            await fetch(request);
          } catch (error) {
          } finally {
            await removeFromQueue(BACKGROUND_SYNC_QUEUE, request);
          }
        }
      })()
    );
  }
});

async function getAllPendingRequests(queueName) {
  const cache = await caches.open(queueName);
  return await cache.keys();
}

async function removeFromQueue(queueName, request) {
  const cache = await caches.open(queueName);
  await cache.delete(request);
}
