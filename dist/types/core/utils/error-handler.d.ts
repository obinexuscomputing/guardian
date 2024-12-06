import { ErrorCode } from '../types/error';
export interface ErrorMetadata {
    [key: string]: any;
}
export declare class GuardianError extends Error {
    readonly code: ErrorCode;
    readonly statusCode: number;
    readonly isOperational: boolean;
    readonly metadata: ErrorMetadata;
    constructor(message: string, code?: ErrorCode, statusCode?: number, isOperational?: boolean, metadata?: ErrorMetadata);
}
export declare class ValidationError extends GuardianError {
    constructor(message: string, metadata?: ErrorMetadata);
}
export declare class ImageProcessingError extends GuardianError {
    constructor(message: string, metadata?: ErrorMetadata);
}
export declare class PluginError extends GuardianError {
    constructor(message: string, metadata?: ErrorMetadata);
}
export declare class CaptchaGenerationError extends GuardianError {
    constructor(message: string, metadata?: ErrorMetadata);
}
export declare class AuthError extends GuardianError {
    constructor(message: string, metadata?: ErrorMetadata);
}
export declare class RateLimitError extends GuardianError {
    constructor(message: string, metadata?: ErrorMetadata);
}
export declare function handleError(error: Error | GuardianError): void;
