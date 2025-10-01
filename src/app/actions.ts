"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function addTransaction(amount: number, type: "INCOME" | "EXPENSE", categoryId: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }

  return prisma.transaction.create({
    data: {
      amount,
      type,
      description: type === "INCOME" ? "Added Income" : "Added Expense",
      user: { connect: { id: session.user.id } },        // ✅ connect user safely
      category: { connect: { id: categoryId } },         // ✅ connect category safely
    },
  });
}