import React from "react";
import { CheckCircle2, XCircle, Trash2, UserPlus } from "lucide-react";

/**
 * UserRow
 * - Renders desktop table row on md+
 * - Renders stacked card on mobile (single td)
 *
 * Props:
 *  - user: { id, name, email, username, phone, photoUrl, status: 'pending'|'active'|'suspended', plan: 'free'|'starter'|'pro'|'enterprise' }
 *  - onApprove(user), onAssign(user), onDelete(user)
 */
export default function UserRow({ user, onApprove, onAssign, onDelete }) {
  const statusStyles = {
    pending: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
    active: "text-green-700 bg-green-50 dark:bg-green-900/20",
    suspended: "text-red-700 bg-red-50 dark:bg-red-900/20",
  };

  return (
    <>
      {/* Desktop row */}
      <tr className="hidden md:table-row border-t border-gray-200 dark:border-slate-700/40">
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <img src={user.photoUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
            <div className="min-w-0">
              <div className="text-sm font-medium text-theme dark:text-white truncate">{user.name}</div>
              <div className="text-xs text-theme-light dark:text-theme-light truncate">{user.email}</div>
            </div>
          </div>
        </td>

        <td className="px-4 py-3">
          <div className="text-sm text-theme dark:text-white">{user.username || "-"}</div>
          <div className="text-xs text-theme-light dark:text-theme-light">{user.phone || "-"}</div>
        </td>

        <td className="px-4 py-3">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${statusStyles[user.status] || ""}`}>
            {user.status === "active" ? "Active" : user.status === "pending" ? "Pending" : "Suspended"}
          </div>
        </td>

        <td className="px-4 py-3">
          <div className="text-sm text-theme dark:text-white capitalize">{user.plan === "free" ? "Free" : user.plan}</div>
          <div className="text-xs text-theme-light dark:text-theme-light">{user.plan === "free" ? "Limited access" : "Subscribed"}</div>
        </td>

        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {user.status === "pending" && (
              <button onClick={() => onApprove(user)} className="p-2 rounded-md hover:bg-slate-100/60 dark:hover:bg-white/6" title="Approve">
                <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
              </button>
            )}

            <button onClick={() => onAssign(user)} className="p-2 rounded-md hover:bg-slate-100/60 dark:hover:bg-white/6" title="Assign Plan">
              <UserPlus size={16} className="text-theme-light dark:text-theme-light" />
            </button>

            <button onClick={() => onDelete(user)} className="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20" title="Remove">
              <Trash2 size={16} className="text-red-600 dark:text-red-400" />
            </button>
          </div>
        </td>
      </tr>

      {/* Mobile stacked card */}
      <tr className="table-row md:hidden border-t border-gray-200 dark:border-slate-700/40">
        <td colSpan={5} className="px-3 py-4">
          <div className="bg-theme dark:bg-theme-dark rounded-md p-3 border border-gray-200 dark:border-slate-700/40">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <img src={user.photoUrl} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-theme dark:text-white truncate">{user.name}</div>
                    <div className="text-xs text-theme-light dark:text-theme-light truncate">{user.email}</div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-xs text-theme-light dark:text-theme-light">Username</div>
                    <div className="text-theme dark:text-white">{user.username || "-"}</div>
                  </div>

                  <div>
                    <div className="text-xs text-theme-light dark:text-theme-light">Phone</div>
                    <div className="text-theme dark:text-white">{user.phone || "-"}</div>
                  </div>

                  <div>
                    <div className="text-xs text-theme-light dark:text-theme-light">Status</div>
                    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs ${statusStyles[user.status] || ""}`}>
                      {user.status === "active" ? "Active" : user.status === "pending" ? "Pending" : "Suspended"}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-theme-light dark:text-theme-light">Plan</div>
                    <div className="text-theme dark:text-white capitalize">{user.plan}</div>
                  </div>
                </div>

                {user.notes ? <div className="mt-3 text-xs text-theme-light dark:text-theme-light line-clamp-3">{user.notes}</div> : null}
              </div>

              <div className="flex flex-col items-center gap-2">
                {user.status === "pending" && (
                  <button onClick={() => onApprove(user)} className="p-2 rounded-md hover:bg-slate-100/60 dark:hover:bg-white/6" title="Approve">
                    <CheckCircle2 size={18} className="text-green-600 dark:text-green-400" />
                  </button>
                )}

                <button onClick={() => onAssign(user)} className="p-2 rounded-md hover:bg-slate-100/60 dark:hover:bg-white/6" title="Assign Plan">
                  <UserPlus size={18} className="text-theme-light dark:text-theme-light" />
                </button>

                <button onClick={() => onDelete(user)} className="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20" title="Remove">
                  <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                </button>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}
