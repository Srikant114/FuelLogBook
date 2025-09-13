import React from "react";
import { useThemeContext } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import { LoginBg } from "../../assets";
import { Link } from "react-router-dom";

const Login = () => {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const leftVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  const rightVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const hoverLift = {
    whileHover: { y: -3, boxShadow: "0px 8px 15px rgba(0,0,0,0.1)" },
    transition: { type: "spring", stiffness: 300 },
  };

  return (
    <motion.div
      className={`flex flex-col md:flex-row w-full min-h-screen overflow-hidden ${
        isDark ? "bg-slate-900 text-slate-200" : "bg-white text-gray-900"
      }`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Left Branding Section - hidden on mobile */}
      <motion.div
        className="w-full md:w-1/2 hidden md:flex flex-col items-start justify-center bg-[var(--color-primary-light)] dark:bg-slate-800 overflow-hidden"
        variants={leftVariants}
      >
        <motion.img
          src={LoginBg}
          alt="Login Illustration"
          className="w-full h-auto md:h-full object-cover"
          variants={itemVariants}
        />
      </motion.div>

      {/* Right Login Form Section */}
      <motion.div
        className="w-full md:mt-0 mt-15 md:w-1/2 flex items-center justify-center p-6 md:p-20"
        variants={rightVariants}
      >
        <motion.form
          className={`w-full max-w-md flex flex-col items-center justify-center ${
            isDark ? "text-slate-200" : "text-gray-900"
          }`}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h2 className="text-4xl font-medium mb-2" variants={itemVariants}>
            Sign in
          </motion.h2>
          <motion.p
            className={`text-sm mb-6 ${isDark ? "text-slate-400" : "text-gray-500/90"}`}
            variants={itemVariants}
          >
            Welcome back! Please sign in to continue
          </motion.p>

          {/* Google Login Button */}
          <motion.button
            type="button"
            className={`w-full mb-5 flex items-center justify-center h-12 rounded-full transition ${
              isDark ? "bg-slate-700 hover:bg-slate-600" : "bg-gray-500/10 hover:bg-gray-300"
            }`}
            variants={itemVariants}
            {...hoverLift}
          >
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
              alt="googleLogo"
            />
          </motion.button>

          {/* OR Divider */}
          <motion.div className="flex items-center gap-4 w-full my-5" variants={itemVariants}>
            <div className={`w-full h-px ${isDark ? "bg-slate-700" : "bg-gray-300/90"}`}></div>
            <p className="text-nowrap text-sm">or sign in with email</p>
            <div className={`w-full h-px ${isDark ? "bg-slate-700" : "bg-gray-300/90"}`}></div>
          </motion.div>

          {/* Email Input */}
          <motion.div
            className={`flex items-center w-full h-12 rounded-full overflow-hidden pl-6 gap-2 border mb-4 ${
              isDark ? "border-slate-700 bg-slate-800" : "border-gray-300/60 bg-white"
            }`}
            variants={itemVariants}
            {...hoverLift}
          >
            <svg
              width="16"
              height="11"
              viewBox="0 0 16 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                fill={isDark ? "#CBD5E1" : "#6B7280"}
              />
            </svg>
            <input
              type="email"
              placeholder="Email id"
              className={`bg-transparent outline-none text-sm w-full h-full placeholder-gray-400 ${
                isDark ? "placeholder-slate-400 text-slate-200" : "placeholder-gray-500 text-gray-900"
              }`}
              required
            />
          </motion.div>

          {/* Password Input */}
          <motion.div
            className={`flex items-center w-full h-12 rounded-full overflow-hidden pl-6 gap-2 border mb-4 ${
              isDark ? "border-slate-700 bg-slate-800" : "border-gray-300/60 bg-white"
            }`}
            variants={itemVariants}
            {...hoverLift}
          >
            <input
              type="password"
              placeholder="Password"
              className={`bg-transparent outline-none text-sm w-full h-full placeholder-gray-400 ${
                isDark ? "placeholder-slate-400 text-slate-200" : "placeholder-gray-500 text-gray-900"
              }`}
              required
            />
          </motion.div>

          {/* Remember & Forgot */}
          <motion.div className="w-full flex items-center justify-between mb-4 text-sm" variants={itemVariants}>
            <div className="flex items-center gap-2">
              <input className="h-5" type="checkbox" id="checkbox" />
              <label htmlFor="checkbox">Remember me</label>
            </div>
            <a className="underline" href="#">
              Forgot password?
            </a>
          </motion.div>

          {/* Login Button */}
          <motion.button
            type="submit"
            className={`w-full h-11 rounded-full transition mb-4 ${
              isDark ? "bg-indigo-600 hover:bg-indigo-500 text-white" : "bg-indigo-500 hover:opacity-90 text-white"
            }`}
            variants={itemVariants}
            {...hoverLift}
          >
            Login
          </motion.button>

          <motion.p className="text-sm mt-2" variants={itemVariants}>
            Don’t have an account?{" "}
            <Link className="hover:underline text-indigo-400" to="/register">
              Sign up
            </Link>
          </motion.p>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default Login;
