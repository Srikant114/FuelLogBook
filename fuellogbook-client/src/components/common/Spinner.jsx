// src/components/admin/Spinner.jsx
import React from "react";

/**
 * Spinner
 * - Simple reusable spinner component
 * - Adapts to theme via CSS classes you already have (uses .bg-primary for color)
 *
 * Props:
 *  - size: number (px) default 20
 *  - className: extra classes to apply
 */
export default function Spinner({ size = 20, className = "" }) {
  const s = size;
  return (
    <svg
      className={`animate-spin ${className}`}
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {/* Use currentColor for flexibility; apply color by wrapping element or inline style */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeOpacity="0.15"
      />
      <path
        d="M22 12a10 10 0 00-10-10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
