// src/context/VehiclesApiContext.jsx
import React, { createContext, useContext, useMemo } from "react";
import { api } from "../utils/CallApi";

/**
 * VehiclesApiContext
 *
 * Exposes:
 *  - getAllVehicles(opts)
 *  - addVehicle(payload)
 *  - updateVehicle(id, payload)
 *  - deleteVehicle(id)
 *  - uploadImage(vehicleId, File)
 *
 * Each method returns the raw response object from backend (or throws).
 * The UI can still show toast messages as needed.
 */

const VehiclesApiContext = createContext(null);

export const VehiclesApiProvider = ({ children }) => {
  // Implement API wrappers. Keep them minimal and return the backend response
  const getAllVehicles = async (opts = {}) => {
    // opts can include query: { page, pageSize, onlyWithLogs } etc.
    const query = opts.query || {};
    try {
      const res = await api.get("/api/vehicles/get-all-vehicles", { query });
      return res;
    } catch (err) {
      // rethrow to let consumers decide how to handle
      throw err;
    }
  };

  const addVehicle = async (payload) => {
    try {
      const res = await api.post("/api/vehicles/add-vehicle", payload);
      return res;
    } catch (err) {
      throw err;
    }
  };

  const updateVehicle = async (id, payload) => {
    try {
      const res = await api.put(`/api/vehicles/update-vehicle/${id}`, payload);
      return res;
    } catch (err) {
      throw err;
    }
  };

  const deleteVehicle = async (id) => {
    try {
      const res = await api.del(`/api/vehicles/delete-vehicle/${id}`);
      return res;
    } catch (err) {
      throw err;
    }
  };

  const uploadImage = async (vehicleId, file) => {
    if (!file) return null;
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await api.put(`/api/vehicles/upload-image/${vehicleId}`, fd);
      return res;
    } catch (err) {
      throw err;
    }
  };

  const value = useMemo(
    () => ({
      getAllVehicles,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      uploadImage,
    }),
    []
  );

  return <VehiclesApiContext.Provider value={value}>{children}</VehiclesApiContext.Provider>;
};

/**
 * hook to use Vehicles API context
 */
export const useVehiclesApi = () => {
  const ctx = useContext(VehiclesApiContext);
  if (!ctx) {
    throw new Error("useVehiclesApi must be used within VehiclesApiProvider");
  }
  return ctx;
};
