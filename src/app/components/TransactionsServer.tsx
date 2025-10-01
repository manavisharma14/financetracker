import { prisma } from "@/lib/prisma";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react"; // icons

export default async function TransactionsServer() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
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
            {/* Left side: icon + details */}
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
                  {new Date(t.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Right side: amount */}
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