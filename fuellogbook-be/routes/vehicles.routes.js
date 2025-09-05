import express from "express";
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
} from "../controllers/vehicles.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// 👇 Using your custom endpoints
router.post("/add-vehicle",authMiddleware, createVehicle);
router.get("/get-all-vehicles",authMiddleware, getVehicles);
router.get("/get-vehicle/:id",authMiddleware, getVehicleById);
router.put("/update-vehicle/:id",authMiddleware, updateVehicle);
router.delete("/delete-vehicle/:id",authMiddleware, deleteVehicle);

export default router;
