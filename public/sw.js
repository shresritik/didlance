self.addEventListener('install', event => {
	console.log('Service Worker installed');
	self.skipWaiting();
});

self.addEventListener('activate', event => {
	console.log('Service Worker activated');
});

self.addEventListener('push', event => {
	console.log('Push event received:', event);

	const { title, body, url } = event.data.json();

	const options = {
		body,
		data: { url },
		// icon: '/icon.png', // Commented out since you don't have the image
		// badge: '/badge.png', // Commented out since you don't have the image
	};

	event.waitUntil(
		self.registration.showNotification(title, options)
	);
});

self.addEventListener('notificationclick', event => {
	event.notification.close();
	const url = event.notification.data.url || '/';
	event.waitUntil(
		clients.openWindow(url)
	);
});

self.addEventListener('fetch', event => {
	console.log('Fetch event:', event);
	event.respondWith(fetch(event.request));
});
