const winston = require('winston');
const config = require('config');

const customFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message, traceid }) => {
    if (!traceid) {
      return `[${timestamp}] [${level}] ${message}`;
    }
    return `[${timestamp}] [${level}] [${traceid}]: ${message}`;
  }),
);

const customLogger = winston.createLogger({
  level: config.get('envType') === 'development' ? 'debug' : 'info', // check config type cpde review
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (config.get('log.console')) {
  customLogger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), customFormat),
    }),
  );
}

winston.exceptions.handle(
  new winston.transports.File({ filename: 'uncaughtExceptions.log' }),
);

process.on('unhandledRejection', (ex) => {
  customLogger.error(ex);
});

module.exports = customLogger;
