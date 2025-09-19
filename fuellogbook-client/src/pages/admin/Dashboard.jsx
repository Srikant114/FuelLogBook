import React from "react";
import TitleAdmin from "../../components/common/TitleAdmin";
import StatCard from "../../components/admin/StatCard";
import MileageChart from "../../components/admin/MileageChart";
import RecentTripsTable from "../../components/admin/RecentTripsTable";
import { Car, DollarSign, MapPin, Calendar } from "lucide-react";

/**
 * Dashboard page for vehicle fuel/mileage/trip/service records
 * - Responsive grid
 * - Theme aware via CSS variables (no hard-coded colors)
 */

const Dashboard = () => {
  // SAMPLE KPI values (replace with real values from API)
  const kpis = [
    {
      id: "totalVehicles",
      title: "Total Vehicles",
      value: 24,
      delta: "+2",
      icon: Car,
      subtitle: "Active vehicles on fleet",
    },
    {
      id: "monthlyCost",
      title: "This Month Cost",
      value: "₹ 124,532",
      delta: "-6%",
      icon: DollarSign,
      subtitle: "Fuel + maintenance",
    },
    {
      id: "totalTrips",
      title: "Total Trips",
      value: 1_382,
      delta: "+8%",
      icon: MapPin,
      subtitle: "Trips recorded (month)",
    },
    {
      id: "servicesDue",
      title: "Services Due",
      value: 6,
      delta: "+1",
      icon: Calendar,
      subtitle: "Upcoming scheduled services",
    },
  ];

  // SAMPLE chart data (replace with API)
  const chartData = [
    { month: "Jan", mileage: 12.4, fuelCost: 32000 },
    { month: "Feb", mileage: 13.2, fuelCost: 28000 },
    { month: "Mar", mileage: 11.8, fuelCost: 35000 },
    { month: "Apr", mileage: 12.6, fuelCost: 30000 },
    { month: "May", mileage: 13.0, fuelCost: 29000 },
    { month: "Jun", mileage: 12.1, fuelCost: 31000 },
    { month: "Jul", mileage: 12.8, fuelCost: 29500 },
    { month: "Aug", mileage: 13.5, fuelCost: 27000 },
    { month: "Sep", mileage: 13.0, fuelCost: 28500 },
  ];

  // SAMPLE recent trips
  const recentTrips = [
    {
      id: "T-1001",
      vehicle: "MH12 AB 1234",
      driver: "Ravi Kumar",
      distanceKm: 120,
      fuelConsumedL: 9.2,
      cost: 760,
      date: "2025-09-12",
    },
    {
      id: "T-1002",
      vehicle: "MH14 CD 4567",
      driver: "Suresh Patil",
      distanceKm: 48,
      fuelConsumedL: 3.8,
      cost: 315,
      date: "2025-09-12",
    },
    {
      id: "T-1003",
      vehicle: "MH20 EF 9876",
      driver: "Anjali Desai",
      distanceKm: 210,
      fuelConsumedL: 16.1,
      cost: 1320,
      date: "2025-09-11",
    },
  ];

  return (
    <div className="px-4 pt-4 md:px-10 flex-1">
      <TitleAdmin
        title="Admin Dashboard"
        subTitle="Monitor fleet fuel efficiency, trip costs, maintenance schedules and recent activities."
      />

      {/* KPI cards */}
      <section aria-labelledby="kpi-heading" className="mb-6">
        <h2 id="kpi-heading" className="sr-only">
          Key performance indicators
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <StatCard
              key={k.id}
              title={k.title}
              value={k.value}
              delta={k.delta}
              subtitle={k.subtitle}
              Icon={k.icon}
            />
          ))}
        </div>
      </section>

      {/* Charts and lists area */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className="lg:col-span-2 p-4 rounded-2xl shadow-sm"
          style={{
            background: "var(--color-bg)",
            border: "1px solid rgba(148,163,184,0.06)",
            color: "var(--color-text)",
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-medium" style={{ color: "var(--color-text)" }}>
                Mileage & Fuel Cost Trend
              </h3>
              <p className="text-sm mt-1" style={{ color: "var(--color-text-light)" }}>
                Monthly average mileage (km/l) and fuel cost.
              </p>
            </div>
          </div>

          <div className="w-full h-64">
            <MileageChart data={chartData} />
          </div>
        </div>

        <div
          className="p-4 rounded-2xl shadow-sm"
          style={{
            background: "var(--color-bg)",
            border: "1px solid rgba(148,163,184,0.06)",
            color: "var(--color-text)",
          }}
        >
          <h3 className="text-lg font-medium" style={{ color: "var(--color-text)" }}>
            Quick Summary
          </h3>
          <p className="text-sm mt-2" style={{ color: "var(--color-text-light)" }}>
            Average mileage this month: <strong style={{ color: "var(--color-primary)" }}>13.0 km/l</strong>
          </p>

          <ul className="mt-4 space-y-2">
            <li className="text-sm" style={{ color: "var(--color-text-light)" }}>
              Total trips: <strong style={{ color: "var(--color-text)" }}>1,382</strong>
            </li>
            <li className="text-sm" style={{ color: "var(--color-text-light)" }}>
              Avg cost per km: <strong style={{ color: "var(--color-text)" }}>₹ 6.2</strong>
            </li>
            <li className="text-sm" style={{ color: "var(--color-text-light)" }}>
              Vehicles due for service: <strong style={{ color: "var(--color-primary)" }}>6</strong>
            </li>
          </ul>
        </div>
      </section>

      {/* Recent Trips Table */}
      <section className="mt-6">
        <RecentTripsTable rows={recentTrips} />
      </section>
    </div>
  );
};

export default Dashboard;
