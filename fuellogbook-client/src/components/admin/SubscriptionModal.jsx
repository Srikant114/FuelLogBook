import React from "react";
import { X } from "lucide-react";

/**
 * SubscriptionModal
 * - open, onClose, user, onSave({ plan, startDate })
 *
 * Shows plan cards and allows Super Admin to assign plan to user.
 */
const PLANS = [
  { key: "free", title: "Free", price: "Free", bullets: ["Limited features", "Up to 5 logs"] },
  { key: "starter", title: "Starter", price: "₹299/mo", bullets: ["Up to 50 entries", "Basic reports"] },
  { key: "pro", title: "Pro", price: "₹799/mo", bullets: ["Unlimited entries", "Detailed analytics"] },
  { key: "enterprise", title: "Enterprise", price: "₹1499/mo", bullets: ["Team access", "Dedicated support"] },
];

export default function SubscriptionModal({ open, onClose, user, onSave }) {
  const [selected, setSelected] = React.useState(user?.plan || "free");
  const [startDate, setStartDate] = React.useState(new Date().toISOString().slice(0, 10));

  React.useEffect(() => {
    setSelected(user?.plan || "free");
  }, [user]);

  if (!open) return null;

  return (
    <div className="py-6 px-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-theme dark:text-white">Assign Plan — {user?.name}</h3>
        <button onClick={onClose} className="p-2 rounded-md hover:bg-slate-100/60 dark:hover:bg-white/6">
          <X size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PLANS.map((p) => (
          <label key={p.key} className={`block cursor-pointer rounded-md p-4 border ${selected === p.key ? "border-primary bg-primary/10 dark:bg-primary/10" : "border-gray-200 dark:border-slate-700/40 bg-theme dark:bg-theme-dark"}`}>
            <input type="radio" name="plan" value={p.key} checked={selected === p.key} onChange={() => setSelected(p.key)} className="sr-only" />
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold text-theme dark:text-white">{p.title}</div>
                <div className="text-xs text-theme-light dark:text-theme-light">{p.price}</div>
                <ul className="mt-2 text-xs text-theme-light dark:text-theme-light space-y-1">
                  {p.bullets.map((b, i) => <li key={i}>• {b}</li>)}
                </ul>
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <label className="text-sm text-theme dark:text-theme-light">Start date</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white" />
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button onClick={onClose} className="px-3 py-2 rounded-md border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme-light dark:text-theme-light">Cancel</button>
        <button onClick={() => onSave({ plan: selected, startDate })} className="px-3 py-2 rounded-md bg-primary text-white">Save</button>
      </div>
    </div>
  );
}
