import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true }, // when you refueled
    amount: { type: Number, required: true }, // ₹ spent
    pricePerL: { type: Number, required: true }, // ₹/L
    litres: { type: Number, required: true }, // computed (amount ÷ pricePerL)

    tripDistance: { type: Number, default: 0 }, // km (Trip A)
    mileage: { type: Number, default: 0 }, // km/L (computed if tripDistance given)
    runningCostPerKm: { type: Number, default: 0 }, // ₹/km (computed)

    odometer: { type: Number }, // optional, for future
    notes: { type: String }, // e.g. "50% highway, avg 60km/h"
  },
  { timestamps: true }
);

export default mongoose.model("Log", logSchema);