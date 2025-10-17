// src/pages/auth/Login.jsx
import React, { useState } from "react";
import { useThemeContext } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import { LoginBg } from "../../assets"; // adjust path if needed
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../utils/CallApi";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

/**
 * Login page integrated with AuthContext.login()
 * On successful login, calls auth.login(res.data, remember)
 * so AuthContext user state updates immediately.
 */

const Login = () => {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const auth = useAuth(); // <<-- use auth context

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* Framer motion variants */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const leftVariants = { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7 } } };
  const rightVariants = { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7 } } };
  const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

  // small hover lift (used on buttons)
  const hoverLift = {
    whileHover: { y: -3, boxShadow: "0px 8px 15px rgba(0,0,0,0.08)" },
    transition: { type: "spring", stiffness: 300 },
  };

  // Basic validation
  const validate = () => {
    if (!email.trim()) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email";
    if (!password) return "Password is required";
    return null;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      toast.error(v);
      return;
    }

    setLoading(true);
    const tid = toast.loading("Signing in...");
    try {
      // Login call
      const res = await api.post("/api/auth/login", { email: email.trim(), password });

      if (!res || !res.success) {
        toast.error((res && res.message) || "Login failed", { id: tid });
        setLoading(false);
        return;
      }

      // Use AuthContext.login to update context immediately
      // auth.login expects { token, ... } shape (it will fetch /me internally)
      const token = res.data?.token;
      if (!token) {
        toast.error("No token received from server", { id: tid });
        setLoading(false);
        return;
      }

      try {
        // this will save token in storage and fetch /api/auth/me to set user in context
        await auth.login({ token }, remember);
      } catch (err) {
        // If fetching profile failed, still save token and set minimal user
        // but we want to notify user
        console.warn("Auth login: failed to fetch profile", err);
        toast.error("Signed in but failed to load profile", { id: tid });
      }

      toast.success(res.message || "Login successful", { id: tid });

      // Redirect to admin dashboard
      // Because AuthContext now has user, ProtectedRoute will allow admin pages
      setTimeout(() => navigate("/admin"), 200);
    } catch (err) {
      console.error("Login error:", err);
      const msg = err?.message || "Login failed";
      toast.error(msg, { id: tid });
    } finally {
      setLoading(false);
    }
  };

  // Simulated Google login handler (placeholder)
  const handleGoogle = () => {
    toast("Google Sign-in is not wired in this demo.", { icon: "⚠️" });
  };

  return (
    <>

      <motion.div
        className={`flex flex-col md:flex-row w-full min-h-screen overflow-hidden bg-theme dark:bg-theme-dark text-theme dark:text-white`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Left branding illustration (hidden on mobile) */}
        <motion.div className="w-full md:w-1/2 hidden md:flex flex-col items-start justify-center overflow-hidden" variants={leftVariants}>
          <img src={LoginBg} alt="Login illustration" className="w-full h-auto md:h-full object-cover" />
        </motion.div>

        {/* Right form area */}
        <motion.div className="w-full md:mt-0 mt-12 md:w-1/2 flex items-center justify-center p-6 md:p-20" variants={rightVariants}>
          <motion.form onSubmit={handleSubmit} className="w-full max-w-md" initial="hidden" animate="visible" variants={containerVariants}>
            <motion.h2 className="text-3xl md:text-4xl font-semibold mb-2 text-theme dark:text-white" variants={itemVariants}>
              Sign in
            </motion.h2>

            <motion.p className="text-sm mb-6 text-theme-light dark:text-theme-light" variants={itemVariants}>
              Welcome back! Please sign in to continue.
            </motion.p>

            {/* Google sign-in button (visual only) */}
            <motion.button
              type="button"
              onClick={handleGoogle}
              className={`w-full mb-5 flex items-center justify-center h-12 rounded-full transition ${isDark ? "bg-slate-700 hover:bg-slate-600" : "bg-gray-500/10 hover:bg-gray-300"}`}
              variants={itemVariants}
              {...hoverLift}
            >
              <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg" alt="googleLogo" />
            </motion.button>

            {/* OR divider */}
            <motion.div className="flex items-center gap-4 w-full my-5" variants={itemVariants}>
              <div className={`w-full h-px ${isDark ? "bg-slate-700" : "bg-gray-300/90"}`}></div>
              <p className="text-nowrap text-sm text-theme-light dark:text-theme-light">or sign in with email</p>
              <div className={`w-full h-px ${isDark ? "bg-slate-700" : "bg-gray-300/90"}`}></div>
            </motion.div>

            {/* Email input */}
            <motion.div className={`flex items-center w-full h-12 rounded-full overflow-hidden pl-4 pr-3 gap-2 border mb-4 ${isDark ? "border-slate-700 bg-slate-800" : "border-gray-300/60 bg-white"}`} variants={itemVariants} {...hoverLift}>
              <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill={isDark ? "#CBD5E1" : "#6B7280"} />
              </svg>
              <input
                type="email"
                placeholder="Email id"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                className={`bg-transparent outline-none text-sm w-full h-full placeholder:text-[--placeholder] ${isDark ? "text-slate-200" : "text-gray-900"}`}
                required
                autoComplete="email"
              />
            </motion.div>

            {/* Password input with eye toggle */}
            <motion.div className={`relative flex items-center w-full h-12 rounded-full overflow-hidden pl-4 pr-3 gap-2 border mb-4 ${isDark ? "border-slate-700 bg-slate-800" : "border-gray-300/60 bg-white"}`} variants={itemVariants} {...hoverLift}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`bg-transparent outline-none text-sm w-full h-full placeholder:text-[--placeholder] ${isDark ? "text-slate-200" : "text-gray-900"}`}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </motion.div>

            {/* Remember & Forgot row */}
            <motion.div className="w-full flex items-center justify-between mb-4 text-sm" variants={itemVariants}>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4" />
                <span className={`${isDark ? "text-theme-light" : "text-theme-light"}`}>Remember me</span>
              </label>
              <Link to="/forgot-password" className="underline text-theme-light dark:text-theme-light">Forgot password?</Link>
            </motion.div>

            {/* Login button */}
            <motion.button
              type="submit"
              className={`w-full h-11 rounded-full transition mb-4 ${loading ? "opacity-70 cursor-not-allowed" : "bg-primary hover:bg-primary-dark"} text-white`}
              variants={itemVariants}
              {...hoverLift}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </motion.button>

            {/* Sign up link */}
            <motion.p className="text-sm mt-2 text-center" variants={itemVariants}>
              Don’t have an account?{" "}
              <Link className="hover:underline text-primary" to="/register">
                Sign up
              </Link>
            </motion.p>
          </motion.form>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Login;
