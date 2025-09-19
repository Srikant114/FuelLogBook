import React from "react";

/**
 * ReportTable
 * - logs: array of log objects
 * - vehiclesMap: {id: name}
 *
 * Responsive: md+ shows table layout, mobile shows stacked cards
 */
export default function ReportTable({ logs, vehiclesMap }) {
  if (!logs.length) {
    return (
      <div className="p-6 text-center text-theme-light dark:text-theme-light">
        No records for the selected range.
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-md">
      <table className="hidden md:table w-full">
        <thead className="text-left text-theme dark:text-white">
          <tr>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Vehicle</th>
            <th className="px-4 py-3 font-medium">Amount (₹)</th>
            <th className="px-4 py-3 font-medium">Litres</th>
            <th className="px-4 py-3 font-medium">Distance (km)</th>
            <th className="px-4 py-3 font-medium">Mileage</th>
            <th className="px-4 py-3 font-medium">Cost/km</th>
            <th className="px-4 py-3 font-medium">Notes</th>
          </tr>
        </thead>

        <tbody className="text-theme dark:text-white">
          {logs.map((log) => (
            <tr key={log.id} className="border-t border-gray-200 dark:border-slate-700/40">
              <td className="px-4 py-3">{new Date(log.date).toLocaleDateString()}</td>
              <td className="px-4 py-3">{vehiclesMap[log.vehicleId] || "Unknown"}</td>
              <td className="px-4 py-3">₹{Number(log.amount || 0).toFixed(2)}</td>
              <td className="px-4 py-3">{Number(log.litres || 0).toFixed(2)} L</td>
              <td className="px-4 py-3">{Number(log.tripDistance || 0)} km</td>
              <td className="px-4 py-3">{log.mileage ? `${Number(log.mileage).toFixed(2)} km/L` : "-"}</td>
              <td className="px-4 py-3">₹{Number(log.runningCostPerKm || 0).toFixed(2)}</td>
              <td className="px-4 py-3">{log.notes ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile stacked cards */}
      <div className="md:hidden space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="bg-theme dark:bg-theme-dark rounded-md p-3 border border-gray-200 dark:border-slate-700/40">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-theme dark:text-white">{vehiclesMap[log.vehicleId] || "Unknown"}</div>
                <div className="text-xs text-theme-light dark:text-theme-light">{new Date(log.date).toLocaleDateString()}</div>
              </div>
              <div className="text-sm font-medium text-theme dark:text-white">₹{Number(log.amount || 0).toFixed(2)}</div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-xs text-theme-light dark:text-theme-light">Litres</div>
                <div className="text-theme dark:text-white font-medium">{Number(log.litres || 0).toFixed(2)} L</div>
              </div>

              <div>
                <div className="text-xs text-theme-light dark:text-theme-light">Distance</div>
                <div className="text-theme dark:text-white font-medium">{Number(log.tripDistance || 0)} km</div>
              </div>

              <div>
                <div className="text-xs text-theme-light dark:text-theme-light">Mileage</div>
                <div className="text-theme dark:text-white font-medium">{log.mileage ? `${Number(log.mileage).toFixed(2)} km/L` : "-"}</div>
              </div>

              <div>
                <div className="text-xs text-theme-light dark:text-theme-light">Cost / km</div>
                <div className="text-theme dark:text-white font-medium">₹{Number(log.runningCostPerKm || 0).toFixed(2)}</div>
              </div>
            </div>

            {log.notes ? <div className="mt-3 text-xs text-theme-light dark:text-theme-light">{log.notes}</div> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
