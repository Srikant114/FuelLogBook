import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser"; // ✅ added
import passport from "passport";

import connectDB from "./config/db.js";
import { logger } from "./middleware/logger.js";
import logsRoute from "./routes/logs.routes.js";
import vehiclesRoute from "./routes/vehicles.routes.js";
import authRoutes from "./routes/auth.routes.js";
import googleAuthRoutes from "./routes/auth.google.routes.js";
import setupGooglePassport from "./config/passport.js";

// App Name
const APP_NAME = "FuelLogBook";

// Initialize Express app
const app = express();

// Custom Logger middleware
app.use(logger);

// Mongo DB Connection
await connectDB();

// Setup Passport (Google strategy)
setupGooglePassport();
app.use(passport.initialize());

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL, // allow frontend origin
  credentials: true, // allow cookies
}));
app.use(express.json());
app.use(cookieParser()); // ✅ parse cookies

// Health or Root Route
app.get("/", (req, res) => res.send(`${APP_NAME} • Server is running`));

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", googleAuthRoutes); // Google OAuth endpoints
app.use("/api/vehicles", vehiclesRoute);
app.use("/api/vehicles/:vehicleId", logsRoute);

// Start Server
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`[${APP_NAME}] Server is running on port ${PORT}`);
});
