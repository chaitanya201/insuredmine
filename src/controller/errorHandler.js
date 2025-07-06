import { SERVER_CONFIG } from "../config/server.config.js";
import AppError from "../utils/appError.js";

// Error handlers
const handleCastErrorDB = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}.`, 400);

const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)?.[0] || "field";
  return new AppError(
    `Duplicate field value: ${value}. Please use another value!`,
    400
  );
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  return new AppError(`Invalid input data. ${errors.join(". ")}`, 400);
};

const handleJWTError = () => new AppError("Unable to verify token.", 401);

// Error response formatters
const sendErrorDev = (err, res) =>
  res.status(err.statusCode).json({
    status: false,
    error: err,
    message: err.message,
    stack: err.stack,
  });

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: false,
      message: err.message,
    });
  } else {
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: false,
      message: "Something went very wrong!",
    });
  }
};

// Global error handler
const globalErrorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || false;

  const env = SERVER_CONFIG.NODE_ENV || "development";

  if (env === "development") {
    return sendErrorDev(err, res);
  }

  // Clone original error object to avoid mutation
  let error = { ...err, message: err.message };

  if (error.name === "CastError") error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === "ValidationError") error = handleValidationErrorDB(error);
  if (["JsonWebTokenError", "TokenExpiredError"].includes(error.name))
    error = handleJWTError();

  sendErrorProd(error, res);
};

export default globalErrorHandler;
