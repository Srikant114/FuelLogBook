import React from "react";
import { Edit3, Trash2 } from "lucide-react";

/**
 * LogRow (responsive)
 * - Renders as normal table columns on md+ screens.
 * - On small screens it renders a single stacked card for better readability.
 *
 * Props:
 *  - log: object
 *  - vehicleName: string
 *  - onEdit(log), onDelete(log)
 */
export default function LogRow({ log, vehicleName, onEdit, onDelete }) {
  const dateLabel = new Date(log.date).toLocaleDateString();
  return (
    <>
      {/* Desktop / Tablet Row (md and up) */}
      <tr className="hidden md:table-row border-t border-gray-500/20">
        <td className="md:px-4 pl-2 md:pl-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate text-theme dark:text-white">{vehicleName}</div>
              <div className="text-xs text-theme-light dark:text-theme-light truncate">{dateLabel}</div>
            </div>
          </div>
        </td>

        <td className="px-4 py-3">
          <div className="text-sm text-theme dark:text-white">₹{Number(log.amount || 0).toFixed(2)}</div>
          <div className="text-xs text-theme-light dark:text-theme-light">₹{Number(log.pricePerL || 0).toFixed(2)} / L</div>
        </td>

        <td className="px-4 py-3 hidden md:table-cell">
          <div className="text-sm text-theme dark:text-white">{Number(log.litres || 0).toFixed(2)} L</div>
          <div className="text-xs text-theme-light dark:text-theme-light">{log.mileage ? `${Number(log.mileage).toFixed(2)} km/L` : "-"}</div>
        </td>

        <td className="px-4 py-3">
          <div className="text-sm text-theme dark:text-white">{Number(log.tripDistance || 0)} km</div>
          <div className="text-xs text-theme-light dark:text-theme-light">₹{Number(log.runningCostPerKm || 0).toFixed(2)} / km</div>
        </td>

        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <button onClick={() => onEdit(log)} className="p-2 rounded-md hover:bg-slate-100/60 dark:hover:bg-white/6">
              <Edit3 size={16} className="text-theme-light dark:text-theme-light" />
            </button>
            <button onClick={() => onDelete(log)} className="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20">
              <Trash2 size={16} className="text-red-600 dark:text-red-400" />
            </button>
          </div>
        </td>
      </tr>

      {/* Mobile Row: stacked card (visible on small screens) */}
      <tr className="table-row md:hidden border-t border-gray-500/20">
        <td colSpan={5} className="px-3 py-4">
          <div className="bg-theme dark:bg-theme-dark rounded-lg p-3 shadow-sm border border-gray-200 dark:border-slate-700/40">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-theme dark:text-white truncate">{vehicleName}</h4>
                  <span className="text-xs text-theme-light dark:text-theme-light">{dateLabel}</span>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-xs text-theme-light dark:text-theme-light">Amount</div>
                    <div className="text-sm font-medium text-theme dark:text-white">₹{Number(log.amount || 0).toFixed(2)}</div>
                    <div className="text-xs text-theme-light dark:text-theme-light">₹{Number(log.pricePerL || 0).toFixed(2)}/L</div>
                  </div>

                  <div>
                    <div className="text-xs text-theme-light dark:text-theme-light">Distance</div>
                    <div className="text-sm font-medium text-theme dark:text-white">{Number(log.tripDistance || 0)} km</div>
                    <div className="text-xs text-theme-light dark:text-theme-light">₹{Number(log.runningCostPerKm || 0).toFixed(2)}/km</div>
                  </div>

                  <div>
                    <div className="text-xs text-theme-light dark:text-theme-light">Litres</div>
                    <div className="text-sm font-medium text-theme dark:text-white">{Number(log.litres || 0).toFixed(2)} L</div>
                  </div>

                  <div>
                    <div className="text-xs text-theme-light dark:text-theme-light">Mileage</div>
                    <div className="text-sm font-medium text-theme dark:text-white">{log.mileage ? `${Number(log.mileage).toFixed(2)} km/L` : "-"}</div>
                  </div>
                </div>

                {log.notes ? (
                  <p className="mt-3 text-xs text-theme-light dark:text-theme-light line-clamp-3">{log.notes}</p>
                ) : null}
              </div>

              {/* Actions column: small vertical buttons */}
              <div className="flex flex-col items-center gap-2">
                <button onClick={() => onEdit(log)} className="p-2 rounded-md hover:bg-slate-100/60 dark:hover:bg-white/6">
                  <Edit3 size={16} className="text-theme-light dark:text-theme-light" />
                </button>
                <button onClick={() => onDelete(log)} className="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                </button>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}
    