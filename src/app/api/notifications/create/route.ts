import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import webpush, { SendResult } from 'web-push';

// Set the VAPID details
webpush.setVapidDetails(
	'mailto:yogesh000aryal@gmail.com',
	process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
	process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: NextRequest) {
	try {
		// Parse request body
		const { sui_address, title, message, type, metadata } = await request.json();

		// Validate required fields
		if (!sui_address || !title || !message) {
			return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
		}

		// Create notification in the database
		const notification = await prisma.notification.create({
			data: { sui_address, title, message, type, metadata },
		});

		// Get the push subscription for the Sui address
		const pushSubscription = await prisma.pushSubscription.findFirst({
			where: { sui_address },
		});

		if (!pushSubscription) {
			console.warn(`No push subscription found for Sui address: ${sui_address}`);
			return NextResponse.json({
				notification,
				message: 'Notification saved, but no push subscription found for this user',
			}, { status: 201 });
		}

		// Attempt to send the push notification
		try {
			const sendResult: SendResult = await webpush.sendNotification(
				JSON.parse(pushSubscription.subscription),
				JSON.stringify({
					title,
					body: message,
					data: { url: `/notifications` },
				})
			);
			console.log('Push notification sent:', sendResult);
		} catch (error) {
			console.error('Push notification failed:', error);
			return NextResponse.json({
				message: 'Error sending push notification',
				notification,
			}, { status: 500 });
		}

		return NextResponse.json(notification, { status: 201 });
	} catch (error) {
		console.error('Error creating notification:', error);
		return NextResponse.json({ message: 'Error creating notification' }, { status: 500 });
	}
}

