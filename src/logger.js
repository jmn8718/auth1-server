const winston = require('winston');
const { LOG_LEVEL } = require('./env');

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.cli(),
  defaultMeta: {},
  transports: [
    new winston.transports.Console({
      stringify: JSON.stringify,
      prettyPrint: JSON.stringify,
    }),
  ],
});

module.exports = {
  logger,
};
