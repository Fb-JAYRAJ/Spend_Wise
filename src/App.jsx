import { useEffect, useState, useCallback } from "react";
import { supabase } from "./lib/supabase";

import AddExpense from "./components/expenses/AddExpense";
import ExpenseItem from "./components/expenses/ExpenseItem";
import SpendingChart from "./components/expenses/SpendingChart";

import { CATEGORIES } from "./constants/categories";
import { Toaster, toast } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";

import Login from "./components/auth/Login";
import Logo from "./components/layout/Logo";

export default function App() {
  // THEME
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("dark") === "true"
  );

  // AUTH + DATA STATE
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI CONTROLS
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("month");
  const [month, setMonth] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // ---------------- AUTH SESSION ----------------
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    }

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user || null)
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setExpenses([]);
    toast.success("Logged out");
  }

  // ---------------- FETCH EXPENSES ----------------
  const fetchExpenses = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    let query = supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    // month filter
    if (viewMode === "month" && month) {
      const start = `${month}-01`;

      const end = new Date(month + "-01");
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);

      const formattedEnd = end.toISOString().split("T")[0];

      query = query.gte("date", start).lte("date", formattedEnd);
    }

    // week filter
    if (viewMode === "week") {
      const today = new Date();
      const day = today.getDay();

      const monday = new Date(today);
      monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      const start = monday.toISOString().split("T")[0];
      const end = sunday.toISOString().split("T")[0];

      query = query.gte("date", start).lte("date", end);
    }

    const { data } = await query;
    setExpenses(data || []);
    setLoading(false);
  }, [user, viewMode, month]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // ---------------- THEME ----------------
  useEffect(() => {
    const root = document.documentElement;
    darkMode ? root.classList.add("dark") : root.classList.remove("dark");
    localStorage.setItem("dark", darkMode);
  }, [darkMode]);

  // ---------------- DELETE HELPERS ----------------
  async function handleDeleteAll() {
    if (!month) return;

    const ok = window.confirm("Delete ALL expenses for this month?");
    if (!ok) return;

    const start = `${month}-01`;
    const end = new Date(month + "-01");
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);

    const formattedEnd = end.toISOString().split("T")[0];

    await supabase
      .from("expenses")
      .delete()
      .eq("user_id", user.id)
      .gte("date", start)
      .lte("date", formattedEnd);

    toast.success("Deleted for selected month");
    fetchExpenses();
  }

  async function handleDeleteEverything() {
    const ok = window.confirm("⚠ Delete ALL expenses forever?");
    if (!ok) return;

    await supabase.from("expenses").delete().eq("user_id", user.id);
    toast.success("All expenses deleted");
    fetchExpenses();
  }

  // ---------------- FILTER + CALC ----------------
  const filteredExpenses = expenses
    .filter((e) =>
      filterCategory === "All" ? true : e.category === filterCategory
    )
    .filter((e) => e.title.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
      if (sortBy === "oldest") return new Date(a.date) - new Date(b.date);
      if (sortBy === "high") return b.amount - a.amount;
      if (sortBy === "low") return a.amount - b.amount;
      return 0;
    });

  const total = filteredExpenses.reduce((s, e) => s + Number(e.amount), 0);
  const count = filteredExpenses.length;
  const average = count ? Math.round(total / count) : 0;

  // ---------------- LOGIN SCREEN ----------------
  if (!user)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Login onAuth={fetchExpenses} />
      </div>
    );

  // ---------------- APP UI ----------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 dark:text-gray-100">
      <Toaster />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-1">
          <Logo />

          <div className="flex gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="border px-3 py-1 rounded bg-white dark:bg-gray-800 dark:border-gray-700 shadow-md hover:shadow-lg transition">
              {darkMode ? "☀ Light" : "🌙 Dark"}
            </button>

            <button
              onClick={handleLogout}
              className="border px-3 py-1 rounded bg-white dark:bg-gray-800 dark:border-gray-700 text-red-600 shadow-md hover:shadow-lg transition">
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT PANEL */}
          <div className="space-y-4">
            {/* View controls */}
            <div className="border p-4 rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 shadow-md hover:shadow-xl transition space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("month")}
                  className={`border px-3 py-1 rounded ${
                    viewMode === "month"
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-700"
                  }`}>
                  Month View
                </button>

                <button
                  onClick={() => setViewMode("week")}
                  className={`border px-3 py-1 rounded ${
                    viewMode === "week"
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-700"
                  }`}>
                  Week View
                </button>
              </div>

              {viewMode === "month" && (
                <div className="flex gap-2 items-center">
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600">
                    <option value="">All Months</option>
                    <option value="2025-01">January 2025</option>
                    <option value="2025-02">February 2025</option>
                    <option value="2025-03">March 2025</option>
                    <option value="2025-04">April 2025</option>
                  </select>

                  {month && (
                    <button
                      onClick={handleDeleteAll}
                      className="border px-3 py-1 rounded text-red-600 dark:border-gray-600">
                      Delete Month
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Add expense */}
            <div className="border p-4 rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 shadow-md hover:shadow-xl transition">
              <AddExpense onAdd={fetchExpenses} />
            </div>

            {/* Filters */}
            <div className="border p-4 rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 shadow-md hover:shadow-xl transition space-y-3">
              <input
                className="border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600">
                <option>All</option>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600">
                <option value="newest">Date — Newest</option>
                <option value="oldest">Date — Oldest</option>
                <option value="high">Amount — High → Low</option>
                <option value="low">Amount — Low → High</option>
              </select>
            </div>

            {/* Delete everything */}
            <button
              onClick={handleDeleteEverything}
              className="w-full px-4 py-3 rounded-lg border
              bg-white dark:bg-gray-800 dark:border-gray-700
              text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30
              shadow-md hover:shadow-xl transition">
              Delete EVERYTHING
            </button>
          </div>

          {/* RIGHT PANEL */}
          <div className="md:col-span-2 space-y-4">
            <div className="border p-4 rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 shadow-md hover:shadow-xl transition flex gap-6 flex-wrap">
              <div>🧾 {count} expenses</div>
              <div>📉 Avg ₹{average}</div>
              <div>💰 Total ₹{total}</div>
            </div>

            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"
                  />
                ))}
              </div>
            ) : filteredExpenses.length === 0 ? (
              <p className="opacity-70">No expenses yet.</p>
            ) : (
              <ul className="space-y-2">
                <AnimatePresence>
                  {filteredExpenses.map((e) => (
                    <ExpenseItem
                      key={e.id}
                      expense={e}
                      onChange={(id) => {
                        setExpenses((prev) => prev.filter((x) => x.id !== id));
                        fetchExpenses();
                      }}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            )}

            <div className="border p-4 rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 shadow-md hover:shadow-xl transition">
              <SpendingChart expenses={filteredExpenses} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
