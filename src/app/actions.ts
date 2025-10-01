// app/actions.ts
"use server";
import { getServerSession } from "next-auth";

import {prisma} from "@/lib/prisma";

export async function addTransaction(amount: number, type: "INCOME" | "EXPENSE") {
    const session = await getServerSession();
  return prisma.transaction.create({
    data: {
      amount,
      type,
      description: type === "INCOME" ? "Added Income" : "Added Expense",
      user: {
        connect: { email: session?.user?.email || "" },
      },
    },
  });
}