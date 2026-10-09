import express from "express";
import { lookupRentals } from "../controllers/portalController.js";
import { validate } from "../middleware/validate.js";
import { portalLookupSchema } from "../validators/portalValidator.js";
import { portalLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Order: rate limit first (cheap), then validation, then the controller
router.post("/rentals", portalLimiter, validate(portalLookupSchema), lookupRentals);

export default router;