// routes/auth.routes.js
import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  uploadUserPhoto,
  deleteUserPhoto,
  checkUsername,
  updateProfile,
  changePassword,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

router.put("/me/photo", authMiddleware, upload.single("photo"), uploadUserPhoto);
router.delete("/me/photo", authMiddleware, deleteUserPhoto);

router.get("/check-username", checkUsername);

// Register - supports optional 'photo'
router.post("/register", upload.single("photo"), registerUser);

// Login
router.post("/login", loginUser);

// Get logged-in profile
router.get("/me", authMiddleware, getProfile);

// Update profile fields (JSON body: name, username, phone)
router.put("/me", authMiddleware, updateProfile);

// Change password (JSON body: oldPassword, newPassword)
router.put("/me/password", authMiddleware, changePassword);

export default router;
