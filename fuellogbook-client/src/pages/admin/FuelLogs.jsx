// src/pages/admin/FuelLogs.jsx
import React, { useCallback, useEffect, useState } from "react";
import TitleAdmin from "../../components/common/TitleAdmin";
import Modal from "../../components/admin/Modal";
import LogForm from "../../components/admin/LogForm";
import ConfirmDelete from "../../components/admin/ConfirmDelete";
import LogRow from "../../components/admin/LogRow";
import Pagination from "../../components/admin/Pagination";
import VehicleSelectDropdown from "../../components/admin/VehicleSelectDropdown";
import Spinner from "../../components/common/Spinner";
import { PlusCircle } from "lucide-react";
import { api } from "../../utils/CallApi";
import toast from "react-hot-toast";
import { useLogsApi } from "../../context/LogsApiContext";

/**
 * FuelLogs page — shows logs across vehicles (or for a selected vehicle).
 *
 * Behavior:
 *  - Default: selectedVehicleId === "" => show logs for ALL vehicles (aggregated).
 *  - Selecting a specific vehicle will fetch logs for that vehicle only.
 *
 * Notes:
 *  - Aggregating logs across vehicles requires multiple requests (one per vehicle).
 *    For production you should add a backend endpoint that returns logs for all vehicles
 *    of the current user in a single request to avoid many round-trips.
 */

export default function FuelLogs() {
  // UI pagination (client-side)
  const PAGE_SIZE = 10;

  // Vehicles selection (VehicleSelectDropdown handles paged fetching for the dropdown)
  const [selectedVehicleId, setSelectedVehicleId] = useState(""); // "" means ALL vehicles
  const [vehiclesForTable, setVehiclesForTable] = useState([]); // minimal vehicle list used to map names

  // Logs data (aggregated)
  const [logs, setLogs] = useState([]); // array of log objects
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [error, setError] = useState(null);

  // local pagination
  const [currentPage, setCurrentPage] = useState(1);

  // modal / edit / delete states
  const [openAddEdit, setOpenAddEdit] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  // Filters (simple date-range preset)
  const [datePreset, setDatePreset] = useState("30"); // e.g. "7","15","30","90","365","custom"
  const [customRange, setCustomRange] = useState({ start: "", end: "" });

  // Derived: visible logs for current page
  const totalPages = Math.max(1, Math.ceil(logs.length / PAGE_SIZE));
  const visibleLogs = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return logs.slice(start, start + PAGE_SIZE);
  }, [logs, currentPage]);

  // logs api context
  const logsApi = useLogsApi();

  // -----------------------------
  // Helper: fetch logs for a single vehicle
  // -----------------------------
  const fetchLogsForVehicle = useCallback(
    async (vehicleId) => {
      try {
        const res = await logsApi.getLogs(vehicleId);
        if (res && res.success) {
          // backend returns { success, count, logs }
          return Array.isArray(res.logs) ? res.logs : res.data?.logs ?? res.logs ?? [];
        }
        return [];
      } catch (err) {
        console.error("fetchLogsForVehicle error:", err);
        return [];
      }
    },
    [logsApi]
  );

  // -----------------------------
  // Helper: fetch all vehicles for current user (one request, used for aggregation & name mapping)
  // -----------------------------
  const fetchAllVehiclesForUser = useCallback(async () => {
    try {
      const res = await api.get("/api/vehicles/get-all-vehicles", { query: { page: 1, pageSize: 1000 } });
      // Expected shape: { success, data: [...vehicles], total, page, pageSize }
      if (res && res.success) {
        return Array.isArray(res.data) ? res.data : res.data ?? [];
      }
      return [];
    } catch (err) {
      console.error("fetchAllVehiclesForUser error:", err);
      return [];
    }
  }, []);

  // -----------------------------
  // Main fetch function:
  //  - if selectedVehicleId === "" -> aggregate logs across all vehicles of current user
  //  - else -> fetch single vehicle logs
  // -----------------------------
  const fetchLogs = useCallback(async () => {
    setLoadingLogs(true);
    setError(null);
    setLogs([]);
    setCurrentPage(1);

    try {
      if (!selectedVehicleId) {
        // === ALL VEHICLES ===
        // 1) get user's vehicles (name / id)
        const vehicles = await fetchAllVehiclesForUser();
        setVehiclesForTable(vehicles || []);

        if (!vehicles || vehicles.length === 0) {
          setLogs([]);
          return;
        }

        // 2) fetch logs per vehicle and aggregate
        // NOTE: this may do many requests; consider a backend endpoint that returns all logs in one call
        const allLogs = [];
        // fetch all vehicles logs concurrently but handle per-request errors
        const promises = vehicles.map(async (v) => {
          try {
            const listRes = await logsApi.getLogs(v._id || v.id);
            if (listRes && listRes.success) {
              const list = Array.isArray(listRes.logs) ? listRes.logs : listRes.data?.logs ?? listRes.logs ?? [];
              return list.map((log) => ({ ...log, vehicleId: v._id || v.id, vehicleName: v.name }));
            }
            return [];
          } catch (err) {
            console.warn("one vehicle logs failed:", v._id || v.id, err);
            return [];
          }
        });

        const perVehicleLogs = await Promise.all(promises);
        perVehicleLogs.forEach((arr) => allLogs.push(...arr));

        // Sort aggregated logs by date desc
        allLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
        setLogs(allLogs);
      } else {
        // === SINGLE VEHICLE ===
        // fetch logs for that vehicle and also fetch vehicle info for mapping
        const [vehicleRes, logsRes] = await Promise.allSettled([
          api.get(`/api/vehicles/get-vehicle/${selectedVehicleId}`), // expecting { success, data: vehicle }
          logsApi.getLogs(selectedVehicleId),
        ]);

        // vehicle info
        if (vehicleRes.status === "fulfilled" && vehicleRes.value && vehicleRes.value.success) {
          setVehiclesForTable([vehicleRes.value.data]);
        } else {
          // fallback: clear mapping
          setVehiclesForTable([]);
        }

        // logs
        if (logsRes.status === "fulfilled" && logsRes.value && logsRes.value.success) {
          const logsArray = Array.isArray(logsRes.value.logs) ? logsRes.value.logs : logsRes.value.data?.logs ?? logsRes.value.logs ?? [];
          const vehicleName = vehicleRes.status === "fulfilled" && vehicleRes.value && vehicleRes.value.success ? vehicleRes.value.data?.name : "";
          const final = (logsArray || []).map((l) => ({ ...l, vehicleName }));
          final.sort((a, b) => new Date(b.date) - new Date(a.date));
          setLogs(final);
        } else {
          setLogs([]);
        }
      }
    } catch (err) {
      console.error("fetchLogs error:", err);
      setError("Unable to load logs");
      toast.error("Failed to fetch logs");
    } finally {
      setLoadingLogs(false);
    }
  }, [selectedVehicleId, fetchAllVehiclesForUser, logsApi]);

  // fetch logs initially and whenever selectedVehicleId / filters change
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs, datePreset, customRange]);

  // -----------------------------
  // Handlers: add / edit / delete flows (local-update + server calls)
  // -----------------------------
  const openAdd = () => {
    setEditing(null);
    setOpenAddEdit(true);
  };
  const openEdit = (log) => {
    setEditing(log);
    setOpenAddEdit(true);
  };

  /**
   * onSubmit handler for the modal form.
   * The child LogForm now calls onSubmit(returnedLog, backendMessage).
   * We use backendMessage (if present) for the toast text.
   */
  const handleSubmitFromModal = async (returnedLog, backendMessage) => {
    try {
      if (!returnedLog) {
        setOpenAddEdit(false);
        return;
      }

      // Update existing
      if (editing && (editing._id || editing.id)) {
        setLogs((prev) => prev.map((l) => ((l._id || l.id) === (returnedLog._id || returnedLog.id) ? returnedLog : l)));
        toast.success(backendMessage || "Log updated");
      } else {
        // New log -> add to top
        setLogs((prev) => [returnedLog, ...prev]);
        toast.success(backendMessage || "Log added");
      }
    } catch (err) {
      console.warn("handleSubmitFromModal error:", err);
      toast.error("Operation completed but UI refresh failed");
    } finally {
      setOpenAddEdit(false);
      setEditing(null);
    }
  };

  // Delete: call backend then remove from state
  const openDelete = (log) => {
    setToDelete(log);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      // Determine vehicleId and logId
      const vehicleId = toDelete.vehicleId || toDelete.vehicle || "";
      const logId = toDelete._id || toDelete.id;
      if (!vehicleId || !logId) {
        toast.error("Missing identifiers for delete");
        return;
      }
      const res = await logsApi.deleteLog(vehicleId, logId);
      if (res && res.success) {
        setLogs((prev) => prev.filter((l) => (l._id || l.id) !== logId));
        // Use backend message when present
        toast.success(res.message || "Log deleted");
      } else {
        toast.error(res?.message || "Delete failed");
      }
    } catch (err) {
      console.error("confirmDelete error:", err);
      toast.error(err?.message || "Delete failed");
    } finally {
      setToDelete(null);
      setDeleteOpen(false);
    }
  };

  // -----------------------------
  // Utility: map vehicle id -> name (uses vehiclesForTable)
  // -----------------------------
  const vehicleNameById = useCallback(
    (id) => {
      const v = vehiclesForTable.find((x) => (x._id || x.id) === id);
      return v ? v.name : "";
    },
    [vehiclesForTable]
  );

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="px-4 pt-4 md:px-10 flex-1">
      <TitleAdmin
        title="Logs"
        subTitle="Fuel logs per vehicle — add refuels, track mileage and running costs."
      />

      <section className="mb-6">
        {/* Header row: title + add button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-theme dark:text-theme">Fleet</h2>
            <p className="text-sm text-theme-light dark:text-theme-light">Showing vehicle logs</p>
          </div>

          <div>
            <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-sm bg-primary text-white hover:bg-primary-dark transition">
              <PlusCircle size={18} className="text-white"/>
              <span className="text-sm font-medium text-white">Add Log</span>
            </button>
          </div>
        </div>

        {/* Filter / controls row */}
        <div className="mb-4 flex flex-col md:flex-row md:items-center gap-3 justify-between">
          {/* Left side: vehicle select + spinner */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-64">
              {/* VehicleSelectDropdown handles its own paged fetching */}
              <VehicleSelectDropdown
                value={selectedVehicleId}
                onChange={(val) => {
                  setSelectedVehicleId(val);
                }}
                onlyWithLogs={true}
                pageSize={10}
                includeAllOption={true}
                placeholder="All Vehicles"
              />
            </div>

            {/* small spinner while logs are loading */}
            {loadingLogs && (
              <div className="flex items-center">
                <Spinner className="text-primary dark:text-white" />
              </div>
            )}
          </div>

          {/* Right side: date presets / custom range */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Presets */}
            {["7", "15", "30", "90", "365", "custom"].map((p) => (
              <button
                key={p}
                onClick={() => setDatePreset(p)}
                className={`px-3 py-1 rounded-full text-sm ${datePreset === p ? "bg-primary !text-white" : "bg-theme border border-gray-300 dark:border-slate-700/60 text-theme-light dark:text-theme-light"}`}
              >
                {p === "custom" ? "Custom" : `Last ${p}d`}
              </button>
            ))}

            {/* Custom range inputs (visible if custom) */}
            {datePreset === "custom" && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={customRange.start}
                  onChange={(e) => setCustomRange((s) => ({ ...s, start: e.target.value }))}
                  className="py-1 px-2 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white text-sm"
                />
                <span className="text-sm text-theme-light dark:text-theme-light">to</span>
                <input
                  type="date"
                  value={customRange.end}
                  onChange={(e) => setCustomRange((s) => ({ ...s, end: e.target.value }))}
                  className="py-1 px-2 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white text-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* Logs table / list */}
        <div className="w-full md:p-0 p-2">
          <div className="flex flex-col items-center max-w-6xl w-full overflow-hidden rounded-md bg-theme border border-gray-500/10 dark:border-slate-700/40">
            {/* Table for md+ screens */}
            <table className="md:table-auto table-fixed w-full overflow-hidden">
              <thead className="hidden md:table-header-group text-theme dark:text-white text-sm text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold truncate">Vehicle / Date</th>
                  <th className="px-4 py-3 font-semibold truncate">Amount</th>
                  <th className="px-4 py-3 font-semibold truncate hidden md:block">Litres / Mileage</th>
                  <th className="px-4 py-3 font-semibold truncate">Distance / Cost</th>
                  <th className="px-4 py-3 font-semibold truncate">Actions</th>
                </tr>
              </thead>

              <tbody className="text-sm text-theme dark:text-white">
                {visibleLogs.map((log) => {
                  // ensure vehicleName exists (in aggregated case we attached it); fallback to mapping:
                  const vehicleName = log.vehicleName || vehicleNameById(log.vehicleId || log.vehicle) || "Unknown";
                  return (
                    <LogRow
                      key={log._id || log.id}
                      log={log}
                      vehicleName={vehicleName}
                      onEdit={() => openEdit(log)}
                      onDelete={() => openDelete(log)}
                    />
                  );
                })}

                {visibleLogs.length === 0 && !loadingLogs && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-theme-light dark:text-theme-light">No logs yet. Add your first refuel.</td>
                  </tr>
                )}

                {loadingLogs && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <Spinner className="text-primary dark:text-white" />
                        <span className="text-theme-light dark:text-theme-light">Loading logs...</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination footer — hide if only one page or no logs */}
          {!loadingLogs && logs.length > 0 && (
            <div className="mt-6 flex justify-center">
              <div className="w-full max-w-md">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(p) => setCurrentPage(p)}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Add / Edit modal */}
      <Modal open={openAddEdit} onClose={() => setOpenAddEdit(false)} size="md">
        <LogForm
          initialData={editing}
          // Provide vehicles list to modal: we will fetch pages inside VehicleSelectDropdown within LogForm
          vehicles={vehiclesForTable}
          onCancel={() => {
            setOpenAddEdit(false);
            setEditing(null);
          }}
          onSubmit={handleSubmitFromModal}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} size="sm">
        <ConfirmDelete
          openItemName={toDelete ? `${vehicleNameById(toDelete.vehicleId || toDelete.vehicle) || "this item"} — ${toDelete.date ? new Date(toDelete.date).toLocaleDateString() : ""}` : ""}
          onCancel={() => {
            setDeleteOpen(false);
            setToDelete(null);
          }}
          onConfirm={confirmDelete}
        />
      </Modal>
    </div>
  );
}
