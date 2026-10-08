export class AppError extends Error {
  constructor(message, statusCode = 500, errorCode, details) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
  }
}