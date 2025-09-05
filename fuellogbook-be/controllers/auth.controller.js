import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import cloudinary from "../config/cloudinary.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Upload / update user profile photo
export const uploadUserPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const streamUpload = (fileBuffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "fuelLogbook/users" }, // ✅ all uploads go to fuelLogbook/users
          (error, result) => (result ? resolve(result) : reject(error))
        );
        stream.end(fileBuffer);
      });

    const result = await streamUpload(req.file.buffer);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { photoUrl: result.secure_url },
      { new: true }
    );

    res.status(200).json({ success: true, user, message: "Profile photo updated" });
  } catch (err) {
    console.error("uploadUserPhoto error:", err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};

// Delete user photo
export const deleteUserPhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.photoUrl)
      return res.status(404).json({ success: false, message: "No photo to delete" });

    user.photoUrl = null;
    await user.save();

    res.status(200).json({ success: true, message: "Profile photo deleted", user });
  } catch (err) {
    console.error("deleteUserPhoto error:", err);
    res.status(500).json({ success: false, message: "Deletion failed" });
  }
};

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Name, Email & Password required" });
    }

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // create user
    const user = new User({ name, email, username, passwordHash });
    await user.save();

    // generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

     res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        token
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email & Password required" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Profile (only logged-in user)
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};