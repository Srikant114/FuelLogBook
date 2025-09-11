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


/* ---------- Fuel log compute helpers ---------- */

/**
 * Compute litres from amount and price per litre.
 * Returns Number (rounded to 3 decimal places) or 0.
 */
export function computeLitres(amount, pricePerL) {
  const a = Number(amount) || 0;
  const p = Number(pricePerL) || 0;
  if (p <= 0) return 0;
  return Math.round((a / p) * 1000) / 1000;
}

/**
 * Compute mileage (km per litre) if tripDistance and litres available.
 * Returns Number rounded to 2 decimals or 0.
 */
export function computeMileage(tripDistance, litres) {
  const d = Number(tripDistance) || 0;
  const l = Number(litres) || 0;
  if (l <= 0) return 0;
  return Math.round((d / l) * 100) / 100;
}

/**
 * Running cost per km (amount / tripDistance).
 * Returns Number rounded to 2 decimals or 0.
 */
export function computeRunningCost(amount, tripDistance) {
  const a = Number(amount) || 0;
  const d = Number(tripDistance) || 0;
  if (d <= 0) return 0;
  return Math.round((a / d) * 100) / 100;
}