import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id }, // 👈 filter only by userId
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(transactions);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
  }

  const { amount, type, description, categoryId } = await request.json();

  if (!amount || !type || !categoryId) {
    return NextResponse.json({ message: "Amount, type and category are required" }, { status: 400 });
  }

  const transaction = await prisma.transaction.create({
    data: {
      amount,
      type,
      description,
      categoryId,
      userId: session.user.id, // 👈 always link to logged-in user
    },
  });

  return NextResponse.json(transaction);
}