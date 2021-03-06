self.addEventListener('install', (event) => {
    console.log('👷', 'install', event);
    self.skipWaiting();
  });
  
  self.addEventListener('activate', (event) => {
    console.log('👷', 'activate', event);
    return self.clients.claim();
  });
  
  // self.addEventListener('fetch', function(event) {
  //   // console.log('👷', 'fetch', event);
  //   event.respondWith(fetch(event.request));
  // });

  const filesToCache = [
    '/',
    'script.js',
    'index.html',
    'style.css'
  ];
  
  const staticCacheName = 'pages-cache-v2';

  
  self.addEventListener('install', event => {
    console.log('Attempting to install service worker and cache static assets');
    event.waitUntil(
      caches.open(staticCacheName)
      .then(cache => {
        return cache.addAll(filesToCache);
      })
    );
  });

  self.addEventListener('fetch', event => {
    console.log('Fetch event for ', event.request.url);
    event.respondWith(
      caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('Found ', event.request.url, ' in cache');
          return response;
        }
        console.log('Network request for ', event.request.url);
        return fetch(event.request)
  
        // TODO 4 - Add fetched files to the cache
  
      }).catch(error => {
  
        // TODO 6 - Respond with custom offline page
  
      })
    );
  });
  self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
      
    );
  })
  self.addEventListener('push', ev => {
    const data = ev.data.json();
    console.log('Got push', data);
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      data : {
        url : data.url
      },
      requireInteraction: true
    });
  });