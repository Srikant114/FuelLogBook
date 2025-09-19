import React, { useRef } from "react";
import { X, UploadCloud } from "lucide-react";

/**
 * VehicleForm (single-image upload with drag & drop)
 * - initialData: object to prefill form (for edit)
 * - onCancel()
 * - onSubmit(payload) => payload contains fields + imageFile (File or null) + imageUrl (string preview/existing)
 */
const EMPTY = {
  name: "",
  make: "",
  modelYear: "",
  fuelType: "Petrol",
  notes: "",
  imageUrl: "", // single image url
};

export default function VehicleForm({ initialData, onCancel, onSubmit }) {
  const isEdit = Boolean(initialData?.id);
  const [form, setForm] = React.useState(() => ({
    ...EMPTY,
    ...(initialData || {}),
    imageUrl: (initialData?.imageUrls && initialData.imageUrls[0]) || initialData?.imageUrl || "",
  }));

  const [imageFile, setImageFile] = React.useState(null);
  const [previewUrl, setPreviewUrl] = React.useState(form.imageUrl || "");
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = useRef(null);

  const handle = (key) => (e) => setForm((s) => ({ ...s, [key]: e.target.value }));

  // handle drop or file change
  const handleFile = (file) => {
    if (!file) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const onInputChange = (e) => {
    const f = e.target.files?.[0] || null;
    if (f) handleFile(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) handleFile(f);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeImage = (e) => {
    e?.stopPropagation();
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
    setImageFile(null);
    setForm((s) => ({ ...s, imageUrl: "" }));
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name?.trim()) {
      alert("Please enter vehicle name");
      return;
    }

    const payload = {
      ...form,
      modelYear: form.modelYear ? Number(form.modelYear) : undefined,
      imageFile,
      imageUrl: previewUrl || "",
    };

    onSubmit?.(payload);
  };

  return (
    <div className="py-6 px-6 md:px-10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-theme dark:text-white">{isEdit ? "Edit Vehicle" : "Add Vehicle"}</h3>
        <button
          className="p-2 rounded-md hover:bg-slate-100/60 dark:hover:bg-white/6"
          onClick={onCancel}
          aria-label="close"
        >
          <X size={18} className="text-theme dark:text-white" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Single image upload area */}
        <div>
          <label className="text-sm font-medium text-theme dark:text-theme-light block mb-2">Vehicle Image</label>

          {!previewUrl ? (
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => inputRef.current?.click()}
              role="button"
              tabIndex={0}
              className={`w-full max-w-sm flex flex-col items-center gap-3 p-5 rounded-lg border-2 ${
                dragActive ? "border-dashed border-primary" : "border-dashed border-gray-200 dark:border-slate-700/60"
              } bg-theme dark:bg-theme-dark cursor-pointer transition`}
            >
              <div className="flex items-center gap-2 text-theme-light dark:text-theme-light">
                <UploadCloud size={18} />
                <span className="text-sm">Drag & drop an image here or click to upload</span>
              </div>
              <div className="text-xs text-theme-light dark:text-theme-light">PNG, JPG, or GIF — max 5MB</div>

              <input
                ref={inputRef}
                accept="image/*"
                type="file"
                className="hidden"
                onChange={onInputChange}
              />
            </div>
          ) : (
            <div className="w-full max-w-sm rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700/60 bg-theme dark:bg-theme-dark">
              <div className="relative w-full h-56">
                <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/40 text-white hover:bg-black/50"
                  title="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Compact fields: name + fuel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-theme dark:text-theme-light" htmlFor="vehicle-name">Vehicle Name</label>
            <input
              id="vehicle-name"
              value={form.name}
              onChange={handle("name")}
              type="text"
              placeholder="Hunter 350"
              className="outline-none py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-theme dark:text-theme-light" htmlFor="fuel">Fuel Type</label>
            <select
              id="fuel"
              value={form.fuelType}
              onChange={handle("fuelType")}
              className="outline-none py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white appearance-none"
            >
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="EV">EV</option>
            </select>
          </div>
        </div>

        {/* Make + Year */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-theme dark:text-theme-light" htmlFor="make">Make</label>
            <input
              id="make"
              value={form.make}
              onChange={handle("make")}
              type="text"
              placeholder="Royal Enfield"
              className="outline-none py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-theme dark:text-theme-light" htmlFor="modelYear">Model Year</label>
            <input
              id="modelYear"
              value={form.modelYear || ""}
              onChange={handle("modelYear")}
              type="number"
              placeholder="2023"
              className="outline-none py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-theme dark:text-theme-light" htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            rows={4}
            value={form.notes}
            onChange={handle("notes")}
            className="outline-none py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white resize-none"
            placeholder="Service, registration or other notes..."
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-transparent text-theme-light dark:text-theme-light hover:bg-slate-50 dark:hover:bg-white/6 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-primary hover:bg-primary-dark text-white transition"
          >
            {isEdit ? "Save changes" : "Add Vehicle"}
          </button>
        </div>
      </form>
    </div>
  );
}
