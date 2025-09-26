// src/pages/Register.jsx
import React, { useEffect, useRef, useState } from "react";
import { useThemeContext } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import { LoginBg as RegisterBg } from "../../assets"; // adjust if your asset path differs
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../utils/CallApi";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, Check, XCircle } from "lucide-react";

/**
 * Register page with client-side image compression
 *
 * - compressImage(file, opts) compresses/resize the selected image before upload
 * - compress settings: maxWidth/maxHeight and quality are configurable
 * - keeps username check, show/hide password, confirm password features intact
 */

/* ---------- Image compression helper ----------
 Uses createImageBitmap + canvas for better performance.
 Returns a File (Blob with filename) so FormData.append works the same.
*/
async function compressImage(file, { maxWidth = 1200, maxHeight = 1200, quality = 0.82, mimeType = "image/jpeg" } = {}) {
  if (!file) return null;

  // If file is already small and likely OK, skip compression
  // e.g., under 100KB, and smaller than max dimensions; tweak thresholds as needed
  const SKIP_THRESHOLD_BYTES = 100 * 1024; // 100 KB

  // read image natural size
  const imgBitmap = await createImageBitmap(file);

  const originalWidth = imgBitmap.width;
  const originalHeight = imgBitmap.height;

  // compute target dimensions while preserving aspect ratio
  let targetWidth = originalWidth;
  let targetHeight = originalHeight;

  if (originalWidth > maxWidth || originalHeight > maxHeight) {
    const widthRatio = maxWidth / originalWidth;
    const heightRatio = maxHeight / originalHeight;
    const ratio = Math.min(widthRatio, heightRatio);
    targetWidth = Math.round(originalWidth * ratio);
    targetHeight = Math.round(originalHeight * ratio);
  }

  // If original already smaller than target AND file size small enough, skip
  if (originalWidth <= targetWidth && originalHeight <= targetHeight && file.size <= SKIP_THRESHOLD_BYTES) {
    return file;
  }

  // Create a canvas of target size and draw
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");

  // draw the bitmap
  ctx.drawImage(imgBitmap, 0, 0, targetWidth, targetHeight);

  // convert canvas -> Blob
  const blob = await new Promise((resolve) => {
    canvas.toBlob(
      (b) => resolve(b),
      mimeType,
      quality // 0..1
    );
  });

  if (!blob) {
    // fallback: return original file
    return file;
  }

  // Create a File from the blob so it keeps a filename
  const ext = mimeType === "image/png" ? "png" : "jpg";
  const newName = (file.name || "upload").replace(/\.[^/.]+$/, "") + `-compressed.${ext}`;
  const compressedFile = new File([blob], newName, { type: mimeType });

  // free resources
  imgBitmap.close?.();

  return compressedFile;
}
/* ------------------------------------------------ */


const CHECK_USERNAME_URL = (username) => `/api/auth/check-username?username=${encodeURIComponent(username)}`;

const Register = () => {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  // form state
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  // image preview/file
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  // UI states
  const [loading, setLoading] = useState(false);

  // password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // username availability states: 'idle' | 'checking' | 'available' | 'taken' | 'error'
  const [usernameStatus, setUsernameStatus] = useState("idle");
  const usernameAbortRef = useRef(null);
  const usernameDebounceRef = useRef(null);
  const lastCheckedRef = useRef(""); // to prevent redundant checks

  /* -------------------------
     Motion variants (FRAMER)
     ------------------------- */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const leftVariants = { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7 } } };
  const rightVariants = { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7 } } };
  const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

  // small UI lift on hover
  const hoverLift = {
    whileHover: { y: -3, boxShadow: "0px 10px 18px rgba(0,0,0,0.06)" },
    transition: { type: "spring", stiffness: 300 },
  };

  /* -------------------------
     Helpers
     ------------------------- */
  const update = (key) => (e) => setForm((s) => ({ ...s, [key]: e.target.value }));

  // image handler: compress and set preview + file
  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPhotoFile(null);
      setPhotoPreview(null);
      return;
    }

    // basic client-side validation: type & size limit
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (jpg, png, etc.)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      // reject extremely large files early (10MB)
      toast.error("Image too large — maximum allowed 10MB. Please resize your image.");
      return;
    }

    // Show instant preview from original file while compression is underway
    setPhotoPreview(URL.createObjectURL(file));

    try {
      // compress the image with desired settings
      // tweak maxWidth/maxHeight/quality to taste. Good balance: 1200px & 0.82 quality.
      const compressed = await compressImage(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.82, mimeType: "image/jpeg" });

      // if compressImage returned null or original, still set the appropriate file
      const finalFile = compressed || file;

      // Set File object to be appended to FormData on submit
      setPhotoFile(finalFile);

      // Update the preview to compressed blob URL (revoke previous objectURL to avoid leaks)
      try {
        if (photoPreview) URL.revokeObjectURL(photoPreview);
      } catch (err) { /* ignore */ }

      setPhotoPreview(URL.createObjectURL(finalFile));
    } catch (err) {
      console.error("Image compression failed:", err);
      toast.error("Image processing failed. Uploading original image instead.");
      setPhotoFile(file);
      // preview is already set
    }
  };

  // username availability check (debounced + abortable)
  useEffect(() => {
    const username = (form.username || "").trim();

    // reset if empty or too short
    if (!username || username.length < 3) {
      if (usernameDebounceRef.current) {
        clearTimeout(usernameDebounceRef.current);
        usernameDebounceRef.current = null;
      }
      if (usernameAbortRef.current) {
        usernameAbortRef.current.abort();
        usernameAbortRef.current = null;
      }
      setUsernameStatus("idle");
      lastCheckedRef.current = "";
      return;
    }

    // prevent re-checking same username repeatedly
    if (username === lastCheckedRef.current) {
      return;
    }

    // clear existing debounce timer
    if (usernameDebounceRef.current) clearTimeout(usernameDebounceRef.current);

    setUsernameStatus("checking");
    usernameDebounceRef.current = setTimeout(() => {
      // abort previous request if any
      if (usernameAbortRef.current) {
        usernameAbortRef.current.abort();
      }
      const controller = new AbortController();
      usernameAbortRef.current = controller;

      api.get(CHECK_USERNAME_URL(username), { rawResponse: false, headers: {}, query: null })
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(text || `Status ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data && typeof data.available !== "undefined") {
            setUsernameStatus(data.available ? "available" : "taken");
            if (data.available) lastCheckedRef.current = username;
            else lastCheckedRef.current = "";
          } else if (data && data.success && typeof data.available !== "undefined") {
            setUsernameStatus(data.available ? "available" : "taken");
            if (data.available) lastCheckedRef.current = username;
            else lastCheckedRef.current = "";
          } else {
            setUsernameStatus("error");
            lastCheckedRef.current = "";
          }
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          console.error("Username check error:", err);
          setUsernameStatus("error");
          lastCheckedRef.current = "";
        })
        .finally(() => {
          usernameAbortRef.current = null;
        });
    }, 600); // 600ms debounce

    return () => {
      if (usernameDebounceRef.current) clearTimeout(usernameDebounceRef.current);
    };
  }, [form.username]);

  // client-side validation
  const validate = () => {
    if (!form.name.trim()) return "Full name is required";
    if (!form.email.trim()) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Enter a valid email address";
    if (!form.password || form.password.length < 6) return "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    if (usernameStatus === "taken") return "Username is already taken";
    return null;
  };

  // submit handler — uses CallApi helper which supports FormData
  const handleSubmit = async (e) => {
    e.preventDefault();

    const v = validate();
    if (v) {
      toast.error(v);
      return;
    }

    setLoading(true);
    const tid = toast.loading("Creating account...");

    try {
      // Build FormData — include compressed photoFile if present
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("email", form.email.trim());
      fd.append("password", form.password);
      if (form.username) fd.append("username", form.username.trim());
      if (form.phone) fd.append("phone", form.phone.trim());
      if (photoFile) fd.append("photo", photoFile); // backend expects field name 'photo'

      // POST to backend. CallApi will prefix with BASE_URL (http://localhost:5000) by default
      const res = await api.post("/api/auth/register", fd);

      if (res && res.success) {
        toast.success(res.message || "Registered successfully", { id: tid });

        // Option: store token to auto-login (we don't auto-login here per instruction)
        // if (res.data?.token) localStorage.setItem("token", res.data.token);

        setTimeout(() => navigate("/login"), 700);
      } else {
        toast.error((res && res.message) || "Registration failed", { id: tid });
      }
    } catch (err) {
      const msg = err?.message || (err?.body && err.body.message) || "Registration failed";
      toast.error(msg, { id: tid });
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------
     JSX
     ------------------------- */
  return (
    <>
      <Toaster position="top-right" />

      <motion.div
        className={`flex flex-col md:flex-row w-full min-h-screen overflow-hidden bg-theme dark:bg-theme-dark text-theme dark:text-white`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Left illustration */}
        <motion.div className="w-full md:w-1/2 hidden md:flex items-start justify-center overflow-hidden" variants={leftVariants}>
          <img src={RegisterBg} alt="Register illustration" className="w-full h-auto md:h-full object-cover" />
        </motion.div>

        {/* Right form */}
        <motion.div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-20" variants={rightVariants}>
          <motion.form onSubmit={handleSubmit} className="w-full max-w-md" aria-labelledby="register-heading" variants={containerVariants}>
            <motion.h2 id="register-heading" className="text-3xl md:text-4xl font-semibold mb-1 text-theme dark:text-white" variants={itemVariants}>
              Create Account
            </motion.h2>

            <motion.p className="text-sm mb-6 text-theme-light dark:text-theme-light" variants={itemVariants}>
              Sign up to get started — a free-tier member account will be created by default.
            </motion.p>

            {/* Photo upload */}
            <motion.div className="flex flex-col items-center justify-center mb-4" variants={itemVariants}>
              <label htmlFor="photo-input" className="cursor-pointer">
                <div className={`w-20 h-20 rounded-full overflow-hidden border-2 flex items-center justify-center ${isDark ? "border-slate-600 bg-slate-800" : "border-gray-300 bg-white"}`} aria-hidden="true">
                  {photoPreview ? <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" /> : <span className={`text-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}>Upload</span>}
                </div>
              </label>

              <input id="photo-input" name="photo" type="file" accept="image/*" onChange={handlePhotoChange} className="sr-only" aria-label="Upload profile photo" />
            </motion.div>

            {/* Inputs */}
            <motion.div className="grid grid-cols-1 gap-3" variants={itemVariants}>
              <input name="name" type="text" value={form.name} onChange={update("name")} placeholder="Full name" className="w-full rounded-md px-4 py-2 border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white placeholder:text-[--placeholder]" required aria-required="true" />

              {/* Username + inline status inside input (single row) */}
              <div className="relative flex items-center">
                <input name="username" type="text" value={form.username} onChange={update("username")} placeholder="Username (min 3 chars)" className="w-full rounded-md px-4 pr-10 py-2 border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white placeholder:text-[--placeholder]" aria-describedby="username-help" />
                <div className="absolute right-3 flex items-center">
                  {usernameStatus === "checking" && (
                    <svg className="animate-spin h-4 w-4 text-theme-light dark:text-theme-light" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  )}
                  {usernameStatus === "available" && <Check size={18} className="text-green-600" />}
                  {usernameStatus === "taken" && <XCircle size={18} className="text-red-600" />}
                  {usernameStatus === "error" && <XCircle size={18} className="text-yellow-500" />}
                </div>
              </div>

              <div id="username-help" className="mt-1 text-xs">
                {usernameStatus === "available" && <span className="text-green-600">Username available</span>}
                {usernameStatus === "taken" && <span className="text-red-600">Username already taken</span>}
                {usernameStatus === "checking" && <span className="text-theme-light dark:text-theme-light">Checking availability…</span>}
                {usernameStatus === "error" && <span className="text-yellow-500">Could not verify (server error)</span>}
                {usernameStatus === "idle" && <span className="text-theme-light dark:text-theme-light">Optional — choose a username</span>}
              </div>

              <input name="email" type="email" value={form.email} onChange={update("email")} placeholder="Email" className="w-full rounded-md px-4 py-2 border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white placeholder:text-[--placeholder]" required />

              {/* Password with eye toggle */}
              <div className="relative">
                <input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={update("password")} placeholder="Password (min 6 chars)" className="w-full rounded-md px-4 py-2 border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white placeholder:text-[--placeholder]" required />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Confirm password with eye toggle */}
              <div className="relative">
                <input name="confirmPassword" type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={update("confirmPassword")} placeholder="Confirm password" className="w-full rounded-md px-4 py-2 border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white placeholder:text-[--placeholder]" required />
                <button type="button" onClick={() => setShowConfirm((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded" aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}>
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {form.confirmPassword.length > 0 && form.password !== form.confirmPassword && <div className="text-xs text-red-600">Passwords do not match</div>}

              <input name="phone" type="tel" value={form.phone} onChange={update("phone")} placeholder="Phone (optional)" className="w-full rounded-md px-4 py-2 border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white placeholder:text-[--placeholder]" />
            </motion.div>

            <motion.div className="mt-4" variants={itemVariants}>
              <motion.button type="submit" className={`w-full py-2 rounded-md text-white ${loading ? "opacity-70 cursor-not-allowed" : "bg-primary hover:bg-primary-dark"}`} disabled={loading} {...hoverLift} aria-busy={loading}>
                {loading ? "Creating account..." : "Create account"}
              </motion.button>
            </motion.div>

            <motion.div className="mt-4 text-sm text-center text-theme-light dark:text-theme-light" variants={itemVariants}>
              Already have an account? <Link to="/login" className="text-primary underline">Sign in</Link>
            </motion.div>
          </motion.form>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Register;
