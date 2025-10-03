// src/lib/createDefaultCategories.ts
import { prisma } from "./prisma";

export async function createDefaultCategories(userId: string) {
  const existing = await prisma.category.findMany({ where: { userId } });
  if (existing.length === 0) {
    await prisma.category.createMany({
      data: [


        { name: "Food & Drinks", type: "EXPENSE", userId },
        { name: "Travel", type: "EXPENSE", userId },
        { name: "Shopping", type: "EXPENSE", userId },
        { name: "Health & Fitness", type: "EXPENSE", userId },
        { name: "Housing & Utilities", type: "EXPENSE", userId },
        { name: "Personal Care", type: "EXPENSE", userId },
        { name: "Transportation", type: "EXPENSE", userId },
        { name: "Others", type: "EXPENSE", userId },
      ],
    });
  }
}