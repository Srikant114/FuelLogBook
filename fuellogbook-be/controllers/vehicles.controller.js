import Vehicle from "../models/Vehicle.model.js";

// 🔹 Helper for consistent error handling
const handleError = (res, error, status = 500) => {
  res.status(status).json({
    success: false,
    message: error.message || "Something went wrong"
  });
};

// 🔹 Create Vehicle (linked to logged-in user)
export const createVehicle = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "❌ Vehicle name is required" });
    }

    const vehicle = new Vehicle({
      ...req.body,
      userId: req.user.id // ✅ attach logged-in user
    });

    await vehicle.save();

    res.status(201).json({
      success: true,
      message: "✅ Vehicle created successfully",
      data: vehicle
    });
  } catch (error) {
    handleError(res, error, 400);
  }
};

// 🔹 Get all Vehicles for logged-in user
export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.user.id });
    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    handleError(res, error);
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
      return res.status(404).json({ success: false, message: "❌ Vehicle not found or not yours" });
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
      return res.status(404).json({ success: false, message: "❌ Vehicle not found or not yours" });
    }

    res.status(200).json({
      success: true,
      message: "✅ Vehicle updated successfully",
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
      return res.status(404).json({ success: false, message: "❌ Vehicle not found or not yours" });
    }

    res.status(200).json({
      success: true,
      message: "✅ Vehicle deleted successfully"
    });
  } catch (error) {
    handleError(res, error);
  }
};
