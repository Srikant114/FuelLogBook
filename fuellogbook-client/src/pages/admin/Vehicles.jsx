import React, { useState } from "react";
import TitleAdmin from "../../components/common/TitleAdmin"; 
import VehicleCard from "../../components/admin/VehicleCard";
import Pagination from "../../components/admin/Pagination";
import { PlusCircle } from "lucide-react";
import Modal from "../../components/admin/Modal";
import VehicleForm from "../../components/admin/VehicleForm";
import ConfirmDelete from "../../components/admin/ConfirmDelete";


/**
 * Vehicles Page
 * - Shows Add button, grid of vehicles (12 items total), and pagination
 * - Uses VehicleCard and Pagination components above
 */

const DUMMY_VEHICLES = Array.from({ length: 16 }).map((_, i) => ({
  id: `${i + 1}`,
  name: ["Hunter 350", "KTM 390", "Royal Enfield Classic", "Tesla Model 3"][i % 4] + ` ${i + 1}`,
  make: ["Royal Enfield", "KTM", "Royal Enfield", "Tesla"][i % 4],
  modelYear: 2018 + (i % 6),
  fuelType: ["Petrol", "Diesel", "EV", "Petrol"][i % 4],
  imageUrl: [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4c7NMROq90uLjNsgKXf5Y7klRg0EuPNa8cg&s",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000&auto=format&fit=crop",
    "https://cars.tatamotors.com/content/dam/tml/pv/products/tiago/year-2025/ice/promoting-vc/lifestyle/lifestyle-02.jpg",
    "https://imgd.aeplcdn.com/642x361/n/cw/ec/185551/hyundai-venue-left-front-three-quarter4.jpeg?isig=0&q=75",
  ][i % 4],
  notes: "Recently serviced. Next service due in 1500 km.",
}));

const Vehicles = () => {
  const PAGE_SIZE = 12;

  const [vehicles, setVehicles] = useState(DUMMY_VEHICLES);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [openAddEdit, setOpenAddEdit] = useState(false);
  const [editing, setEditing] =useState(null); // vehicle object or null
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  // If you later fetch real data, compute totalPages from server meta
  const totalPages = Math.max(1, Math.ceil(vehicles.length / PAGE_SIZE));
  const visibleVehicles = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return vehicles.slice(start, start + PAGE_SIZE);
  }, [vehicles, currentPage]);


  
  // Open Add modal
  const handleOpenAdd = () => {
    setEditing(null);
    setOpenAddEdit(true);
  };

  // Open Edit modal
  const handleOpenEdit = (vehicle) => {
    setEditing(vehicle);
    setOpenAddEdit(true);
  };

  const handleAddEditSubmit = (payload) => {
    if (editing) {
      // update
      setVehicles((prev) => prev.map((v) => (v.id === editing.id ? { ...v, ...payload } : v)));
    } else {
      // add new, create simple id
      const newVehicle = { id: String(Date.now()), ...payload };
      setVehicles((prev) => [newVehicle, ...prev]);
    }
    setOpenAddEdit(false);
  };

  // Delete flow
  const handleOpenDelete = (vehicle) => {
    setToDelete(vehicle);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (toDelete) {
      setVehicles((prev) => prev.filter((v) => v.id !== toDelete.id));
      setToDelete(null);
      setDeleteOpen(false);
    }
  };

  return (
     <div className="px-4 pt-4 md:px-10 flex-1">
      <TitleAdmin
        title="Vehicles"
        subTitle="Monitor fleet fuel efficiency, trip costs, maintenance schedules and recent activities."
      />

      <section className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-theme dark:text-theme">Fleet</h2>
            <p className="text-sm text-theme-light dark:text-theme-light">Showing vehicles</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-sm bg-primary text-white hover:bg-primary-dark transition"
            >
              <PlusCircle size={18} />
              <span className="text-sm font-medium">Add Vehicle</span>
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {visibleVehicles.map((v) => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              onEdit={() => handleOpenEdit(v)}
              onDelete={() => handleOpenDelete(v)}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center">
          <div className="w-full max-w-md">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </div>
      </section>

      {/* Add / Edit Modal */}
      <Modal open={openAddEdit} onClose={() => setOpenAddEdit(false)} size="md">
        <VehicleForm
          initialData={editing || undefined}
          onCancel={() => setOpenAddEdit(false)}
          onSubmit={handleAddEditSubmit}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} size="sm">
        <ConfirmDelete
          openItemName={toDelete?.name || "this item"}
          onCancel={() => setDeleteOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      </Modal>
    </div>
  );
};

export default Vehicles;
