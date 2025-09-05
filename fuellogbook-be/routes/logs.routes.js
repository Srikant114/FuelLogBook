import express from "express";
import { createLog, deleteLog, getLogById, getLogs, updateLog } from "../controllers/logs.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router({mergeParams: true})

router.post("/create-log",authMiddleware, createLog);
router.get("/get-logs",authMiddleware, getLogs);
router.get("/get-log/:logId",authMiddleware, getLogById);
router.put("/update-logs/:logId",authMiddleware, updateLog);
router.delete("/delete-logs/:logId",authMiddleware, deleteLog);

export default router