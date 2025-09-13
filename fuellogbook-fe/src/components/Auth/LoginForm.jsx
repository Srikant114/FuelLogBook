// src/components/Auth/LoginForm.jsx
import React, { useState } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginForm() {
  const { login, loading, authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await login({ email, password });
    setSubmitting(false);
    if (!res.success) {
      setError(res.error || "Login failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error || authError ? (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error || authError}</div>
      ) : null}

      <div>
        <label className="text-xs font-medium">Email</label>
        <div className="mt-1 relative">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="w-full rounded-md border px-3 py-2 pr-10"
            placeholder="you@example.com"
          />
          <div className="absolute right-3 top-2 text-gray-400">
            <FiMail />
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium">Password</label>
        <div className="mt-1 relative">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            className="w-full rounded-md border px-3 py-2 pr-10"
            placeholder="••••••••"
          />
          <div className="absolute right-3 top-2 text-gray-400">
            <FiLock />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="rounded" />
          <span className="text-xs text-[var(--muted)]">Remember me</span>
        </label>

        <button type="button" className="text-xs text-[var(--muted)] underline">Forgot?</button>
      </div>

      <div>
        <button
          type="submit"
          disabled={submitting || loading}
          className="w-full px-4 py-2 rounded-md bg-[var(--accent)] text-white font-medium"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </div>
    </form>
  );
}
