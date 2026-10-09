import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import rentalRoutes from "./routes/rentalRoutes.js";
import portalRoutes from "./routes/portalRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";


dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

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