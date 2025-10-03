"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Category {
  id: string;
  name: string;
}

interface Transaction {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  categoryId: string | null;
  category?: Category | null;
}

export default function CategoryPie({ transactions }: { transactions: Transaction[] }) {

  const expenseTx = transactions.filter((t) => t.type === "EXPENSE");

  if (!expenseTx || expenseTx.length === 0) {
    return <p className="text-gray-500 italic text-center">No expenses yet 🚀</p>;
  }


  const grouped = expenseTx.reduce((acc, t) => {
    const key = t.category?.name || "Uncategorized";
    acc[key] = (acc[key] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(grouped).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = [
    "#7a81eb",
    "#34d399",
    "#f87171",
    "#fbbf24",
    "#60a5fa",
    "#c084fc",
    "#fb923c",
    "#2dd4bf",
  ];

  return (
    <div className="w-full bg-white shadow-md rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
        Spending by Category
      </h2>
     
      <div className="w-full h-80 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              label
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}