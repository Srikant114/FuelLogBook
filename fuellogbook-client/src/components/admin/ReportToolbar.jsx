import React from "react";
import { Mail, DownloadCloud } from "lucide-react";

/**
 * ReportToolbar
 * Props:
 *  - vehicles: [{id, name}]
 *  - selectedVehicle, setSelectedVehicle
 *  - range (string: week|month|year|custom), setRange
 *  - customFrom, customTo, setCustomFrom, setCustomTo
 *  - onDownload(), onSendEmail()
 */
export default function ReportToolbar({
  vehicles,
  selectedVehicle,
  setSelectedVehicle,
  range,
  setRange,
  customFrom,
  customTo,
  setCustomFrom,
  setCustomTo,
  onDownload,
  onSendEmail,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={selectedVehicle}
          onChange={(e) => setSelectedVehicle(e.target.value)}
          className="py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white"
        >
          <option value="all">All Vehicles</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2 bg-theme dark:bg-theme-dark rounded p-1 border border-gray-200 dark:border-slate-700/40">
          {["week", "month", "year", "custom"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-sm rounded-md ${
                range === r
                  ? "bg-primary text-white shadow-sm"
                  : "text-theme dark:text-white hover:bg-slate-100 dark:hover:bg-white/6"
              }`}
            >
              {r === "week" ? "Weekly" : r === "month" ? "Monthly" : r === "year" ? "Annual" : "Custom"}
            </button>
          ))}
        </div>

        {range === "custom" && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white"
            />
            <span className="text-theme-light dark:text-theme-light">to</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onDownload}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-white hover:bg-primary-dark transition"
          title="Download CSV"
        >
          <DownloadCloud size={16} />
          <span className="text-sm">Download</span>
        </button>

        <button
          onClick={onSendEmail}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white hover:bg-slate-50 dark:hover:bg-white/6 transition"
          title="Send report to email"
        >
          <Mail size={16} />
          <span className="text-sm">Email</span>
        </button>
      </div>
    </div>
  );
}
