'use strict';

const winston = require('winston');
const { createLogger, format, transports } = winston;

function initLogger() {
  var log = createLogger({
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
      new transports.File({ filename: './log/error.log', level: 'error' }),
      new transports.File({ filename: './log/warn.log', level: 'warn' }),
      new transports.File({ filename: './log/info.log', level: 'info' }),
    ],
  });
  global.log = log;
}

exports.initLogger = initLogger;

 
/*
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  log.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}*/