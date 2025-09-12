// src/components/Users/ViewUserModal.jsx
import React from "react";
import { FiX } from "react-icons/fi";
import ModalShell from "../Modals/ModalShell";

/**
 * View user details modal
 */
export default function ViewUserModal({ open, onClose, user }) {
  if (!user) return null;
  return (
    <ModalShell open={open} onClose={onClose} width="max-w-md">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">User details</h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-[var(--hover-bg)]"><FiX /></button>
        </div>

        <div className="mt-4 flex gap-4">
          <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-lg object-cover" />
          <div>
            <div className="text-lg font-semibold">{user.name}</div>
            <div className="text-sm text-[var(--muted)]">{user.email}</div>
            <div className="text-sm text-[var(--muted)]">{user.phone ?? "—"}</div>
            <div className="mt-2">
              <div className="text-xs text-[var(--muted)]">Role</div>
              <div className="font-semibold">{user.role}</div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs text-[var(--muted)]">Joined</div>
          <div className="font-semibold">{user.createdAt ? new Date(user.createdAt).toLocaleString() : "—"}</div>

          <div className="mt-3">
            <div className="text-xs text-[var(--muted)]">Notes</div>
            <div className="text-sm">{user.notes ?? "—"}</div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
