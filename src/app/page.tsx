// app/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import RightSideBar from "./components/RightSideBar";
import TransactionsServer from "./components/TransactionsServer";
import AddTransactionForm from "./components/AddTransactionForm";
import IncomeExpenseLine from "./components/IncomeExpenseLine";
import CategoryPie from "./components/CategoryPie";
import Link from "next/link";

export default async function HomePage() {
  const session = await getServerSession(authOptions);


  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-700 mb-4">
          💸 Smart Expense Tracker
        </h1>
        <p className="text-gray-700 text-lg md:text-xl max-w-xl text-center mb-8">
          Take control of your finances. Track income, monitor expenses, and 
          build better money habits effortlessly.
        </p>
        <a
          href="/api/auth/signin"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition"
        >
          Get Started → Sign In
        </a>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="p-6 bg-white rounded-xl shadow text-center">
            <h3 className="font-semibold text-indigo-600">📊 Visual Insights</h3>
            <p className="text-gray-600 text-sm mt-2">
              Track spending patterns with charts and graphs.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow text-center">
            <h3 className="font-semibold text-indigo-600">💰 Income & Expense</h3>
            <p className="text-gray-600 text-sm mt-2">
              Add transactions easily and categorize them.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow text-center">
            <h3 className="font-semibold text-indigo-600">🔒 Secure & Private</h3>
            <p className="text-gray-600 text-sm mt-2">
              Sign in with Google/GitHub. Your data stays yours.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { category: true }, // 👈 include related category details
  });

  const categories = await prisma.category.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
  });

  const safeTransactions = transactions.map((t) => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
      <div className="md:col-span-3 space-y-6">
        <AddTransactionForm categories={categories} /> 
        <div className="flex gap-6 mt-16">
        <IncomeExpenseLine transactions={safeTransactions} />
        <CategoryPie transactions={safeTransactions} />
        </div>
      </div>
      <div className="md:col-span-1">
        <RightSideBar />
      </div>
    </div>
  );
}