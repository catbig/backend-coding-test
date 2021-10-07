'use strict';

const winston = require('winston');
const { createLogger, format, transports } = winston;
//    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'rides' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `info.log`
    //
    new transports.File({ filename: './log/debug.log', level: 'debug' }),
    new transports.File({ filename: './log/error.log', level: 'error' }),
    new transports.File({ filename: './log/warn.log', level: 'warn' }),
    new transports.File({ filename: './log/info.log', level: 'info' })
  ]
});

module.exports = logger;
