import winston from 'winston';
import { format } from 'date-fns';

const { combine, timestamp, printf, colorize, errors } = winston.format;

interface LogEntry {
  level: string;
  message: string;
  timestamp: string | number | Date;
  stack?: string;
  [key: string]: any;
}

// Custom log format
const logFormat = printf(({ level, message, timestamp, ...metadata }: LogEntry) => {
  let formattedDate: string;
  
  try {
    formattedDate = format(
      new Date(timestamp),
      'yyyy-MM-dd HH:mm:ss'
    );
  } catch {
    formattedDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  }

  let msg = `${formattedDate} [${level}]: ${message}`;
  
  if (metadata.stack) {
    msg += `\n${metadata.stack}`;
  }
  
  if (Object.keys(metadata).length > 0 && !metadata.stack) {
    msg += `\nMetadata: ${JSON.stringify(metadata, null, 2)}`;
  }
  
  return msg;
});

// Create the logger instance
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp(),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), logFormat)
    }),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  ]
});

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export const log = (level: LogLevel, message: string, meta?: any) => {
  logger.log(level, message, meta);
};