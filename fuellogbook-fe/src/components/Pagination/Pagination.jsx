// src/components/Pagination/Pagination.jsx
import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination({ total, page, pageSize, onPageChange, onPageSizeChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const windowSize = 5;
  let start = Math.max(1, page - Math.floor(windowSize / 2));
  let end = Math.min(totalPages, start + windowSize - 1);
  if (end - start < windowSize - 1) start = Math.max(1, end - windowSize + 1);
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div className="flex items-center gap-3">
        <button onClick={() => onPageChange(Math.max(1, page - 1))} className="p-2 rounded-full bg-[var(--panel)] hover:bg-[var(--hover-bg)]" disabled={page <= 1}>
          <FiChevronLeft />
        </button>

        <div className="flex items-center gap-2">
          {pages.map(p => (
            <button key={p} onClick={() => onPageChange(p)} className={`h-9 w-9 rounded-md flex items-center justify-center text-sm ${p === page ? "bg-[var(--accent)] text-white font-semibold" : "bg-[var(--panel)] hover:bg-[var(--hover-bg)]"}`}>
              {p}
            </button>
          ))}
        </div>

        <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} className="p-2 rounded-full bg-[var(--panel)] hover:bg-[var(--hover-bg)]" disabled={page >= totalPages}>
          <FiChevronRight />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-sm text-[var(--muted)]">Page {page} / {totalPages}</div>
        <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))} className="rounded-md border px-2 py-1">
          {[6, 9, 12, 24].map(n => <option key={n} value={n}>{n} / page</option>)}
        </select>
      </div>
    </div>
  );
}
