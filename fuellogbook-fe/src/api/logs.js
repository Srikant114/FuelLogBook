// src/api/logs.js
import client from "./client";

/**
 * Logs API wrapper matching backend routes:
 * POST   /api/vehicles/:vehicleId/create-log
 * GET    /api/vehicles/:vehicleId/get-logs
 * GET    /api/vehicles/:vehicleId/get-log/:logId
 * PUT    /api/vehicles/:vehicleId/update-logs/:logId
 * DELETE /api/vehicles/:vehicleId/delete-logs/:logId
 */

export async function getLogsForVehicle(vehicleId) {
  const res = await client.get(`/api/vehicles/${vehicleId}/get-logs`);
  // backend returns { success, count, logs }
  return res.data?.logs ?? [];
}

export async function getLogById(vehicleId, logId) {
  const res = await client.get(`/api/vehicles/${vehicleId}/get-log/${logId}`);
  return res.data?.log ?? null;
}

export async function createLog(vehicleId, payload) {
  const res = await client.post(`/api/vehicles/${vehicleId}/create-log`, payload);
  return res.data?.log ?? res.data;
}

export async function updateLog(vehicleId, logId, payload) {
  const res = await client.put(`/api/vehicles/${vehicleId}/update-logs/${logId}`, payload);
  return res.data?.log ?? res.data;
}

export async function deleteLog(vehicleId, logId) {
  const res = await client.delete(`/api/vehicles/${vehicleId}/delete-logs/${logId}`);
  return res.data;
}
