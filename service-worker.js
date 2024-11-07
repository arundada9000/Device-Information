self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("my-cache-name").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/styles.css",
        "/script.js",
        "/images/information.ico",
        "/images/responsive.png",
        "/images/smartphone.png",
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request)
          .then((fetchResponse) => {
            if (!fetchResponse || fetchResponse.status !== 200) {
              return response;
            }
            const responseClone = fetchResponse.clone();
            caches.open("my-cache-name").then((cache) => {
              cache.put(event.request, responseClone);
            });
            return fetchResponse;
          })
          .catch(() => {
            return response;
          })
      );
    })
  );
});
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
