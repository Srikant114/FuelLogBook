import React, { useEffect } from "react";

/**
 * Modal
 * - open, onClose, children, size
 * - inner content should be inside a container with className="modal-body" (done in children if needed)
 */
const sizeMap = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
};

export default function Modal({ open, onClose, children, size = "md", closeOnBackdrop = true }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto"
      aria-modal="true"
      role="dialog"
    >
      {/* Outer padding so modal doesn't stick to screen edges */}
      <div className="absolute inset-0 p-6 sm:p-10">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm rounded-xl"
          onClick={() => closeOnBackdrop && onClose?.()}
        />

        {/* Centering wrapper */}
        <div className="relative z-10 flex items-center justify-center min-h-full">
          <div className={`w-full ${sizeMap[size] || sizeMap.md} mx-auto`} onClick={(e) => e.stopPropagation()}>
            {/* Panel wrapper: hide outer scrollbars but allow inner scrolling */}
            <div className="max-h-[85vh] bg-theme dark:bg-theme-dark text-theme dark:text-white rounded-xl shadow-xl border border-gray-200 dark:border-slate-700/40 transition-colors overflow-hidden">
              {/* inner scroll area: scrolls if content overflow, but hide native scrollbars visually */}
              <div className="modal-body no-scrollbar max-h-[85vh] overflow-y-auto">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
