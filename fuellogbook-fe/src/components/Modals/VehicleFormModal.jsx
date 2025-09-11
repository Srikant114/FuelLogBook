// src/components/Modals/VehicleFormModal.jsx
import React, { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import ModalShell from "./ModalShell";

export default function VehicleFormModal({ open, onClose, onSave, initialData = null }) {
  const [form, setForm] = useState({
    name: "",
    make: "",
    modelYear: "",
    fuelType: "Petrol",
    imageUrl: "",
    notes: "",
  });
  const [preview, setPreview] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        make: initialData.make || "",
        modelYear: initialData.modelYear || "",
        fuelType: initialData.fuelType || "Petrol",
        imageUrl: initialData.imageUrl || "",
        notes: initialData.notes || "",
        id: initialData.id,
      });
      setPreview(initialData.imageUrl || "");
    } else {
      setForm({
        name: "",
        make: "",
        modelYear: "",
        fuelType: "Petrol",
        imageUrl: "",
        notes: "",
      });
      setPreview("");
    }
  }, [initialData, open]);

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setPreview(dataUrl);
      setForm((s) => ({ ...s, imageUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name) {
      alert("Please provide vehicle name");
      return;
    }

    const payload = {
      ...form,
      modelYear: form.modelYear ? Number(form.modelYear) : undefined,
    };

    onSave(payload);
    onClose();
  };

  return (
    <ModalShell open={open} onClose={onClose} width="max-w-2xl">
      <form onSubmit={submit} className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{form.id ? "Edit Vehicle" : "Add Vehicle"}</h3>
          <button type="button" onClick={onClose} className="p-1 rounded-md hover:bg-[var(--hover-bg)]">
            <FiX />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Vehicle Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-1 focus:ring-[var(--accent)]"
              placeholder="Hunter 350"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Make</label>
            <input
              value={form.make}
              onChange={(e) => setForm({ ...form, make: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none"
              placeholder="Royal Enfield"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Model Year</label>
            <input
              value={form.modelYear}
              onChange={(e) => setForm({ ...form, modelYear: e.target.value })}
              type="number"
              min="1900"
              max={new Date().getFullYear() + 2}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none"
              placeholder="2023"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Fuel Type</label>
            <select
              value={form.fuelType}
              onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none"
            >
              <option>Petrol</option>
              <option>Diesel</option>
              <option>EV</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="w-full md:w-1/2">
            <label className="text-sm font-medium">Image</label>
            <div className="mt-2 flex items-center gap-3">
              <div className="w-32 h-20 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-200">
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-xs text-[var(--muted)] px-2">No image</div>
                )}
              </div>

              <div className="flex-1">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} className="text-sm" />
                <div className="text-xs text-[var(--muted)] mt-2">
                  Upload a file (client-side preview), or paste an image URL below.
                </div>
                <input
                  value={form.imageUrl}
                  onChange={(e) => {
                    setForm((s) => ({ ...s, imageUrl: e.target.value }));
                    setPreview(e.target.value);
                  }}
                  placeholder="Or paste image URL"
                  className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={4}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none resize-none"
              placeholder="Any notes about this vehicle"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-white border text-sm hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 rounded-md bg-[var(--accent)] text-white text-sm shadow">
            {form.id ? "Save Changes" : "Add Vehicle"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
