// app/api/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import webpush, { SendResult } from "web-push";

// Set the VAPID details
webpush.setVapidDetails(
  "mailto:shrestharitik@gmail.com",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { sui_address, title, message, type, metadata, createdAt } =
      await request.json();

    // Validate required fields
    if (!sui_address || !title || !message) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create notification in the database
    const notification = await prisma.notification.create({
      data: { sui_address, title, message, type, metadata },
    });

    // Get unread notification count
    const unreadCount = await prisma.notification.count({
      where: {
        sui_address,
        isRead: false,
      },
    });

    // Get the push subscription for the Sui address
    const pushSubscription = await prisma.pushSubscription.findFirst({
      where: { sui_address },
    });

    if (!pushSubscription) {
      console.warn(
        `No push subscription found for Sui address: ${sui_address}`
      );
      return NextResponse.json(
        {
          notification,
          message:
            "Notification saved, but no push subscription found for this user",
        },
        { status: 201 }
      );
    }

    // Attempt to send the push notification
    //sui_address, title, message, type, metadata
    try {
      const sendResult: SendResult = await webpush.sendNotification(
        JSON.parse(pushSubscription.subscription),
        JSON.stringify({
          title,
          body: message,
          data: {
            url: `/notifications`,
            type,
            metadata,
            sui_address,
            title,
            message,
            createdAt,
          },
          unreadCount, // Include unread count in the push notification
        })
      );
    } catch (error) {
      console.error("Push notification failed:", error);
      if (error instanceof Error && error.name === "ExpiredSubscriptionError") {
        // Delete expired subscription
        await prisma.pushSubscription.delete({
          where: { id: pushSubscription.id },
        });
      }
      return NextResponse.json(
        {
          message: "Error sending push notification",
          notification,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        notification,
        unreadCount,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { message: "Error creating notification" },
      { status: 500 }
    );
  }
}

// Add endpoint to mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const { sui_address, notification_ids } = await request.json();

    if (!sui_address) {
      return NextResponse.json(
        { message: "Missing sui_address" },
        { status: 400 }
      );
    }

    const updateQuery = notification_ids
      ? { id: { in: notification_ids } }
      : {}; // If no IDs provided, prepare to update all

    await prisma.notification.updateMany({
      where: {
        sui_address,
        ...updateQuery,
      },
      data: {
        isRead: true,
      },
    });

    // Get updated unread count
    const unreadCount = await prisma.notification.count({
      where: {
        sui_address,
        isRead: false,
      },
    });

    // Get push subscription to send update
    const pushSubscription = await prisma.pushSubscription.findFirst({
      where: { sui_address },
    });

    if (pushSubscription) {
      try {
        await webpush.sendNotification(
          JSON.parse(pushSubscription.subscription),
          JSON.stringify({
            type: "BADGE_UPDATE",
            unreadCount,
          })
        );
      } catch (error) {
        console.error("Error sending badge update:", error);
      }
    }

    return NextResponse.json({ success: true, unreadCount }, { status: 200 });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json(
      { message: "Error updating notifications" },
      { status: 500 }
    );
  }
}
