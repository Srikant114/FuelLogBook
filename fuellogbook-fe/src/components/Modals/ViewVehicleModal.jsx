// src/components/Modals/ViewVehicleModal.jsx
import React from "react";
import { FiX } from "react-icons/fi";
import ModalShell from "./ModalShell";
import { formatDate } from "../../utils/helpers";

export default function ViewVehicleModal({ open, onClose, vehicle }) {
  if (!vehicle) return null;
  return (
    <ModalShell open={open} onClose={onClose} width="max-w-3xl">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{vehicle.name}</h3>
            <div className="text-sm text-[var(--muted)]">
              {vehicle.make} • {vehicle.modelYear} • {vehicle.fuelType}
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-md hover:bg-[var(--hover-bg)]">
            <FiX />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg overflow-hidden border border-gray-100">
            <img
              src={vehicle.imageUrl || ""}
              alt={vehicle.name}
              className="w-full h-72 object-cover"
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm text-[var(--muted)]">Notes</p>
            <p className="text-sm">{vehicle.notes || "—"}</p>

            <div className="pt-4">
              <p className="text-xs text-[var(--muted)]">Added on</p>
              <p className="text-sm">{formatDate(vehicle.createdAt)}</p>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="px-4 py-2 rounded-md border hover:bg-[var(--hover-bg)]">
                Edit
              </button>
              <a
                href={vehicle.imageUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-md bg-[var(--accent)] text-white"
              >
                Open Image
              </a>
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
