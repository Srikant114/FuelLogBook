// src/api/client.js
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"; // match backend port

/**
 * Central axios instance for the app.
 * - Supports both JWT and cookie-based sessions
 * - Attaches Authorization header if token is in localStorage
 * - Sends cookies automatically (withCredentials: true)
 */
const client = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // ✅ allow cookies
});

// Attach token from localStorage if available
client.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      /* ignore */
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Handle global 401s
client.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      console.warn("401 Unauthorized — user not logged in or token expired");
      // Optionally trigger logout or redirect
      // window.dispatchEvent(new Event("app:logout"));
    }
    return Promise.reject(error);
  }
);

// Helper to set token
export function setAuthToken(token) {
  if (token) {
    localStorage.setItem("token", token);
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete client.defaults.headers.common.Authorization;
  }
}

export default client;
