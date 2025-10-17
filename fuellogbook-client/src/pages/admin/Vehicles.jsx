// src/pages/admin/Vehicles.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import TitleAdmin from "../../components/common/TitleAdmin";
import VehicleCard from "../../components/admin/VehicleCard";
import Pagination from "../../components/admin/Pagination";
import { PlusCircle } from "lucide-react";
import Modal from "../../components/admin/Modal";
import VehicleForm from "../../components/admin/VehicleForm";
import ConfirmDelete from "../../components/admin/ConfirmDelete";
import { useVehiclesApi } from "../../context/VehiclesApiContext"; // <- use context hook
import toast from "react-hot-toast";

/**
 * Vehicles page (connected to backend via VehiclesApiContext)
 *
 * Backend endpoints used (through context):
 * - getAllVehicles()
 * - addVehicle()
 * - updateVehicle()
 * - deleteVehicle()
 * - uploadImage()
 *
 * Notes:
 * - VehicleForm returns a payload object that may include `imageFile` (File).
 * - After creating/updating we will upload the image (if provided) and then refresh the list.
 * - Pagination is client-side (pageSize = 12).
 */

const Vehicles = () => {
  const PAGE_SIZE = 12;

  // list + UI state
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [openAddEdit, setOpenAddEdit] = useState(false);
  const [editing, setEditing] = useState(null); // vehicle object or null
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  // get api from context
  const vehiclesApi = useVehiclesApi();

  // fetch vehicles for the current user
  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      // request all vehicles; adapt query if needed (page / pageSize)
      const res = await vehiclesApi.getAllVehicles();
      if (res && res.success) {
        // backend uses res.data for list (keeps legacy behavior)
        setVehicles(Array.isArray(res.data) ? res.data : res.data || []);
        setCurrentPage(1);
      } else {
        toast.error(res?.message || "Failed to load vehicles");
      }
    } catch (err) {
      console.error("fetchVehicles error:", err);
      toast.error(err?.message || "Failed to fetch vehicles");
    } finally {
      setLoading(false);
    }
  }, [vehiclesApi]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Pagination helpers
  const totalPages = Math.max(1, Math.ceil(vehicles.length / PAGE_SIZE));
  const visibleVehicles = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return vehicles.slice(start, start + PAGE_SIZE);
  }, [vehicles, currentPage]);

  /* -------------------------
     Add / Edit handlers
     VehicleForm will call onSubmit(payload) returning:
       {
         name, make, modelYear, fuelType, notes,
         imageFile: File | null,
         imageUrl: string (preview or existing)
       }
  ------------------------- */

  // open Add modal
  const handleOpenAdd = () => {
    setEditing(null);
    setOpenAddEdit(true);
  };

  // open Edit modal
  const handleOpenEdit = (vehicle) => {
    setEditing(vehicle);
    setOpenAddEdit(true);
  };

  // helper to upload image file to backend for a vehicle id
  const uploadVehicleImage = async (vehicleId, file) => {
    if (!file) return null;
    try {
      const res = await vehiclesApi.uploadImage(vehicleId, file);
      if (res && res.success) return res.vehicle || res.data || res;
      throw new Error(res?.message || "Image upload failed");
    } catch (err) {
      console.error("uploadVehicleImage error:", err);
      toast.error("Vehicle image upload failed");
      throw err;
    }
  };

  // handle add or edit submit (per form)
  const handleAddEditSubmit = async (payload) => {
    // payload contains form fields + imageFile (File) + imageUrl (string)
    try {
      if (editing) {
        // UPDATE flow
        const id = editing._id || editing.id;
        const res = await vehiclesApi.updateVehicle(id, {
          name: payload.name,
          make: payload.make,
          modelYear: payload.modelYear,
          fuelType: payload.fuelType,
          notes: payload.notes,
          imageUrl: payload.imageUrl || undefined,
        });

        if (!res || !res.success) {
          toast.error(res?.message || "Failed to update vehicle");
          return;
        }

        // if imageFile present, upload it
        if (payload.imageFile) {
          await uploadVehicleImage(res.data._id || res.data.id || id, payload.imageFile);
        }

        toast.success(res.message || "Vehicle updated");
      } else {
        // CREATE flow
        const res = await vehiclesApi.addVehicle({
          name: payload.name,
          make: payload.make,
          modelYear: payload.modelYear,
          fuelType: payload.fuelType,
          notes: payload.notes,
          imageUrl: payload.imageUrl || undefined,
        });

        if (!res || !res.success) {
          toast.error(res?.message || "Failed to create vehicle");
          return;
        }

        // If imageFile present, upload it to the newly created vehicle
        const newId = res.data._id || res.data.id;
        if (payload.imageFile && newId) {
          await uploadVehicleImage(newId, payload.imageFile);
        }

        toast.success(res.message || "Vehicle added");
      }

      // refresh list
      await fetchVehicles();
      setOpenAddEdit(false);
      setEditing(null);
    } catch (err) {
      console.error("handleAddEditSubmit error:", err);
      toast.error(err?.message || "Operation failed");
    }
  };

  /* -------------------------
     Delete handlers
  ------------------------- */
  const handleOpenDelete = (vehicle) => {
    setToDelete(vehicle);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    try {
      const id = toDelete._id || toDelete.id;
      const res = await vehiclesApi.deleteVehicle(id);
      if (!res || !res.success) {
        toast.error(res?.message || "Delete failed");
        return;
      }
      toast.success(res.message || "Vehicle deleted");
      setDeleteOpen(false);
      setToDelete(null);

      // refresh list
      await fetchVehicles();
    } catch (err) {
      console.error("delete vehicle error:", err);
      toast.error(err?.message || "Delete failed");
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
              <PlusCircle size={18} className="text-white" />
              <span className="text-sm text-white font-medium">Add Vehicle</span>
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 rounded-xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Grid of vehicles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {visibleVehicles.length ? (
                visibleVehicles.map((v) => (
                  <VehicleCard
                    key={v._id || v.id}
                    vehicle={v}
                    onEdit={() => handleOpenEdit(v)}
                    onDelete={() => handleOpenDelete(v)}
                  />
                ))
              ) : (
                <div className="col-span-full py-14 text-center text-theme-light dark:text-theme-light">
                  No vehicles yet. Click “Add Vehicle” to create your first vehicle.
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center">
              <div className="w-full max-w-md">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            </div>
          </>
        )}
      </section>

      {/* Add / Edit Modal */}
      <Modal open={openAddEdit} onClose={() => { setOpenAddEdit(false); setEditing(null); }} size="md">
        <VehicleForm
          initialData={editing}
          onCancel={() => { setOpenAddEdit(false); setEditing(null); }}
          onSubmit={handleAddEditSubmit}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} size="sm">
        <ConfirmDelete
          openItemName={toDelete?.name || "this vehicle"}
          onCancel={() => setDeleteOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      </Modal>
    </div>
  );
};

export default Vehicles;
