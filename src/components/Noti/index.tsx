'use client';
import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Bell } from 'lucide-react';
import { format } from 'date-fns';
import type { Notification } from '@/types/notification';
import { urlBase64ToUint8Array } from '@/lib/utils';

interface NotificationDialogProps {
	suiAddress: string;
}

const NotificationDialog: React.FC<NotificationDialogProps> = ({ suiAddress }) => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if ('serviceWorker' in navigator) {
			const messageHandler = (event: MessageEvent) => {
				if (event.data && event.data.type === 'NOTIFICATION_COUNT_UPDATE') {
					setUnreadCount(event.data.count);
				}
			};

			navigator.serviceWorker.addEventListener('message', messageHandler);

			return () => {
				navigator.serviceWorker.removeEventListener('message', messageHandler);
			};
		}
	}, []);

	useEffect(() => {
		if (suiAddress && 'serviceWorker' in navigator && 'PushManager' in window) {
			const initNotifications = async () => {
				try {
					await requestNotificationPermission();
					await registerServiceWorker({ suiAddress });
					await fetchNotifications();
				} catch (error) {
					console.error('Error initializing notifications:', error);
				}
			};

			initNotifications();
		}
	}, [suiAddress]);

	const registerServiceWorker = async ({ suiAddress }: { suiAddress: string }) => {
		try {
			// Check if service workers and Push API are supported
			if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
				throw new Error('Push notifications are not supported in this browser');
			}

			// Check if VAPID key is configured
			if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
				throw new Error('VAPID public key is not configured');
			}

			// Convert VAPID key from base64 to Uint8Array
			const applicationServerKey = urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY);

			// Register service worker
			const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
			await navigator.serviceWorker.ready;
			console.log(await registration.pushManager.getSubscription());

			// Subscribe to push notifications
			const subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey,
			});

			// Send subscription to server
			await fetch('/api/notifications/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ sui_address: suiAddress.toLowerCase(), subscription }),
			});

			return subscription;
		} catch (error) {
			console.error('Service worker registration failed:', error);
			throw error;
		}
	};

	const requestNotificationPermission = async () => {
		try {
			const permission = await Notification.requestPermission();
			if (permission !== 'granted') {
				throw new Error('Notification permission denied');
			}
		} catch (error) {
			console.error('Failed to request notification permission:', error);
			throw error;
		}
	};

	const fetchNotifications = async () => {
		try {
			const response = await fetch(`/api/notifications/get?sui_address=${suiAddress.toLowerCase()}`);
			if (!response.ok) {

				throw new Error('Failed to fetch notifications');
			}
			const data = await response.json();
			setUnreadCount(data.length);
			setNotifications(data);

			// Update badge if supported
			if ('setAppBadge' in navigator) {
				if (data.unreadCount > 0) {
					await navigator.setAppBadge(data.unreadCount);
				} else {
					await navigator.clearAppBadge();
				}
			}
		} catch (error) {
			console.error('Error fetching notifications:', error);
		}
	};

	const markAsRead = async (notificationId?: string) => {
		try {
			const response = await fetch('/api/notifications/create', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					sui_address: suiAddress, // Make sure you have access to walletAddress
					notification_ids: notificationId ? [notificationId] : undefined
				})
			});

			if (!response.ok) {
				throw new Error('Failed to update notification');
			}

			const { unreadCount } = await response.json();

			// Update local state
			setNotifications(notifications.map(n =>
				notificationId
					? (n.id === notificationId ? { ...n, isRead: true } : n)
					: { ...n, isRead: true }
			));
			setUnreadCount(unreadCount);
		} catch (error) {
			console.error('Failed to mark notification as read:', error);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<button className="text-gray-600 hover:text-gray-900 relative">
					<Bell className="h-5 w-5" />
					{unreadCount > 0 && (
						<Badge
							className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-red-500 text-white border-2 border-white rounded-full"
						>
							{unreadCount}
						</Badge>
					)}
				</button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Notifications</DialogTitle>
					<DialogDescription>
						Your recent notifications will appear here.
					</DialogDescription>
				</DialogHeader>
				<div className="max-h-[60vh] overflow-y-auto">
					{notifications.length === 0 ? (
						<p className="text-sm text-gray-500 p-4">No new notifications</p>
					) : (
						<div className="space-y-4 p-4">
							{notifications.map((notification) => (
								<div
									key={notification.id}
									className={`p-4 rounded-lg border ${notification.isRead ? 'bg-white' : 'bg-blue-50'}`}
									onClick={() => markAsRead(notification.id)}
								>
									<div className="flex justify-between items-start">
										<h4 className="text-sm font-medium">{notification.title}</h4>
										<span className="text-xs text-gray-500" suppressHydrationWarning={true}>
											{format(new Date(notification.createdAt), 'MMM d, h:mm a')}
										</span>
									</div>
									<p className="text-sm text-gray-600 mt-1">{notification.message}</p>
									{notification.type === 'job_application' && notification.metadata?.jobId && (
										<div className="mt-2">

											<a href={`/jobs/${notification.metadata.jobId}`}
												className="text-sm text-blue-600 hover:underline" >
												View Job
											</a>
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog >
	);
};

export default NotificationDialog;
