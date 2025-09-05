import express from "express";
import { registerUser, loginUser, getProfile, uploadUserPhoto, deleteUserPhoto } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

router.put("/me/photo", authMiddleware, upload.single("photo"), uploadUserPhoto);
router.delete("/me/photo", authMiddleware, deleteUserPhoto);

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Get logged-in profile
router.get("/me", authMiddleware, getProfile);

export default router;