/* ============================================
   SERVICE WORKER - PWA SUPPORT
   ============================================ */

const CACHE_NAME = 'gigamerge-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/styles/animations.css',
    '/js/config.js',
    '/js/auth.js',
    '/js/db.js',
    '/js/chatbot.js',
    '/js/app.js',
    '/manifest.json'
];

// ============ INSTALL EVENT ============
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Cache opened, adding assets');
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => {
            self.skipWaiting();
        }).catch((error) => {
            console.error('Cache installation failed:', error);
        })
    );
});

// ============ ACTIVATE EVENT ============
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            self.clients.matchAll().then((clients) => {
                clients.forEach((client) => {
                    client.postMessage({ type: 'CACHE_UPDATED' });
                });
            });
        })
    );
});

// ============ FETCH EVENT ============
self.addEventListener('fetch', (event) => {
    const { request } = event;
    
    // Skip cross-origin requests
    if (new URL(request.url).origin !== location.origin) {
        return;
    }

    // Network first strategy for API calls
    if (request.url.includes('/api/')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const clonedResponse = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, clonedResponse);
                    });
                    return response;
                })
                .catch(() => {
                    return caches.match(request).then((cached) => {
                        return cached || createOfflineResponse();
                    });
                })
        );
        return;
    }

    // Cache first strategy for static assets
    event.respondWith(
        caches.match(request)
            .then((cached) => {
                if (cached) {
                    return cached;
                }
                return fetch(request).then((response) => {
                    if (!response || response.status !== 200 || response.type === 'error') {
                        return response;
                    }
                    
                    const clonedResponse = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, clonedResponse);
                    });
                    
                    return response;
                });
            })
            .catch(() => {
                // Return offline page for document requests
                if (request.headers.get('accept').includes('text/html')) {
                    return createOfflineResponse();
                }
            })
    );
});

// ============ OFFLINE RESPONSE ============
function createOfflineResponse() {
    return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>GigaMerge - Offline</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    background: linear-gradient(135deg, #000000 0%, #0a0a0a 100%);
                    color: #ffffff;
                    font-family: 'Poppins', sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    padding: 20px;
                }
                .container {
                    text-align: center;
                    max-width: 500px;
                }
                .icon {
                    font-size: 80px;
                    margin-bottom: 20px;
                }
                h1 {
                    font-size: 2.5rem;
                    margin-bottom: 10px;
                    background: linear-gradient(135deg, #00d9ff, #7c3aed);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                p {
                    color: #a0aec0;
                    font-size: 1.1rem;
                    margin-bottom: 30px;
                    line-height: 1.6;
                }
                .features {
                    text-align: left;
                    background: rgba(15, 15, 35, 0.7);
                    border: 1px solid rgba(0, 217, 255, 0.1);
                    border-radius: 10px;
                    padding: 20px;
                    margin-bottom: 30px;
                }
                .features h3 {
                    margin-bottom: 15px;
                    color: #00d9ff;
                }
                .features li {
                    margin-bottom: 8px;
                    padding-left: 25px;
                    position: relative;
                }
                .features li:before {
                    content: '✓';
                    position: absolute;
                    left: 0;
                    color: #00d9ff;
                }
                .button {
                    display: inline-block;
                    padding: 12px 30px;
                    background: linear-gradient(135deg, #00d9ff, #7c3aed);
                    color: #000;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                .button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 0 30px rgba(0, 217, 255, 0.4);
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="icon">📡</div>
                <h1>You're Offline</h1>
                <p>It looks like you've lost your internet connection. GigaMerge works best when online.</p>
                
                <div class="features">
                    <h3>What you can still access:</h3>
                    <ul>
                        <li>Previously loaded content</li>
                        <li>Your saved profiles</li>
                        <li>Cached creator information</li>
                        <li>Local app data</li>
                    </ul>
                </div>
                
                <p style="font-size: 0.95rem; margin-bottom: 20px;">
                    Please check your internet connection and refresh the page when online.
                </p>
                
                <button class="button" onclick="location.reload()">
                    Try Again
                </button>
                
                <p style="margin-top: 30px; font-size: 0.85rem; color: #718096;">
                    GigaMerge Studio © 2024
                </p>
            </div>
        </body>
        </html>
    `, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}

// ============ MESSAGE HANDLING ============
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// ============ BACKGROUND SYNC (Optional) ============
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-projects') {
        event.waitUntil(syncProjects());
    }
    if (event.tag === 'sync-profile') {
        event.waitUntil(syncProfile());
    }
});

async function syncProjects() {
    try {
        const response = await fetch('/api/projects');
        if (response.ok) {
            const projects = await response.json();
            const cache = await caches.open(CACHE_NAME);
            await cache.put('/api/projects', response);
        }
    } catch (error) {
        console.error('Sync projects failed:', error);
    }
}

async function syncProfile() {
    try {
        const response = await fetch('/api/profile');
        if (response.ok) {
            const profile = await response.json();
            const cache = await caches.open(CACHE_NAME);
            await cache.put('/api/profile', response);
        }
    } catch (error) {
        console.error('Sync profile failed:', error);
    }
}

// ============ PUSH NOTIFICATIONS (Optional) ============
self.addEventListener('push', (event) => {
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        tag: 'gigamerge-notification',
        requireInteraction: false
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// ============ NOTIFICATION CLICK ============
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});

console.log('Service Worker loaded and ready! 🚀');
