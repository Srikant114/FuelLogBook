import React from "react";
import TitleAdmin from "../../components/common/TitleAdmin";
import Modal from "../../components/admin/Modal"; // adjust path if necessary
import LogForm from "../../components/admin/LogForm";
import ConfirmDelete from "../../components/admin/ConfirmDelete";
import LogRow from "../../components/admin/LogRow";
import Pagination from "../../components/admin/Pagination";
import { PlusCircle } from "lucide-react";

/**
 * Logs Page
 * - Uses dummy vehicles + dummy logs for now
 * - Add / Edit / Delete handled locally (use API in future)
 */

const DUMMY_VEHICLES = [
  { id: "v1", name: "Hunter 350" },
  { id: "v2", name: "KTM 390" },
  { id: "v3", name: "Tesla Model 3" },
];

const DUMMY_LOGS = [
  {
    id: "l1",
    vehicleId: "v1",
    userId: "u1",
    date: new Date().toISOString(),
    amount: 1200,
    pricePerL: 100,
    litres: 12,
    tripDistance: 180,
    mileage: 15,
    runningCostPerKm: 6.67,
    odometer: 12345,
    notes: "City + highway mix",
  },
  {
    id: "l2",
    vehicleId: "v2",
    userId: "u1",
    date: new Date().toISOString(),
    amount: 700,
    pricePerL: 95,
    litres: 7.368,
    tripDistance: 100,
    mileage: 13.57,
    runningCostPerKm: 7.00,
    odometer: 5432,
    notes: "Short trip",
  },
];

export default function FuelLogs() {
  const [vehicles] = React.useState(DUMMY_VEHICLES);
  const [logs, setLogs] = React.useState(DUMMY_LOGS);

  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.max(1, Math.ceil(logs.length / PAGE_SIZE));
  const visibleLogs = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return logs.slice(start, start + PAGE_SIZE);
  }, [logs, currentPage]);

  // modal states
  const [openAddEdit, setOpenAddEdit] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [toDelete, setToDelete] = React.useState(null);

  // actions
  const openAdd = () => {
    setEditing(null);
    setOpenAddEdit(true);
  };

  const openEdit = (log) => {
    setEditing(log);
    setOpenAddEdit(true);
  };

  const handleSubmit = (payload) => {
    if (editing) {
      setLogs((prev) => prev.map((l) => (l.id === editing.id ? { ...l, ...payload } : l)));
    } else {
      const newLog = { id: `l${Date.now()}`, ...payload };
      setLogs((prev) => [newLog, ...prev]);
      setCurrentPage(1);
    }
    setOpenAddEdit(false);
  };

  const openDelete = (log) => {
    setToDelete(log);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    setLogs((prev) => prev.filter((l) => l.id !== toDelete.id));
    setToDelete(null);
    setDeleteOpen(false);
  };

  return (
    <div className="px-4 pt-4 md:px-10 flex-1">
      <TitleAdmin title="Logs" subTitle="Fuel logs per vehicle — add refuels, track mileage and running costs." />

      <section className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-theme dark:text-theme">Fleet</h2>
            <p className="text-sm text-theme-light dark:text-theme-light">Showing vehicles</p>
          </div>

          <div>
            <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-sm bg-primary text-white hover:bg-primary-dark transition">
              <PlusCircle size={18} />
              <span className="text-sm font-medium">Add Log</span>
            </button>
          </div>
        </div>

        <div className="w-full md:p-0 p-2">
          <div className="flex flex-col items-center max-w-6xl w-full overflow-hidden rounded-md bg-theme border border-gray-500/10 dark:border-slate-700/40">
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
                  const vehicle = vehicles.find((v) => v.id === log.vehicleId);
                  return (
                    <LogRow
                      key={log.id}
                      log={log}
                      vehicleName={vehicle?.name || "Unknown"}
                      onEdit={() => openEdit(log)}
                      onDelete={() => openDelete(log)}
                    />
                  );
                })}
                {visibleLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-theme-light dark:text-theme-light">No logs yet. Add your first refuel.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination footer */}
          <div className="mt-6 flex justify-center">
            <div className="w-full max-w-md">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </div>
        </div>
      </section>

      {/* Add / Edit modal */}
      <Modal open={openAddEdit} onClose={() => setOpenAddEdit(false)} size="md">
        <LogForm
          initialData={editing}
          vehicles={vehicles}
          onCancel={() => setOpenAddEdit(false)}
          onSubmit={handleSubmit}
        />
      </Modal>

      {/* Delete modal */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} size="sm">
        <ConfirmDelete
          openItemName={toDelete ? `${vehicles.find((v) => v.id === toDelete.vehicleId)?.name || "this item"} — ${new Date(toDelete.date).toLocaleDateString()}` : ""}
          onCancel={() => setDeleteOpen(false)}
          onConfirm={confirmDelete}
        />
      </Modal>
    </div>
  );
}
