"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Fel lösenord, försök igen.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-mint-50"
      style={{ background: "linear-gradient(135deg, #ede9fe 0%, #fce7f3 50%, #d1fae5 100%)" }}
    >
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-sm border border-purple-100">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">✨</div>
          <h1 className="text-2xl font-bold text-purple-900">Sofie Dashboard</h1>
          <p className="text-purple-400 text-sm mt-1">Välkommen tillbaka!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Lösenord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-purple-100 focus:border-purple-300 focus:outline-none text-purple-900 placeholder-purple-300 transition-colors"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-pink-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? "Loggar in..." : "Logga in"}
          </button>
        </form>
      </div>
    </div>
  );
}
