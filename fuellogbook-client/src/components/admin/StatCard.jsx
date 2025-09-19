import React from "react";

/**
 * Small KPI card
 * Props:
 *  - title
 *  - value
 *  - delta (string)
 *  - subtitle
 *  - Icon (React component)
 */
const StatCard = ({ title, value, delta, subtitle, Icon }) => {
  return (
    <div
      className="rounded-2xl p-4 flex items-start gap-4"
      style={{
        background: "var(--color-bg)",
        border: "1px solid rgba(148,163,184,0.06)",
        color: "var(--color-text)",
      }}
    >
      <div
        className="flex items-center justify-center rounded-lg p-2 shrink-0"
        style={{
          background: "linear-gradient(180deg, rgba(146,63,239,0.08), rgba(195,93,232,0.04))",
        }}
      >
        {Icon && <Icon size={20} style={{ color: "var(--color-primary)" }} />}
      </div>

      <div className="flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <div className="text-sm font-medium" style={{ color: "var(--color-text-light)" }}>
              {title}
            </div>
            <div className="text-xl md:text-2xl font-semibold mt-1" style={{ color: "var(--color-text)" }}>
              {value}
            </div>
          </div>

          {delta && (
            <div
              className="text-sm font-medium"
              style={{
                color: delta.startsWith("-") ? "var(--color-text-light)" : "var(--color-primary)",
              }}
            >
              {delta}
            </div>
          )}
        </div>

        {subtitle && (
          <p className="text-xs mt-2" style={{ color: "var(--color-text-light)" }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
