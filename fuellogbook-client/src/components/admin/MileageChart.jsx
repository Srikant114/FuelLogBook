import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

/**
 * MileageChart - shows mileage (km/l) and fuel cost (stack or line)
 * Uses recharts (responsive)
 * Colors come from CSS variables for theme support
 */

const MileageChart = ({ data }) => {
  // Pull colors from CSS variables (fallbacks provided)
  const primary = getComputedStyle(document.documentElement).getPropertyValue("--color-primary") || "#923FEF";
  const primaryLight =
    getComputedStyle(document.documentElement).getPropertyValue("--color-primary-light") || "#C99DFF";
  const text = getComputedStyle(document.documentElement).getPropertyValue("--color-text") || "#111827";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.04)" />
        <XAxis dataKey="month" stroke={text} tickLine={false} />
        <YAxis yAxisId="left" orientation="left" stroke={text} tickLine={false} />
        <YAxis yAxisId="right" orientation="right" stroke={text} tickLine={false} />
        <Tooltip wrapperStyle={{ background: "var(--color-bg)", borderRadius: 8 }} />
        <Legend wrapperStyle={{ color: text }} />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="mileage"
          name="Mileage (km/l)"
          fill={primaryLight}
          stroke={primary}
          fillOpacity={0.18}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="fuelCost"
          name="Fuel Cost"
          stroke={primary}
          strokeWidth={2}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default MileageChart;
