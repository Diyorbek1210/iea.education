const CACHE_NAME = "iea-v1";
const STATIC_ASSETS = [
  "/",
  "/dashboard",
  "/vocabulary",
  "/practice",
  "/mock-test",
  "/analytics",
  "/study-plan",
  "/task-practice",
  "/model-answers",
  "/band-calculator",
  "/resources",
  "/requirements",
  "/leaderboard",
  "/community",
  "/notifications",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.hostname.includes("firestore.googleapis.com") || url.hostname.includes("firebaseio.com")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetched = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);

      return cached || fetched;
    }),
  );
});
