// src/components/Auth/AuthModal.jsx
import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useAuth } from "../../contexts/AuthContext";

/**
 * Auth modal — shows login by default, can toggle to register.
 * If you have a ModalShell component in your project you can swap it easily.
 */
export default function AuthModal({ open = true }) {
  const { user } = useAuth();
  const [mode, setMode] = useState("login"); // 'login' | 'register'

  // If user exists, don't show modal
  if (!open || user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="text-lg font-semibold">{mode === "login" ? "Sign in to FuelLogBook" : "Create an account"}</div>
          <div className="text-sm text-gray-500">Secure admin access</div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              {mode === "login"
                ? "Enter your credentials to continue."
                : "Create your account. You can switch back to login anytime."}
            </div>

            {mode === "login" ? <LoginForm /> : <RegisterForm />}

            <div className="text-xs text-gray-500">
              By continuing you agree to using this app for authorized purposes only.
            </div>
          </div>

          {/* Right side: marketing / quick instructions */}
          <div className="hidden md:flex flex-col justify-center p-4 bg-[var(--panel)] rounded-lg">
            <h4 className="font-semibold mb-2">{mode === "login" ? "New here?" : "Already a member?"}</h4>
            <p className="text-sm text-[var(--muted)] mb-4">
              {mode === "login"
                ? "Register an account to manage vehicles and fuel logs."
                : "Sign in to manage your fleet and view reports."}
            </p>

            <div className="mt-auto">
              <button
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="w-full px-4 py-2 rounded-md border bg-white text-sm"
              >
                {mode === "login" ? "Create account" : "Back to login"}
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 text-xs text-center text-gray-400 border-t">
          Need help? Contact your administrator.
        </div>
      </div>
    </div>
  );
}
