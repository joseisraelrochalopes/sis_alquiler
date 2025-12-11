
const CACHE_NAME = 'mi-pwa-cache-v1';

// Rutas mínimas que queremos cachear al inicio
const URLS_TO_CACHE = [
  '/',
  '/offline',        // luego crearemos esta ruta
  '/manifest.json',
];

// INSTALACIÓN: cacheo inicial
self.addEventListener('install', (event) => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// ACTIVACIÓN: limpiar caches viejas
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Deleting old cache', name);
            return caches.delete(name);
          }
        })
      )
    )
  );
});

// FETCH: manejo de peticiones
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // No tocar POST/PUT/DELETE, etc.
  if (request.method !== 'GET') return;

  // Navegación de páginas (HTML): network first con fallback a offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const respClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, respClone));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return caches.match('/offline');
        })
    );
    return;
  }

  // Recursos estáticos: cache first con actualización
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          // Actualiza en segundo plano
          event.waitUntil(
            fetch(request).then((response) => {
              return caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, response.clone());
              });
            })
          );
          return cached;
        }

        // Si no está en cache, ve a la red y guarda
        return fetch(request).then((response) => {
          const respClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, respClone));
          return response;
        });
      })
    );
  }
});
