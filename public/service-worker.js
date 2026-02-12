// Service Worker for PWA - TerangaReserve
const CACHE_NAME = 'teranga-reserve-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/carte.html',
    '/manifest.json',
    '/robots.txt',
    '/sitemap.xml',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
    console.log('📦 Service Worker: Installation en cours...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('✅ Service Worker: Cache ouvert');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('✅ Service Worker: Tous les fichiers sont en cache');
                return self.skipWaiting();
            })
    );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
    console.log('🔄 Service Worker: Activation en cours...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Service Worker: Suppression ancien cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker: Activé');
            return self.clients.claim();
        })
    );
});

// Stratégie de cache: Network First, fallback to Cache
self.addEventListener('fetch', (event) => {
    // Ignorer les requêtes non-GET
    if (event.request.method !== 'GET') return;

    // Ignorer les requêtes vers des domaines externes (sauf images)
    const url = new URL(event.request.url);
    if (url.origin !== location.origin && !event.request.url.includes('unsplash')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clone la réponse car elle ne peut être utilisée qu'une fois
                const responseToCache = response.clone();

                caches.open(CACHE_NAME)
                    .then((cache) => {
                        cache.put(event.request, responseToCache);
                    });

                return response;
            })
            .catch(() => {
                // Si le réseau échoue, essayer le cache
                return caches.match(event.request)
                    .then((response) => {
                        if (response) {
                            console.log('📦 Service Worker: Récupération depuis le cache:', event.request.url);
                            return response;
                        }

                        // Page offline par défaut
                        if (event.request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

// Push Notifications
self.addEventListener('push', (event) => {
    console.log('🔔 Push notification reçue');

    const options = {
        body: event.data ? event.data.text() : 'Nouvelle notification de TerangaReserve',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [200, 100, 200],
        tag: 'teranga-notification',
        requireInteraction: false,
        actions: [
            { action: 'view', title: 'Voir', icon: '/icons/view-icon.png' },
            { action: 'close', title: 'Fermer', icon: '/icons/close-icon.png' }
        ],
        data: {
            url: '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification('TerangaReserve', options)
    );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
    console.log('🔔 Notification cliquée:', event.action);

    event.notification.close();

    if (event.action === 'view' || !event.action) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url || '/')
        );
    }
});

// Background Sync pour les réservations offline
self.addEventListener('sync', (event) => {
    console.log('🔄 Background sync:', event.tag);

    if (event.tag === 'sync-reservations') {
        event.waitUntil(syncReservations());
    }
});

async function syncReservations() {
    // Récupérer les réservations en attente depuis IndexedDB
    // et les envoyer au serveur
    console.log('🔄 Synchronisation des réservations...');
    // TODO: Implémenter la logique de synchronisation
}

console.log('✅ Service Worker chargé et prêt !');
