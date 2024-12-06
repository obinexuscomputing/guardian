export declare enum ErrorCode {
    VALIDATION_ERROR = "VALIDATION_ERROR",
    PLUGIN_ERROR = "PLUGIN_ERROR",
    CAPTCHA_GENERATION_ERROR = "CAPTCHA_GENERATION_ERROR",
    AUTH_ERROR = "AUTH_ERROR",
    RATE_LIMIT_ERROR = "RATE_LIMIT_ERROR",
    INTERNAL_ERROR = "INTERNAL_ERROR"
}
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
export declare function safeExecute<T>(operation: () => Promise<T>, errorMessage: string): Promise<T>;
