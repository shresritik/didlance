// public/serviceWorker.js
let notificationCount = 0;

self.addEventListener('install', event => {
	console.log('Service Worker installed');
	self.skipWaiting();
});

self.addEventListener('activate', event => {
	console.log('Service Worker activated');
	event.waitUntil(self.clients.claim());
});

const updateBadgeAndNotifyClients = async (count, data) => {
	notificationCount = count;

	// Update badge
	if ('setAppBadge' in navigator) {
		try {
			if (count > 0) {
				await navigator.setAppBadge(count);
			} else {
				await navigator.clearAppBadge();
			}
		} catch (error) {
			console.error('Error updating badge:', error);
		}
	}

	// Notify all clients about the new count
	const clients = await self.clients.matchAll();
	clients.forEach(client => {
		client.postMessage({
			type: 'NOTIFICATION_COUNT_UPDATE',
			count: count,
			data: data
		});
	});
};

self.addEventListener('push', event => {
	const data = event.data.json();
	console.log('Push event received:', data);

	// If it's just a badge update, don't show notification
	if (data.type === 'BADGE_UPDATE') {
		event.waitUntil(updateBadgeAndNotifyClients(data.unreadCount, data));
		return;
	}

	const options = {
		body: data.body,
		data: {
			url: data.data.url,
			type: data.data.type,
			metadata: data.data.metadata,
			isRead: false,
			createdAt: data.data.createdAt,
		},
		icon: '/icon.png',
		badge: '/badge.png',
		tag: 'notification-count',
	};

	event.waitUntil(
		Promise.all([
			self.registration.showNotification(data.title, options),
			updateBadgeAndNotifyClients(data.unreadCount, data)
		])
	);
});

self.addEventListener('notificationclick', event => {
	event.notification.close();
	const url = event.notification.data.url || '/';

	event.waitUntil(
		clients.openWindow(url)
	);
});
