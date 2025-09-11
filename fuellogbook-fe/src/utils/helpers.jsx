// small helper utilities
export function truncate(s, n = 120) {
  return s && s.length > n ? s.slice(0, n).trim() + "…" : s;
}

export function formatDate(d) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return d;
  }
}
