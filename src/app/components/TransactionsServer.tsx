// components/TransactionsServer.tsx
import { prisma } from "@/lib/prisma";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function TransactionsServer() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return <p className="text-gray-500 text-center italic">Not signed in 🚫</p>;
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id }, // 👈 filter only current user
    orderBy: { createdAt: "desc" },
    include: { category: true }, // so you can display category name if needed
  });

  if (!transactions.length) {
    return (
      <p className="text-gray-500 text-center italic">
        No transactions yet 🚀
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((t) => {
        const isIncome = t.type === "INCOME";
        return (
          <div
            key={t.id}
            className={`flex items-center justify-between p-4 rounded-lg shadow-sm border transition hover:scale-[1.01] ${
              isIncome
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {isIncome ? (
                <ArrowUpCircle className="text-green-500 w-6 h-6" />
              ) : (
                <ArrowDownCircle className="text-red-500 w-6 h-6" />
              )}
              <div>
                <p className="font-medium text-gray-800">
                  {t.description || (isIncome ? "Income" : "Expense")}
                </p>
                <p className="text-xs text-gray-500">
                  {t.category?.name ?? "Uncategorized"} ·{" "}
                  {new Date(t.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <p
              className={`font-semibold text-lg ${
                isIncome ? "text-green-600" : "text-red-600"
              }`}
            >
              {isIncome ? "+" : "-"}${t.amount}
            </p>
          </div>
        );
      })}
    </div>
  );
}