import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

class ApiError extends Error {
  public statusCode: number;
  public message: string;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
}

const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error({
    message: err.message,
    statusCode,
    stack: err.stack,
  });

  res.status(statusCode).json({ status: 'error', statusCode, message });
  next();
};

export { errorHandler, ApiError };
