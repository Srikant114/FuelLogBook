import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  generateExcelReport,
  sendReportByEmail,
} from "../controllers/reports.controller.js";

const router = express.Router({ mergeParams: true });

// Export Excel for specific vehicle
router.get("/:vehicleId/report/excel", authMiddleware, generateExcelReport);

// Export Excel for ALL vehicles of the user
router.get("/all/excel", authMiddleware, generateExcelReport);

// Send email for specific vehicle
router.post("/:vehicleId/report/email", authMiddleware, sendReportByEmail);

// Send email for ALL vehicles of the user
router.post("/all/email", authMiddleware, sendReportByEmail);

export default router;
