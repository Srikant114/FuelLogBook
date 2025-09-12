// src/components/Users/ConfirmModal.jsx
import React from "react";
import ModalShell from "../Modals/ModalShell";

/**
 * Generic confirm modal
 * props: open, onClose, title, description, confirmLabel, onConfirm
 */
export default function ConfirmModal({ open, onClose, title = "Confirm", description = "", confirmLabel = "Confirm", onConfirm }) {
  return (
    <ModalShell open={open} onClose={onClose} width="max-w-sm">
      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-[var(--muted)] mt-2">{description}</p>

        <div className="mt-4 flex items-center justify-center gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md border bg-white">Cancel</button>
          <button onClick={() => { onConfirm?.(); onClose?.(); }} className="px-4 py-2 rounded-md bg-red-600 text-white">{confirmLabel}</button>
        </div>
      </div>
    </ModalShell>
  );
}
