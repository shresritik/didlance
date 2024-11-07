import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
	console.log('Subscribe endpoint hit');

	try {
		// Parse the request body
		const { sui_address, subscription }: { suiAddress: String; subscription: PushSubscription } = await request.json();

		// Validate required fields
		if (!sui_address || !subscription) {
			return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
		}

		// Convert the subscription to a string
		const subscriptionString = JSON.stringify(subscription);

		// Create or update the push subscription in the database
		await prisma.pushSubscription.upsert({
			where: { sui_address },
			update: { subscription: subscriptionString },
			create: { sui_address, subscription: subscriptionString },
		});

		return NextResponse.json({ message: 'Subscription successful' }, { status: 200 });
	} catch (error) {
		console.error('Subscription error:', error);
		return NextResponse.json({ message: 'Subscription failed' }, { status: 500 });
	}
}
