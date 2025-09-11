// src/pages/Vehicles.jsx
import React, { useEffect, useMemo, useState } from "react";

/* components */
import HeaderControls from "../components/Controls/HeaderControls";
import VehicleCard from "../components/Card/VehicleCard";
import Pagination from "../components/Pagination/Pagination";
import VehicleFormModal from "../components/Modals/VehicleFormModal";
import ViewVehicleModal from "../components/Modals/ViewVehicleModal";
import ConfirmDeleteModal from "../components/Modals/ConfirmDeleteModal";

/* utils */
import { truncate } from "../utils/helpers";

/* icons used elsewhere (optional) */
import { FiSearch } from "react-icons/fi";

/* ---------- sample data (replace with API) ---------- */
const initialVehicles = [
  {
    id: "v1",
    userId: "u1",
    name: "Royal Enfield Hunter 350",
    make: "Royal Enfield",
    modelYear: 2023,
    fuelType: "Petrol",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
    notes: "Daily commuter, recently serviced. Good condition.",
    createdAt: "2024-07-12",
  },
  {
    id: "v2",
    userId: "u1",
    name: "Toyota Innova Crysta",
    make: "Toyota",
    modelYear: 2020,
    fuelType: "Diesel",
    imageUrl:
      "https://images.unsplash.com/photo-1542367597-4512c5e3b2d5?q=80&w=1200&auto=format&fit=crop",
    notes: "7-seater. Assigned to operations team.",
    createdAt: "2024-05-21",
  },
  {
    id: "v3",
    userId: "u2",
    name: "Tesla Model 3",
    make: "Tesla",
    modelYear: 2024,
    fuelType: "EV",
    imageUrl:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop",
    notes: "Corporate EV — fast charging enabled.",
    createdAt: "2024-08-01",
  },
  {
    id: "v4",
    userId: "u3",
    name: "Mahindra Thar",
    make: "Mahindra",
    modelYear: 2022,
    fuelType: "Petrol",
    imageUrl:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop",
    notes: "Offroad vehicle, occasionally used for field visits.",
    createdAt: "2024-03-09",
  },
];

export default function Vehicles() {
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

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setVehicles(initialVehicles);
      setLoading(false);
    }, 350);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [query]);

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
    if (sort === "name") list.sort((a,b) => a.name.localeCompare(b.name));
    if (sort === "year") list.sort((a,b) => (b.modelYear||0) - (a.modelYear||0));
    if (sort === "newest") list.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }, [vehicles, debouncedQuery, filterFuel, sort]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  const startIdx = (page - 1) * pageSize;
  const pageItems = filtered.slice(startIdx, startIdx + pageSize);

  /* handlers */
  const handleOpenAdd = () => { setFormInitial(null); setFormOpen(true); };
  const handleSaveVehicle = (payload) => {
    if (payload.id) {
      setVehicles(s => s.map(v => (v.id === payload.id ? { ...v, ...payload } : v)));
    } else {
      const newV = { ...payload, id: "v" + Date.now(), createdAt: new Date().toISOString() };
      setVehicles(s => [newV, ...s]);
    }
  };

  const openEdit = (v) => { setFormInitial(v); setFormOpen(true); };
  const openView = (v) => { setActiveVehicle(v); setViewOpen(true); };
  const openDelete = (v) => { setActiveVehicle(v); setDeleteOpen(true); };

  const confirmDelete = (id) => {
    setVehicles(s => s.filter(x => x.id !== id));
    setDeleteOpen(false);
    setActiveVehicle(null);
  };

  const uniqueFuels = useMemo(() => ["All", ...Array.from(new Set(vehicles.map(v => v.fuelType)))], [vehicles]);

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

          <button onClick={handleOpenAdd} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--accent)] text-white ml-3 shadow">
            Add Vehicle
          </button>
        </div>
      </div>

      {/* controls row - uses HeaderControls component */}
      <HeaderControls
        query={query}
        onQueryChange={(v) => { setQuery(v); setPage(1); }}
        total={total}
        pageSize={pageSize}
        onPageSizeChange={(n) => { setPageSize(n); setPage(1); }}
        onAdd={handleOpenAdd}
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
            <button onClick={handleOpenAdd} className="px-4 py-2 rounded-md bg-[var(--accent)] text-white">Add Vehicle</button>
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
      <VehicleFormModal open={formOpen} onClose={() => setFormOpen(false)} onSave={(payload) => {
        // if payload has id -> update; else create
        if (payload.id) {
          setVehicles(s => s.map(x => x.id === payload.id ? { ...x, ...payload } : x));
        } else {
          const newV = { ...payload, id: "v" + Date.now(), createdAt: new Date().toISOString() };
          setVehicles(s => [newV, ...s]);
        }
      }} initialData={formInitial} />

      <ViewVehicleModal open={viewOpen} onClose={() => setViewOpen(false)} vehicle={activeVehicle} />
      <ConfirmDeleteModal open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={confirmDelete} vehicle={activeVehicle} />
    </div>
  );
}
