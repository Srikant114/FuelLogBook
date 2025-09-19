import React from "react";
import TitleAdmin from "../../components/common/TitleAdmin";
import ReportToolbar from "../../components/admin/ReportToolbar";
import ReportTable from "../../components/admin/ReportTable";
import Modal from "../../components/admin/Modal";
import { X } from "lucide-react";

/* Dummy vehicles & logs */
const DUMMY_VEHICLES = [
  { id: "v1", name: "Hunter 350" },
  { id: "v2", name: "KTM 390" },
  { id: "v3", name: "Tesla Model 3" },
];

const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const DUMMY_LOGS = Array.from({ length: 24 }).map((_, i) => {
  const vehicle = DUMMY_VEHICLES[i % DUMMY_VEHICLES.length];
  const date = randomDate(new Date(2024, 0, 1), new Date()); // random in 2024+
  const amount = Math.round((400 + Math.random() * 1400) * 100) / 100;
  const pricePerL = Math.round((70 + Math.random() * 40) * 100) / 100;
  const litres = Number((amount / pricePerL).toFixed(2));
  const tripDistance = Math.round((50 + Math.random() * 350) * 10) / 10;
  const mileage = litres > 0 ? Number((tripDistance / litres).toFixed(2)) : 0;
  const runningCostPerKm = tripDistance > 0 ? Number((amount / tripDistance).toFixed(2)) : 0;
  return {
    id: `log${i + 1}`,
    vehicleId: vehicle.id,
    date: date.toISOString(),
    amount,
    pricePerL,
    litres,
    tripDistance,
    mileage,
    runningCostPerKm,
    odometer: Math.round(1000 + Math.random() * 90000),
    notes: Math.random() > 0.6 ? "50% highway mix, smooth drive" : "",
  };
});

/* Helpers */
const formatCurrency = (v) => `₹${Number(v || 0).toFixed(2)}`;

export default function Report() {
  const [vehicles] = React.useState(DUMMY_VEHICLES);
  const [logs] = React.useState(DUMMY_LOGS);

  const vehiclesMap = React.useMemo(() => {
    const m = {};
    vehicles.forEach((v) => (m[v.id] = v.name));
    return m;
  }, [vehicles]);

  // toolbar state
  const [selectedVehicle, setSelectedVehicle] = React.useState("all");
  const [range, setRange] = React.useState("month"); // week, month, year, custom
  const [customFrom, setCustomFrom] = React.useState("");
  const [customTo, setCustomTo] = React.useState("");

  // email modal
  const [emailOpen, setEmailOpen] = React.useState(false);
  const [emailTo, setEmailTo] = React.useState("");

  // derived filtered logs
  const filteredLogs = React.useMemo(() => {
    const userLogs = logs.filter((l) => selectedVehicle === "all" || l.vehicleId === selectedVehicle);

    const now = new Date();
    let from = null;
    let to = null;

    if (range === "week") {
      // last 7 days
      to = new Date();
      from = new Date();
      from.setDate(to.getDate() - 7);
    } else if (range === "month") {
      to = new Date();
      from = new Date();
      from.setMonth(to.getMonth() - 1);
    } else if (range === "year") {
      to = new Date();
      from = new Date();
      from.setFullYear(to.getFullYear() - 1);
    } else if (range === "custom" && customFrom && customTo) {
      from = new Date(customFrom);
      to = new Date(customTo);
      // include whole to day
      to.setHours(23, 59, 59, 999);
    }

    if (!from || !to) return userLogs.sort((a, b) => new Date(b.date) - new Date(a.date));

    return userLogs.filter((l) => {
      const d = new Date(l.date);
      return d >= from && d <= to;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [logs, selectedVehicle, range, customFrom, customTo]);

  // KPIs
  const summary = React.useMemo(() => {
    const totalSpent = filteredLogs.reduce((s, l) => s + (Number(l.amount) || 0), 0);
    const totalLitres = filteredLogs.reduce((s, l) => s + (Number(l.litres) || 0), 0);
    const avgMileage =
      filteredLogs.length > 0
        ? filteredLogs.reduce((s, l) => s + (Number(l.mileage) || 0), 0) / filteredLogs.length
        : 0;
    const avgCostPerKm =
      filteredLogs.length > 0
        ? filteredLogs.reduce((s, l) => s + (Number(l.runningCostPerKm) || 0), 0) / filteredLogs.length
        : 0;

    return {
      totalSpent,
      totalLitres,
      avgMileage: Number(avgMileage.toFixed(2)),
      avgCostPerKm: Number(avgCostPerKm.toFixed(2)),
    };
  }, [filteredLogs]);

  /* Download CSV (Excel-friendly). This is frontend-only. */
  const downloadCsv = () => {
    const vehicleName = selectedVehicle === "all" ? "all-vehicles" : vehiclesMap[selectedVehicle] || "vehicle";
    const headers = [
      "Date",
      "Vehicle",
      "Amount (₹)",
      "Price / L",
      "Litres",
      "Trip Distance (km)",
      "Mileage (km/L)",
      "Running Cost (₹/km)",
      "Odometer (km)",
      "Notes",
    ];
    const rows = filteredLogs.map((l) => [
      new Date(l.date).toLocaleDateString(),
      vehiclesMap[l.vehicleId] || l.vehicleId,
      l.amount ?? "",
      l.pricePerL ?? "",
      l.litres ?? "",
      l.tripDistance ?? "",
      l.mileage ?? "",
      l.runningCostPerKm ?? "",
      l.odometer ?? "",
      (l.notes || "").replace(/\n/g, " "),
    ]);

    const csvContent =
      [headers, ...rows].map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fuel-report-${vehicleName}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  /* Email send (simulated) */
  const openEmailModal = () => {
    setEmailTo("");
    setEmailOpen(true);
  };

  const sendEmail = () => {
    if (!emailTo || !/\S+@\S+\.\S+/.test(emailTo)) {
      alert("Enter a valid recipient email");
      return;
    }
    // simulate sending, show toast or message
    setTimeout(() => {
      alert(`Report sent to ${emailTo} (simulated).`);
      setEmailOpen(false);
    }, 600);
  };

  return (
    <div className="px-4 pt-4 md:px-10 flex-1">
      <TitleAdmin title="Reports" subTitle="Fuel reports by vehicle — weekly, monthly, annual or custom range." />

      <section className="mb-6">
        <div className="bg-theme dark:bg-theme-dark rounded-lg p-4 border border-gray-200 dark:border-slate-700/40">
          <ReportToolbar
            vehicles={vehicles}
            selectedVehicle={selectedVehicle}
            setSelectedVehicle={setSelectedVehicle}
            range={range}
            setRange={setRange}
            customFrom={customFrom}
            customTo={customTo}
            setCustomFrom={setCustomFrom}
            setCustomTo={setCustomTo}
            onDownload={downloadCsv}
            onSendEmail={openEmailModal}
          />

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
  <div className="p-3 rounded-md bg-theme dark:bg-theme-dark border border-gray-200 dark:border-slate-700/40">
    <div className="text-xs text-theme-light dark:text-theme-light">Total Spent</div>
    <div className="text-lg font-semibold text-theme dark:text-white">
      {formatCurrency(summary.totalSpent)}
    </div>
  </div>

  <div className="p-3 rounded-md bg-theme dark:bg-theme-dark border border-gray-200 dark:border-slate-700/40">
    <div className="text-xs text-theme-light dark:text-theme-light">Total Litres</div>
    <div className="text-lg font-semibold text-theme dark:text-white">
      {summary.totalLitres.toFixed(2)} L
    </div>
  </div>

  <div className="p-3 rounded-md bg-theme dark:bg-theme-dark border border-gray-200 dark:border-slate-700/40">
    <div className="text-xs text-theme-light dark:text-theme-light">Avg Mileage</div>
    <div className="text-lg font-semibold text-theme dark:text-white">
      {summary.avgMileage} km/L
    </div>
  </div>

  <div className="p-3 rounded-md bg-theme dark:bg-theme-dark border border-gray-200 dark:border-slate-700/40">
    <div className="text-xs text-theme-light dark:text-theme-light">Avg Cost / km</div>
    <div className="text-lg font-semibold text-theme dark:text-white">
      ₹{summary.avgCostPerKm}
    </div>
  </div>
</div>

          {/* table */}
          <div className="mt-4">
            <ReportTable logs={filteredLogs} vehiclesMap={vehiclesMap} />
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-4 flex items-center justify-end gap-3">
          <button onClick={downloadCsv} className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark">
            Download CSV
          </button>
          <button onClick={openEmailModal} className="px-4 py-2 rounded-md border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white">
            Email Report
          </button>
        </div>
      </section>

      {/* Email modal */}
      <Modal open={emailOpen} onClose={() => setEmailOpen(false)} size="sm">
        <div className="py-6 px-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-theme dark:text-white">Send Report</h3>
            <button onClick={() => setEmailOpen(false)} className="p-1 rounded-md hover:bg-slate-100/60 dark:hover:bg-white/6">
              <X />
            </button>
          </div>

          <div className="space-y-3">
            <label className="text-sm text-theme dark:text-theme-light">Recipient email</label>
            <input
              type="email"
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
              placeholder="name@example.com"
              className="w-full py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setEmailOpen(false)} className="px-3 py-2 rounded-md border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme-light dark:text-theme-light">
                Cancel
              </button>
              <button onClick={sendEmail} className="px-3 py-2 rounded-md bg-primary text-white">
                Send
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
