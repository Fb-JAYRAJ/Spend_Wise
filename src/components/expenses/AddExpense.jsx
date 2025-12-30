import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { CATEGORIES } from "../../constants/categories";
import { toast } from "react-hot-toast";

export default function AddExpense({ onAdd }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title || !amount || !category) {
      toast.error("Title, amount and category are required");
      return;
    }

    setLoading(true);

    // current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You must be logged in");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("expenses").insert([
      {
        title,
        amount: Number(amount),
        category,
        date: date || new Date().toISOString().split("T")[0],
        notes,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error(error);
      toast.error("Something went wrong");
      setLoading(false);
      return;
    }

    toast.success("Expense added!");

    // reset
    setTitle("");
    setAmount("");
    setCategory("");
    setDate("");
    setNotes("");
    setLoading(false);

    onAdd?.();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="w-full border p-2 rounded"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="number"
        className="w-full border p-2 rounded"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <select
        className="w-full border p-2 rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select category</option>

        {CATEGORIES.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <input
        type="date"
        className="w-full border p-2 rounded"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <textarea
        className="w-full border p-2 rounded"
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button
        disabled={loading}
        className={`w-full px-4 py-2 rounded text-white ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 transition"
        }`}>
        {loading ? "Saving…" : "Add Expense"}
      </button>
    </form>
  );
}
