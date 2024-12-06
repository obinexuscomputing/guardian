import winston from 'winston';
export declare const logger: winston.Logger;
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';
export declare const log: (level: LogLevel, message: string, meta?: any) => void;
