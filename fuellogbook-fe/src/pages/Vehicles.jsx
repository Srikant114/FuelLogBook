// src/pages/Vehicles.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

/* components */
import HeaderControls from "../components/Controls/HeaderControls";
import VehicleCard from "../components/Card/VehicleCard";
import Pagination from "../components/Pagination/Pagination";
import VehicleFormModal from "../components/Modals/VehicleFormModal";
import ViewVehicleModal from "../components/Modals/ViewVehicleModal";
import ConfirmDeleteModal from "../components/Modals/ConfirmDeleteModal";

/* API */
import {
  getMyVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  uploadVehicleImage,
} from "../api/vehicles";

/* utils */
import { truncate } from "../utils/helpers";

/* icons used elsewhere (optional) */
import { FiSearch } from "react-icons/fi";

/**
 * Helper: normalize backend vehicle (_id -> id)
 */
function normalizeVehicle(raw) {
  if (!raw) return null;
  return {
    ...raw,
    id: raw._id ?? raw.id,
  };
}

/**
 * Convert dataURL (base64) to File object
 */
function dataURLtoFile(dataurl, filename = "image.png") {
  if (!dataurl) return null;
  const arr = dataurl.split(",");
  if (arr.length < 2) return null;
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}

export default function Vehicles() {
  const { user } = useAuth();

  // === state/hooks (UNCONDITIONAL - must run in same order every render) ===
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [pageSize, setPageSize] = useState(9);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");
  const [filterFuel, setFilterFuel] = useState("All");

  /* modals */
  const [formOpen, setFormOpen] = useState(false);
  const [formInitial, setFormInitial] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeVehicle, setActiveVehicle] = useState(null);

  // Load user's vehicles from backend
  async function loadVehicles() {
    setLoading(true);
    try {
      const list = await getMyVehicles(); // backend returns array in res.data.data
      const normalized = Array.isArray(list) ? list.map(normalizeVehicle) : [];
      setVehicles(normalized);
    } catch (err) {
      console.error("Failed to load vehicles", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) loadVehicles();
    else {
      setVehicles([]);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [query]);

  // filtering / sorting (same as your original)
  const filtered = useMemo(() => {
    let list = vehicles.slice();
    if (debouncedQuery) {
      list = list.filter((v) => {
        const q = debouncedQuery;
        return (v.name || "").toLowerCase().includes(q) ||
               (v.make || "").toLowerCase().includes(q) ||
               (v.fuelType || "").toLowerCase().includes(q) ||
               (v.notes || "").toLowerCase().includes(q);
      });
    }
    if (filterFuel !== "All") {
      list = list.filter((v) => v.fuelType === filterFuel);
    }
    if (sort === "name") list.sort((a,b) => (a.name||"").localeCompare(b.name||""));
    if (sort === "year") list.sort((a,b) => (b.modelYear||0) - (a.modelYear||0));
    if (sort === "newest") list.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }, [vehicles, debouncedQuery, filterFuel, sort]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  const startIdx = (page - 1) * pageSize;
  const pageItems = filtered.slice(startIdx, startIdx + pageSize);

  // Unique fuels list (UNCONDITIONAL hook)
  const uniqueFuels = useMemo(() => ["All", ...Array.from(new Set(vehicles.map(v => v.fuelType)))], [vehicles]);

  // === end hooks ===

  /* handlers (wired to backend) */
  const handleOpenAdd = () => { setFormInitial(null); setFormOpen(true); };
  const openEdit = (v) => { setFormInitial(v); setFormOpen(true); };
  const openView = (v) => { setActiveVehicle(v); setViewOpen(true); };
  const openDelete = (v) => { setActiveVehicle(v); setDeleteOpen(true); };

  async function handleSaveVehicle(payload) {
    try {
      if (payload.id) {
        const updateBody = {
          name: payload.name,
          make: payload.make,
          modelYear: payload.modelYear ? Number(payload.modelYear) : undefined,
          fuelType: payload.fuelType,
          notes: payload.notes,
        };
        await updateVehicle(payload.id, updateBody);
        if (payload.imageUrl && String(payload.imageUrl).startsWith("data:")) {
          const file = dataURLtoFile(payload.imageUrl, `vehicle-${payload.id}.png`);
          if (file) await uploadVehicleImage(payload.id, file);
        } else if (payload.imageUrl && payload.imageUrl.startsWith("http")) {
          await updateVehicle(payload.id, { imageUrl: payload.imageUrl });
        }
      } else {
        const createBody = {
          name: payload.name,
          make: payload.make,
          modelYear: payload.modelYear ? Number(payload.modelYear) : undefined,
          fuelType: payload.fuelType,
          notes: payload.notes,
        };
        const created = await createVehicle(createBody);
        let createdVehicle = created;
        if (created?.data) createdVehicle = created.data;
        if (createdVehicle?.data) createdVehicle = createdVehicle.data;
        const createdId = createdVehicle?._id ?? createdVehicle?.id ?? createdVehicle?._id;
        if (createdId && payload.imageUrl && String(payload.imageUrl).startsWith("data:")) {
          const file = dataURLtoFile(payload.imageUrl, `vehicle-${createdId}.png`);
          if (file) await uploadVehicleImage(createdId, file);
        } else if (createdId && payload.imageUrl && payload.imageUrl.startsWith("http")) {
          await updateVehicle(createdId, { imageUrl: payload.imageUrl });
        }
      }

      await loadVehicles();
    } catch (err) {
      console.error("Save vehicle failed", err);
      alert(err?.response?.data?.message ?? "Failed to save vehicle");
    } finally {
      setFormOpen(false);
      setFormInitial(null);
    }
  }

  async function handleConfirmDelete(id) {
    try {
      await deleteVehicle(id);
      setVehicles((s) => s.filter((v) => v.id !== id));
      setDeleteOpen(false);
      setActiveVehicle(null);
    } catch (err) {
      console.error("Delete failed", err);
      alert(err?.response?.data?.message ?? "Delete failed");
    }
  }

  // If user is not logged in, show message (render-only, after hooks)
  if (!user) {
    return (
      <div className="p-6">
        <div className="text-sm text-[var(--muted)]">Please sign in to view your vehicles</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="bg-[var(--panel)] p-5 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Vehicles</h2>
          <p className="text-sm text-[var(--muted)] mt-1 max-w-prose">
            Manage fleet vehicles — add, inspect, or remove. Use search and filters to quickly find a vehicle.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-[var(--muted)] mr-2 hidden sm:block">Filters</div>

          <div className="flex items-center gap-2">
            {uniqueFuels.map(f => (
              <button
                key={f}
                onClick={() => { setFilterFuel(f); setPage(1); }}
                className={`text-sm px-3 py-1.5 rounded-full border ${filterFuel===f ? "bg-[var(--accent)] text-white border-transparent shadow" : "bg-[var(--panel)] text-[var(--text)] hover:bg-[var(--hover-bg)]"}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="ml-3">
            <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="rounded-md border px-2 py-1 text-sm">
              <option value="newest">Newest</option>
              <option value="name">Name</option>
              <option value="year">Model Year</option>
            </select>
          </div>

          <button onClick={() => { setFormInitial(null); setFormOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--accent)] text-white ml-3 shadow">
            Add Vehicle
          </button>
        </div>
      </div>

      {/* controls row */}
      <HeaderControls
        query={query}
        onQueryChange={(v) => { setQuery(v); setPage(1); }}
        total={total}
        pageSize={pageSize}
        onPageSizeChange={(n) => { setPageSize(n); setPage(1); }}
        onAdd={() => { setFormInitial(null); setFormOpen(true); }}
        uniqueFuels={uniqueFuels}
        filterFuel={filterFuel}
        setFilterFuel={(f) => { setFilterFuel(f); setPage(1); }}
      />

      {/* grid */}
      <div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: pageSize }).map((_, i) => (
              <div key={i} className="animate-pulse bg-[var(--panel)] p-4 rounded-xl">
                <div className="h-40 bg-gray-200 rounded-md mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : pageItems.length === 0 ? (
          <div className="py-12 text-center text-[var(--muted)]">
            <p className="text-lg font-medium mb-3">No vehicles found</p>
            <p className="text-sm mb-4">Try removing filters or add a new vehicle.</p>
            <button onClick={() => { setFormInitial(null); setFormOpen(true); }} className="px-4 py-2 rounded-md bg-[var(--accent)] text-white">Add Vehicle</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pageItems.map((v) => (
              <VehicleCard key={v.id} vehicle={v} onView={openView} onEdit={openEdit} onDelete={openDelete} />
            ))}
          </div>
        )}
      </div>

      <Pagination total={total} page={page} pageSize={pageSize} onPageChange={(p)=>setPage(p)} onPageSizeChange={(n)=>{ setPageSize(n); setPage(1); }} />

      {/* modals */}
      <VehicleFormModal open={formOpen} onClose={() => setFormOpen(false)} onSave={handleSaveVehicle} initialData={formInitial} />

      <ViewVehicleModal open={viewOpen} onClose={() => setViewOpen(false)} vehicle={activeVehicle} />
      <ConfirmDeleteModal open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={() => handleConfirmDelete(activeVehicle?.id)} vehicle={activeVehicle} />
    </div>
  );
}
