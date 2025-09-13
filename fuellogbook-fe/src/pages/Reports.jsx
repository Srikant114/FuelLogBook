// src/pages/Reports.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
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
import {
  computeLitres,
  computeMileage,
  computeRunningCost,
  formatDate,
} from "../utils/helpers";
import { FiDownload, FiSend } from "react-icons/fi";

/* API wrappers - assume these exist and return JS objects/arrays */
import { getMyVehicles } from "../api/vehicles";
import { getLogsForVehicle } from "../api/logs";
import client from "../api/client"; // axios instance configured with baseURL + auth

/* palette for pie */
const PIE_COLORS = [
  "#4f46e5",
  "#06b6d4",
  "#f97316",
  "#10b981",
  "#ef4444",
  "#f59e0b",
];

/* week/month utilities (kept from your original) */
function getWeekKey(d) {
  const date = new Date(d);
  const start = new Date(date.getFullYear(), 0, 1);
  const diff =
    date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60000;
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const week = Math.floor(diff / oneWeek) + 1;
  return `${date.getFullYear()}-W${String(week).padStart(2, "0")}`;
}
function getMonthKey(d) {
  const date = new Date(d);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}
function getYearKey(d) {
  const date = new Date(d);
  return `${date.getFullYear()}`;
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

/**
 * Reports page — integrates with backend Excel/email endpoints.
 */
export default function Reports() {
  const [vehicles, setVehicles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [vehicleFilter, setVehicleFilter] = useState("All");
  const [mode, setMode] = useState("month"); // "year" | "month" | "week" | "custom"
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  // email modal
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailSending, setEmailSending] = useState(false);

  // refresh control
  const pollingRef = useRef(null);
  const refreshPendingRef = useRef(false);
  const POLL_MS = 15000; // 15s polling fallback

  // load vehicles on mount
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const vlist = await getMyVehicles();
        const normalized = Array.isArray(vlist)
          ? vlist.map((v) => ({ ...v, id: v._id ?? v.id }))
          : [];
        if (!mounted) return;
        setVehicles(normalized);
        // keep vehicleFilter default "All"
      } catch (err) {
        console.error("Reports: failed to load vehicles", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load logs helper
  const loadLogs = async (opts = {}) => {
    const { forceVehicleId } = opts;
    setLoading(true);
    try {
      const selected = forceVehicleId ?? vehicleFilter;

      if (!vehicles || vehicles.length === 0) {
        setLogs([]);
        setLoading(false);
        return;
      }

      if (selected === "All") {
        const all = [];
        // fetch per-vehicle logs and attach vehicle info
        for (const v of vehicles) {
          try {
            const res = await getLogsForVehicle(v.id);
            const rows = Array.isArray(res) ? res : res?.logs ?? [];
            rows.forEach((r) => {
              all.push({
                ...r,
                id: r._id ?? r.id,
                vehicle: { id: v.id, name: v.name, make: v.make },
              });
            });
          } catch (err) {
            console.warn("Reports: failed to load logs for vehicle", v.id, err);
          }
        }
        const withComputed = all.map((l) => ({
          ...l,
          litres: l.litres ?? computeLitres(l.amount || 0, l.pricePerL || 0),
          mileage:
            l.mileage ?? computeMileage(l.tripDistance || 0, l.litres ?? 0),
          runningCostPerKm:
            l.runningCostPerKm ??
            computeRunningCost(l.amount || 0, l.tripDistance || 0),
        }));
        withComputed.sort((a, b) => new Date(a.date) - new Date(b.date));
        setLogs(withComputed);
      } else {
        const v = vehicles.find((x) => x.id === selected);
        if (!v) {
          setLogs([]);
        } else {
          const res = await getLogsForVehicle(v.id);
          const rows = Array.isArray(res) ? res : res?.logs ?? [];
          const normalized = rows.map((r) => ({
            ...r,
            id: r._id ?? r.id,
            vehicle:
              r.vehicle && typeof r.vehicle === "object"
                ? {
                    id: r.vehicle._id ?? r.vehicle.id ?? v.id,
                    name: r.vehicle.name ?? v.name,
                  }
                : { id: v.id, name: v.name },
            litres: r.litres ?? computeLitres(r.amount || 0, r.pricePerL || 0),
            mileage:
              r.mileage ?? computeMileage(r.tripDistance || 0, r.litres ?? 0),
            runningCostPerKm:
              r.runningCostPerKm ??
              computeRunningCost(r.amount || 0, r.tripDistance || 0),
          }));
          normalized.sort((a, b) => new Date(a.date) - new Date(b.date));
          setLogs(normalized);
        }
      }
    } catch (err) {
      console.error("Reports: loadLogs error", err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  // load logs when vehicles or vehicleFilter changes
  useEffect(() => {
    if (!vehicles) return;
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleFilter, vehicles]);

  // auto refresh on custom event + polling fallback
  useEffect(() => {
    const handler = () => {
      if (refreshPendingRef.current) return;
      refreshPendingRef.current = true;
      Promise.resolve().then(async () => {
        await loadLogs();
        refreshPendingRef.current = false;
      });
    };
    window.addEventListener("fuellog:data-updated", handler);

    pollingRef.current = setInterval(() => {
      if (!refreshPendingRef.current) loadLogs();
    }, POLL_MS);

    return () => {
      window.removeEventListener("fuellog:data-updated", handler);
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicles, vehicleFilter]);

  // Filtered logs according to mode/year/custom range/vehicle
  const filteredLogs = useMemo(() => {
    let list = (logs ?? []).slice();
    if (mode === "custom" && customFrom && customTo) {
      const from = new Date(customFrom);
      const to = new Date(customTo);
      to.setHours(23, 59, 59, 999);
      list = list.filter((l) => {
        const d = new Date(l.date);
        return d >= from && d <= to;
      });
    } else if (mode !== "custom" && yearFilter) {
      list = list.filter(
        (l) => new Date(l.date).getFullYear() === Number(yearFilter)
      );
    }
    return list.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [logs, mode, customFrom, customTo, yearFilter]);

  // group for charts
  const grouped = useMemo(() => {
    const map = new Map();
    filteredLogs.forEach((l) => {
      const dateKey = l.date;
      let key;
      if (mode === "year") key = getYearKey(dateKey);
      else if (mode === "week") key = getWeekKey(dateKey);
      else if (mode === "custom") {
        key = new Date(dateKey).toISOString().slice(0, 10);
      } else key = getMonthKey(dateKey);

      if (!map.has(key)) {
        map.set(key, {
          period: key,
          amount: 0,
          litres: 0,
          distance: 0,
          count: 0,
          fuelCounts: {},
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

    const arr = Array.from(map.values()).sort((a, b) => {
      if (mode === "year") return Number(a.period) - Number(b.period);
      if (mode === "month") {
        const [ay, am] = a.period.split("-").map(Number);
        const [by, bm] = b.period.split("-").map(Number);
        return ay === by ? am - bm : ay - by;
      }
      if (mode === "week") return a.period.localeCompare(b.period);
      return a.period.localeCompare(b.period);
    });

    return arr.map((row) => ({
      ...row,
      avgPricePerL: row.litres ? +(row.amount / row.litres).toFixed(2) : 0,
      avgMileage: row.litres ? +(row.distance / row.litres).toFixed(2) : 0,
      label: formatKeyLabel(row.period, mode === "custom" ? "month" : mode),
    }));
  }, [filteredLogs, mode]);

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

  const pieData = useMemo(() => {
    const counts = {};
    filteredLogs.forEach((l) => {
      const k = l.fuelType || "Unknown";
      counts[k] = (counts[k] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredLogs]);

  // years available
  const years = useMemo(() => {
    const s = new Set(logs.map((l) => new Date(l.date).getFullYear()));
    return Array.from(s).sort((a, b) => b - a);
  }, [logs]);

  /* Export handling:
     - Use server Excel endpoint for single vehicle or "all" endpoint for all vehicles.
     - If server Excel isn't available, you could fallback to CSV or client-side XLSX.
  */
  const exportToExcel = async () => {
    try {
      let url;
      if (vehicleFilter !== "All") {
        url = `/api/vehicles/${vehicleFilter}/report/excel`;
      } else {
        url = `/api/reports/all/excel`;
      }

      const res = await client.get(url, { responseType: "blob" });

      // try to detect content type and set file extension
      const contentType = res?.headers?.["content-type"] ?? res?.type ?? "";
      const isXlsx = contentType.includes("spreadsheet") || contentType.includes("vnd.openxmlformats");
      const ext = isXlsx ? "xlsx" : contentType.includes("csv") ? "csv" : "xlsx";
      const blob = new Blob([res.data], {
        type: res.data.type || (isXlsx ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : "text/csv"),
      });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;

      const vehicleName =
        vehicleFilter === "All"
          ? "all"
          : vehicles.find((v) => v.id === vehicleFilter)?.name ?? vehicleFilter;

      a.download = `fuel-report-${vehicleName}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Reports export failed", err);
      alert("Export failed. Check console for details.");
    }
  };

  /* ---------- Email sending (modal UI) ---------- */
  const openEmailModal = () => {
    setEmailTo("");
    setEmailOpen(true);
  };

  const closeEmailModal = () => {
    setEmailOpen(false);
    setEmailTo("");
  };

  const sendReportEmail = async (e) => {
    e?.preventDefault?.();
    if (!emailTo || !emailTo.includes("@")) {
      alert("Please enter a valid recipient email.");
      return;
    }
    setEmailSending(true);
    try {
      let url;
      if (vehicleFilter !== "All") {
        url = `/api/vehicles/${vehicleFilter}/report/email`;
      } else {
        url = `/api/reports/all/email`;
      }

      const res = await client.post(url, { to: emailTo });
      alert(res.data?.message || "Report sent successfully");
      closeEmailModal();
    } catch (err) {
      console.error("Send report email failed:", err);
      alert("Failed to send report by email");
    } finally {
      setEmailSending(false);
    }
  };

  /* ---------- UI (keeps original layout & classes) ---------- */
  return (
    <div className="space-y-6">
      <div className="bg-[var(--panel)] p-5 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Reports</h2>
            <p className="text-sm text-[var(--muted)] mt-1 max-w-prose">
              View fuel & consumption stats by year/month/week or custom date range.
              Filter by vehicle and export the visible rows to Excel.
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

            <button
              onClick={openEmailModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-500 text-white shadow"
              title="Send report by email"
            >
              <FiSend /> Email Report
            </button>
          </div>
        </div>

        {/* controls */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          <div>
            <label className="text-sm text-[var(--muted)]">Vehicle</label>
            <select
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
            >
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
            <select
              value={mode}
              onChange={(e) => {
                setMode(e.target.value);
                setCustomFrom("");
                setCustomTo("");
              }}
              className="mt-1 w-full rounded-md border px-3 py-2"
            >
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
                  <input
                    type="date"
                    value={customFrom}
                    onChange={(e) => setCustomFrom(e.target.value)}
                    className="rounded-md border px-3 py-2"
                  />
                  <input
                    type="date"
                    value={customTo}
                    onChange={(e) => setCustomTo(e.target.value)}
                    className="rounded-md border px-3 py-2"
                  />
                </>
              ) : (
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="w-full rounded-md border px-3 py-2"
                >
                  <option value="">All years</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* quick totals */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-xs text-[var(--muted)]">Total Spent</div>
            <div className="text-lg font-semibold">
              ₹{(totals.amount ?? 0).toLocaleString()}
            </div>
            <div className="text-xs text-[var(--muted)]">({totals.count} entries)</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-xs text-[var(--muted)]">Total Litres</div>
            <div className="text-lg font-semibold">
              {(totals.litres ?? 0).toFixed(2)}
            </div>
            <div className="text-xs text-[var(--muted)]">
              Avg price ₹{totals.avgPricePerL ?? 0}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-xs text-[var(--muted)]">Total Distance</div>
            <div className="text-lg font-semibold">
              {(totals.distance ?? 0).toLocaleString()} km
            </div>
            <div className="text-xs text-[var(--muted)]">
              Avg mileage {totals.avgMileage ?? 0} km/L
            </div>
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
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#4f46e5"
                  name="Amount (₹)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="litres"
                  stroke="#06b6d4"
                  name="Litres"
                  strokeWidth={2}
                />
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
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                  >
                    {pieData.map((entry, idx) => (
                      <Cell
                        key={`c-${idx}`}
                        fill={PIE_COLORS[idx % PIE_COLORS.length]}
                      />
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
                        <td
                          colSpan={6}
                          className="px-2 py-6 text-center text-[var(--muted)]"
                        >
                          No data for this filter
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal (basic inline modal) */}
      {emailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              if (!emailSending) closeEmailModal();
            }}
          />
          <div className="relative bg-white dark:bg-slate-800 rounded-lg w-full max-w-xl p-6 z-10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Send Report by Email</h3>
              <button
                onClick={() => {
                  if (!emailSending) closeEmailModal();
                }}
                className="p-1 rounded hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={sendReportEmail} className="space-y-4">
              <div>
                <label className="text-sm font-medium">To</label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="recipient@example.com"
                  required
                  className="mt-1 w-full rounded-md border px-3 py-2"
                />
                <p className="text-xs text-[var(--muted)] mt-1">
                  Sends the currently filtered report ({vehicleFilter === "All" ? "All vehicles" : `vehicle ${vehicleFilter}`})
                </p>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!emailSending) closeEmailModal();
                  }}
                  className="px-4 py-2 rounded-md bg-white border"
                  disabled={emailSending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[var(--accent)] text-white"
                  disabled={emailSending}
                >
                  {emailSending ? "Sending..." : "Send Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
