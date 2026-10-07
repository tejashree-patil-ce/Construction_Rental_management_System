// Runs when no route matched the request
export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

// Central error handler: every error from every controller ends up here
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Invalid MongoDB id format, e.g. /api/customers/abc
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Schema rules broken (required, match, ...)
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Duplicate value on a unique field (phone)
  if (err.code === 11000) {
    statusCode = 409;
    message = `${Object.keys(err.keyValue)[0]} already exists`;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};