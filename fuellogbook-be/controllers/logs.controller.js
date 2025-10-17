import Vehicle from "../models/Vehicle.model.js";
import Log from "../models/Log.model.js";
import {calcLitres, calcMileage, calcRunningCost} from '../utils/calc.utils.js'

export async function createLog(req, res) {
  try {
    const { vehicleId } = req.params;
    const { date, amount, pricePerL, tripDistance = 0, notes = "", odometer } = req.body;

    if (!amount || !pricePerL || !date) {
      return res.status(400).json({ success: false, message: "Date, Amount and Price per Litre are required" });
    }

    // Vehicle must belong to user
    const vehicle = await Vehicle.findOne({ _id: vehicleId, userId: req.user.id });
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found or not owned by user" });
    }

    // Calculations
    const litres = calcLitres(amount, pricePerL);
    const mileage = tripDistance ? calcMileage(tripDistance, litres) : 0;
    const runningCostPerKm = tripDistance ? calcRunningCost(amount, tripDistance) : 0;

    // Save
    const log = await Log.create({
      userId: req.user.id,
      vehicle: vehicleId,
      date: new Date(date),
      amount,
      pricePerL,
      litres,
      tripDistance,
      mileage,
      runningCostPerKm,
      odometer,
      notes,
    });

    return res.status(201).json({ success: true, log, message: "Log Added Successfully" });
  } catch (err) {
    console.error("createLog error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// // GET ALL LOGS for a vehicle
// export async function getLogs(req, res) {
//   try {
//     const { vehicleId } = req.params;

//     const vehicle = await Vehicle.findOne({ _id: vehicleId, userId: req.user.id });
//     if (!vehicle) {
//       return res.status(404).json({ success: false, message: "❌ Vehicle not found or not owned by user" });
//     }

//     const logs = await Log.find({ vehicle: vehicleId, userId: req.user.id }).sort({ date: -1 });

//     return res.status(200).json({ success: true, count: logs.length, logs });
//   } catch (err) {
//     console.error("getLogs error:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// }

/**
 * GET ALL LOGS for a vehicle with optional filters/sort
 * Query params supported:
 *  - from (YYYY-MM-DD)
 *  - to   (YYYY-MM-DD)
 *  - minAmount, maxAmount
 *  - sortBy (date|amount) default date
 *  - sortDir (asc|desc) default desc
 *  - page, pageSize (optional, for server pagination)
 */
export async function getLogs(req, res) {
  try {
    const { vehicleId } = req.params;

    // ensure vehicle belongs to user
    const vehicle = await Vehicle.findOne({ _id: vehicleId, userId: req.user.id });
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found or not owned by user" });
    }

    // Build query
    const query = { vehicle: vehicleId, userId: req.user.id };

    // Date range filter
    const { from, to, minAmount, maxAmount, sortBy = "date", sortDir = "desc", page, pageSize } = req.query;

    if (from) {
      const fromDate = new Date(from);
      if (!isNaN(fromDate)) query.date = { ...(query.date || {}), $gte: fromDate };
    }
    if (to) {
      const toDate = new Date(to);
      if (!isNaN(toDate)) {
        // include full day by moving to end of day
        toDate.setHours(23, 59, 59, 999);
        query.date = { ...(query.date || {}), $lte: toDate };
      }
    }

    // Amount range filter
    if (minAmount !== undefined && minAmount !== "") {
      const mn = Number(minAmount);
      if (!isNaN(mn)) query.amount = { ...(query.amount || {}), $gte: mn };
    }
    if (maxAmount !== undefined && maxAmount !== "") {
      const mx = Number(maxAmount);
      if (!isNaN(mx)) query.amount = { ...(query.amount || {}), $lte: mx };
    }

    // Sorting
    const sortField = sortBy === "amount" ? "amount" : "date";
    const sortOrder = sortDir === "asc" ? 1 : -1;
    const sortObj = { [sortField]: sortOrder };

    // Optional server-side pagination
    const p = Math.max(1, Number(page) || 1);
    const ps = Math.max(1, Math.min(100, Number(pageSize) || 1000)); // large default to return many by default

    const [logs, total] = await Promise.all([
      Log.find(query).sort(sortObj).skip((p - 1) * ps).limit(ps),
      Log.countDocuments(query),
    ]);

    return res.status(200).json({ success: true, count: logs.length, total, page: p, pageSize: ps, logs });
  } catch (err) {
    console.error("getLogs error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}


// GET SINGLE LOG
export async function getLogById(req, res) {
  try {
    const { vehicleId, logId } = req.params;

    const log = await Log.findOne({ _id: logId, vehicle: vehicleId, userId: req.user.id });
    if (!log) {
      return res.status(404).json({ success: false, message: "Log not found" });
    }

    return res.status(200).json({ success: true, log });
  } catch (err) {
    console.error("getLogById error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// UPDATE LOG
export async function updateLog(req, res) {
  try {
    const { vehicleId, logId } = req.params;
    const { date, amount, pricePerL, tripDistance, notes, odometer } = req.body;

    const log = await Log.findOne({ _id: logId, vehicle: vehicleId, userId: req.user.id });
    if (!log) {
      return res.status(404).json({ success: false, message: "Log not found or not owned by user" });
    }

    if (amount && pricePerL) {
      log.litres = calcLitres(amount, pricePerL);
      log.mileage = tripDistance ? calcMileage(tripDistance, log.litres) : 0;
      log.runningCostPerKm = tripDistance ? calcRunningCost(amount, tripDistance) : 0;
    }

    if (date) log.date = new Date(date);
    if (amount) log.amount = Number(amount);
    if (pricePerL) log.pricePerL = Number(pricePerL);
    if (tripDistance !== undefined) log.tripDistance = Number(tripDistance);
    if (notes !== undefined) log.notes = notes;
    if (odometer !== undefined) log.odometer = Number(odometer);

    await log.save();

    return res.status(200).json({ success: true, log, message: "Log Updated Successfully" });
  } catch (err) {
    console.error("updateLog error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// DELETE LOG
export async function deleteLog(req, res) {
  try {
    const { vehicleId, logId } = req.params;

    const log = await Log.findOneAndDelete({ _id: logId, vehicle: vehicleId, userId: req.user.id });
    if (!log) {
      return res.status(404).json({ success: false, message: "Log not found or not owned by user" });
    }

    return res.status(200).json({ success: true, message: "Log deleted successfully" });
  } catch (err) {
    console.error("deleteLog error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}