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

const streamUpload = (fileBuffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "fuelLogbook/users",
        transformation: [
          { width: 1200, height: 1200, crop: "limit" },      // max dimensions
          { quality: "auto:good", fetch_format: "auto" }     // auto quality & modern format (webp when supported)
        ]
      },
      (error, result) => (result ? resolve(result) : reject(error))
    );
    stream.end(fileBuffer);
  });

// Register User

// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, username } = req.body;

//     if (!name || !email || !password) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Name, Email & Password required" });
//     }

//     // check existing user
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Email already registered" });
//     }

//     // hash password
//     const salt = await bcrypt.genSalt(10);
//     const passwordHash = await bcrypt.hash(password, salt);

//     // create user
//     const user = new User({ name, email, username, passwordHash });
//     await user.save();

//     // generate token
//     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

//      res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       data: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         username: user.username,
//         token
//       }
//     });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// -------------------------

export const checkUsername = async (req, res) => {
  const username = (req.query.username || "").trim();
  if (!username || username.length < 3) return res.json({ available: false });

  const exists = await User.findOne({ username });
  res.json({ available: !exists });
};


export const registerUser = async (req, res) => {
  try {
    // If multipart/form-data, multer has put file on req.file
    // For JSON payloads (no file), fields are in req.body as usual.
    const { name, email, password, username, phone } = req.body;

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

    // prepare new user data with defaults role & subscription
    const newUserData = {
      name,
      email,
      username,
      phone,
      passwordHash,
      role: "member",        // default
      subscription: "free",  // default (FreeTier)
    };

    // if file present, upload to cloudinary and set photoUrl
    if (req.file && req.file.buffer) {
      try {
        const result = await streamUpload(req.file.buffer);
        if (result && result.secure_url) {
          newUserData.photoUrl = result.secure_url;
        }
      } catch (uploadErr) {
        console.error("Cloudinary upload failed during register:", uploadErr);
        // continue without failing registration; optionally return error instead
      }
    }

    // create user
    const user = new User(newUserData);
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
        role: user.role,
        subscription: user.subscription,
        token,
      },
    });
  } catch (error) {
    console.error("registerUser error:", error);
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

// -------------------- NEW: update profile (name, username, phone) --------------------
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, username, phone } = req.body;

    // simple validation
    if (username && username.length < 3) {
      return res.status(400).json({ success: false, message: "Username must be at least 3 characters" });
    }

    // if changing username, ensure uniqueness
    if (username) {
      const existing = await User.findOne({ username, _id: { $ne: userId } });
      if (existing) {
        return res.status(400).json({ success: false, message: "Username already taken" });
      }
    }

    const update = {};
    if (name) update.name = name;
    if (username) update.username = username;
    if (phone) update.phone = phone;

    const user = await User.findByIdAndUpdate(userId, update, { new: true }).select("-passwordHash");

    return res.status(200).json({ success: true, message: "Profile updated", data: user });
  } catch (err) {
    console.error("updateProfile error:", err);
    return res.status(500).json({ success: false, message: "Profile update failed" });
  }
};

// -------------------- NEW: change password --------------------
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Old and new passwords required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(userId).select("+passwordHash");
    if (!user || !user.passwordHash) {
      return res.status(404).json({ success: false, message: "User not found or no password set" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Old password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("changePassword error:", err);
    return res.status(500).json({ success: false, message: "Password change failed" });
  }
};