self.addEventListener('push', function (event) {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: 'NSD Creations', body: event.data.text() };
  }

  const targetUrl = data.url || '/';
  const options = {
    body: data.body,
    icon: data.icon || '/icon.png',
    image: data.image,
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2',
      url: targetUrl,
      channel: data.channel || 'general',
      sound: data.sound || null,
    },
  };

  const notificationPromise = self.registration.showNotification(data.title || 'NSD Creations', options);

  // The page can play the custom admin sound while an admin tab is open.
  // Browsers do not consistently support custom audio on OS-rendered push notifications.
  const broadcastPromise = clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
    for (const client of clientList) {
      client.postMessage({
        type: 'PUSH_RECEIVED',
        payload: data,
      });
    }
  });

  event.waitUntil(Promise.all([notificationPromise, broadcastPromise]));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      const targetUrl = new URL(event.notification.data?.url || '/', self.location.origin).href;
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
