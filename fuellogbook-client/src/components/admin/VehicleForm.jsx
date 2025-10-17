import React, { useEffect, useRef, useState } from "react";
import { X, UploadCloud } from "lucide-react";

/**
 * VehicleForm (single-image upload with drag & drop)
 * - initialData: object to prefill form (for edit). Accepts either {_id, ...} or {id, ...}
 * - onCancel()
 * - onSubmit(payload) => payload contains fields + imageFile (File or null) + imageUrl (string preview/existing)
 *
 * Fixes:
 * - Detect edit mode when initialData._id (mongo) is present
 * - Update internal state when initialData prop changes (so modal opened for edit reflects data)
 * - Clean up blob URLs to avoid memory leaks
 */

const EMPTY = {
  name: "",
  make: "",
  modelYear: "",
  fuelType: "",
  notes: "",
  imageUrl: "", // single image url (existing)
};

export default function VehicleForm({ initialData, onCancel, onSubmit }) {
  // detect edit either by Mongo _id or id
  const isEdit = (initialData && (initialData._id || initialData.id));

  // init state from initialData if provided; we'll also sync on prop change via useEffect
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    ...(initialData || {}),
    imageUrl:
      (initialData?.imageUrls && initialData.imageUrls[0]) ||
      initialData?.imageUrl ||
      "",
  }));

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    (initialData &&
      ((initialData.imageUrls && initialData.imageUrls[0]) ||
        initialData.imageUrl)) ||
      ""
  );
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  // sync form state and preview when initialData changes (e.g., opening edit modal)
  useEffect(() => {
    if (initialData) {
      // revoke previous preview blob if needed
      try {
        if (previewUrl && previewUrl.startsWith("blob:"))
          URL.revokeObjectURL(previewUrl);
      } catch (e) {}

      const existingImage =
        (initialData.imageUrls && initialData.imageUrls[0]) ||
        initialData.imageUrl ||
        "";
      setForm({
        ...EMPTY,
        ...initialData,
        imageUrl: existingImage,
      });
      setPreviewUrl(existingImage || "");
      setImageFile(null); // no local file selected yet
    } else {
      // if switching to Add mode, reset the form
      try {
        if (previewUrl && previewUrl.startsWith("blob:"))
          URL.revokeObjectURL(previewUrl);
      } catch (e) {}
      setForm({ ...EMPTY });
      setPreviewUrl("");
      setImageFile(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  // helper to update form keys
  const handle = (key) => (e) =>
    setForm((s) => ({ ...s, [key]: e.target.value }));

  // handle file selection (from input or drop)
  const handleFile = (file) => {
    if (!file) return;
    // revoke old preview if it was a blob url
    try {
      if (previewUrl && previewUrl.startsWith("blob:"))
        URL.revokeObjectURL(previewUrl);
    } catch (e) {}

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
    // revoke blob url if used
    try {
      if (previewUrl && previewUrl.startsWith("blob:"))
        URL.revokeObjectURL(previewUrl);
    } catch (err) {}
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
      imageFile, // may be null if not changed
      imageUrl: previewUrl || form.imageUrl || "",
    };

    onSubmit?.(payload);
  };

  return (
    <div className="py-6 px-6 md:px-10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-theme dark:text-white">
          {isEdit ? "Edit Vehicle" : "Add Vehicle"}
        </h3>
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
          <label className="text-sm font-medium text-theme dark:text-theme-light block mb-2">
            Vehicle Image
          </label>

          {!previewUrl ? (
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => inputRef.current?.click()}
              role="button"
              tabIndex={0}
              className={`w-full max-w-sm flex flex-col items-center gap-3 p-5 rounded-lg border-2 ${
                dragActive
                  ? "border-dashed border-primary"
                  : "border-dashed border-gray-200 dark:border-slate-700/60"
              } bg-theme dark:bg-theme-dark cursor-pointer transition`}
            >
              <div className="flex items-center gap-2 text-theme-light dark:text-theme-light">
                <UploadCloud size={18} />
                <span className="text-sm">
                  Drag & drop an image here or click to upload
                </span>
              </div>
              <div className="text-xs text-theme-light dark:text-theme-light">
                PNG, JPG, or GIF — max 5MB
              </div>

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
                <img
                  src={previewUrl}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
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
            <label
              className="text-sm font-medium text-theme dark:text-theme-light"
              htmlFor="vehicle-name"
            >
              Vehicle Name
            </label>
            <input
              id="vehicle-name"
              value={form.name}
              onChange={handle("name")}
              type="text"
              placeholder="Enter Your Vehicle Name"
              className="outline-none py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-sm font-medium text-theme dark:text-theme-light"
              htmlFor="fuel"
            >
              Fuel Type
            </label>
            <select
              id="fuel"
              value={form.fuelType}
              onChange={handle("fuelType")}
              className="outline-none py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white appearance-none"
            >
              <option value="" disabled selected hidden>
                Select Fuel Type of Your Vehicle
              </option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="EV">EV</option>
            </select>
          </div>
        </div>

        {/* Make + Year */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label
              className="text-sm font-medium text-theme dark:text-theme-light"
              htmlFor="make"
            >
              Make
            </label>
            <input
              id="make"
              value={form.make}
              onChange={handle("make")}
              type="text"
              placeholder="Enter Your vehicle Company Name"
              className="outline-none py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-sm font-medium text-theme dark:text-theme-light"
              htmlFor="modelYear"
            >
              Model Year
            </label>
            <input
              id="modelYear"
              value={form.modelYear || ""}
              onChange={handle("modelYear")}
              type="number"
              placeholder="Select Manufacturing Year"
              min="1900"
              max="2099"
              step="1"
              onWheel={(e) => e.target.blur()} // 🚫 disables scroll change
              className="outline-none py-2 px-3 rounded border border-gray-300 dark:border-slate-700/60 bg-theme dark:bg-theme-dark text-theme dark:text-white [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              style={{ MozAppearance: "textfield" }} // 🚫 disables arrows in Firefox
            />
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1">
          <label
            className="text-sm font-medium text-theme dark:text-theme-light"
            htmlFor="notes"
          >
            Notes
          </label>
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
            <span className="text-white">
              {isEdit ? "Save changes" : "Add Vehicle"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
