const uuid = require('uuid');
const logger = require('../startup/logging');

module.exports = function (req, res, next) {
  let traceid = req.header('x-trace-id');

  if (!traceid) {
    traceid = uuid.v4();
    res.setHeader('x-trace-id', traceid);
  }

  req.traceid = traceid;
  // console.log('Trace ID:', req.headers['x-trace-id']);

  // Correct the variable name to `traceid` instead of `traceId`
  logger.info(`${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`, {
    traceid,
  });

  next();
};
