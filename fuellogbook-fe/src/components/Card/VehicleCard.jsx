// src/components/Card/VehicleCard.jsx
import React from "react";
import { FiEye, FiTrash2, FiEdit } from "react-icons/fi";
import { truncate } from "../../utils/helpers";

export default function VehicleCard({ vehicle, onView, onEdit, onDelete }) {
  return (
    <div className="relative group rounded-xl overflow-hidden shadow-sm bg-[var(--panel)] border border-gray-100 transform transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="h-48 md:h-56 w-full bg-gray-50 overflow-hidden">
        <img
          src={vehicle.imageUrl || ""}
          alt={vehicle.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-[var(--muted)]">
              {vehicle.make} • {vehicle.modelYear}
            </p>
            <h3 className="text-lg font-semibold mt-1">{vehicle.name}</h3>
            <p className="text-sm text-[var(--muted)] mt-2">{truncate(vehicle.notes, 90)}</p>
          </div>

          <div className="text-right min-w-[72px]">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${vehicle.fuelType === "EV" ? "bg-green-50 text-green-700" : vehicle.fuelType === "Diesel" ? "bg-yellow-50 text-yellow-700" : "bg-blue-50 text-blue-700"}`}>
              {vehicle.fuelType}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onView(vehicle)} className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-[var(--panel)] border hover:bg-[var(--hover-bg)]">
            <FiEye /> <span>View</span>
          </button>

          <button onClick={() => onEdit(vehicle)} className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-white border hover:bg-[var(--hover-bg)]">
            <FiEdit /> <span>Edit</span>
          </button>

          <button onClick={() => onDelete(vehicle)} className="flex items-center gap-2 px-3 py-2 text-sm rounded-md text-red-600 border border-red-100 hover:bg-red-50">
            <FiTrash2 /> <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
