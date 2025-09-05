import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import { logger } from "./middleware/logger.js";
import vehiclesRoute from "./routes/vehicles.routes.js";
import authRoutes from './routes/auth.routes.js'

//  App Name For log Purpose
const APP_NAME = "FuelLogBook";

// Initialize Express app
const app = express();

// Custom Logger middleware
app.use(logger);

// Mongo DB Connection
await connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Health or Root Route
app.get("/", (req, res) => res.send(`${APP_NAME} • Server is running`));

// Mount logs routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehiclesRoute);

// Start Server
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`[${APP_NAME}] Server is running on port ${PORT}`);
});
