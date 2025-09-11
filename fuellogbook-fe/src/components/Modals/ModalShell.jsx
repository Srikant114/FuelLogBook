// src/components/Modals/ModalShell.jsx
import React from "react";

export default function ModalShell({ open, onClose, children, width = "max-w-3xl" }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 md:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 w-full ${width} bg-[var(--panel)] rounded-xl shadow-xl overflow-hidden`}>
        {children}
      </div>
    </div>
  );
}
