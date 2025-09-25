import React from "react";
import TitleAdmin from "../../components/common/TitleAdmin";
import UserRow from "../../components/admin/UserRow";
import SubscriptionModal from "../../components/admin/SubscriptionModal";
import Modal from "../../components/admin/Modal";
import ConfirmDelete from "../../components/admin/ConfirmDelete";
import Pagination from "../../components/admin/Pagination";
import { Search } from "lucide-react";

/* Dummy users */
const DUMMY_USERS = [
  { id: "u1", name: "Asha Rao", username: "asharao", email: "asha@example.com", phone: "9876543210", photoUrl: "https://i.pravatar.cc/150?img=12", status: "pending", plan: "free" },
  { id: "u2", name: "Manish Kumar", username: "manishk", email: "manish@example.com", phone: "9123456780", photoUrl: "https://i.pravatar.cc/150?img=5", status: "active", plan: "starter" },
  { id: "u3", name: "Priya Singh", username: "priya", email: "priya@example.com", phone: "9988776655", photoUrl: "https://i.pravatar.cc/150?img=8", status: "active", plan: "pro" },
  { id: "u4", name: "Ravi Patel", username: "ravip", email: "ravi@example.com", phone: "9012345678", photoUrl: "https://i.pravatar.cc/150?img=25", status: "suspended", plan: "free" },
  { id: "u5", name: "Sneha Das", username: "sneha", email: "sneha@example.com", phone: "9001122334", photoUrl: "https://i.pravatar.cc/150?img=18", status: "pending", plan: "free" },
  // add more if needed
];

export default function Users() {
  const [users, setUsers] = React.useState(DUMMY_USERS);
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  // pagination
  const PAGE_SIZE = 6;
  const [page, setPage] = React.useState(1);
  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));

  // modals
  const [subOpen, setSubOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [delOpen, setDelOpen] = React.useState(false);
  const [toDelete, setToDelete] = React.useState(null);

  // search + filter
  const filtered = React.useMemo(() => {
    return users.filter((u) => {
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.username || "").toLowerCase().includes(q)
      );
    });
  }, [users, query, statusFilter]);

  const visible = React.useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // actions
  const handleApprove = (user) => {
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: "active" } : u)));
  };

  const handleAssign = (user) => {
    setSelectedUser(user);
    setSubOpen(true);
  };

  const handleSavePlan = ({ plan, startDate }) => {
    if (!selectedUser) return;
    setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? { ...u, plan, status: plan === "free" ? u.status : "active", planStart: startDate } : u)));
    setSubOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = (user) => {
    setToDelete(user);
    setDelOpen(true);
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    setUsers((prev) => prev.filter((u) => u.id !== toDelete.id));
    setToDelete(null);
    setDelOpen(false);
  };

  React.useEffect(() => {
    setPage(1);
  }, [query, statusFilter]);

  return (
    <div className="px-4 pt-4 md:px-10 flex-1">
      <TitleAdmin title="Users" subTitle="Registered users — approve, assign subscription plans or remove users." />

      <section className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex items-center w-full md:w-[360px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-light dark:text-theme-light" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, email or username" className="w-full pl-9 pr-3 py-2 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white" />
            </div>

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white">
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => { setSelectedUser(null); setSubOpen(true); }} className="px-3 py-2 rounded-md bg-primary text-white hover:bg-primary-dark">Add user</button>
            <button onClick={() => { navigator.clipboard?.writeText(JSON.stringify(users, null, 2)); alert("Copied sample data to clipboard"); }} className="px-3 py-2 rounded-md border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white">Export</button>
          </div>
        </div>

        <div className="bg-theme dark:bg-theme-dark rounded-md border border-gray-200 dark:border-slate-700/40 overflow-hidden">
          <table className="md:table-auto table-fixed w-full">
            <thead className="hidden md:table-header-group text-theme dark:text-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">User</th>
                <th className="px-4 py-3 text-left font-semibold">Contact</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Plan</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {visible.map((u) => (
                <UserRow key={u.id} user={u} onApprove={handleApprove} onAssign={handleAssign} onDelete={handleDelete} />
              ))}

              {visible.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-theme-light dark:text-theme-light">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-theme-light dark:text-theme-light">{filtered.length} users</div>
          <Pagination currentPage={page} totalPages={Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))} onPageChange={setPage} />
        </div>
      </section>

      {/* Subscription modal */}
      <Modal open={subOpen} onClose={() => { setSubOpen(false); setSelectedUser(null); }} size="md">
        <SubscriptionModal open={subOpen} onClose={() => { setSubOpen(false); setSelectedUser(null); }} user={selectedUser || { name: "New user" }} onSave={handleSavePlan} />
      </Modal>

      {/* Confirm delete modal */}
      <Modal open={delOpen} onClose={() => { setDelOpen(false); setToDelete(null); }} size="sm">
        <ConfirmDelete openItemName={toDelete?.email || toDelete?.name || ""} onCancel={() => { setDelOpen(false); setToDelete(null); }} onConfirm={confirmDelete} />
      </Modal>
    </div>
  );
}
