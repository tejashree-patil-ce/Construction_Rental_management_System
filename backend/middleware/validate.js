import { AppError } from "../utils/AppError.js";

export const validate = (schema) => (req, res, next) => {
  // "?? {}" so a request with no body gets a clean 400, not a crash
  const result = schema.safeParse(req.body ?? {});

  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      field: issue.path.join(".") || "body",
      message: issue.message,
    }));

    return next(new AppError("Validation failed", 400, "VALIDATION_ERROR", details));
  }

  // Replace the body with the cleaned data (trimmed, unknown fields removed)
  req.body = result.data;
  next();
};