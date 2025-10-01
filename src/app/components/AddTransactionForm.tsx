"use client";
import { useState, useTransition, useEffect } from "react";
import { addTransaction } from "@/app/actions";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

export default function AddTransactionForm({categories} : {categories: Category[]}) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("INCOME");
  const [categoryId, setCategoryId] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();



  const handleAdd = () => {
    startTransition(async () => {
      await addTransaction(parseFloat(amount), type, categoryId);
      setAmount("");
      setCategoryId("");
      router.refresh();
    });
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
      />

      <div className="flex space-x-4">
        {/* Income button */}
        <button
          className={`flex-1 p-3 rounded-lg ${
            type === "INCOME"
              ? "bg-green-500 text-white"
              : "border border-green-500 text-green-600 hover:bg-green-50"
          }`}
          onClick={() => setType("INCOME")}
        >
          💰 Income
        </button>

        {/* Expense button */}
        <button
          className={`flex-1 p-3 rounded-lg ${
            type === "EXPENSE"
              ? "bg-red-500 text-white"
              : "border border-red-500 text-red-600 hover:bg-red-50"
          }`}
          onClick={() => setType("EXPENSE")}
        >
          💸 Expense
        </button>

        {/* Category dropdown */}
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="flex-1 p-3 rounded-lg border border-gray-300"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <button
        className="w-full py-3 bg-[#7a81eb] hover:bg-[#7a81eb]/70 text-white rounded-lg"
        onClick={handleAdd}
        disabled={isPending || !amount || !categoryId}
      >
        Add Transaction
      </button>
    </div>
  );
}