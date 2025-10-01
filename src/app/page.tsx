// app/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import RightSideBar from "./components/RightSideBar";
import TransactionsServer from "./components/TransactionsServer";
import AddTransactionForm from "./components/AddTransactionForm";
import IncomeExpenseLine from "./components/IncomeExpenseLine";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <p className="text-center">Please log in</p>;
  }

  // query DB directly instead of API call
  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  const safeTransactions = transactions.map((t) => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
      <div className="md:col-span-3 space-y-6">
        <AddTransactionForm />
        <IncomeExpenseLine transactions={safeTransactions} />

      </div>
      <div className="md:col-span-1">
        <RightSideBar />
      </div>
    </div>
  );
}