import { z, ZodError } from "zod";
import { HTTPSTATUS } from "../config/Https.config.js";
import { ErrorCodeEnum } from "../enums/error-code.enum.js";
import type { ErrorRequestHandler, Response } from "express";
import { AppError } from "../utils/AppError.js";



// Helper to standardize Zod validation error responses
const formatZodError = (res: Response, error: z.ZodError) => {
  const errors = error?.issues?.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));
  return res.status(HTTPSTATUS.BAD_REQUEST).json({
    message: "Validation failed",
    errors: errors,
    errorCode: ErrorCodeEnum.VALIDATION_ERROR,
  });
};

export const ErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
): any => {
  console.log("Error occurred on PATH:", req.path, "Error:", error);

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return formatZodError(res, error);
  }

  // Handle Multer errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "File too large",
      error: "Maximum file size is 5MB",
      errorCode: ErrorCodeEnum.VALIDATION_ERROR,
    });
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "Unexpected file field",
      error: `Expected field name 'thumbnail', received '${error.field}'`,
      errorCode: ErrorCodeEnum.VALIDATION_ERROR,
    });
  }

  // Handle custom AppError
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
    });
  }

  // Handle generic errors
  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
    error: error?.message || "Unknown error occurred",
  });
};