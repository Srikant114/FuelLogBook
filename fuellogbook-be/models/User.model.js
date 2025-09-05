import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String }, // will be null if Google OAuth only
    phone: { type: String },
    photoUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);