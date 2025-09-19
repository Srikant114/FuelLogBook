import React from "react";

/**
 * LogForm
 * - initialData: optional log object to prefill (for edit)
 * - vehicles: array of { id, name } to choose which vehicle the log belongs to
 * - onCancel(), onSubmit(payload)
 *
 * Payload shape returned:
 * {
 *   id?, vehicleId, userId, date, amount, pricePerL, litres,
 *   tripDistance, mileage, runningCostPerKm, odometer, notes
 * }
 */
export default function LogForm({ initialData = null, vehicles = [], onCancel, onSubmit }) {
  const isEdit = Boolean(initialData?.id);

  const [form, setForm] = React.useState(() => ({
    vehicleId: initialData?.vehicleId || (vehicles[0]?.id ?? ""),
    userId: initialData?.userId || "",
    date: initialData?.date ? new Date(initialData.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    amount: initialData?.amount ?? "",
    pricePerL: initialData?.pricePerL ?? "",
    litres: initialData?.litres ?? "",
    tripDistance: initialData?.tripDistance ?? "",
    mileage: initialData?.mileage ?? "",
    runningCostPerKm: initialData?.runningCostPerKm ?? "",
    odometer: initialData?.odometer ?? "",
    notes: initialData?.notes ?? "",
  }));

  // compute derived fields when amount / pricePerL / tripDistance change
  React.useEffect(() => {
    const amount = parseFloat(form.amount) || 0;
    const pricePerL = parseFloat(form.pricePerL) || 0;
    const tripDistance = parseFloat(form.tripDistance) || 0;

    const litres = pricePerL > 0 ? +(amount / pricePerL) : 0;
    const mileage = litres > 0 ? +(tripDistance / litres) : 0;
    const runningCostPerKm = tripDistance > 0 ? +(amount / tripDistance) : 0;

    // only update if values changed significantly (to avoid infinite loops)
    setForm((prev) => {
      const needUpdate =
        Math.abs((prev.litres || 0) - litres) > 0.0001 ||
        Math.abs((prev.mileage || 0) - mileage) > 0.0001 ||
        Math.abs((prev.runningCostPerKm || 0) - runningCostPerKm) > 0.0001;

      if (!needUpdate) return prev;
      return {
        ...prev,
        litres: Number(litres.toFixed(3)),
        mileage: Number(mileage.toFixed(2)),
        runningCostPerKm: Number(runningCostPerKm.toFixed(2)),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.amount, form.pricePerL, form.tripDistance]);

  const handle = (key) => (e) => {
    const value = e.target.type === "number" ? e.target.value : e.target.value;
    setForm((s) => ({ ...s, [key]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.vehicleId) return alert("Please choose a vehicle");
    if (!form.date) return alert("Please provide the date");
    if (!form.amount || !form.pricePerL) return alert("Please enter amount and price per litre");

    onSubmit({
      ...form,
      amount: Number(form.amount),
      pricePerL: Number(form.pricePerL),
      litres: Number(form.litres),
      tripDistance: Number(form.tripDistance || 0),
      mileage: Number(form.mileage),
      runningCostPerKm: Number(form.runningCostPerKm),
      odometer: form.odometer ? Number(form.odometer) : undefined,
    });
  };

  return (
    <div className="py-6 px-6 md:px-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-theme dark:text-white">{isEdit ? "Edit Log" : "Add Log"}</h3>
        <button onClick={onCancel} className="p-2 rounded-md hover:bg-slate-100/60 dark:hover:bg-white/6">
          Close
        </button>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {/* Vehicle select */}
        <div>
          <label className="text-sm font-medium text-theme dark:text-theme-light block mb-1">Vehicle</label>
          <select
            className="w-full py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white"
            value={form.vehicleId}
            onChange={handle("vehicleId")}
          >
            {vehicles.length === 0 ? <option value="">No vehicles</option> : vehicles.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </div>

        {/* Date & odometer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-theme dark:text-theme-light block mb-1">Date</label>
            <input
              type="date"
              className="w-full py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white"
              value={form.date}
              onChange={handle("date")}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-theme dark:text-theme-light block mb-1">Odometer (optional)</label>
            <input
              type="number"
              placeholder="km"
              className="w-full py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white"
              value={form.odometer}
              onChange={handle("odometer")}
            />
          </div>
        </div>

        {/* Amount, Price per L, Litres (computed) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-sm font-medium text-theme dark:text-theme-light block mb-1">Amount (₹)</label>
            <input
              type="number"
              step="0.01"
              placeholder="Total spent"
              className="w-full py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white"
              value={form.amount}
              onChange={handle("amount")}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-theme dark:text-theme-light block mb-1">Price / L (₹)</label>
            <input
              type="number"
              step="0.01"
              placeholder="₹ per litre"
              className="w-full py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white"
              value={form.pricePerL}
              onChange={handle("pricePerL")}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-theme dark:text-theme-light block mb-1">Litres (calculated)</label>
            <input
              type="number"
              step="0.001"
              readOnly
              className="w-full py-2 px-3 rounded border border-gray-200 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white"
              value={form.litres ?? ""}
            />
          </div>
        </div>

        {/* Trip Distance, Mileage, Running cost per km (computed) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-sm font-medium text-theme dark:text-theme-light block mb-1">Trip Distance (km)</label>
            <input
              type="number"
              step="0.1"
              placeholder="km"
              className="w-full py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white"
              value={form.tripDistance}
              onChange={handle("tripDistance")}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-theme dark:text-theme-light block mb-1">Mileage (km/L)</label>
            <input
              type="number"
              step="0.01"
              readOnly
              className="w-full py-2 px-3 rounded border border-gray-200 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white"
              value={form.mileage ?? ""}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-theme dark:text-theme-light block mb-1">Running Cost (₹/km)</label>
            <input
              type="number"
              step="0.01"
              readOnly
              className="w-full py-2 px-3 rounded border border-gray-200 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white"
              value={form.runningCostPerKm ?? ""}
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-sm font-medium text-theme dark:text-theme-light block mb-1">Notes</label>
          <textarea
            rows={3}
            className="w-full py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white resize-none"
            placeholder="e.g. 50% highway, avg speed 60km/h"
            value={form.notes}
            onChange={handle("notes")}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-transparent text-theme-light dark:text-theme-light hover:bg-slate-50 dark:hover:bg-white/6 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 rounded-md bg-primary hover:bg-primary-dark text-white transition">
            {isEdit ? "Save Log" : "Add Log"}
          </button>
        </div>
      </form>
    </div>
  );
}
