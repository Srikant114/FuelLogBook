// src/pages/Reports.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { computeLitres, computeMileage, computeRunningCost, formatDate } from "../utils/helpers" ;
import { FiDownload } from "react-icons/fi";

/**
 * Reports page
 * - drop-in page showing aggregated stats and charts
 * - export visible rows to Excel (xlsx)
 *
 * This file uses sample data (replace with API data).
 */

/* ---------- sample vehicles + logs (replace with real data) ---------- */
const sampleVehicles = [
  { id: "v1", name: "Royal Enfield Hunter 350", make: "Royal Enfield" },
  { id: "v2", name: "Toyota Innova Crysta", make: "Toyota" },
  { id: "v3", name: "Tesla Model 3", make: "Tesla" },
];

const sampleLogs = [
  // various dates across months & years for demonstration
  { id: "l1", vehicle: { id: "v1", name: "Hunter 350" }, date: "2024-01-10", amount: 800, pricePerL: 100, tripDistance: 180, odometer: 10000, notes: "Commute", fuelType: "Petrol" },
  { id: "l2", vehicle: { id: "v1", name: "Hunter 350" }, date: "2024-02-08", amount: 900, pricePerL: 100, tripDistance: 210, odometer: 10200, notes: "Weekend ride", fuelType: "Petrol" },
  { id: "l3", vehicle: { id: "v2", name: "Innova Crysta" }, date: "2024-02-22", amount: 3500, pricePerL: 110, tripDistance: 500, odometer: 44000, notes: "Intercity", fuelType: "Diesel" },
  { id: "l4", vehicle: { id: "v3", name: "Tesla Model 3" }, date: "2024-03-01", amount: 0, pricePerL: 0, tripDistance: 120, odometer: 5000, notes: "EV charging", fuelType: "EV" },
  { id: "l5", vehicle: { id: "v1", name: "Hunter 350" }, date: "2024-04-12", amount: 950, pricePerL: 105, tripDistance: 220, odometer: 10450, notes: "Trip", fuelType: "Petrol" },
  { id: "l6", vehicle: { id: "v2", name: "Innova Crysta" }, date: "2024-07-28", amount: 3000, pricePerL: 120, tripDistance: 600, odometer: 45200, notes: "Long trip", fuelType: "Diesel" },
  { id: "l7", vehicle: { id: "v1", name: "Hunter 350" }, date: "2023-11-12", amount: 700, pricePerL: 95, tripDistance: 160, odometer: 9000, notes: "Old log", fuelType: "Petrol" },
  { id: "l8", vehicle: { id: "v1", name: "Hunter 350" }, date: "2022-12-20", amount: 760, pricePerL: 95, tripDistance: 150, odometer: 5400, notes: "Last year", fuelType: "Petrol" },
  // add more to test year grouping
];

/* ---------- helpers ---------- */

// week number (ISO-like simple week calculation)
function getWeekKey(d) {
  const date = new Date(d);
  // compute year-week string. We'll use simple approach: get week number with Jan 1 base (not ISO strict)
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = (date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60000);
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const week = Math.floor(diff / oneWeek) + 1;
  return `${date.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

function getMonthKey(d) {
  const date = new Date(d);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; // YYYY-MM
}

function getYearKey(d) {
  const date = new Date(d);
  return `${date.getFullYear()}`; // YYYY
}

function formatKeyLabel(key, mode) {
  if (mode === "year") return key;
  if (mode === "month") {
    const [y, m] = key.split("-");
    const date = new Date(Number(y), Number(m) - 1, 1);
    return date.toLocaleString(undefined, { year: "numeric", month: "short" });
  }
  if (mode === "week") {
    return key;
  }
  return key;
}

/* palette for pie */
const PIE_COLORS = ["#4f46e5", "#06b6d4", "#f97316", "#10b981", "#ef4444", "#f59e0b"];

export default function Reports() {
  // data (in real app, fetch from API)
  const [vehicles] = useState(sampleVehicles);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [vehicleFilter, setVehicleFilter] = useState("All");
  const [mode, setMode] = useState("month"); // "year" | "month" | "week" | "custom"
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [yearFilter, setYearFilter] = useState(""); // quick year select (optional)

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      // compute litres,mileage for sample logs for convenience
      const withComputed = sampleLogs.map((l) => {
        const litres = computeLitres(l.amount, l.pricePerL);
        const mileage = computeMileage(l.tripDistance, litres);
        const runningCostPerKm = computeRunningCost(l.amount, l.tripDistance);
        return { ...l, litres, mileage, runningCostPerKm, createdAt: new Date(l.date).toISOString() };
      });
      setLogs(withComputed);
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, []);

  // years available (for quick year select)
  const years = useMemo(() => {
    const s = new Set(logs.map((l) => new Date(l.date).getFullYear()));
    return Array.from(s).sort((a, b) => b - a);
  }, [logs]);

  // filtered logs (by vehicle and custom range/year)
  const filteredLogs = useMemo(() => {
    let list = (logs ?? []).slice();
    if (vehicleFilter && vehicleFilter !== "All") {
      list = list.filter((l) => l?.vehicle?.id === vehicleFilter);
    }
    if (mode === "custom" && customFrom && customTo) {
      const from = new Date(customFrom);
      const to = new Date(customTo);
      to.setHours(23, 59, 59, 999);
      list = list.filter((l) => {
        const d = new Date(l.date);
        return d >= from && d <= to;
      });
    } else if (mode !== "custom" && yearFilter) {
      // if year selected, filter logs for that year
      list = list.filter((l) => new Date(l.date).getFullYear() === Number(yearFilter));
    }
    return list.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [logs, vehicleFilter, mode, customFrom, customTo, yearFilter]);

  // group by key depending on mode
  const grouped = useMemo(() => {
    const map = new Map();

    filteredLogs.forEach((l) => {
      const dateKey = l.date;
      let key;
      if (mode === "year") key = getYearKey(dateKey);
      else if (mode === "week") key = getWeekKey(dateKey);
      else if (mode === "custom") {
        // for custom, we group by day
        key = new Date(dateKey).toISOString().slice(0, 10); // YYYY-MM-DD
      } else key = getMonthKey(dateKey);

      if (!map.has(key)) {
        map.set(key, {
          period: key,
          amount: 0,
          litres: 0,
          distance: 0,
          count: 0,
          fuelCounts: {}, // for pie
        });
      }
      const obj = map.get(key);
      obj.amount += Number(l.amount || 0);
      obj.litres += Number(l.litres || 0);
      obj.distance += Number(l.tripDistance || 0);
      obj.count += 1;
      const ft = l.fuelType || "Unknown";
      obj.fuelCounts[ft] = (obj.fuelCounts[ft] || 0) + 1;
    });

    // convert map to sorted array
    const arr = Array.from(map.values()).sort((a, b) => {
      // sort by parsed date or numeric key
      if (mode === "year") return Number(a.period) - Number(b.period);
      if (mode === "month") {
        const [ay, am] = a.period.split("-").map(Number);
        const [by, bm] = b.period.split("-").map(Number);
        return ay === by ? am - bm : ay - by;
      }
      if (mode === "week") {
        // lexicographic works because format is YYYY-WNN
        return a.period.localeCompare(b.period);
      }
      // custom day: YYYY-MM-DD sorts lexicographically
      return a.period.localeCompare(b.period);
    });

    // add avgSale / avgMileage fields
    return arr.map((row) => ({
      ...row,
      avgPricePerL: row.litres ? +(row.amount / row.litres).toFixed(2) : 0,
      avgMileage: row.litres ? +(row.distance / row.litres).toFixed(2) : 0,
      label: formatKeyLabel(row.period, mode === "custom" ? "month" : mode), // for display
    }));
  }, [filteredLogs, mode]);

  // overall stats for the selection
  const totals = useMemo(() => {
    const t = { amount: 0, litres: 0, distance: 0, count: 0 };
    filteredLogs.forEach((l) => {
      t.amount += Number(l.amount || 0);
      t.litres += Number(l.litres || 0);
      t.distance += Number(l.tripDistance || 0);
      t.count += 1;
    });
    return {
      ...t,
      avgMileage: t.litres ? +(t.distance / t.litres).toFixed(2) : 0,
      avgPricePerL: t.litres ? +(t.amount / t.litres).toFixed(2) : 0,
    };
  }, [filteredLogs]);

  // pie data for fuel type distribution (over filteredLogs)
  const pieData = useMemo(() => {
    const counts = {};
    filteredLogs.forEach((l) => {
      const k = l.fuelType || "Unknown";
      counts[k] = (counts[k] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredLogs]);

  /* ---------- export to excel (xlsx) ---------- */
  const exportToExcel = async () => {
    try {
      const XLSX = await import("xlsx");
      const rows = [];

      // header
      rows.push(["Period", "Vehicle", "Date", "Amount (₹)", "Price / L", "Litres", "Distance (km)", "Mileage (km/L)", "Notes", "Fuel Type"]);

      // current filteredLogs rows
      filteredLogs.forEach((r) => {
        rows.push([
          // period same as group for quick scanning
          r.date ? new Date(r.date).toISOString().slice(0, 10) : "",
          r.vehicle?.name ?? r.vehicle ?? "",
          r.date ? new Date(r.date).toISOString().slice(0, 10) : "",
          r.amount ?? "",
          r.pricePerL ?? "",
          r.litres ?? "",
          r.tripDistance ?? "",
          r.mileage ?? "",
          r.notes ?? "",
          r.fuelType ?? "",
        ]);
      });

      const ws = XLSX.utils.aoa_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "FuelLogs");
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

      const blob = new Blob([wbout], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const from = customFrom || (yearFilter ? `${yearFilter}` : "");
      const to = customTo || "";
      const vehicleName = vehicleFilter === "All" ? "all" : (vehicles.find(v => v.id === vehicleFilter)?.name ?? vehicleFilter);
      const fileName = `fuel-logs_${vehicleName}_${mode}${from ? `_${from}` : ""}${to ? `_${to}` : ""}.xlsx`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to export xlsx. Did you install the 'xlsx' package?", err);
      alert("Export failed — make sure the 'xlsx' package is installed.");
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="space-y-6">
      <div className="bg-[var(--panel)] p-5 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Reports</h2>
            <p className="text-sm text-[var(--muted)] mt-1 max-w-prose">
              View fuel & consumption stats by year/month/week or custom date range. Filter by vehicle and export the visible rows to Excel.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportToExcel}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--accent)] text-white shadow"
              title="Download current data to Excel"
            >
              <FiDownload /> Export XLSX
            </button>
          </div>
        </div>

        {/* controls */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          <div>
            <label className="text-sm text-[var(--muted)]">Vehicle</label>
            <select value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2">
              <option value="All">All vehicles</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} — {v.make}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-[var(--muted)]">Granularity</label>
            <select value={mode} onChange={(e) => { setMode(e.target.value); setCustomFrom(""); setCustomTo(""); }} className="mt-1 w-full rounded-md border px-3 py-2">
              <option value="year">Yearly</option>
              <option value="month">Monthly</option>
              <option value="week">Weekly</option>
              <option value="custom">Custom range</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-[var(--muted)]">Year / Range</label>
            <div className="mt-1 flex gap-2">
              {mode === "custom" ? (
                <>
                  <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="rounded-md border px-3 py-2" />
                  <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="rounded-md border px-3 py-2" />
                </>
              ) : (
                <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="w-full rounded-md border px-3 py-2">
                  <option value="">All years</option>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* quick totals */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-xs text-[var(--muted)]">Total Spent</div>
            <div className="text-lg font-semibold">₹{(totals.amount ?? 0).toLocaleString()}</div>
            <div className="text-xs text-[var(--muted)]">({totals.count} entries)</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-xs text-[var(--muted)]">Total Litres</div>
            <div className="text-lg font-semibold">{(totals.litres ?? 0).toFixed(2)}</div>
            <div className="text-xs text-[var(--muted)]">Avg price ₹{totals.avgPricePerL ?? 0}</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-xs text-[var(--muted)]">Total Distance</div>
            <div className="text-lg font-semibold">{(totals.distance ?? 0).toLocaleString()} km</div>
            <div className="text-xs text-[var(--muted)]">Avg mileage {totals.avgMileage ?? 0} km/L</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-xs text-[var(--muted)]">Periods</div>
            <div className="text-lg font-semibold">{grouped.length}</div>
            <div className="text-xs text-[var(--muted)]">Grouped by {mode}</div>
          </div>
        </div>
      </div>

      {/* charts + table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--panel)] p-4 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Trend ({mode})</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={grouped}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#4f46e5" name="Amount (₹)" strokeWidth={2} />
                <Line type="monotone" dataKey="litres" stroke="#06b6d4" name="Litres" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Period totals</h4>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={grouped}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" name="Amount (₹)" fill="#4f46e5" />
                  <Bar dataKey="litres" name="Litres" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-[var(--panel)] p-4 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Breakdown</h3>

          <div className="grid grid-cols-1 gap-4">
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                    {pieData.map((entry, idx) => (
                      <Cell key={`c-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Period Table</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm table-auto">
                  <thead>
                    <tr className="text-left text-xs text-[var(--muted)]">
                      <th className="px-2 py-2">Period</th>
                      <th className="px-2 py-2">Amount (₹)</th>
                      <th className="px-2 py-2">Litres</th>
                      <th className="px-2 py-2">Distance</th>
                      <th className="px-2 py-2">Avg Price/L</th>
                      <th className="px-2 py-2">Avg Mileage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grouped.map((g) => (
                      <tr key={g.period} className="border-t">
                        <td className="px-2 py-3">{g.label}</td>
                        <td className="px-2 py-3">₹{Math.round(g.amount)}</td>
                        <td className="px-2 py-3">{g.litres.toFixed(2)}</td>
                        <td className="px-2 py-3">{Math.round(g.distance)}</td>
                        <td className="px-2 py-3">₹{g.avgPricePerL}</td>
                        <td className="px-2 py-3">{g.avgMileage} km/L</td>
                      </tr>
                    ))}
                    {grouped.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-2 py-6 text-center text-[var(--muted)]">No data for this filter</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
