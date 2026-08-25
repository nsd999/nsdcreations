self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || '/icon.png',
      image: data.image,
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
        url: data.url || '/'
      },
      // Note: Web Push API currently doesn't widely support custom sounds across all browsers
      // for security reasons (mostly system default plays), but we include it in case of browser support.
      sound: data.sound || '/notification.mp3' 
    };
    
    // Show notification
    const notificationPromise = self.registration.showNotification(data.title, options);
    
    // Broadcast to open clients so they can play custom programmatic audio
    const broadcastPromise = clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        client.postMessage({
          type: 'PUSH_RECEIVED',
          payload: data
        });
      }
    });

    event.waitUntil(Promise.all([notificationPromise, broadcastPromise]));
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(function (clientList) {
      const targetUrl = event.notification.data.url;
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
