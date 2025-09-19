import React from "react";

/**
 * Responsive Recent Trips Table
 * - Uses theme variables for colors
 * - On small screens, rows stack into cards
 */

const RecentTripsTable = ({ rows = [] }) => {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "var(--color-bg)",
        border: "1px solid rgba(148,163,184,0.06)",
        color: "var(--color-text)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium" style={{ color: "var(--color-text)" }}>
          Recent Trips
        </h3>
        <div className="text-sm" style={{ color: "var(--color-text-light)" }}>
          Showing {rows.length} recent
        </div>
      </div>

      {/* Table for md+ screens */}
      <div className="hidden md:block">
        <table className="w-full table-auto">
          <thead>
            <tr style={{ color: "var(--color-text-light)" }}>
              <th className="text-left py-2">Trip ID</th>
              <th className="text-left py-2">Vehicle</th>
              <th className="text-left py-2">Driver</th>
              <th className="text-right py-2">Distance (km)</th>
              <th className="text-right py-2">Fuel (L)</th>
              <th className="text-right py-2">Cost</th>
              <th className="text-left py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t" style={{ borderTopColor: "rgba(148,163,184,0.04)" }}>
                <td className="py-3">{r.id}</td>
                <td className="py-3">{r.vehicle}</td>
                <td className="py-3">{r.driver}</td>
                <td className="py-3 text-right">{r.distanceKm}</td>
                <td className="py-3 text-right">{r.fuelConsumedL}</td>
                <td className="py-3 text-right">₹ {r.cost}</td>
                <td className="py-3">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stacked cards for mobile */}
      <div className="md:hidden space-y-3">
        {rows.map((r) => (
          <div
            key={r.id}
            className="p-3 rounded-xl"
            style={{
              background: "rgba(146,63,239,0.02)",
              border: "1px solid rgba(148,163,184,0.04)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                  {r.vehicle}
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--color-text-light)" }}>
                  {r.driver} • {r.date}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                  ₹ {r.cost}
                </div>
                <div className="text-xs" style={{ color: "var(--color-text-light)" }}>
                  {r.distanceKm} km • {r.fuelConsumedL} L
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTripsTable;
