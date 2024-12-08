import { prisma } from "@/lib/prisma";
import { Post } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const data = await prisma.post.findMany({ orderBy: [{ createdAt: "desc" }] });
  return NextResponse.json({ message: data, status: 200 });
};
export const POST = async (request: NextRequest) => {
  const { sui_address, post, url } = await request.json();
  console.log(sui_address);
  const resBody: Omit<Post, "id" | "createdAt"> = {
    sui_address,
    post,
    url,
  };
  const data = await prisma.post.create({ data: resBody });
  return NextResponse.json({ message: data, status: 200 });
};
