import winston from 'winston';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} | ${level.toUpperCase()} | ${message}`;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: 'error',
  format: logFormat,
  transports: [
    // store all errors in error.log
    new winston.transports.File({ filename: 'logs/error.log' }),
    // store all logs (info, warn, error) in combined.log
    new winston.transports.File({ filename: 'logs/combined.log' })
  ],
});

// Also print error in console — optional (only for dev)
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console());
}

export default logger;
