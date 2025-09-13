// src/components/Auth/RegisterForm.jsx
import React, { useState } from "react";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

export default function RegisterForm() {
  const { register, authError } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (password.length < 6) {
      setError("Password should be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    const res = await register({ name, email, password });
    setSubmitting(false);
    if (!res.success) {
      setError(res.error || "Registration failed");
    } else {
      setSuccessMessage("Account created — you are now signed in.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error || authError ? <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error || authError}</div> : null}
      {successMessage ? <div className="text-sm text-green-700 bg-green-50 p-2 rounded">{successMessage}</div> : null}

      <div>
        <label className="text-xs font-medium">Full name</label>
        <div className="mt-1 relative">
          <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-md border px-3 py-2 pr-10" placeholder="Your name" />
          <div className="absolute right-3 top-2 text-gray-400"><FiUser /></div>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium">Email</label>
        <div className="mt-1 relative">
          <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" className="w-full rounded-md border px-3 py-2 pr-10" placeholder="you@example.com" />
          <div className="absolute right-3 top-2 text-gray-400"><FiMail /></div>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium">Password</label>
        <div className="mt-1 relative">
          <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" className="w-full rounded-md border px-3 py-2 pr-10" placeholder="••••••••" />
          <div className="absolute right-3 top-2 text-gray-400"><FiLock /></div>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium">Confirm password</label>
        <input value={confirm} onChange={(e) => setConfirm(e.target.value)} required type="password" className="mt-1 w-full rounded-md border px-3 py-2" placeholder="Repeat password" />
      </div>

      <div>
        <button type="submit" disabled={submitting} className="w-full px-4 py-2 rounded-md bg-[var(--accent)] text-white font-medium">
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </div>
    </form>
  );
}
