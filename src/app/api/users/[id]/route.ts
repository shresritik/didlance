import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: sui_address } = await params;
    const data = await prisma.user.findFirst({
      where: {
        sui_address,
      },
      include: {
        membership: { select: { status: { select: { name: true } } } },
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
