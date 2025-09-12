// src/pages/Users.jsx
import React, { useEffect, useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import Pagination from "../components/Pagination/Pagination";
import UserRow from "../components/Users/UserRow";
import UserRoleModal from "../components/Users/UserRoleModal";
import ViewUserModal from "../components/Users/ViewUserModal";
import ConfirmModal from "../components/Users/ConfirmModal";

/* ---------- sample data (replace with API) ---------- */
const sampleUsers = [
  { id: "u1", name: "Srikant Rao", email: "srikant@example.com", phone: "+91 98765 43210", role: "Super Admin", createdAt: "2023-11-01", avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200", active: true, notes: "Creator" },
  { id: "u2", name: "Anita Sharma", email: "anita@example.com", phone: "+91 91234 56789", role: "Admin", createdAt: "2024-02-12", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200", active: true },
  { id: "u3", name: "Rahul Verma", email: "rahul@example.com", phone: "+91 99887 66554", role: "User", createdAt: "2024-05-20", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200", active: true },
  { id: "u4", name: "Priya Singh", email: "priya@example.com", phone: null, role: "User", createdAt: "2024-07-15", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200", active: false },
  // ...add more for testing
];

/* Simulate current signed-in user */
const currentUser = { id: "u1", role: "Super Admin", name: "Srikant Rao" };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // controls
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All"); // All | Active | Disabled
  const [pageSize, setPageSize] = useState(8);
  const [page, setPage] = useState(1);

  // modals & active
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({});
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setUsers(sampleUsers);
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, []);

  // derived filter
  const filtered = useMemo(() => {
    let list = (users ?? []).slice();
    const q = (query ?? "").trim().toLowerCase();
    if (q) {
      list = list.filter((u) => (u?.name ?? "").toLowerCase().includes(q) || (u?.email ?? "").toLowerCase().includes(q));
    }
    if (roleFilter !== "All") {
      list = list.filter((u) => u?.role === roleFilter);
    }
    if (statusFilter === "Active") list = list.filter((u) => u?.active);
    if (statusFilter === "Disabled") list = list.filter((u) => !u?.active);
    return list;
  }, [users, query, roleFilter, statusFilter]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  const pageItems = filtered.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

  /* handlers */
  const handleOpenRoleModal = (user) => {
    setActiveUser(user);
    setRoleModalOpen(true);
  };

  const handleSaveRole = (user, newRole, reason) => {
    // guard: only Super Admin can change Super Admin role
    if (user?.role === "Super Admin" && currentUser?.role !== "Super Admin") {
      alert("Only Super Admin may change another Super Admin role.");
      return;
    }
    // update locally
    setUsers((s) => s.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)));
    // TODO: call API to persist (audit with reason)
    console.log("Role changed:", user.id, newRole, reason);
  };

  const handleToggleActive = (user) => {
    // prevent disabling the last super admin or current user accidentally (business rule example)
    if (user?.id === currentUser?.id) {
      if (!confirm("Do you want to disable your own account? This will log you out.")) return;
    }
    setUsers((s) => s.map((u) => (u.id === user.id ? { ...u, active: !u.active } : u)));
  };

  const handleDelete = (user) => {
    // ask to confirm delete
    setConfirmConfig({
      title: "Delete user?",
      description: `Delete ${user?.name ?? "this user"} — this action cannot be undone.`,
      confirmLabel: "Delete",
      onConfirm: () => {
        setUsers((s) => s.filter((x) => x.id !== user.id));
      },
    });
    setConfirmOpen(true);
  };

  const openView = (user) => {
    setActiveUser(user);
    setViewModalOpen(true);
  };

  /* Quick role list for filter */
  const roleOptions = useMemo(() => ["All", ...Array.from(new Set(users.map((u) => u.role)))], [users]);

  return (
    <div className="space-y-6">
      <div className="bg-[var(--panel)] p-5 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Users</h2>
            <p className="text-sm text-[var(--muted)] mt-1 max-w-prose">Manage registered users — view profile, change roles, disable or delete users (admin only).</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--accent)] text-white shadow">
              <FiPlus /> Invite user
            </button>
          </div>
        </div>

        {/* controls */}
        <div className="mt-4 flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center gap-2 w-full max-w-xl">
            <div className="flex items-center gap-2 border rounded-md px-3 py-2 w-full bg-white">
              <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search name or email..." className="w-full outline-none text-sm" />
              {query ? <button onClick={() => setQuery("")} className="p-1 rounded-md hover:bg-[var(--hover-bg)]">Clear</button> : null}
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }} className="rounded-md border px-3 py-2 text-sm">
              {roleOptions.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>

            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="rounded-md border px-3 py-2 text-sm">
              <option>All</option>
              <option>Active</option>
              <option>Disabled</option>
            </select>

            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="rounded-md border px-3 py-2 text-sm">
              {[6, 8, 12, 24].map(n => <option key={n} value={n}>{n} / page</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* list */}
      <div>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: pageSize }).map((_, i) => <div key={i} className="animate-pulse h-20 bg-[var(--panel)] rounded-lg" />)}
          </div>
        ) : pageItems.length === 0 ? (
          <div className="text-center py-12 text-[var(--muted)]">
            <div className="text-lg font-medium">No users found</div>
            <div className="text-sm mt-2">Try changing filters or invite a user.</div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Table header (desktop) */}
            <div className="hidden md:flex items-center gap-4 px-3 py-2 text-xs text-[var(--muted)]">
              <div className="flex-1">User</div>
              <div className="flex-1">Phone</div>
              <div className="flex-1">Role</div>
              <div className="flex-1">Joined</div>
              <div style={{ width: 160 }} className="text-right">Actions</div>
            </div>

            <div className="grid gap-2">
              {pageItems.map((u) => (
                <UserRow
                  key={u?.id}
                  user={u}
                  onView={openView}
                  onOpenRoleModal={handleOpenRoleModal}
                  onToggleActive={handleToggleActive}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* pagination */}
      <Pagination total={total} page={page} pageSize={pageSize} onPageChange={(p) => setPage(p)} onPageSizeChange={(n) => { setPageSize(n); setPage(1); }} />

      {/* modals */}
      <UserRoleModal open={roleModalOpen} onClose={() => setRoleModalOpen(false)} user={activeUser} onSaveRole={handleSaveRole} currentUser={currentUser} />
      <ViewUserModal open={viewModalOpen} onClose={() => setViewModalOpen(false)} user={activeUser} />
      <ConfirmModal open={confirmOpen} onClose={() => setConfirmOpen(false)} {...confirmConfig} />
    </div>
  );
}
