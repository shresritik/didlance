import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { sui_address, commit } = await request.json();
    console.log({ sui_address, commit });
    const user = await prisma.user.findFirst({
      where: {
        sui_address,
      },
    });
    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 500 }
      );
    }
    const data = await prisma.user.create({
      data: {
        sui_address,
        commit,
      },
    });
    return NextResponse.json({ message: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
