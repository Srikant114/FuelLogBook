import React, { useState } from "react";
import { useThemeContext } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import { LoginBg as RegisterBg } from "../../assets";

const Register = () => {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";
  const [photoPreview, setPhotoPreview] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

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
          src={RegisterBg}
          alt="Register Illustration"
          className="w-full h-auto md:h-full object-cover"
          variants={itemVariants}
        />
      </motion.div>

      {/* Right Register Form Section */}
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
          <motion.h2 className="text-4xl font-medium mb-1" variants={itemVariants}>
            Create Account
          </motion.h2>
          <motion.p
            className={`text-sm mb-4 ${isDark ? "text-slate-400" : "text-gray-500/90"}`}
            variants={itemVariants}
          >
            Sign up to get started
          </motion.p>

          {/* Photo Upload */}
          <motion.div
            className="flex flex-col items-center justify-center mb-4"
            variants={itemVariants}
          >
            <label className="cursor-pointer">
              <div
                className={`w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center ${
                  isDark ? "border-slate-500" : "border-gray-300"
                }`}
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-500 dark:text-slate-400">Upload</span>
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>
          </motion.div>

          {/* Name Input */}
          <motion.div
            className={`flex items-center w-full h-10 rounded-full overflow-hidden pl-6 gap-2 border mb-4 ${
              isDark ? "border-slate-700 bg-slate-800" : "border-gray-300/60 bg-white"
            }`}
            variants={itemVariants}
            {...hoverLift}
          >
            <input
              type="text"
              placeholder="Full Name"
              className={`bg-transparent outline-none text-sm w-full h-full placeholder-gray-400 ${
                isDark ? "placeholder-slate-400 text-slate-200" : "placeholder-gray-500 text-gray-900"
              }`}
              required
            />
          </motion.div>

          {/* Username Input */}
          <motion.div
            className={`flex items-center w-full h-10 rounded-full overflow-hidden pl-6 gap-2 border mb-4 ${
              isDark ? "border-slate-700 bg-slate-800" : "border-gray-300/60 bg-white"
            }`}
            variants={itemVariants}
            {...hoverLift}
          >
            <input
              type="text"
              placeholder="Username"
              className={`bg-transparent outline-none text-sm w-full h-full placeholder-gray-400 ${
                isDark ? "placeholder-slate-400 text-slate-200" : "placeholder-gray-500 text-gray-900"
              }`}
              required
            />
          </motion.div>

          {/* Email Input */}
          <motion.div
            className={`flex items-center w-full h-10 rounded-full overflow-hidden pl-6 gap-2 border mb-4 ${
              isDark ? "border-slate-700 bg-slate-800" : "border-gray-300/60 bg-white"
            }`}
            variants={itemVariants}
            {...hoverLift}
          >
            <input
              type="email"
              placeholder="Email"
              className={`bg-transparent outline-none text-sm w-full h-full placeholder-gray-400 ${
                isDark ? "placeholder-slate-400 text-slate-200" : "placeholder-gray-500 text-gray-900"
              }`}
              required
            />
          </motion.div>

          {/* Password Input */}
          <motion.div
            className={`flex items-center w-full h-10 rounded-full overflow-hidden pl-6 gap-2 border mb-4 ${
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

          {/* Phone Input */}
          <motion.div
            className={`flex items-center w-full h-10 rounded-full overflow-hidden pl-6 gap-2 border mb-4 ${
              isDark ? "border-slate-700 bg-slate-800" : "border-gray-300/60 bg-white"
            }`}
            variants={itemVariants}
            {...hoverLift}
          >
            <input
              type="tel"
              placeholder="Phone (optional)"
              className={`bg-transparent outline-none text-sm w-full h-full placeholder-gray-400 ${
                isDark ? "placeholder-slate-400 text-slate-200" : "placeholder-gray-500 text-gray-900"
              }`}
            />
          </motion.div>

          {/* Register Button */}
          <motion.button
            type="submit"
            className={`w-full h-11 rounded-full transition mb-2 ${
              isDark ? "bg-indigo-600 hover:bg-indigo-500 text-white" : "bg-indigo-500 hover:opacity-90 text-white"
            }`}
            variants={itemVariants}
            {...hoverLift}
          >
            Register
          </motion.button>

          <motion.p className="text-sm mt-1" variants={itemVariants}>
            Already have an account?{" "}
            <a className="hover:underline text-indigo-400" href="/login">
              Sign in
            </a>
          </motion.p>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default Register;
