import rateLimit from "express-rate-limit";
import { AppError } from "../utils/AppError.js";

const tooManyRequests = (req, res, next) => {
  next(
    new AppError(
      "Too many attempts. Please try again after some time.",
      429,
      "RATE_LIMITED"
    )
  );
};

// Public customer portal: 20 lookups per 15 minutes per IP
export const portalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: tooManyRequests,
});

// Admin login: 10 attempts per 15 minutes per IP
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: tooManyRequests,
});