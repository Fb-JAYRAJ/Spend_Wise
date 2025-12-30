import { useState } from "react";
import { signIn, signUp } from "../../lib/auth";
import { toast } from "react-hot-toast";

export default function Login({ onAuth }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "login") {
        await signIn(email, password);
        toast.success("Logged in 🎉");
        onAuth?.();
      } else {
        await signUp(email, password);
        toast.success("Account created — check your email ✉️");
        setMode("login");
      }
    } catch (err) {
      console.error(err);

      // nicer messages
      if (err?.message?.includes("Email not confirmed")) {
        setError("Please confirm your email before logging in.");
      } else if (err?.message?.includes("Invalid login credentials")) {
        setError("Incorrect email or password.");
      } else if (err?.message?.includes("password")) {
        setError("Password must be at least 6 characters.");
      } else {
        setError("Something went wrong. Try again.");
      }

      toast.error(err.message || "Error");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 dark:text-gray-100 shadow rounded-lg p-6 w-96 space-y-4">
        <h2 className="text-2xl font-semibold text-center">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h2>

        {/* error */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 p-2 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            className="border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />

          <input
            type="password"
            className="border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            minLength={6}
            required
          />

          <button
            disabled={loading}
            className={`w-full py-2 rounded text-white ${
              loading
                ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 transition"
            }`}>
            {loading
              ? mode === "login"
                ? "Logging you in…"
                : "Creating account…"
              : mode === "login"
              ? "Log in"
              : "Sign up"}
          </button>
        </form>

        <p className="text-sm text-center">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                className="text-blue-600 dark:text-blue-400"
                disabled={loading}
                onClick={() => {
                  setError("");
                  setMode("signup");
                }}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="text-blue-600 dark:text-blue-400"
                disabled={loading}
                onClick={() => {
                  setError("");
                  setMode("login");
                }}>
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
