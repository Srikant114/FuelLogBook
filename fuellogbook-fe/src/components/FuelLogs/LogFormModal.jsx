// src/components/Logs/LogCard.jsx
import React, { useEffect, useState } from "react";
import { FiEye, FiTrash2, FiX } from "react-icons/fi";
import { computeLitres, computeMileage, computeRunningCost, formatDate } from "../../utils/helpers";
import ModalShell from "../Modals/ModalShell";

export default function LogFormModal({ open, onClose, onSave, initialData = null, vehicles = [] }) {
  const emptyForm = {
    vehicleId: "",
    userId: "",
    date: new Date().toISOString().slice(0, 10),
    amount: "",
    pricePerL: "",
    litres: 0,
    tripDistance: "",
    mileage: 0,
    runningCostPerKm: 0,
    odometer: "",
    notes: "",
    fuelType: "Petrol",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        vehicleId: initialData?.vehicle?.id ?? initialData?.vehicle ?? "",
        userId: initialData?.userId ?? "",
        date: initialData?.date ? new Date(initialData.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        amount: initialData?.amount ?? "",
        pricePerL: initialData?.pricePerL ?? "",
        litres: initialData?.litres ?? 0,
        tripDistance: initialData?.tripDistance ?? "",
        mileage: initialData?.mileage ?? 0,
        runningCostPerKm: initialData?.runningCostPerKm ?? 0,
        odometer: initialData?.odometer ?? "",
        notes: initialData?.notes ?? "",
        fuelType: initialData?.fuelType ?? "Petrol",
        id: initialData?.id,
      });
    } else {
      setForm({
        ...emptyForm,
        vehicleId: vehicles?.[0]?.id ?? "",
      });
    }
  }, [initialData, open, vehicles]);

  // Recompute derived whenever amount/pricePerL/tripDistance changes
  useEffect(() => {
    const litres = computeLitres(form.amount, form.pricePerL);
    const mileage = computeMileage(form.tripDistance, litres);
    const running = computeRunningCost(form.amount, form.tripDistance);
    setForm((s) => ({ ...s, litres, mileage, runningCostPerKm: running }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.amount, form.pricePerL, form.tripDistance]);

  const submit = (e) => {
    e.preventDefault();
    if (!form.vehicleId || !form.date || !form.amount || !form.pricePerL) {
      alert("Please fill vehicle, date, amount and price per litre.");
      return;
    }

    const vehicleObj = vehicles.find((v) => v.id === form.vehicleId) ?? null;

    const payload = {
      id: form?.id,
      vehicle: vehicleObj ? { id: vehicleObj.id, name: vehicleObj.name } : form.vehicleId,
      userId: form.userId || undefined,
      date: new Date(form.date).toISOString(),
      amount: Number(form.amount),
      pricePerL: Number(form.pricePerL),
      litres: Number(form.litres),
      tripDistance: form.tripDistance ? Number(form.tripDistance) : 0,
      mileage: Number(form.mileage),
      runningCostPerKm: Number(form.runningCostPerKm),
      odometer: form.odometer ? Number(form.odometer) : undefined,
      notes: form.notes,
      fuelType: form.fuelType,
    };

    onSave(payload);
    onClose();
  };

  return (
    <ModalShell open={open} onClose={onClose} width="max-w-lg">
      <form onSubmit={submit} className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{form?.id ? "Edit Log" : "Add Fuel Log"}</h3>
          <button type="button" onClick={onClose} className="p-1 rounded-md hover:bg-[var(--hover-bg)]">
            <FiX />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Vehicle</label>
            <select
              value={form.vehicleId}
              onChange={(e) => setForm((s) => ({ ...s, vehicleId: e.target.value }))}
              className="mt-1 w-full rounded-md border px-3 py-2"
            >
              <option value="">Select vehicle</option>
              {vehicles?.map((v) => (
                <option key={v?.id} value={v?.id}>
                  {v?.name} — {v?.make}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Amount (₹)</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm((s) => ({ ...s, amount: e.target.value }))}
              className="mt-1 w-full rounded-md border px-3 py-2"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Price per L (₹)</label>
            <input
              type="number"
              value={form.pricePerL}
              onChange={(e) => setForm((s) => ({ ...s, pricePerL: e.target.value }))}
              className="mt-1 w-full rounded-md border px-3 py-2"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Trip Distance (km)</label>
            <input
              type="number"
              value={form.tripDistance}
              onChange={(e) => setForm((s) => ({ ...s, tripDistance: e.target.value }))}
              className="mt-1 w-full rounded-md border px-3 py-2"
              min="0"
              step="0.1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Odometer (km)</label>
            <input
              type="number"
              value={form.odometer}
              onChange={(e) => setForm((s) => ({ ...s, odometer: e.target.value }))}
              className="mt-1 w-full rounded-md border px-3 py-2"
              min="0"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Fuel Type</label>
            <select
              value={form.fuelType}
              onChange={(e) => setForm((s) => ({ ...s, fuelType: e.target.value }))}
              className="mt-1 w-full rounded-md border px-3 py-2"
            >
              <option>Petrol</option>
              <option>Diesel</option>
              <option>EV</option>
            </select>
          </div>

          {/* Derived read-only */}
          <div>
            <label className="text-sm font-medium">Litres (computed)</label>
            <div className="mt-1 w-full rounded-md border px-3 py-2 bg-white/60">{form?.litres ?? 0}</div>
          </div>

          <div>
            <label className="text-sm font-medium">Mileage (km/L)</label>
            <div className="mt-1 w-full rounded-md border px-3 py-2 bg-white/60">{form?.mileage ?? "—"}</div>
          </div>

          <div>
            <label className="text-sm font-medium">Running Cost (₹/km)</label>
            <div className="mt-1 w-full rounded-md border px-3 py-2 bg-white/60">{form?.runningCostPerKm ?? "—"}</div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))}
            rows={3}
            className="mt-1 w-full rounded-md border px-3 py-2 resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border bg-white text-sm">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 rounded-md bg-[var(--accent)] text-white text-sm">
            {form?.id ? "Save Log" : "Add Log"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
