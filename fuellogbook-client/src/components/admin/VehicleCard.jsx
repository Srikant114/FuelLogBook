import React, { useState } from "react";
import { Edit3, Trash2 } from "lucide-react";

const VehicleCard = ({ vehicle, onEdit, onDelete }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const threshold = 12;

  const handleMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setTilt({ x: y * -threshold, y: x * threshold });
  };

    const truncateNotes = (text, wordLimit = 15) => {
    if (!text) return "No notes available.";
    const words = text.trim().split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };


  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="rounded-xl shadow-lg overflow-hidden transition-transform duration-200 ease-out cursor-pointer max-w-full"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      <div
        className="relative bg-theme dark:bg-theme-dark rounded-xl border border-transparent dark:border-[1px] dark:border-slate-400/5"
      >
        {/* top action icons */}
        <div className="absolute right-3 top-3 flex gap-2 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit && onEdit(vehicle);
            }}
            aria-label="edit"
            className="p-2 rounded-md hover:bg-slate-100/60 dark:hover:bg-white/10 transition"
            title="Edit"
          >
            <Edit3 size={16} className="text-theme-light dark:text-theme-light" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete && onDelete(vehicle);
            }}
            aria-label="delete"
            className="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            title="Delete"
          >
            <Trash2 size={16} className="text-red-600 dark:text-red-400" />
          </button>
        </div>

        {/* Image */}
        <div className="w-full h-52">
          <img
            src={vehicle.imageUrl}
            alt={vehicle.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://res.cloudinary.com/dkysfzs5s/image/upload/v1760711986/fuelLogbook/vehicles/bs0fag07njj1ltktu7tf.png";
            }}
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-theme dark:text-theme">
            {vehicle.name}
          </h3>
          <div className="mt-1 text-sm text-theme-light dark:text-theme-light flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full border border-slate-200/60 dark:border-slate-700/60 text-xs">
              <strong className="mr-1">{vehicle.make}</strong>
              <span className="opacity-80">• {vehicle.modelYear}</span>
            </span>

            <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full border border-slate-200/60 dark:border-slate-700/60 text-xs">
              {vehicle.fuelType}
            </span>
          </div>

          <p className="mt-3 text-sm text-theme-light dark:text-theme-light">
             {truncateNotes(vehicle.notes)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
