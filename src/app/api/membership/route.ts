import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const { membership: membershipName, sui_address } = await request.json();
  try {
    // Validate user exists
    const user = await prisma.user.findUnique({
      where: { sui_address },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Find membership status by name
    const membershipStatus = await prisma.membershipStatus.findUnique({
      where: { name: membershipName },
    });

    if (!membershipStatus) {
      return NextResponse.json(
        { message: `Membership status '${membershipName}' not found` },
        { status: 404 }
      );
    }

    // Check if user already has a membership
    const existingMembership = await prisma.membership.findFirst({
      where: { user: { sui_address } },
    });

    if (existingMembership) {
      return NextResponse.json(
        { message: "User already has a membership" },
        { status: 400 }
      );
    }

    // Check if the user has enough commit
    if (+user.commit < +membershipStatus.price) {
      return NextResponse.json(
        { message: "Insufficient commit balance" },
        { status: 400 }
      );
    }

    // Deduct the price from the user's commit
    await prisma.user.update({
      where: { sui_address },
      data: {
        commit: {
          decrement: membershipStatus.price, // Deduct the price
        },
      },
    });
    // Create a new membership for the user
    const membership = await prisma.membership.create({
      data: {
        status: { connect: { id: membershipStatus.id } },
        user: { connect: { sui_address } },
        amount: membershipStatus.price,
      },
      include: {
        status: true,
      },
    });

    return NextResponse.json({ message: membership, status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
};
