// src/components/Logs/ViewLogModal.jsx
import React from "react";
import { FiX } from "react-icons/fi";
import ModalShell from "../Modals/ModalShell";
import { formatDate } from "../../utils/helpers";

export default function ViewLogModal({ open, onClose, log }) {
  if (!log) return null;

  const vehicleName = log?.vehicle?.name ?? log?.vehicle ?? "Vehicle";

  return (
    <ModalShell open={open} onClose={onClose} width="max-w-lg">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">Fuel Log — {vehicleName}</h3>
            <div className="text-sm text-[var(--muted)]">{formatDate(log?.date)}</div>
          </div>

          <button onClick={onClose} className="p-1 rounded-md hover:bg-[var(--hover-bg)]">
            <FiX />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-[var(--muted)]">Amount</div>
              <div className="font-semibold">₹{log?.amount ?? "—"}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--muted)]">Price/L</div>
              <div className="font-semibold">₹{log?.pricePerL ?? "—"}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-[var(--muted)]">Litres</div>
              <div className="font-semibold">{log?.litres ?? "—"}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--muted)]">Trip Distance</div>
              <div className="font-semibold">{log?.tripDistance ?? "—"} km</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-[var(--muted)]">Mileage</div>
              <div className="font-semibold">{log?.mileage ? `${log.mileage} km/L` : "—"}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--muted)]">Running Cost</div>
              <div className="font-semibold">{log?.runningCostPerKm ? `₹${log.runningCostPerKm}/km` : "—"}</div>
            </div>
          </div>

          <div>
            <div className="text-xs text-[var(--muted)]">Odometer</div>
            <div className="font-semibold">{log?.odometer ?? "—"} km</div>
          </div>

          <div>
            <div className="text-xs text-[var(--muted)]">Notes</div>
            <div className="font-normal">{log?.notes ?? "—"}</div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
