// src/components/Users/UserRow.jsx
import React from "react";
import { FiEye, FiEdit, FiTrash2, FiUserCheck } from "react-icons/fi";

/**
 * Desktop table row for a user (and mobile card if needed)
 * Props:
 * - user, onView, onOpenRoleModal, onToggleActive, onDelete
 */
export default function UserRow({ user, onView, onOpenRoleModal, onToggleActive, onDelete }) {
  const roleBadge = (role) => {
    if (role === "Super Admin") return "bg-purple-50 text-purple-700";
    if (role === "Admin") return "bg-indigo-50 text-indigo-700";
    return "bg-slate-50 text-slate-700";
  };

  return (
    <div className="bg-[var(--panel)] rounded-lg shadow-sm p-3 md:p-0">
      {/* Desktop table row */}
      <div className="hidden md:flex items-center justify-between gap-4 px-3 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-lg object-cover" />
          <div className="min-w-0">
            <div className="font-semibold text-[var(--text)] truncate">{user.name}</div>
            <div className="text-xs text-[var(--muted)] truncate">{user.email}</div>
          </div>
        </div>

        <div className="flex-1 text-sm text-[var(--muted)]">{user.phone ?? "—"}</div>

        <div className="flex-1 text-sm">
          <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full font-semibold ${roleBadge(user.role)}`}>
            {user.role}
          </span>
        </div>

        <div className="flex-1 text-sm text-[var(--muted)]">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</div>

        <div className="flex items-center gap-2">
          <button onClick={() => onView(user)} className="p-2 rounded-md hover:bg-[var(--hover-bg)]" title="View">
            <FiEye />
          </button>

          <button onClick={() => onOpenRoleModal(user)} className="p-2 rounded-md hover:bg-[var(--hover-bg)]" title="Change role">
            <FiEdit />
          </button>

          <button onClick={() => onToggleActive(user)} className={`p-2 rounded-md hover:bg-[var(--hover-bg)] ${user.active ? "" : "opacity-80"}`} title={user.active ? "Disable user" : "Enable user"}>
            <FiUserCheck />
          </button>

          <button onClick={() => onDelete(user)} className="p-2 rounded-md hover:bg-red-50 text-red-600" title="Delete user">
            <FiTrash2 />
          </button>
        </div>
      </div>

      {/* Mobile stacked card */}
      <div className="md:hidden flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-lg object-cover" />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-[var(--text)] truncate">{user.name}</div>
            <div className="text-xs text-[var(--muted)] truncate">{user.email}</div>
            <div className="text-xs mt-1">
              <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full font-semibold ${roleBadge(user.role)}`}>
                {user.role}
              </span>
              <span className="ml-2 text-[var(--muted)] text-xs">{user.active ? "Active" : "Disabled"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => onView(user)} className="flex-1 py-2 rounded-md bg-[var(--panel)] border text-sm">View</button>
          <button onClick={() => onOpenRoleModal(user)} className="flex-1 py-2 rounded-md bg-white border text-sm">Role</button>
          <button onClick={() => onToggleActive(user)} className="flex-1 py-2 rounded-md text-sm border">{user.active ? "Disable" : "Enable"}</button>
        </div>
      </div>
    </div>
  );
}
