export default function ExpenseDetails({ expense, onClose }) {
  if (!expense) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-5 rounded w-96 space-y-3">
        <h2 className="text-xl font-semibold">Expense Details</h2>

        <div>
          <strong>Title:</strong> {expense.title}
        </div>
        <div>
          <strong>Category:</strong> {expense.category}
        </div>
        <div>
          <strong>Date:</strong> {expense.date}
        </div>
        <div>
          <strong>Amount:</strong> ₹{expense.amount}
        </div>

        <div>
          <strong>Notes:</strong>
          <p className="mt-1 text-gray-600">
            {expense.notes || "No notes added"}
          </p>
        </div>

        <div className="flex justify-end">
          <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
