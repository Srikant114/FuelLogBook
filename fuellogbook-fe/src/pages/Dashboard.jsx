// src/pages/Dashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  AreaChart,
  Area,
} from "recharts";
import { FiPlus, FiEye, FiDownload } from "react-icons/fi";
import { formatDate, computeLitres } from "../utils/helpers";

/**
 * Dashboard page
 * - lightweight sample data (replace with API)
 * - responsive, modern look using Tailwind + your theme variables
 *
 * Requirements:
 * - recharts installed: npm i recharts
 * - utils helpers file available at ../components/utils/helpers.js
 */

const sampleVehicles = [
  {
    id: "v1",
    name: "Royal Enfield Hunter 350",
    make: "Royal Enfield",
    modelYear: 2023,
    fuelType: "Petrol",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "v2",
    name: "Toyota Innova Crysta",
    make: "Toyota",
    modelYear: 2020,
    fuelType: "Diesel",
    imageUrl:
      "https://images.unsplash.com/photo-1542367597-4512c5e3b2d5?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "v3",
    name: "Tesla Model 3",
    make: "Tesla",
    modelYear: 2024,
    fuelType: "EV",
    imageUrl:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1000&auto=format&fit=crop",
  },
];

const sampleLogs = [
  { id: "l1", vehicleId: "v1", date: "2025-08-14", amount: 1200, pricePerL: 110, tripDistance: 250, notes: "Highway" },
  { id: "l2", vehicleId: "v2", date: "2025-08-09", amount: 3000, pricePerL: 120, tripDistance: 600, notes: "Intercity" },
  { id: "l3", vehicleId: "v1", date: "2025-07-29", amount: 950, pricePerL: 105, tripDistance: 220, notes: "Local" },
  { id: "l4", vehicleId: "v3", date: "2025-07-24", amount: 0, pricePerL: 0, tripDistance: 120, notes: "EV charge" },
  { id: "l5", vehicleId: "v1", date: "2025-08-01", amount: 870, pricePerL: 108, tripDistance: 200, notes: "City" },
  { id: "l6", vehicleId: "v2", date: "2025-08-02", amount: 2800, pricePerL: 118, tripDistance: 520, notes: "Fleet" },
];

/* Utility: generate last N days keys (YYYY-MM-DD) */
function daysArray(lastN = 30) {
  const arr = [];
  const now = new Date();
  for (let i = lastN - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    arr.push(d.toISOString().slice(0, 10));
  }
  return arr;
}

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // load sample data (simulate fetch)
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setVehicles(sampleVehicles);
      // compute litres for each sample log
      const enriched = sampleLogs.map((l) => ({ ...l, litres: computeLitres(l.amount, l.pricePerL) }));
      setLogs(enriched);
      setLoading(false);
    }, 240);
    return () => clearTimeout(t);
  }, []);

  // Quick summary metrics
  const totals = useMemo(() => {
    const totalVehicles = vehicles.length;
    const totalLogsThisMonth = logs.filter((l) => {
      const d = new Date(l.date);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    const totalLitres = logs.reduce((s, l) => s + (Number(l.litres) || 0), 0);
    const totalAmount = logs.reduce((s, l) => s + (Number(l.amount) || 0), 0);
    const avgMileage = (() => {
      const totalDistance = logs.reduce((s, l) => s + (Number(l.tripDistance) || 0), 0);
      if (totalLitres <= 0) return 0;
      return +(totalDistance / totalLitres).toFixed(2);
    })();
    const openIssues = 3; // placeholder - wire to actual issues
    return { totalVehicles, totalLogsThisMonth, totalLitres, totalAmount, avgMileage, openIssues };
  }, [vehicles, logs]);

  // trend data: map last 30 days into aggregated totals
  const trendData = useMemo(() => {
    const days = daysArray(30);
    const map = new Map(days.map((d) => [d, { date: d, amount: 0, litres: 0 }]));
    logs.forEach((l) => {
      const key = new Date(l.date).toISOString().slice(0, 10);
      if (!map.has(key)) return;
      const cur = map.get(key);
      cur.amount += Number(l.amount || 0);
      cur.litres += Number(l.litres || 0);
      map.set(key, cur);
    });
    return Array.from(map.values());
  }, [logs]);

  // sparkline data: small sequences (use trendData substrings or sample)
  const sparkSamples = useMemo(() => {
    // make four small series for cards: total vehicles growth, logs per week, avg mileage, amount last 8 days
    const last8 = trendData.slice(-8);
    const amounts = last8.map((d) => ({ value: Math.round(d.amount) }));
    const litres = last8.map((d) => ({ value: Math.round(d.litres) }));
    const logsCount = last8.map((d) => ({ value: Math.floor(Math.random() * 4) })); // mock
    const mileage = last8.map((d, i) => ({ value: (d.litres ? +(d.amount / (d.litres * 10 || 1)).toFixed(1) : 0) })); // fake for spark
    return { amounts, litres, logsCount, mileage };
  }, [trendData]);

  // recent lists
  const recentVehicles = useMemo(() => vehicles.slice(0, 4), [vehicles]);
  const recentLogs = useMemo(() => logs.slice(0, 6).sort((a, b) => new Date(b.date) - new Date(a.date)), [logs]);

  /* Handlers (placeholders for wiring modals/routes) */
  const handleAddVehicle = () => {
    alert("Wire this to open the Add Vehicle modal");
  };
  const handleAddLog = () => {
    alert("Wire this to open the Add Log modal");
  };
  const handleViewLog = (log) => {
    alert(`View log: ${log?.id}`);
  };

  /* small helper for sparkline */
  const Sparkline = ({ data, color = "var(--accent)" }) => {
    if (!data || data.length === 0) return <div className="h-10" />;
    return (
      <div className="h-10 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.12} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <p className="text-sm text-[var(--muted)] mt-1">Welcome back — quick overview of fleet & fuel activity.</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleAddLog} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white border shadow-sm hover:shadow-md text-sm">
            <FiPlus /> New Log
          </button>
          <button onClick={handleAddVehicle} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[var(--accent)] text-white shadow text-sm">
            <FiPlus /> Add Vehicle
          </button>
          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[var(--panel)] hover:bg-[var(--hover-bg)] text-sm">
            <FiDownload /> Export
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-4 rounded-xl bg-[var(--panel)] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-[var(--muted)]">Total Vehicles</div>
              <div className="text-2xl font-bold">{totals.totalVehicles}</div>
            </div>
            <div className="w-28">
              <Sparkline data={sparkSamples.logsCount} color="#06b6d4" />
            </div>
          </div>
          <div className="mt-3 text-xs text-[var(--muted)]">Active fleet overview</div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--panel)] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-[var(--muted)]">Fuel Logs (this month)</div>
              <div className="text-2xl font-bold">{totals.totalLogsThisMonth}</div>
            </div>
            <div className="w-28">
              <Sparkline data={sparkSamples.amounts} color="#4f46e5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-[var(--muted)]">Trends last week</div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--panel)] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-[var(--muted)]">Total Spent</div>
              <div className="text-2xl font-bold">₹{Math.round(totals.totalAmount).toLocaleString()}</div>
            </div>
            <div className="w-28">
              <Sparkline data={sparkSamples.litres} color="#10b981" />
            </div>
          </div>
          <div className="mt-3 text-xs text-[var(--muted)]">This selection</div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--panel)] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-[var(--muted)]">Avg Mileage</div>
              <div className="text-2xl font-bold">{totals.avgMileage ?? 0} km/L</div>
            </div>
            <div className="w-28">
              <Sparkline data={sparkSamples.mileage} color="#f97316" />
            </div>
          </div>
          <div className="mt-3 text-xs text-[var(--muted)]">Fleet average</div>
        </div>
      </div>

      {/* Main charts & lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large trend chart */}
        <div className="lg:col-span-2 bg-[var(--panel)] p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Fuel Usage — last 30 days</h3>
              <div className="text-sm text-[var(--muted)]">Amount (₹) and litres per day</div>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded-md text-sm bg-white border">7d</button>
              <button className="px-3 py-1 rounded-md text-sm bg-white border">30d</button>
              <button className="px-3 py-1 rounded-md text-sm bg-white border">YTD</button>
            </div>
          </div>

          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip labelFormatter={(d) => `Day: ${d}`} />
                <Line yAxisId="left" type="monotone" dataKey="amount" stroke="#4f46e5" name="Amount (₹)" strokeWidth={2} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="litres" stroke="#06b6d4" name="Litres" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded bg-white text-sm">
              <div className="text-xs text-[var(--muted)]">This month spent</div>
              <div className="font-semibold">₹{Math.round(totals.totalAmount)}</div>
            </div>
            <div className="p-3 rounded bg-white text-sm">
              <div className="text-xs text-[var(--muted)]">This month litres</div>
              <div className="font-semibold">{totals.totalLitres.toFixed(2)}</div>
            </div>
            <div className="p-3 rounded bg-white text-sm">
              <div className="text-xs text-[var(--muted)]">Open issues</div>
              <div className="font-semibold">{totals.openIssues}</div>
            </div>
          </div>
        </div>

        {/* Side column: recent vehicles + recent logs */}
        <div className="bg-[var(--panel)] p-4 rounded-xl shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Recent Vehicles</h4>
            <div className="text-sm text-[var(--muted)]">Top 4</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
            {recentVehicles.map((v) => (
              <div key={v.id} className="flex items-center gap-3 bg-white p-3 rounded-md shadow-sm">
                <img src={v.imageUrl} alt={v.name} className="w-14 h-14 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{v.name}</div>
                  <div className="text-xs text-[var(--muted)]">{v.make} • {v.modelYear}</div>
                </div>
                <div className="text-xs">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${v.fuelType === "EV" ? "bg-green-50 text-green-700" : v.fuelType === "Diesel" ? "bg-yellow-50 text-yellow-700" : "bg-blue-50 text-blue-700"}`}>
                    {v.fuelType}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Recent Fuel Logs</h4>
              <div className="text-xs text-[var(--muted)]">Latest 6</div>
            </div>

            <div className="space-y-3">
              {recentLogs.map((l) => {
                const veh = vehicles.find((v) => v.id === l.vehicleId) || {};
                return (
                  <div key={l.id} className="flex items-center gap-3 p-3 bg-white rounded-md">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{veh?.name ?? "Unknown vehicle"}</div>
                      <div className="text-xs text-[var(--muted)]">{formatDate(l.date)} — {l.notes}</div>
                    </div>

                    <div className="text-right">
                      <div className="font-semibold">₹{l.amount}</div>
                      <div className="text-xs text-[var(--muted)]">{(l.litres || 0).toFixed(2)} L</div>
                    </div>

                    <div>
                      <button onClick={() => handleViewLog(l)} className="p-2 rounded-md hover:bg-[var(--hover-bg)]">
                        <FiEye />
                      </button>
                    </div>
                  </div>
                );
              })}
              {recentLogs.length === 0 && <div className="text-sm text-[var(--muted)]">No recent logs</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
