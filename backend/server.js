import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import rentalRoutes from "./routes/rentalRoutes.js";
import portalRoutes from "./routes/portalRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not set. Add it to your environment variables.");
  process.exit(1);
}

connectDB();

const app = express();

// Render runs one proxy in front of the app
app.set("trust proxy", 1);

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.send("Maya Centring Plates API is running");
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is healthy" });
});

// Public routes (no token)
app.use("/api/auth", authRoutes);
app.use("/api/portal", portalRoutes);

// Admin-only routes (token required)
app.use("/api/customers", protect, customerRoutes);
app.use("/api/inventory", protect, inventoryRoutes);
app.use("/api/rentals", protect, rentalRoutes);

// These two MUST come last, after all routes
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});