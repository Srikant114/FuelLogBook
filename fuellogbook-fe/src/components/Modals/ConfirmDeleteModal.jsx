// src/components/Modals/ConfirmDeleteModal.jsx
import React from "react";
import ModalShell from "./ModalShell";

export default function ConfirmDeleteModal({ open, onClose, onConfirm, vehicle }) {
  if (!vehicle) return null;
  return (
    <ModalShell open={open} onClose={onClose} width="max-w-md">
      <div className="p-6 text-center">
        <div className="flex items-center justify-center p-4 bg-red-100 rounded-full w-16 h-16 mx-auto">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18" stroke="#DC2626" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke="#DC2626" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="#DC2626" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>

        <h4 className="mt-4 text-lg font-semibold">Delete vehicle?</h4>
        <p className="text-sm text-[var(--muted)] mt-2">
          Are you sure you want to remove <strong>{vehicle.name}</strong>? This action cannot be undone.
        </p>

        <div className="mt-5 flex items-center justify-center gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md border bg-white text-sm">Cancel</button>
          <button onClick={() => onConfirm(vehicle.id)} className="px-4 py-2 rounded-md bg-red-600 text-white text-sm">Confirm</button>
        </div>
      </div>
    </ModalShell>
  );
}
