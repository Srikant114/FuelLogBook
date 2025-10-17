import cloudinary from "../config/cloudinary.js";
import Vehicle from "../models/Vehicle.model.js";
import Log from "../models/Log.model.js";
import mongoose from "mongoose";

// Upload / update vehicle image
export const uploadVehicleImage = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, userId: req.user.id });
    if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const streamUpload = (fileBuffer) =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "fuelLogbook/vehicles" }, // ✅ all uploads go to fuelLogbook/vehicles
        (error, result) => (result ? resolve(result) : reject(error))
      );
      stream.end(fileBuffer);
    });

    const result = await streamUpload(req.file.buffer);

    vehicle.imageUrl = result.secure_url;
    await vehicle.save();

    res.status(200).json({ success: true, vehicle, message: "Vehicle image updated" });
  } catch (err) {
    console.error("uploadVehicleImage error:", err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};

// Delete vehicle image
export const deleteVehicleImage = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, userId: req.user.id });
    if (!vehicle || !vehicle.imageUrl)
      return res.status(404).json({ success: false, message: "No image to delete" });

    vehicle.imageUrl = null;
    await vehicle.save();

    res.status(200).json({ success: true, message: "Vehicle image deleted", vehicle });
  } catch (err) {
    console.error("deleteVehicleImage error:", err);
    res.status(500).json({ success: false, message: "Deletion failed" });
  }
};

// 🔹 Helper for consistent error handling
const handleError = (res, error, status = 500) => {
  console.log(error.message); 

  res.status(status).json({
    success: false,
    message: "Something went wrong",
    error: error.message,
  });
};
// 🔹 Create Vehicle (linked to logged-in user)
export const createVehicle = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Vehicle name is required" });
    }

    const vehicle = new Vehicle({
      ...req.body,
      userId: req.user.id // ✅ attach logged-in user
    });

    await vehicle.save();

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle
    });
  } catch (error) {
    handleError(res, error, 400);
  }
};

// 🔹 Get all Vehicles for logged-in user
// export const getVehicles = async (req, res) => {
//   try {
//     const vehicles = await Vehicle.find({ userId: req.user.id }).sort({ createdAt: -1 });
//     res.status(200).json({
//       success: true,
//       count: vehicles.length,
//       data: vehicles
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// };

export const getVehicles = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = Math.max(1, Math.min(100, Number(req.query.pageSize) || 1000));
    const hasLogs = req.query.hasLogs === "true" || req.query.hasLogs === true;

    let filter = { userId };

    // If hasLogs flag is set, compute vehicle ids that have logs for this user
    if (hasLogs) {
      const vehiclesWithLogs = await Log.aggregate([
        { $match: { userId: (typeof userId === "string" ? new mongoose.Types.ObjectId(userId) : userId) } },
        { $group: { _id: "$vehicle", count: { $sum: 1 } } },
        { $project: { vehicleId: "$_id" } },
      ]);

      const ids = vehiclesWithLogs.map((v) => v.vehicleId).filter(Boolean);
      if (!ids.length) {
        return res.status(200).json({ success: true, count: 0, total: 0, page, pageSize, data: [] });
      }
      filter._id = { $in: ids };
    }

    const [data, total] = await Promise.all([
      Vehicle.find(filter).sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize),
      Vehicle.countDocuments(filter),
    ]);

    return res.status(200).json({ success: true, count: data.length, total, page, pageSize, data });
  } catch (error) {
    console.error("getVehicles error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Get Vehicle by ID (must belong to user)
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found or not yours" });
    }

    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    handleError(res, error);
  }
};

// 🔹 Update Vehicle (must belong to user)
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ success: false, message: " Vehicle not found or not yours" });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: vehicle
    });
  } catch (error) {
    handleError(res, error, 400);
  }
};

// 🔹 Delete Vehicle (must belong to user)
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!vehicle) {
      return res.status(404).json({ success: false, message: " Vehicle not found or not yours" });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully"
    });
  } catch (error) {
    handleError(res, error);
  }
};
