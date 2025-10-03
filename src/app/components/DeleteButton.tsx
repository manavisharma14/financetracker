"use client";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function DeleteButton({ id }: { id: string }) {
    const router = useRouter();

  
  async function handleDelete() {
    await fetch(`/api/transactions/${id}`, {
      method: "DELETE",
    });
    router.refresh(); 
  }
  
  // 2. The button is never disabled because the ID is always present
  return (
    <button
      onClick={handleDelete}
      aria-label="Delete transaction"
      className="p-1 rounded-full text-red-500 hover:bg-gray-100 transition-colors"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}