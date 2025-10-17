// src/components/admin/VehicleSelectDropdown.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../../utils/CallApi";
import { ChevronsDown } from "lucide-react";
import Spinner from "../common/Spinner";

/**
 * VehicleSelectDropdown
 *
 * - Fetches pages only when dropdown is opened.
 * - Shows `pageSize` items per fetch, then loads next page when scrolled to bottom.
 * - includeAllOption (default true): adds an "All Vehicles" option at the top.
 *
 * Props:
 *  - value ("" for all, or vehicle id)
 *  - onChange(value) -> value: "" or id
 *  - onlyWithLogs (boolean) -> hasLogs=true to backend (use on main Logs page)
 *  - pageSize (number) default 10
 *  - placeholder (string)
 *  - includeAllOption (boolean) default true
 *  - className (string)
 */
export default function VehicleSelectDropdown({
  value,
  onChange = () => {},
  onlyWithLogs = false,
  pageSize = 10,
  placeholder = "Select vehicle",
  includeAllOption = true,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]); // loaded pages concatenated
  const [page, setPage] = useState(0); // last loaded page number
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const containerRef = useRef(null);
  const listRef = useRef(null);
  const abortRef = useRef(null);

  // helper: fetch page p
  const fetchPage = useCallback(
    async (p = 1) => {
      // stop if we already loaded all
      if (total !== null && items.length >= total) return;
      setLoading(true);
      setError(null);
      try {
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        const query = { page: p, pageSize };
        if (onlyWithLogs) query.hasLogs = true;

        const res = await api.get(`/api/vehicles/get-all-vehicles`, { query });

        if (res && res.success) {
          const newItems = Array.isArray(res.data) ? res.data : [];
          // ensure no duplicates when pages reloaded
          setItems((prev) => {
            if (p === 1) return newItems;
            // avoid duplicates by id
            const ids = new Set(prev.map((x) => x._id || x.id));
            const appended = newItems.filter((x) => !ids.has(x._id || x.id));
            return [...prev, ...appended];
          });
          setPage(res.page || p);
          setTotal(res.total ?? null);
        } else {
          setError(res?.message || "Failed to load vehicles");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("VehicleSelectDropdown fetch error:", err);
          setError(err?.message || "Load failed");
        }
      } finally {
        setLoading(false);
      }
    },
    [onlyWithLogs, pageSize, total, items.length]
  );

  // when dropdown opens -> fetch page1 if not already fetched
  useEffect(() => {
    if (open && page === 0 && !loading && (items.length === 0 || total === null)) {
      fetchPage(1);
    }
    // outside click closes dropdown
    const onDocClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => {
      document.removeEventListener("click", onDocClick);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [open, page, loading, items.length, total, fetchPage]);

  // handle scroll inside list -> load next page
  const handleScroll = React.useCallback(
    (e) => {
      const el = e.target;
      if (!el) return;
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
      if (nearBottom && !loading) {
        const nextPage = page + 1;
        const maxPage = total ? Math.ceil(total / pageSize) : null;
        if (!maxPage || nextPage <= maxPage) {
          fetchPage(nextPage);
        }
      }
    },
    [fetchPage, loading, page, total, pageSize]
  );

  // label for selected value (try find in loaded items; if not loaded and value present -> show placeholder)
  const selectedLabel = React.useMemo(() => {
    if (!value || value === "") return includeAllOption ? "All Vehicles" : placeholder;
    const found = items.find((it) => (it._id || it.id) === value);
    return found ? found.name : placeholder;
  }, [items, value, includeAllOption, placeholder]);

  // render list entries
  const renderListItems = () => {
    const rows = [];

    // All Vehicles option at top (if enabled)
    if (includeAllOption) {
      rows.push(
        <button
          key="__all__"
          type="button"
          onClick={() => {
            onChange("");
            setOpen(false);
          }}
          className={`w-full text-left px-3 py-2 hover:bg-slate-100/60 dark:hover:bg-white/6 flex items-center justify-between ${value === "" ? "bg-primary/10" : ""}`}
        >
          <span className={`truncate ${value === "" ? "font-semibold text-theme" : "text-theme"}`}>All Vehicles</span>
          <span className="text-xs text-theme-light dark:text-theme-light">{total !== null ? `${items.length === 0 ? 0 : items.length} / ${total}` : ""}</span>
        </button>
      );
    }

    // vehicle rows
    items.forEach((v) => {
      const id = v._id || v.id;
      const selected = id === value;
      rows.push(
        <button
          key={id}
          type="button"
          onClick={() => {
            onChange(id);
            setOpen(false);
          }}
          className={`w-full text-left px-3 py-2 hover:bg-slate-100/60 dark:hover:bg-white/6 flex items-center justify-between ${selected ? "bg-primary/10" : ""}`}
        >
          <span className={`truncate ${selected ? "font-semibold text-theme" : "text-theme"}`}>{v.name}</span>
          <span className="text-xs text-theme-light dark:text-theme-light">{v.make ?? ""}</span>
        </button>
      );
    });

    return rows;
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* trigger */}
      <button
        type="button"
        className="w-full text-left py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white flex items-center justify-between gap-2"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`truncate ${value ? "text-theme" : "text-theme-light dark:text-theme-light"}`}>{selectedLabel}</span>
        <div className="flex items-center gap-2">
          {/* show small count + spinner when loading */}
          {loading ? (
            <Spinner className="text-primary dark:text-white" size={16} />
          ) : (
            <span className="text-xs text-theme-light dark:text-theme-light mr-2">{items.length ? `${items.length}${total ? ` / ${total}` : ""}` : ""}</span>
          )}
          <ChevronsDown size={16} />
        </div>
      </button>

      {/* dropdown */}
      {open && (
        <div
          className="absolute z-40 mt-2 right-0 left-0 bg-theme dark:bg-theme-dark border border-gray-200 dark:border-slate-700/40 rounded shadow-lg max-h-64 overflow-hidden"
          style={{ minWidth: 220 }}
        >
          <div ref={listRef} className="overflow-auto max-h-60 no-scrollbar" onScroll={handleScroll} role="listbox" tabIndex={0}>
            {renderListItems()}

            {/* footer row: loader / error / end */}
            <div className="p-2 text-center">
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner className="text-primary dark:text-white" size={16} />
                  <div className="text-xs text-theme-light dark:text-theme-light">Loading...</div>
                </div>
              ) : error ? (
                <div className="text-xs text-red-500">{error}</div>
              ) : total !== null && items.length >= total ? (
                <div className="text-xs text-theme-light dark:text-theme-light">End of list</div>
              ) : (
                <div className="text-xs text-theme-light dark:text-theme-light">Scroll to load more</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
