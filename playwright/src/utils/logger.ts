import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  transports: [
    new transports.File({ filename: 'log/api_tests.log', level: 'info' }),
    new transports.Console({ silent: process.env.NODE_ENV === 'test' }) // Silence console in CI/test
  ],
});

export default logger;
