"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useState } from "react";

interface Transaction {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  createdAt: string;
}

export default function IncomeExpenseLine({ transactions }: { transactions: Transaction[] }) {

  const [view, setView] = useState<"day" | "week" | "month">("day");


  function getKey(date: Date, mode: "day" | "week" | "month") {
    if(mode === "day"){
      return date.toISOString().split('T')[0];
    }
    if(mode === "week"){
      const firstDayOfWeek = new Date(date);
      firstDayOfWeek.setDate(date.getDate() - date.getDay());
      return firstDayOfWeek.toISOString().split('T')[0];
    }

    if(mode === "month"){
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    }
  }
  const sorted = [...transactions].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  // Group transactions by day/week/month based on view

  const totals: Record<string, { income: number; expense: number }> = {};

  sorted.forEach((t) => {
    const d = new Date(t.createdAt);
    const key = getKey(d, view) || ""; 

    if (!totals[key]) {
      totals[key] = { income: 0, expense: 0 };
    }

      totals[key].expense += t.amount;
    
  });

  const data = Object.entries(totals).map(([key, totals]) => ({
    date: key,
    income: totals.income,
    expense: totals.expense,
  }));




  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold text-center mb-4">Income vs Expense Over Time</h2>

      {/* Toggle Buttons */}
      <div className="flex justify-center gap-3 mb-4">
        <button
          onClick={() => setView("day")}
          className={`px-3 py-1 rounded ${view === "day" ? "bg-indigo-500 text-white" : "border"}`}
        >
          Day
        </button>
        <button
          onClick={() => setView("week")}
          className={`px-3 py-1 rounded ${view === "week" ? "bg-indigo-500 text-white" : "border"}`}
        >
          Week
        </button>
        <button
          onClick={() => setView("month")}
          className={`px-3 py-1 rounded ${view === "month" ? "bg-indigo-500 text-white" : "border"}`}
        >
          Month
        </button>
      </div>
      <LineChart width={600} height={350} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />

        <Line type="monotone" dataKey="income" stroke="#16a34a" strokeWidth={2} />
        <Line type="monotone" dataKey="expense" stroke="#dc2626" strokeWidth={2} />
      </LineChart>
    </div>
  );
}