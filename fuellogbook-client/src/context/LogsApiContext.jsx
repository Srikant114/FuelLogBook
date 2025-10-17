// src/context/LogsApiContext.jsx
import React, { createContext, useContext, useMemo } from "react";
import { api } from "../utils/CallApi";

/**
 * LogsApiContext
 *
 * Provides wrapper functions for backend logs endpoints:
 * - getLogs(vehicleId)
 * - getLog(vehicleId, logId)
 * - createLog(vehicleId, payload)
 * - updateLog(vehicleId, logId, payload)
 * - deleteLog(vehicleId, logId)
 *
 * Each function returns the backend response object (so callers can read `res.message`, `res.log`, `res.logs`, etc).
 * On network/low-level errors we rethrow so UI can catch and display error messages.
 */

const LogsApiContext = createContext(null);

export const LogsApiProvider = ({ children }) => {
  // Get all logs for a vehicle
  const getLogs = async (vehicleId, opts = {}) => {
    if (!vehicleId) throw new Error("vehicleId required");
    try {
      const res = await api.get(`/api/vehicles/${vehicleId}/get-logs`, opts);
      return res;
    } catch (err) {
      throw err;
    }
  };

  // Get single log
  const getLog = async (vehicleId, logId) => {
    if (!vehicleId || !logId) throw new Error("vehicleId and logId required");
    try {
      const res = await api.get(`/api/vehicles/${vehicleId}/get-log/${logId}`);
      return res;
    } catch (err) {
      throw err;
    }
  };

  // Create log
  const createLog = async (vehicleId, payload) => {
    if (!vehicleId) throw new Error("vehicleId required");
    try {
      const res = await api.post(`/api/vehicles/${vehicleId}/create-log`, payload);
      return res;
    } catch (err) {
      throw err;
    }
  };

  // Update log
  const updateLog = async (vehicleId, logId, payload) => {
    if (!vehicleId || !logId) throw new Error("vehicleId and logId required");
    try {
      const res = await api.put(`/api/vehicles/${vehicleId}/update-logs/${logId}`, payload);
      return res;
    } catch (err) {
      throw err;
    }
  };

  // Delete log
  const deleteLog = async (vehicleId, logId) => {
    if (!vehicleId || !logId) throw new Error("vehicleId and logId required");
    try {
      const res = await api.del(`/api/vehicles/${vehicleId}/delete-logs/${logId}`);
      return res;
    } catch (err) {
      throw err;
    }
  };

  const value = useMemo(
    () => ({
      getLogs,
      getLog,
      createLog,
      updateLog,
      deleteLog,
    }),
    []
  );

  return <LogsApiContext.Provider value={value}>{children}</LogsApiContext.Provider>;
};

export const useLogsApi = () => {
  const ctx = useContext(LogsApiContext);
  if (!ctx) {
    throw new Error("useLogsApi must be used within LogsApiProvider");
  }
  return ctx;
};
