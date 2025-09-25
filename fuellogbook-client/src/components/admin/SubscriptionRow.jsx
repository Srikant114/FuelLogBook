import React from "react";
import { Edit3, Trash2 } from "lucide-react";

/**
 * SubscriptionRow
 * Renders table row on md+ and card on mobile.
 */
export default function SubscriptionRow({ plan, onEdit, onDelete }) {
  return (
    <>
      {/* Desktop row */}
      <tr className="hidden md:table-row border-t border-gray-200 dark:border-slate-700/40">
        <td className="px-4 py-3">
          <div className="text-sm font-semibold text-theme dark:text-white">{plan.title}</div>
          <div className="text-xs text-theme-light dark:text-theme-light">{plan.description}</div>
        </td>

        <td className="px-4 py-3">
          <div className="text-sm text-theme dark:text-white">{plan.price ? `₹${plan.price}` : "Free"}</div>
          <div className="text-xs text-theme-light dark:text-theme-light capitalize">{plan.cycle}</div>
        </td>

        <td className="px-4 py-3">
          <div className="text-sm text-theme dark:text-white">{plan.limitEntries ? `${plan.limitEntries} entries` : "Unlimited"}</div>
        </td>

        <td className="px-4 py-3">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${plan.visible ? "text-green-700 bg-green-50 dark:bg-green-900/20" : "text-gray-600 bg-gray-100 dark:bg-white/5"}`}>
            {plan.visible ? "Published" : "Hidden"}
          </div>
        </td>

        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <button onClick={() => onEdit(plan)} className="p-2 rounded-md hover:bg-slate-100/60 dark:hover:bg-white/6">
              <Edit3 size={16} className="text-theme-light dark:text-theme-light" />
            </button>
            <button onClick={() => onDelete(plan)} className="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20">
              <Trash2 size={16} className="text-red-600 dark:text-red-400" />
            </button>
          </div>
        </td>
      </tr>

      {/* Mobile card */}
      <tr className="table-row md:hidden border-t border-gray-200 dark:border-slate-700/40">
        <td colSpan={5} className="px-3 py-4">
          <div className="bg-theme dark:bg-theme-dark rounded-md p-3 border border-gray-200 dark:border-slate-700/40">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-theme dark:text-white">{plan.title}</div>
                    <div className="text-xs text-theme-light dark:text-theme-light">{plan.description}</div>
                  </div>
                  <div className="text-sm font-medium text-theme dark:text-white">{plan.price ? `₹${plan.price}` : "Free"}</div>
                </div>

                <div className="mt-3 text-xs text-theme-light dark:text-theme-light">
                  {plan.features?.slice(0, 4).map((f, i) => <div key={i}>• {f}</div>)}
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <button onClick={() => onEdit(plan)} className="p-2 rounded-md hover:bg-slate-100/60 dark:hover:bg-white/6">
                  <Edit3 size={16} className="text-theme-light dark:text-theme-light" />
                </button>
                <button onClick={() => onDelete(plan)} className="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                </button>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}
