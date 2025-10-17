// src/components/admin/FilterBar.jsx
import React from "react";

/**
 * FilterBar (updated)
 * Props:
 *  - values: { from, to, minAmount, maxAmount, sortBy, sortDir, rangePreset }
 *  - onChange(partial) -> merges into values
 *  - onApply() optional
 *  - onClear() optional
 *
 * Presets: last 7,15,30,90,365 days, Custom
 */
const PRESETS = [
  { id: "7", label: "Last 7 days", days: 7 },
  { id: "15", label: "Last 15 days", days: 15 },
  { id: "30", label: "Last 30 days", days: 30 },
  { id: "90", label: "Last 90 days", days: 90 },
  { id: "365", label: "Last 365 days", days: 365 },
  { id: "custom", label: "Custom", days: null },
];

function toDateInputString(d) {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toISOString().slice(0, 10);
}

export default function FilterBar({ values = {}, onChange = () => {}, onApply = () => {}, onClear = () => {} }) {
  const presetId = values.rangePreset || (values.from || values.to ? "custom" : "30");

  const applyPreset = (preset) => {
    if (preset.id === "custom") {
      onChange({ rangePreset: "custom" });
      return;
    }
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - (preset.days - 1));
    onChange({
      rangePreset: preset.id,
      from: toDateInputString(from),
      to: toDateInputString(to),
    });
  };

  const handle = (key) => (e) => onChange({ [key]: e.target.value });

  return (
    <div className="w-full bg-theme dark:bg-theme-dark rounded-md p-3 border border-gray-200 dark:border-slate-700/40 flex flex-col md:flex-row gap-3">
      {/* Left: Preset + custom date inputs */}
      <div className="flex items-center gap-3 flex-wrap w-full md:w-auto">
        <label className="text-xs text-theme-light dark:text-theme-light">Range</label>

        <div className="relative">
          <select
            value={presetId}
            onChange={(e) => {
              const p = PRESETS.find((x) => x.id === e.target.value);
              if (p) applyPreset(p);
            }}
            className="py-1 px-2 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white"
          >
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* show custom date inputs only when custom is selected */}
        {(presetId === "custom" || values.rangePreset === "custom") && (
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="date"
              value={values.from || ""}
              onChange={handle("from")}
              className="py-1 px-2 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white"
            />
            <input
              type="date"
              value={values.to || ""}
              onChange={handle("to")}
              className="py-1 px-2 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white"
            />
          </div>
        )}
      </div>

      {/* Middle: amount filters */}
      <div className="flex items-center gap-2 flex-wrap w-full md:flex-auto">
        <label className="text-xs text-theme-light dark:text-theme-light">Amount ₹</label>
        <input
          type="number"
          placeholder="min"
          value={values.minAmount ?? ""}
          onChange={handle("minAmount")}
          className="py-1 px-2 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white w-24"
        />
        <input
          type="number"
          placeholder="max"
          value={values.maxAmount ?? ""}
          onChange={handle("maxAmount")}
          className="py-1 px-2 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white w-24"
        />
      </div>

      {/* Right: sort + actions */}
      <div className="flex items-center gap-2 ml-auto">
        <label className="text-xs text-theme-light dark:text-theme-light">Sort</label>
        <select
          value={values.sortBy || "date"}
          onChange={(e) => onChange({ sortBy: e.target.value })}
          className="py-1 px-2 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white"
        >
          <option value="date">Date</option>
          <option value="amount">Amount</option>
        </select>

        <select
          value={values.sortDir || "desc"}
          onChange={(e) => onChange({ sortDir: e.target.value })}
          className="py-1 px-2 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white"
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>

        <button onClick={() => onApply()} className="px-3 py-1 rounded bg-primary text-white hover:bg-primary-dark">Apply</button>
        <button onClick={() => onClear()} className="px-3 py-1 rounded border border-gray-300 dark:border-slate-700/60 text-theme-light dark:text-theme-light">Clear</button>
      </div>
    </div>
  );
}
