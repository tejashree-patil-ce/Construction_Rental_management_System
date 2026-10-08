// Runs when no route matched the request
export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

const DEFAULT_CODES = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
};

// Central error handler: every error from every controller ends up here
export const errorHandler = (err, req, res, next) => {
  // AppError carries its own status; older code sets it with res.status()
  let statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  let message = err.message;
  let code = err.errorCode;
  let details = err.details;

  // Invalid MongoDB id format, e.g. /api/customers/abc
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
    code = "INVALID_ID";
  }

  // Mongoose schema rules broken
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    code = "VALIDATION_ERROR";
    details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Duplicate value on a unique field
  if (err.code === 11000) {
    statusCode = 409;
    message = `${Object.keys(err.keyValue)[0]} already exists`;
    code = "DUPLICATE_VALUE";
  }

  // Fake or tampered token
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Not authorized, invalid token";
    code = "INVALID_TOKEN";
  }

  // Token past its expiry time
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Not authorized, token expired";
    code = "TOKEN_EXPIRED";
  }

  // No special code? Derive one from the status
  if (!code) {
    code = DEFAULT_CODES[statusCode] || (statusCode >= 500 ? "SERVER_ERROR" : "ERROR");
  }

  // Unexpected crash: log it for yourself, hide the internals from the client
  if (statusCode >= 500) {
    console.error(err);
    if (process.env.NODE_ENV === "production") {
      message = "Something went wrong";
    }
  }

  const body = { success: false, message, error: { code } };
  if (details) body.error.details = details;

  res.status(statusCode).json(body);
};