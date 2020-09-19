self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open('static')
      .then(cache => cache.addAll(['/offline', '/static/images/favicon.png', '/static/css/normalize.css', '/static/pulltorefresh.min.js', '/static/pulltorefresh-init.js']))
      .catch(error => console.error(error))
  );
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (
    event.request.mode === 'navigate'
    || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))
  ) {
    console.log('## Get HTML', event.request.url);
    event.respondWith(
      fetch(event.request).catch(
        () => console.log('## Response offline page') || caches.match('/offline'),
      )
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          console.log('## Response from cache', event.request.url);
          return response;
        }
        console.log('## Response from origin', event.request.url);
        return fetch(event.request);
      })
    );
  }
});
