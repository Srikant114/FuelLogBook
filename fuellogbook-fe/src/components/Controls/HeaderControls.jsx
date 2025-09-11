// src/components/Controls/HeaderControls.jsx
import React, { useRef } from "react";
import { FiSearch, FiX, FiPlus } from "react-icons/fi";

/**
 * HeaderControls - search + page size + total + add button + filters placeholder
 * Props:
 * - query, onQueryChange
 * - total
 * - pageSize, onPageSizeChange
 * - onAdd
 * - uniqueFuels, filterFuel, setFilterFuel
 * - showFilters boolean (optional)
 */
export default function HeaderControls({
  query,
  onQueryChange,
  total,
  pageSize,
  onPageSizeChange,
  onAdd,
  uniqueFuels = ["All"],
  filterFuel,
  setFilterFuel,
}) {
  const ref = useRef(null);

  return (
    <div className="space-y-3 md:space-y-0 md:flex md:items-center md:justify-between">
      <div className="flex items-center gap-2 w-full max-w-xl">
        <div className="flex items-center gap-2 border rounded-md px-3 py-2 w-full bg-white">
          <FiSearch className="text-[var(--muted)]" />
          <input
            ref={ref}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search vehicles, make, fuel type or notes..."
            className="w-full outline-none text-sm"
          />
          {query ? (
            <button onClick={() => { onQueryChange(""); ref.current?.focus(); }} className="p-1 rounded-md hover:bg-[var(--hover-bg)]">
              <FiX />
            </button>
          ) : (
            <div className="text-[var(--muted)] text-xs px-2 hidden sm:block">Press / to search</div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-sm text-[var(--muted)] hidden sm:block">Total <span className="font-semibold text-[var(--text)]">{total}</span></div>

        <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block" />

        <div className="flex items-center gap-2">
          <label className="text-xs text-[var(--muted)] hidden sm:block">Page size</label>
          <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))} className="rounded-md border px-2 py-1 text-sm">
            {[6,9,12,24].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2 ml-2">
          <button onClick={onAdd} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--accent)] text-white ml-3 shadow">
            <FiPlus /> Add Vehicle
          </button>
        </div>
      </div>
    </div>
  );
}
