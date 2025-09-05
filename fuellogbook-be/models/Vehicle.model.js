import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // now required
    },
    name: { type: String, required: true },  // e.g. Hunter 350
    make: { type: String },                 
    modelYear: { type: Number },            
    fuelType: { type: String, enum: ["Petrol", "Diesel", "EV"], default: "Petrol" },
    notes: { type: String }
  },
  { timestamps: true }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;
