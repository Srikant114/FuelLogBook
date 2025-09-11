import React from "react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <div className="text-sm text-[var(--muted)]">
          Welcome back — here's a quick overview
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-4 rounded-xl bg-[var(--panel)] shadow-sm">
          <div className="text-sm text-[var(--muted)]">Total Vehicles</div>
          <div className="text-2xl font-bold">124</div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--panel)] shadow-sm">
          <div className="text-sm text-[var(--muted)]">
            Fuel Logs (this month)
          </div>
          <div className="text-2xl font-bold">1,024</div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--panel)] shadow-sm">
          <div className="text-sm text-[var(--muted)]">Avg MPG</div>
          <div className="text-2xl font-bold">28.4</div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--panel)] shadow-sm">
          <div className="text-sm text-[var(--muted)]">Open Issues</div>
          <div className="text-2xl font-bold">3</div>
        </div>
      </div>

      {/* Large content / chart placeholder */}
      <div className="p-6 rounded-xl bg-[var(--panel)] shadow-sm">
        <div className="text-sm text-[var(--muted)] mb-2">
          Fuel Usage (last 30 days)
        </div>
        <div className="h-48 rounded-md bg-gradient-to-r from-white to-gray-50 flex items-center justify-center text-gray-400">
          Chart placeholder
        </div>
      </div>
    </div>
  );
}
