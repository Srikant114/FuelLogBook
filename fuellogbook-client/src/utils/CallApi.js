// src/utils/CallApi.js
// Centralized fetch wrapper that prefixes a BASE_URL (configurable via REACT_APP_API_URL)
// Usage: api.post("/api/auth/register", payload)

const BASE = (typeof process !== "undefined" && import.meta.env.VITE_API_URL) || "http://localhost:5000";

const defaultHeaders = () => ({
  "Content-Type": "application/json",
});

const getAuthHeader = () => {
  if (typeof window === "undefined") return {};
  // check localStorage then sessionStorage
  const token = localStorage.getItem("token") || sessionStorage.getItem("token") || null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function callApi(method, path, { body = null, headers = {}, query = null, rawResponse = false } = {}) {
  try {
    // build URL: if path starts with http(s) -> use it, else prefix BASE
    let url = path && (path.startsWith("http://") || path.startsWith("https://")) ? path : `${BASE}${path}`;

    if (query && typeof query === "object") {
      const qs = new URLSearchParams(query).toString();
      if (qs) url += (url.includes("?") ? "&" : "?") + qs;
    }

    const init = {
      method,
      headers: {
        ...defaultHeaders(),
        ...getAuthHeader(),
        ...headers,
      },
    };

    if (body && body instanceof FormData) {
      // let browser set Content-Type including boundary
      delete init.headers["Content-Type"];
      init.body = body;
    } else if (body != null) {
      init.body = JSON.stringify(body);
    }

    const res = await fetch(url, init);

    if (rawResponse) {
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `Request failed: ${res.status}`);
      }
      return res;
    }

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
      const msg =
        (data && (data.message || data.error || data.msg)) ||
        data ||
        `Request failed: ${res.status}`;
      const error = new Error(msg);
      error.status = res.status;
      error.body = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err instanceof SyntaxError) {
      const e = new Error("Invalid JSON response");
      e.cause = err;
      throw e;
    }
    throw err;
  }
}

export const api = {
  get: (path, opts = {}) => callApi("GET", path, opts),
  post: (path, body, opts = {}) => callApi("POST", path, { ...opts, body }),
  put: (path, body, opts = {}) => callApi("PUT", path, { ...opts, body }),
  del: (path, opts = {}) => callApi("DELETE", path, opts),
};
