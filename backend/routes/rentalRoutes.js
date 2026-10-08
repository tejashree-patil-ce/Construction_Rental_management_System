import express from "express";
import {
  createRental,
  getRentals,
  getActiveRentals,
  getRentalById,
  returnRental,
} from "../controllers/rentalController.js";
import { validate } from "../middleware/validate.js";
import {
  createRentalSchema,
  returnRentalSchema,
} from "../validators/rentalValidator.js";

const router = express.Router();

router
  .route("/")
  .get(getRentals)
  .post(validate(createRentalSchema), createRental);

// MUST be above "/:id", otherwise "active" is treated as an id
router.get("/active", getActiveRentals);

router.get("/:id", getRentalById);
router.put("/:id/return", validate(returnRentalSchema), returnRental);

export default router;