import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { generateCSVReport, generatePDFReport, sendReportByEmail } from "../controllers/reports.controller.js";

const router = express.Router({ mergeParams: true });

router.get("/report/csv", authMiddleware, generateCSVReport);
router.get("/report/pdf", authMiddleware, generatePDFReport);
router.post("/report/email", authMiddleware, sendReportByEmail);

export default router;
