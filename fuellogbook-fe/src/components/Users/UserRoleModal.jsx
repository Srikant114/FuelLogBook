// src/components/Users/UserRoleModal.jsx
import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import ModalShell from "../Modals/ModalShell";

/**
 * Props:
 * - open, onClose, user, onSaveRole(currentUserId, newRole, reason?)
 * - currentUser: the logged in user (to prevent self-demotion if desired)
 */
export default function UserRoleModal({ open, onClose, user, onSaveRole, currentUser = null }) {
  const [role, setRole] = useState(user?.role ?? "User");
  const [reason, setReason] = useState("");

  useEffect(() => {
    setRole(user?.role ?? "User");
    setReason("");
  }, [user, open]);

  if (!user) return null;

  const cannotChangeSuper = user?.role === "Super Admin" && (currentUser?.role !== "Super Admin");

  const handleSave = () => {
    if (cannotChangeSuper) {
      alert("Only a Super Admin can change another Super Admin's role.");
      return;
    }
    onSaveRole?.(user, role, reason);
    onClose?.();
  };

  return (
    <ModalShell open={open} onClose={onClose} width="max-w-md">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Change role — {user?.name}</h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-[var(--hover-bg)]"><FiX /></button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm text-[var(--muted)]">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2">
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="Super Admin">Super Admin</option>
            </select>
            {cannotChangeSuper && <div className="text-xs text-red-600 mt-2">Only a Super Admin may change this user's role.</div>}
          </div>

          <div>
            <label className="text-sm text-[var(--muted)]">Reason (optional)</label>
            <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Optional note for audit log" className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md border bg-white">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-md bg-[var(--accent)] text-white">Save</button>
        </div>
      </div>
    </ModalShell>
  );
}
