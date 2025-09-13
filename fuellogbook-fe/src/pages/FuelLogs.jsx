// src/pages/FuelLogs.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

/* components */
import HeaderControls from "../components/Controls/HeaderControls";
import Pagination from "../components/Pagination/Pagination";
import LogCard from "../components/FuelLogs/LogCard";
import LogFormModal from "../components/FuelLogs/LogFormModal";
import ViewLogModal from "../components/FuelLogs/ViewLogModal";
import ConfirmDeleteModal from "../components/Modals/ConfirmDeleteModal";

/* utils */
import {
  computeLitres,
  computeMileage,
  computeRunningCost,
} from "../utils/helpers";

/* API */
import { getMyVehicles } from "../api/vehicles";
import {
  getLogsForVehicle,
  createLog,
  updateLog,
  deleteLog,
} from "../api/logs";

/* ---------- page ---------- */
export default function FuelLogs() {
  const { user } = useAuth();

  // core data
  const [vehicles, setVehicles] = useState([]); // fetched vehicles for user
  const [logs, setLogs] = useState([]); // currently displayed logs (depends on selection)
  const [loading, setLoading] = useState(true);

  // controls
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(8);
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState("all"); // "all" or vehicle id

  // modals
  const [formOpen, setFormOpen] = useState(false);
  const [formInitial, setFormInitial] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeLog, setActiveLog] = useState(null);

  // Load vehicles and logs on mount / when user changes
  useEffect(() => {
    let mounted = true;
    async function init() {
      setLoading(true);
      try {
        if (!user) {
          setVehicles([]);
          setLogs([]);
          setLoading(false);
          return;
        }
        // Fetch user's vehicles
        const vlist = await getMyVehicles(); // returns an array of vehicle objects from backend
        // normalize: backend vehicles have _id
        const normalized = (vlist || []).map((v) => ({
          ...v,
          id: v._id ?? v.id,
        }));
        if (!mounted) return;
        setVehicles(normalized);

        // default selection: first vehicle if exists else 'all'
        if (normalized.length > 0) {
          // If previously selected vehicle still exists keep it, else default to first
          setSelectedVehicleId((prev) =>
            prev && (prev === "all" || normalized.find((x) => x.id === prev))
              ? prev
              : normalized[0].id
          );
        } else {
          setSelectedVehicleId("all");
        }
      } catch (err) {
        console.error("Failed to load vehicles", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, [user]);

  // Whenever selectedVehicleId or vehicles list changes, load logs
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        if (!user) {
          setLogs([]);
          return;
        }
        if (selectedVehicleId === "all") {
          // aggregate logs across all vehicles (sequential)
          const allLogs = [];
          for (const v of vehicles) {
            try {
              const vehicleLogs = await getLogsForVehicle(v.id);
              // ensure each log has id and vehicle info
              const normalized = (vehicleLogs || []).map((L) => ({
                ...L,
                id: L._id ?? L.id,
                vehicle: { id: v.id, name: v.name, make: v.make },
              }));
              allLogs.push(...normalized);
            } catch (e) {
              // ignore per-vehicle failure (still continue)
              console.warn("Failed to load logs for vehicle", v.id, e);
            }
          }
          // sort by date desc
          allLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
          if (mounted) setLogs(allLogs);
        } else {
          // load logs for the specific vehicle
          const v = vehicles.find((x) => x.id === selectedVehicleId);
          if (!v) {
            setLogs([]);
            return;
          }
          const vehicleLogs = await getLogsForVehicle(v.id);
          const normalized = (vehicleLogs || []).map((L) => ({
            ...L,
            id: L._id ?? L.id,
            vehicle:
              L.vehicle && typeof L.vehicle === "object"
                ? {
                    id: L.vehicle._id ?? L.vehicle.id ?? v.id,
                    name: L.vehicle.name ?? v.name,
                  }
                : { id: v.id, name: v.name },
          }));
          normalized.sort((a, b) => new Date(b.date) - new Date(a.date));
          if (mounted) setLogs(normalized);
        }
      } catch (err) {
        console.error("Failed to load logs", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    // Only call when vehicles are loaded (if there are vehicles)
    load();
    return () => {
      mounted = false;
    };
  }, [selectedVehicleId, vehicles, user]);

  // Filtering & search (same behavior as before)
  const filtered = useMemo(() => {
    let list = (logs ?? []).slice();
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
      to.setHours(23, 59, 59, 999);
      list = list.filter((L) => new Date(L?.date) <= to);
    }
    return list;
  }, [logs, query, dateFrom, dateTo]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const startIdx = (page - 1) * pageSize;
  const pageItems = filtered.slice(startIdx, startIdx + pageSize);

  /* handlers */
  const openAdd = () => {
    setFormInitial(null);
    setFormOpen(true);
  };
  const openEdit = (log) => {
    setFormInitial(log);
    setFormOpen(true);
  };
  const openView = (log) => {
    setActiveLog(log);
    setViewOpen(true);
  };
  const openDelete = (log) => {
    setActiveLog(log);
    setDeleteOpen(true);
  };

  // Save handler: create or update using API
  const handleSave = async (payload) => {
    // payload contains fields as built by LogFormModal
    try {
      if (!payload.vehicle || !payload.vehicle.id) {
        // If payload.vehicle is an id or object, handle both
        if (payload.vehicle && typeof payload.vehicle === "string") {
          // convert into object with id if possible
          payload.vehicle = { id: payload.vehicle, name: "" };
        } else {
          alert("Please select a vehicle.");
          return;
        }
      }
      const vehicleId = payload.vehicle.id ?? payload.vehicle;

      // Build body fields expected by backend
      const body = {
        date: payload.date,
        amount: Number(payload.amount),
        pricePerL: Number(payload.pricePerL),
        tripDistance: payload.tripDistance ? Number(payload.tripDistance) : 0,
        notes: payload.notes,
        odometer: payload.odometer ? Number(payload.odometer) : undefined,
      };

      if (payload.id) {
        // update existing log
        await updateLog(vehicleId, payload.id, body);
      } else {
        await createLog(vehicleId, body);
      }

      // reload logs
      // prefer to keep selectedVehicleId as-is so list refreshes correctly
      // small delay optional but immediate reload is fine
      if (selectedVehicleId === "all") {
        // reload all vehicle logs
        const vcopy = vehicles.slice();
        setLoading(true);
        const allLogs = [];
        for (const v of vcopy) {
          try {
            const vehicleLogs = await getLogsForVehicle(v.id);
            const normalized = (vehicleLogs || []).map((L) => ({
              ...L,
              id: L._id ?? L.id,
              vehicle: { id: v.id, name: v.name, make: v.make },
            }));
            allLogs.push(...normalized);
          } catch (e) {
            /* ignore */
          }
        }
        allLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
        setLogs(allLogs);
        setLoading(false);
      } else {
        const v = vehicles.find((x) => x.id === selectedVehicleId);
        const vehicleLogs = await getLogsForVehicle(v.id);
        const normalized = (vehicleLogs || []).map((L) => ({
          ...L,
          id: L._id ?? L.id,
          vehicle: { id: v.id, name: v.name },
        }));
        normalized.sort((a, b) => new Date(b.date) - new Date(a.date));
        setLogs(normalized);
      }

      setFormOpen(false);
      setFormInitial(null);
    } catch (err) {
      console.error("Save log failed", err);
      alert(err?.response?.data?.message ?? "Failed to save log");
    }
  };

  const confirmDelete = async (id) => {
    try {
      if (!activeLog) return;
      const vehicleId = activeLog.vehicle?.id ?? activeLog.vehicle;
      await deleteLog(vehicleId, id);
      // remove locally for instant UI feedback
      setLogs((s) => s.filter((x) => (x.id ?? x._id) !== id));
      setDeleteOpen(false);
      setActiveLog(null);
    } catch (err) {
      console.error("Delete failed", err);
      alert(err?.response?.data?.message ?? "Delete failed");
    }
  };

  // Vehicle selection helper for controls
  const vehicleOptions = useMemo(() => {
    return [
      { id: "all", name: "All vehicles" },
      ...vehicles.map((v) => ({ id: v.id, name: v.name })),
    ];
  }, [vehicles]);

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-sm text-[var(--muted)]">
          Please sign in to manage your fuel logs.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="bg-[var(--panel)] p-5 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Fuel Logs</h2>
          <p className="text-sm text-[var(--muted)] mt-1 max-w-prose">
            Add and manage fuel refills. Each log computes litres, mileage (if
            distance provided) and running cost/km.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedVehicleId}
            onChange={(e) => {
              setSelectedVehicleId(e.target.value);
              setPage(1);
            }}
            className="rounded-md border px-2 py-1"
          >
            {vehicleOptions.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>

          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--accent)] text-white ml-3 shadow"
          >
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
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by vehicle, notes or amount..."
              className="w-full outline-none text-sm"
            />
            {query ? (
              <button
                onClick={() => {
                  setQuery("");
                  setPage(1);
                }}
                className="p-1 rounded-md hover:bg-[var(--hover-bg)]"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <label className="text-xs text-[var(--muted)]">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              className="rounded-md border px-2 py-1 text-sm"
            />
            <label className="text-xs text-[var(--muted)]">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              className="rounded-md border px-2 py-1 text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-[var(--muted)] hidden sm:block">
              Page size
            </label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-md border px-2 py-1 text-sm"
            >
              {[6, 8, 10, 20].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* list */}
      <div>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: pageSize }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse h-24 bg-[var(--panel)] rounded-lg"
              />
            ))}
          </div>
        ) : (pageItems?.length ?? 0) === 0 ? (
          <div className="py-12 text-center text-[var(--muted)]">
            <p className="text-lg font-medium mb-3">No logs found</p>
            <p className="text-sm mb-4">Add a new fuel log to get started.</p>
            <button
              onClick={openAdd}
              className="px-4 py-2 rounded-md bg-[var(--accent)] text-white"
            >
              Add Log
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {pageItems?.map((l) => (
              <LogCard
                key={l?.id ?? l?._id}
                log={l}
                onView={openView}
                onEdit={openEdit} // <-- pass edit handler
                onDelete={openDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* pagination */}
      <Pagination
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(n) => {
          setPageSize(n);
          setPage(1);
        }}
      />

      {/* modals */}
      <LogFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initialData={formInitial}
        vehicles={vehicles}
      />
      <ViewLogModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        log={activeLog}
      />
      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={(id) => confirmDelete(id)}
        vehicle={activeLog?.vehicle}
      />
    </div>
  );
}
