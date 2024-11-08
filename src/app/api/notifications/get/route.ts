
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
	console.log("from GET method"); // Confirm that this is reached

	// Get the `sui_address` from query parameters
	const suiAddress = request.nextUrl.searchParams.get('sui_address')?.toLowerCase();

	// Validate `sui_address` is provided
	if (!suiAddress) {
		return NextResponse.json({ message: 'Missing sui_address parameter' }, { status: 400 });
	}

	try {
		// Fetch notifications from the database for the provided sui_address
		const notifications = await prisma.notification.findMany({
			where: { sui_address: suiAddress, isRead: false },
			orderBy: { createdAt: 'desc' },
		});

		// Return the notifications as a JSON response
		return NextResponse.json(notifications, { status: 200 });
	} catch (error) {
		console.error('Error fetching notifications:', error);
		return NextResponse.json(
			{ message: 'Error fetching notifications' },
			{ status: 500 }
		);
	}
}

