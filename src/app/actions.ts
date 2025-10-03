// app/actions.ts
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function addTransaction(
  amount: number,
  type: "INCOME" | "EXPENSE",
  categoryId?: string
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }

  // build transaction data dynamically
  const data: any = {
    amount,
    type,
    description: type === "INCOME" ? "Added Income" : "Added Expense",
    userId: session.user.id,
  };

  if (categoryId) {
    data.categoryId = categoryId;  
  }

  return prisma.transaction.create({
    data,
    include: { category: true } 
  });
} 