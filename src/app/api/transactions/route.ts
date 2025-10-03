import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ObjectId } from "bson";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id }, // 👈 filter only by userId
    orderBy: { createdAt: "desc" },
    include: {
      category: true, // 👈 include related category details
    },
  });

  return NextResponse.json(transactions);
}
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, type, categoryId } = await req.json();

    console.log("Checking categoryId:", categoryId);
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    console.log("Matched category:", category);

    const transaction = await prisma.transaction.create({
      data: {
        amount,
        type,
        description: type === "INCOME" ? "Added Income" : "Added Expense", // ✅ fix
        categoryId: categoryId ? new ObjectId(categoryId).toString() : undefined,
        userId: session.user.id,
      },
      include: { category: true },
    });


    return NextResponse.json(transaction);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}