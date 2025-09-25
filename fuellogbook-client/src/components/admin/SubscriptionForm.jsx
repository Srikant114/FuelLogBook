import React, { useState } from "react";
import { X, Plus } from "lucide-react";

/**
 * SubscriptionForm
 * - initialData: optional (for edit). shape: { id, key, title, price, cycle, description, features: string[], limitEntries, visible }
 * - onCancel()
 * - onSubmit(plan) -> returns created/updated plan object
 *
 * Minimal, theme-aware form. Features editable as dynamic list.
 */
export default function SubscriptionForm({ initialData = null, onCancel, onSubmit }) {
  const isEdit = Boolean(initialData?.id);
  const [plan, setPlan] = useState(() => ({
    key: initialData?.key || "",
    title: initialData?.title || "",
    price: initialData?.price || "",
    cycle: initialData?.cycle || "monthly", // monthly/annual
    description: initialData?.description || "",
    features: initialData?.features ? [...initialData.features] : ["Feature 1", "Feature 2"],
    limitEntries: initialData?.limitEntries ?? null,
    visible: initialData?.visible ?? true,
  }));

  const handle = (k) => (e) => setPlan((p) => ({ ...p, [k]: e.target.value }));
  const toggleVisible = () => setPlan((p) => ({ ...p, visible: !p.visible }));

  const setFeature = (idx, value) => {
    setPlan((p) => {
      const features = [...p.features];
      features[idx] = value;
      return { ...p, features };
    });
  };

  const addFeature = () => setPlan((p) => ({ ...p, features: [...p.features, ""] }));
  const removeFeature = (idx) => setPlan((p) => ({ ...p, features: p.features.filter((_, i) => i !== idx) }));

  const submit = (e) => {
    e.preventDefault();
    if (!plan.title.trim()) return alert("Please enter plan title");
    if (!plan.price && plan.price !== 0) return alert("Please set price (0 for free)");
    // build final object
    const payload = {
      ...plan,
      key: plan.key || plan.title.toLowerCase().replace(/\s+/g, "-"),
      price: Number(plan.price),
      limitEntries: plan.limitEntries ? Number(plan.limitEntries) : null,
    };
    onSubmit?.(payload);
  };

  return (
    <div className="py-6 px-6 md:px-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-theme dark:text-white">{isEdit ? "Edit Plan" : "Create Plan"}</h3>
        <button onClick={onCancel} className="p-2 rounded-md hover:bg-slate-100/60 dark:hover:bg-white/6">
          <X size={18} className="text-theme dark:text-white" />
        </button>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-sm text-theme dark:text-theme-light">Plan Title</label>
          <input value={plan.title} onChange={handle("title")} placeholder="Pro Plan" className="w-full py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-theme dark:text-theme-light">Price (₹)</label>
            <input value={plan.price} onChange={handle("price")} type="number" step="1" className="w-full py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white" />
          </div>

          <div>
            <label className="text-sm text-theme dark:text-theme-light">Billing Cycle</label>
            <select value={plan.cycle} onChange={handle("cycle")} className="w-full py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white">
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm text-theme dark:text-theme-light">Limit (entries)</label>
          <input value={plan.limitEntries ?? ""} onChange={handle("limitEntries")} type="number" placeholder="e.g. 50 (leave blank for unlimited)" className="w-full py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white" />
        </div>

        <div>
          <label className="text-sm text-theme dark:text-theme-light">Short description</label>
          <textarea rows={3} value={plan.description} onChange={handle("description")} className="w-full py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white resize-none" placeholder="Describe the plan benefits..." />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-theme dark:text-theme-light">Features</label>
            <button type="button" onClick={addFeature} className="inline-flex items-center gap-2 px-2 py-1 rounded text-sm border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white">
              <Plus size={14} /> Add
            </button>
          </div>

          <div className="space-y-2">
            {plan.features.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={f} onChange={(e) => setFeature(i, e.target.value)} placeholder={`Feature ${i + 1}`} className="flex-1 py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white" />
                <button type="button" onClick={() => removeFeature(i)} className="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={plan.visible} onChange={toggleVisible} className="h-4 w-4" />
            <span className="text-sm text-theme dark:text-theme-light">Published</span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button type="button" onClick={onCancel} className="px-3 py-2 rounded-md border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme-light dark:text-theme-light">Cancel</button>
          <button type="submit" className="px-3 py-2 rounded-md bg-primary text-white">{isEdit ? "Save Plan" : "Create Plan"}</button>
        </div>
      </form>
    </div>
  );
}
