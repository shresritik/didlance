import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = await params;
    const data = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!data) {
      return NextResponse.json({ error: "No data found" }, { status: 400 });
    }
    return NextResponse.json({ message: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}