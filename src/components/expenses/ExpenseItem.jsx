import { useState } from "react";
import EditExpense from "./EditExpense";
import ExpenseDetails from "./ExpenseDetails";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const CATEGORY_COLORS = {
  Food: "bg-green-100 text-green-700",
  Transport: "bg-blue-100 text-blue-700",
  Shopping: "bg-purple-100 text-purple-700",
  Bills: "bg-red-100 text-red-700",
  Entertainment: "bg-yellow-100 text-yellow-700",
  Other: "bg-gray-100 text-gray-700",
};

export default function ExpenseItem({ expense, onChange }) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const ok = window.confirm(
      `Delete "${expense.title}" for ₹${expense.amount}?`
    );
    if (!ok) return;

    setDeleting(true);
    onChange(expense.id); // optimistic remove

    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", expense.id);

    if (error) {
      toast.error("Delete failed — restoring item");
      onChange();
      setDeleting(false);
      return;
    }

    toast.success("Deleted");
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <motion.li
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.18 }}
        className={`flex justify-between items-center p-3 rounded border dark:border-gray-700 
          ${
            expense.date === today
              ? "bg-amber-50 dark:bg-amber-900/30"
              : "bg-white dark:bg-gray-800"
          }`}>
        <div>
          <div className="flex items-center gap-2">
            <strong className="text-[15px]">{expense.title}</strong>

            {expense.date === today && (
              <span className="text-xs px-2 py-[2px] rounded-full bg-amber-100 text-amber-700">
                Today
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                CATEGORY_COLORS[expense.category] || "bg-gray-100 text-gray-700"
              }`}>
              {expense.category}
            </span>

            <span>{expense.date}</span>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <span className="text-green-600 font-semibold">
            ₹{expense.amount}
          </span>

          <button
            className="px-2 text-gray-700 dark:text-gray-300 hover:underline"
            onClick={() => setShowDetails(true)}
            disabled={deleting}>
            View
          </button>

          <button
            className="px-2 text-blue-600 hover:underline"
            onClick={() => setShowEdit(true)}
            disabled={deleting}>
            Edit
          </button>

          <button
            className="px-2 text-red-600 hover:underline"
            onClick={handleDelete}
            disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </motion.li>

      {showEdit && (
        <EditExpense
          expense={expense}
          onClose={() => setShowEdit(false)}
          onUpdated={onChange}
        />
      )}

      {showDetails && (
        <ExpenseDetails
          expense={expense}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}
