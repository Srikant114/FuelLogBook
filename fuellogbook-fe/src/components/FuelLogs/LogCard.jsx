// src/components/Logs/LogCard.jsx
import React from "react";
import { FiEye, FiTrash2, FiEdit } from "react-icons/fi";
import { formatDate } from "../../utils/helpers";

/**
 * Defensive LogCard: returns null if no log provided and logs a helpful message.
 */
export default function LogCard({ log, onView, onEdit, onDelete }) {
  // Defensive: don't crash if log is undefined
  if (!log) {
    // eslint-disable-next-line no-console
    console.warn("LogCard: received undefined `log` prop", { log });
    return null;
  }

  const vehicleName = log?.vehicle?.name ?? log?.vehicle ?? "Unknown vehicle";
  const fuelType = log?.fuelType ?? log?.vehicle?.fuelType ?? "—";

  return (
    <div className="bg-[var(--panel)] rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm text-[var(--muted)]">
              <span className="font-semibold text-[var(--text)]">{vehicleName}</span>
              <span className="ml-2">• {fuelType}</span>
            </div>
            <div className="text-base font-semibold truncate">{log?.notes ?? "Fuel entry"}</div>
          </div>

          <div className="text-right hidden sm:block">
            <div className="text-xs text-[var(--muted)]">Date</div>
            <div className="text-sm">{formatDate(log?.date)}</div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div>
            <div className="text-xs text-[var(--muted)]">Amount</div>
            <div className="font-semibold">₹{log?.amount ?? "—"}</div>
          </div>

          <div>
            <div className="text-xs text-[var(--muted)]">Price/L</div>
            <div className="font-semibold">₹{log?.pricePerL ?? "—"}</div>
          </div>

          <div>
            <div className="text-xs text-[var(--muted)]">Litres</div>
            <div className="font-semibold">{log?.litres ?? "—"}</div>
          </div>

          <div>
            <div className="text-xs text-[var(--muted)]">Mileage</div>
            <div className="font-semibold">{log?.mileage ? `${log.mileage} km/L` : "—"}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onView?.(log)}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-[var(--panel)] border hover:bg-[var(--hover-bg)] text-sm"
          title="View"
        >
          <FiEye /> View
        </button>

        {/* Edit button (new) */}
        <button
          onClick={() => onEdit?.(log)}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border hover:bg-[var(--hover-bg)] text-sm"
          title="Edit"
        >
          <FiEdit /> Edit
        </button>

        <button
          onClick={() => onDelete?.(log)}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-red-600 border border-red-100 hover:bg-red-50 text-sm"
          title="Delete"
        >
          <FiTrash2 /> Delete
        </button>
      </div>
    </div>
  );
}
