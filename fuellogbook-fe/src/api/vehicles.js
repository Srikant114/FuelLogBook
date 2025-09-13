// src/api/vehicles.js
import client from "./client";

/**
 * Vehicles API wrapper matching backend routes:
 * POST   /api/vehicles/add-vehicle
 * GET    /api/vehicles/get-all-vehicles
 * GET    /api/vehicles/get-vehicle/:id
 * PUT    /api/vehicles/update-vehicle/:id
 * DELETE /api/vehicles/delete-vehicle/:id
 * PUT    /api/vehicles/upload-image/:id  (form-data, field name: "image")
 */

export async function getMyVehicles() {
  const res = await client.get("/api/vehicles/get-all-vehicles");
  // backend returns { success, count, data: vehicles }
  return res.data?.data ?? [];
}

export async function getVehicleById(id) {
  const res = await client.get(`/api/vehicles/get-vehicle/${id}`);
  return res.data?.data ?? null;
}

export async function createVehicle(payload) {
  // payload: { name, make, modelYear, fuelType, imageUrl?, notes? }
  const res = await client.post("/api/vehicles/add-vehicle", payload);
  return res.data?.data ?? res.data;
}

export async function updateVehicle(id, payload) {
  const res = await client.put(`/api/vehicles/update-vehicle/${id}`, payload);
  return res.data?.data ?? res.data;
}

export async function deleteVehicle(id) {
  const res = await client.delete(`/api/vehicles/delete-vehicle/${id}`);
  return res.data;
}

export async function uploadVehicleImage(id, file) {
  const form = new FormData();
  form.append("image", file);
  const res = await client.put(`/api/vehicles/upload-image/${id}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data?.vehicle ?? res.data;
}

export async function deleteVehicleImage(id) {
  const res = await client.delete(`/api/vehicles/delete-image/${id}`);
  return res.data;
}
