import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { CATEGORIES } from "../../constants/categories";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function SpendingChart({ expenses }) {
  const totals = CATEGORIES.map((cat) =>
    expenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + Number(e.amount), 0)
  );

  const data = {
    labels: CATEGORIES,
    datasets: [
      {
        label: "Spending (₹)",
        data: totals,
        backgroundColor: [
          "#2563eb",
          "#10b981",
          "#f59e0b",
          "#a855f7",
          "#ef4444",
          "#6b7280",
        ],
      },
    ],
  };

  return (
    <div className="mt-10 p-4 border rounded bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-3">Spending by Category</h2>
      <Bar data={data} />
    </div>
  );
}
