import express from "express";
import {
  createRental,
  getRentals,
  getActiveRentals,
  getRentalById,
  returnRental,
} from "../controllers/rentalController.js";

const router = express.Router();

router.route("/").get(getRentals).post(createRental);

// MUST be above "/:id", otherwise "active" is treated as an id
router.get("/active", getActiveRentals);

router.get("/:id", getRentalById);
router.put("/:id/return", returnRental);

export default router;