"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface Transaction {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  createdAt: string;
}

export default function IncomeExpenseLine({ transactions }: { transactions: Transaction[] }) {
  // Sort transactions by date
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Aggregate daily totals for income & expense
  const dailyTotals: Record<string, { income: number; expense: number }> = {};

  sorted.forEach((t) => {
    const date = new Date(t.createdAt).toLocaleDateString();
    if (!dailyTotals[date]) {
      dailyTotals[date] = { income: 0, expense: 0 };
    }
    if (t.type === "INCOME") {
      dailyTotals[date].income += t.amount;
    } else {
      dailyTotals[date].expense += t.amount;
    }
  });

  // Convert to Recharts format
  const data = Object.entries(dailyTotals).map(([date, totals]) => ({
    date,
    income: totals.income,
    expense: totals.expense,
  }));

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold text-center mb-4">Income vs Expense Over Time</h2>
      <LineChart width={600} height={350} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />

        {/* Income Line */}
        <Line type="monotone" dataKey="income" stroke="#16a34a" strokeWidth={2} />

        {/* Expense Line */}
        <Line type="monotone" dataKey="expense" stroke="#dc2626" strokeWidth={2} />
      </LineChart>
    </div>
  );
}