"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
}


export default function AddTransactionForm({ categories }: { categories: Category[]}) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("INCOME");
  const [categoryId, setCategoryId] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAdd = async () => {
    try {
      startTransition(async () => {

  
        const res = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: Number(amount), type, categoryId }),
        });
  
        if (!res.ok) throw new Error("Failed to add transaction");
  
        const newTx = await res.json();

        setAmount("");
        setCategoryId("");
        setType("INCOME");
  
        router.refresh();
      });
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
      {/* Amount input */}
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
          type="button"
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
          type="button"
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
        {type === "EXPENSE" && (
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
)}
      </div>

      {/* Submit button */}
      <button
        className="w-full py-3 bg-[#7a81eb] hover:bg-[#7a81eb]/70 text-white rounded-lg"
        onClick={handleAdd}
        disabled={isPending || !amount || (type === "EXPENSE" && !categoryId)}      >
        {isPending ? "Adding..." : "Add Transaction"}
      </button>
    </div>
  );
}