import express from "express";
import { registerUser, loginUser, getProfile } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Get logged-in profile
router.get("/me", authMiddleware, getProfile);

export default router;