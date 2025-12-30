import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";

export default function EditExpense({ expense, onClose, onUpdated }) {
  const [title, setTitle] = useState(expense.title);
  const [amount, setAmount] = useState(expense.amount);
  const [category, setCategory] = useState(expense.category);
  const [date, setDate] = useState(expense.date);
  const [notes, setNotes] = useState(expense.notes || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // focus title first
  useEffect(() => {
    document.getElementById("edit-title")?.focus();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("Title is required");
    if (!amount || amount <= 0) return setError("Amount must be > 0");
    if (!category) return setError("Category is required");
    if (!date) return setError("Date is required");

    setSaving(true);

    const { error } = await supabase
      .from("expenses")
      .update({ title, amount, category, date, notes })
      .eq("id", expense.id);

    setSaving(false);

    if (error) {
      toast.error("Failed to update");
      return setError("Something went wrong. Try again.");
    }

    toast.success("Updated");
    onUpdated();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSave}
        className="bg-white p-6 rounded-lg w-96 space-y-3 shadow-xl">
        <h2 className="text-xl font-semibold mb-2">Edit Expense</h2>

        {error && (
          <div className="p-2 bg-red-100 border border-red-300 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <input
          id="edit-title"
          className="border p-2 w-full rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <input
          type="number"
          className="border p-2 w-full rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />

        <input
          className="border p-2 w-full rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
        />

        <input
          type="date"
          className="border p-2 w-full rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <textarea
          className="border p-2 w-full rounded"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
        />

        <div className="flex gap-3 justify-end mt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 border rounded">
            Cancel
          </button>

          <button
            className={`px-4 py-1 rounded text-white ${
              saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
