// src/pages/FuelLogs.jsx
import React, { useEffect, useMemo, useState } from "react";
import HeaderControls from "../components/Controls/HeaderControls";
import Pagination from "../components/Pagination/Pagination";
import LogCard from "../components/FuelLogs/LogCard";
import LogFormModal from "../components/FuelLogs/LogFormModal";
import ViewLogModal from "../components/FuelLogs/ViewLogModal";
import ConfirmDeleteModal from "../components/Modals/ConfirmDeleteModal";
import { computeLitres, computeMileage, computeRunningCost } from "../utils/helpers";

/* sample vehicles */
const sampleVehicles = [
  { id: "v1", name: "Royal Enfield Hunter 350", make: "Royal Enfield" },
  { id: "v2", name: "Toyota Innova Crysta", make: "Toyota" },
  { id: "v3", name: "Tesla Model 3", make: "Tesla" },
];

/* sample logs */
const initialLogs = [
  {
    id: "l1",
    vehicle: { id: "v1", name: "Royal Enfield Hunter 350" },
    userId: "u1",
    date: new Date("2024-08-05").toISOString(),
    amount: 1200,
    pricePerL: 110,
    litres: computeLitres(1200, 110),
    tripDistance: 250,
    mileage: computeMileage(250, computeLitres(1200, 110)),
    runningCostPerKm: computeRunningCost(1200, 250),
    odometer: 10250,
    notes: "Long highway run — decent mileage",
    fuelType: "Petrol",
    createdAt: new Date("2024-08-05").toISOString(),
  },
  {
    id: "l2",
    vehicle: { id: "v2", name: "Toyota Innova Crysta" },
    userId: "u2",
    date: new Date("2024-07-28").toISOString(),
    amount: 3000,
    pricePerL: 120,
    litres: computeLitres(3000, 120),
    tripDistance: 600,
    mileage: computeMileage(600, computeLitres(3000, 120)),
    runningCostPerKm: computeRunningCost(3000, 600),
    odometer: 45200,
    notes: "Inter-city trip",
    fuelType: "Diesel",
    createdAt: new Date("2024-07-28").toISOString(),
  },
];

export default function FuelLogs() {
  const [logs, setLogs] = useState([]);
  const [vehicles] = useState(sampleVehicles);
  const [loading, setLoading] = useState(true);

  // controls
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(8);
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // modals
  const [formOpen, setFormOpen] = useState(false);
  const [formInitial, setFormInitial] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeLog, setActiveLog] = useState(null);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setLogs(initialLogs);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    let list = (logs ?? []).slice().sort((a,b)=> new Date(b.date) - new Date(a.date));
    const q = (query ?? "").trim().toLowerCase();
    if (q) {
      list = list.filter((L) => {
        return (
          (L?.vehicle?.name ?? "").toLowerCase().includes(q) ||
          (L?.notes ?? "").toLowerCase().includes(q) ||
          String(L?.amount ?? "").includes(q)
        );
      });
    }
    if (dateFrom) {
      const from = new Date(dateFrom);
      list = list.filter((L) => new Date(L?.date) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23,59,59,999);
      list = list.filter((L) => new Date(L?.date) <= to);
    }
    return list;
  }, [logs, query, dateFrom, dateTo]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  const startIdx = (page - 1) * pageSize;
  const pageItems = filtered.slice(startIdx, startIdx + pageSize);

  /* handlers */
  const openAdd = () => { setFormInitial(null); setFormOpen(true); };
  const openEdit = (log) => { setFormInitial(log); setFormOpen(true); };
  const openView = (log) => { setActiveLog(log); setViewOpen(true); };
  const openDelete = (log) => { setActiveLog(log); setDeleteOpen(true); };

  const handleSave = (payload) => {
    // ensure derived fields
    const litres = computeLitres(payload.amount, payload.pricePerL);
    const mileage = computeMileage(payload.tripDistance, litres);
    const running = computeRunningCost(payload.amount, payload.tripDistance);

    const entry = {
      ...payload,
      litres,
      mileage,
      runningCostPerKm: running,
      createdAt: new Date().toISOString(),
    };

    if (payload?.id) {
      setLogs((s) => s.map((x) => (x?.id === payload?.id ? { ...x, ...entry } : x)));
    } else {
      const newItem = { ...entry, id: "l" + Date.now() };
      setLogs((s) => [newItem, ...s]);
    }
  };

  const confirmDelete = (id) => {
    setLogs((s) => s.filter((x) => x?.id !== id));
    setDeleteOpen(false);
    setActiveLog(null);
  };

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="bg-[var(--panel)] p-5 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Fuel Logs</h2>
          <p className="text-sm text-[var(--muted)] mt-1 max-w-prose">
            Add and manage fuel refills. Each log computes litres, mileage (if distance provided) and running cost/km.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--accent)] text-white ml-3 shadow">
            Add Log
          </button>
        </div>
      </div>

      {/* controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2 w-full max-w-xl">
          <div className="flex items-center gap-2 border rounded-md px-3 py-2 w-full bg-white">
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search by vehicle, notes or amount..."
              className="w-full outline-none text-sm"
            />
            {query ? (
              <button onClick={() => { setQuery(""); setPage(1); }} className="p-1 rounded-md hover:bg-[var(--hover-bg)]">Clear</button>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <label className="text-xs text-[var(--muted)]">From</label>
            <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} className="rounded-md border px-2 py-1 text-sm" />
            <label className="text-xs text-[var(--muted)]">To</label>
            <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} className="rounded-md border px-2 py-1 text-sm" />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-[var(--muted)] hidden sm:block">Page size</label>
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="rounded-md border px-2 py-1 text-sm">
              {[6,8,10,20].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* list */}
      <div>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: pageSize }).map((_,i) => <div key={i} className="animate-pulse h-24 bg-[var(--panel)] rounded-lg" />)}
          </div>
        ) : (pageItems?.length ?? 0) === 0 ? (
          <div className="py-12 text-center text-[var(--muted)]">
            <p className="text-lg font-medium mb-3">No logs found</p>
            <p className="text-sm mb-4">Add a new fuel log to get started.</p>
            <button onClick={openAdd} className="px-4 py-2 rounded-md bg-[var(--accent)] text-white">Add Log</button>
          </div>
        ) : (
          <div className="space-y-3">
            {pageItems?.map((l) => (
              <LogCard key={l?.id ?? Math.random()} log={l} onView={openView} onDelete={openDelete} />
            ))}
          </div>
        )}
      </div>

      {/* pagination */}
      <Pagination total={total} page={page} pageSize={pageSize} onPageChange={(p)=>setPage(p)} onPageSizeChange={(n)=>{ setPageSize(n); setPage(1); }} />

      {/* modals */}
      <LogFormModal open={formOpen} onClose={() => setFormOpen(false)} onSave={handleSave} initialData={formInitial} vehicles={vehicles} />
      <ViewLogModal open={viewOpen} onClose={() => setViewOpen(false)} log={activeLog} />
      {/* ConfirmDeleteModal expects a "vehicle" object; pass activeLog?.vehicle so message shows vehicle name */}
      <ConfirmDeleteModal open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={(id) => confirmDelete(id)} vehicle={activeLog?.vehicle} />
    </div>
  );
}
