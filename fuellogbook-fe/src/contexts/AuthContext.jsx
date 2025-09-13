// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import client, { setAuthToken } from "../api/client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true); // while checking on load
  const [authError, setAuthError] = useState(null);

  // whenever token changes set axios header and localStorage
  useEffect(() => {
    if (token) {
      setAuthToken(token);
    } else {
      setAuthToken(null);
    }
  }, [token]);

  // try to fetch profile on mount if token present or cookie session may exist
  useEffect(() => {
    let mounted = true;
    async function init() {
      setLoading(true);
      try {
        // try to get profile via cookie/session or token
        const res = await client.get("/api/auth/me");
        const p = res?.data?.data ?? res?.data ?? null;
        if (mounted) setUser(p);
      } catch (err) {
        // Not authenticated or error — leave user null
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();
    return () => { mounted = false; };
  }, []);

  // login supports JWT or cookie session
  async function login({ email, password }) {
    setAuthError(null);
    setLoading(true);
    try {
      const res = await client.post("/api/auth/login", { email, password });

      // try several shapes for token
      const tokenFromServer =
        res?.data?.token ??
        res?.data?.data?.token ??
        res?.data?.data?.accessToken ??
        null;

      if (tokenFromServer) {
        // JWT flow
        localStorage.setItem("token", tokenFromServer);
        setTokenState(tokenFromServer);
        setAuthToken(tokenFromServer);
        // fetch profile with header auth
        const profileRes = await client.get("/api/auth/me");
        const profile = profileRes?.data?.data ?? profileRes?.data ?? null;
        setUser(profile);
        setLoading(false);
        return { success: true, user: profile };
      }

      // If no token returned assume cookie session; fetch profile (cookies sent via withCredentials)
      try {
        const profileRes = await client.get("/api/auth/me");
        const profile = profileRes?.data?.data ?? profileRes?.data ?? null;
        setUser(profile);
        setLoading(false);
        return { success: true, user: profile };
      } catch (err) {
        setLoading(false);
        setAuthError(err?.response?.data?.message ?? err.message);
        return { success: false, error: err?.response?.data?.message ?? err.message };
      }
    } catch (err) {
      setLoading(false);
      setAuthError(err?.response?.data?.message ?? err.message);
      return { success: false, error: err?.response?.data?.message ?? err.message };
    }
  }

  // register: calls backend register endpoint then auto-login / fetch profile
  async function register({ name, email, password }) {
    setAuthError(null);
    setLoading(true);
    try {
      const res = await client.post("/api/auth/register", { name, email, password });
      // If backend returns token, use it
      const tokenFromServer =
        res?.data?.token ??
        res?.data?.data?.token ??
        res?.data?.data?.accessToken ??
        null;

      if (tokenFromServer) {
        localStorage.setItem("token", tokenFromServer);
        setTokenState(tokenFromServer);
        setAuthToken(tokenFromServer);
        const profileRes = await client.get("/api/auth/me");
        const profile = profileRes?.data?.data ?? profileRes?.data ?? null;
        setUser(profile);
        setLoading(false);
        return { success: true, user: profile };
      }

      // Otherwise try cookie session flow: fetch profile
      const profileRes = await client.get("/api/auth/me");
      const profile = profileRes?.data?.data ?? profileRes?.data ?? null;
      setUser(profile);
      setLoading(false);
      return { success: true, user: profile };
    } catch (err) {
      setLoading(false);
      setAuthError(err?.response?.data?.message ?? err.message);
      return { success: false, error: err?.response?.data?.message ?? err.message };
    }
  }

  function logout() {
    // optionally call backend logout endpoint if present
    try {
      client.post("/api/auth/logout").catch(() => {});
    } catch (e) {}
    localStorage.removeItem("token");
    setTokenState(null);
    setUser(null);
    setAuthToken(null);
  }

  const value = {
    user,
    token,
    loading,
    authError,
    login,
    register,
    logout,
    setToken: (t) => { localStorage.setItem("token", t); setTokenState(t); },
    fetchProfile: async () => {
      try {
        const res = await client.get("/api/auth/me");
        const profile = res?.data?.data ?? res?.data ?? null;
        setUser(profile);
        return profile;
      } catch (err) {
        setUser(null);
        throw err;
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
