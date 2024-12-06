import { logger } from '../config/logger';
import { ErrorCode } from '../types/error';

export interface ErrorMetadata {
  [key: string]: any;
}

export class GuardianError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly metadata: ErrorMetadata;

  constructor(
    message: string,
    code = ErrorCode.INTERNAL_ERROR,
    statusCode = 500,
    isOperational = true,
    metadata: ErrorMetadata = {}
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.metadata = metadata;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error types
export class ValidationError extends GuardianError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(message, ErrorCode.VALIDATION_ERROR, 400, true, metadata);
  }
}

export class ImageProcessingError extends GuardianError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(message, ErrorCode.IMAGE_PROCESSING_ERROR, 500, true, metadata);
  }
}

export class PluginError extends GuardianError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(message, ErrorCode.PLUGIN_ERROR, 500, true, metadata);
  }
}

export class CaptchaGenerationError extends GuardianError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(message, ErrorCode.CAPTCHA_GENERATION_ERROR, 500, true, metadata);
  }
}

export class AuthError extends GuardianError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(message, ErrorCode.AUTH_ERROR, 401, true, metadata);
  }
}

export class RateLimitError extends GuardianError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(message, ErrorCode.RATE_LIMIT_ERROR, 429, true, metadata);
  }
}

// Error handler function
export function handleError(error: Error | GuardianError): void {
  if (error instanceof GuardianError && error.isOperational) {
    logger.error({
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      metadata: error.metadata,
      stack: error.stack
    });
  } else {
    logger.error({
      message: 'Unhandled error occurred',
      error: error.message,
      stack: error.stack
    });
    
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
}

// Global error handlers
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  handleError(error);
});

process.on('unhandledRejection', (reason: any) => {
  logger.error('Unhandled Rejection:', reason);
  handleError(reason instanceof Error ? reason : new Error(String(reason)));
});