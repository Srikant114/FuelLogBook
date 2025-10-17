// src/components/admin/LogForm.jsx
import React, { useState } from "react";
import { useLogsApi } from "../../context/LogsApiContext";
import VehicleSelectDropdown from "./VehicleSelectDropdown";
import Spinner from "../common/Spinner";
import toast from "react-hot-toast";

/**
 * LogForm
 *
 * Props:
 *  - initialData: optional log object to prefill (for edit). expected fields: { _id, vehicleId, date, amount, pricePerL, tripDistance, litres, mileage, runningCostPerKm, odometer, notes }
 *  - vehicles: optional array of vehicles (not strictly required because dropdown loads pages itself)
 *  - onCancel()
 *  - onSubmit(returnedLog, backendMessage) -> parent will update UI using returned log and can show backendMessage
 *
 * Notes:
 *  - This component **does not** show success toasts. It returns the created/updated log via onSubmit
 *    and the parent component should show success messages. This prevents duplicate success toasts.
 */

export default function LogForm({ initialData = null, vehicles = [], onCancel, onSubmit }) {
  const logsApi = useLogsApi();
  const isEdit = (initialData && (initialData._id || initialData.id));

  const [form, setForm] = useState(() => ({
    vehicleId: initialData?.vehicleId || (vehicles[0]?.id || vehicles[0]?._id) || "",
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

  const [submitting, setSubmitting] = useState(false);

  // Derived calculations: automatically compute litres / mileage / runningCostPerKm
  React.useEffect(() => {
    const amount = Number(form.amount) || 0;
    const pricePerL = Number(form.pricePerL) || 0;
    const tripDistance = Number(form.tripDistance) || 0;

    const litres = pricePerL > 0 ? +(amount / pricePerL) : 0;
    const mileage = litres > 0 ? +(tripDistance / litres) : 0;
    const runningCostPerKm = tripDistance > 0 ? +(amount / tripDistance) : 0;

    // update only if changed
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
    const value = e.target.value;
    setForm((s) => ({ ...s, [key]: value }));
  };

  // Submit handler: calls backend and returns created/updated log to parent via onSubmit
  const submit = async (e) => {
    e.preventDefault();

    // validation
    if (!form.vehicleId) {
      toast.error("Please select a vehicle");
      return;
    }
    if (!form.date) {
      toast.error("Please provide a date");
      return;
    }
    if (!form.amount || !form.pricePerL) {
      toast.error("Please enter amount and price per litre");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        date: form.date,
        amount: Number(form.amount),
        pricePerL: Number(form.pricePerL),
        tripDistance: Number(form.tripDistance || 0),
        // litres, mileage, runningCostPerKm will be computed server-side too, but we include for convenience
        litres: Number(form.litres || 0),
        mileage: Number(form.mileage || 0),
        runningCostPerKm: Number(form.runningCostPerKm || 0),
        odometer: form.odometer ? Number(form.odometer) : undefined,
        notes: form.notes || "",
      };

      if (isEdit) {
        // Update
        const logId = initialData._id || initialData.id;
        const res = await logsApi.updateLog(form.vehicleId, logId, payload);
        if (res && res.success) {
          // server returns updated log in res.log or res.data.log
          const returned = res.log || res.data?.log || res.data || res;
          // Pass backend message to parent so parent can toast it
          const backendMessage = res.message || res.msg || null;
          onSubmit && onSubmit(returned, backendMessage);
        } else {
          // show backend error message when present
          toast.error(res?.message || res?.msg || "Update failed");
        }
      } else {
        // Create
        const res = await logsApi.createLog(form.vehicleId, payload);
        if (res && res.success) {
          // server returns created log in res.log or res.data.log
          const returned = res.log || res.data?.log || res.data || res;
          const backendMessage = res.message || res.msg || null;
          onSubmit && onSubmit(returned, backendMessage);
        } else {
          toast.error(res?.message || res?.msg || "Add failed");
        }
      }
    } catch (err) {
      console.error("LogForm submit error:", err);
      toast.error(err.message || "Request failed");
    } finally {
      setSubmitting(false);
    }
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
        {/* Vehicle select (paged dropdown) */}
        <div>
          <label className="text-sm font-medium text-theme dark:text-theme-light block mb-1">Vehicle</label>
          <VehicleSelectDropdown
            value={form.vehicleId || ""}
            onChange={(v) => setForm((s) => ({ ...s, vehicleId: v }))}
            onlyWithLogs={false} // show all vehicles in the modal (user must choose)
            pageSize={10}
            includeAllOption={false} // don't allow "All" when creating a log
            placeholder="Select vehicle"
            className="w-full"
          />
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
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-primary hover:bg-primary-dark text-white transition flex items-center gap-2"
            disabled={submitting}
          >
            {submitting ? <Spinner className="text-white" size={16} /> : null}
            <span className="text-white">{isEdit ? "Save Log" : "Add Log"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
