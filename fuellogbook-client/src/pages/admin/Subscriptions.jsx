import React from "react";
import TitleAdmin from "../../components/common/TitleAdmin";
import SubscriptionRow from "../../components/admin/SubscriptionRow";
import SubscriptionForm from "../../components/admin/SubscriptionForm";
import Modal from "../../components/admin/Modal";
import ConfirmDelete from "../../components/admin/ConfirmDelete";
import Pagination from "../../components/admin/Pagination";
import { PlusCircle } from "lucide-react";

/* Dummy plans */
const DUMMY_PLANS = [
  { id: "p_free", key: "free", title: "Free", price: 0, cycle: "monthly", description: "Basic free tier", features: ["Limited features", "Basic reports"], limitEntries: 5, visible: true },
  { id: "p_starter", key: "starter", title: "Starter", price: 299, cycle: "monthly", description: "Starter Plan", features: ["Up to 50 fuel entries", "Monthly summary"], limitEntries: 50, visible: true },
  { id: "p_pro", key: "pro", title: "Pro", price: 799, cycle: "monthly", description: "Pro Plan", features: ["Unlimited entries", "Detailed analytics"], limitEntries: null, visible: true },
  { id: "p_enterprise", key: "enterprise", title: "Enterprise", price: 1499, cycle: "monthly", description: "Enterprise Plan", features: ["Team access", "Dedicated support"], limitEntries: null, visible: false },
];

export default function Subscriptions() {
  const [plans, setPlans] = React.useState(DUMMY_PLANS);
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const PAGE_SIZE = 6;

  // modals
  const [openForm, setOpenForm] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [toDelete, setToDelete] = React.useState(null);

  const filtered = React.useMemo(() => {
    if (!query) return plans;
    const q = query.toLowerCase();
    return plans.filter((p) => p.title.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q) || (p.key || "").toLowerCase().includes(q));
  }, [plans, query]);

  const visible = React.useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // actions
  const openCreate = () => {
    setEditing(null);
    setOpenForm(true);
  };

  const openEdit = (plan) => {
    setEditing(plan);
    setOpenForm(true);
  };

  const handleSavePlan = (payload) => {
    if (editing) {
      // update
      setPlans((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...payload } : p)));
    } else {
      const newPlan = { id: `p${Date.now()}`, ...payload };
      setPlans((prev) => [newPlan, ...prev]);
    }
    setOpenForm(false);
    setEditing(null);
  };

  const openDelete = (plan) => {
    setToDelete(plan);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    setPlans((prev) => prev.filter((p) => p.id !== toDelete.id));
    setToDelete(null);
    setDeleteOpen(false);
  };

  return (
    <div className="px-4 pt-4 md:px-10 flex-1">
      <TitleAdmin title="Subscriptions" subTitle="Manage subscription plans, features and visibility." />

      <section className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search plans" className="w-full md:w-[360px] pl-3 py-2 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white" />
          </div>

          <div className="flex items-center gap-3">
            <button onClick={openCreate} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-white hover:bg-primary-dark">
              <PlusCircle size={16} />
              <span className="text-sm">Create Plan</span>
            </button>
          </div>
        </div>

        <div className="bg-theme dark:bg-theme-dark rounded-md border border-gray-200 dark:border-slate-700/40 overflow-hidden">
          <table className="hidden md:table w-full">
            <thead className="text-left text-theme dark:text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Plan</th>
                <th className="px-4 py-3 font-semibold">Price / Cycle</th>
                <th className="px-4 py-3 font-semibold">Limit</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {visible.map((p) => (
                <SubscriptionRow key={p.id} plan={p} onEdit={openEdit} onDelete={openDelete} />
              ))}
            </tbody>
          </table>

          {/* Mobile list */}
          <div className="md:hidden space-y-3 p-3">
            {visible.map((p) => (
              <div key={p.id} className="bg-theme dark:bg-theme-dark rounded-md p-3 border border-gray-200 dark:border-slate-700/40">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-theme dark:text-white">{p.title}</div>
                    <div className="text-xs text-theme-light dark:text-theme-light">{p.description}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(p)} className="p-2 rounded-md hover:bg-slate-100/60 dark:hover:bg-white/6">Edit</button>
                    <button onClick={() => openDelete(p)} className="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400">Delete</button>
                  </div>
                </div>

                <div className="mt-3 text-xs text-theme-light dark:text-theme-light">
                  {p.features?.slice(0, 4).map((f, i) => <div key={i}>• {f}</div>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-theme-light dark:text-theme-light">{filtered.length} plans</div>
          <Pagination currentPage={page} totalPages={Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))} onPageChange={setPage} />
        </div>
      </section>

      {/* Create / Edit modal */}
      <Modal open={openForm} onClose={() => { setOpenForm(false); setEditing(null); }} size="md">
        <SubscriptionForm initialData={editing} onCancel={() => { setOpenForm(false); setEditing(null); }} onSubmit={handleSavePlan} />
      </Modal>

      {/* Delete modal */}
      <Modal open={deleteOpen} onClose={() => { setDeleteOpen(false); setToDelete(null); }} size="sm">
        <ConfirmDelete openItemName={toDelete?.title || ""} onCancel={() => { setDeleteOpen(false); setToDelete(null); }} onConfirm={confirmDelete} />
      </Modal>
    </div>
  );
}
