// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../utils/CallApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

/**
 * AuthContext
 * - Checks token on mount by calling GET /api/auth/me
 * - Exposes user, loading, login(), logout()
 *
 * Usage:
 * const { user, login, logout, loading, isAuthenticated } = useAuth();
 */

const AuthStateContext = createContext(null);
const AuthActionsContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // user: null | { ...user fields }
  const [user, setUser] = useState(null);
  // loading: true while validating token on app start
  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(user);

  // read token from storage: prefer localStorage then sessionStorage
  const readToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token") || sessionStorage.getItem("token") || null;
  };

  // Save token to storage choosing persistence (remember)
  const saveToken = (token, remember = true) => {
    if (typeof window === "undefined") return;
    if (remember) {
      localStorage.setItem("token", token);
      sessionStorage.removeItem("token");
    } else {
      sessionStorage.setItem("token", token);
      localStorage.removeItem("token");
    }
  };

  // Clear stored token + user
  const clearAuth = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUser(null);
  };

  // Logout helper (call from UI)
  const logout = (opts = {}) => {
    clearAuth();
    toast.success("Logged out");
    if (opts.redirect !== false) {
      navigate("/login");
    }
  };

  // Login helper: save token, fetch profile, set user
  // resData: { token, ... optionally user }
  const login = async (resData = {}, remember = true) => {
    const token = resData.token;
    if (!token) throw new Error("No token provided");
    saveToken(token, remember);

    // Fetch profile
    try {
      const prof = await api.get("/api/auth/me");
      if (prof && prof.success) {
        setUser(prof.data);
      } else {
        // fallback: set basic info from resData
        setUser(resData.user || null);
      }
    } catch (err) {
      console.warn("login: failed to fetch profile", err);
      setUser(resData.user || null);
    }
  };

  // Validate token on mount: if token exists, attempt to fetch /me
  useEffect(() => {
    let mounted = true;
    const token = readToken();
    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }

    // attempt to fetch profile
    (async () => {
      try {
        const prof = await api.get("/api/auth/me");
        if (!mounted) return;
        if (prof && prof.success) {
          setUser(prof.data);
        } else {
          clearAuth();
          setUser(null);
        }
      } catch (err) {
        // token invalid/expired or network error
        console.warn("Auth validation failed:", err);
        clearAuth();
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const valueState = { user, loading, isAuthenticated };
  const valueActions = { login, logout, saveToken };

  return (
    <AuthStateContext.Provider value={valueState}>
      <AuthActionsContext.Provider value={valueActions}>{children}</AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  );
};

export const useAuth = () => {
  const state = useContext(AuthStateContext);
  const actions = useContext(AuthActionsContext);
  if (state === null || actions === null) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return { ...state, ...actions };
};
