const winston = require('winston');
const { StatusCodes } = require('http-status-codes');
const logger = require('../startup/logging');

module.exports = function (err, req, res, next) {
  // Log the error
  logger.error(err.stack, { traceid: req.traceid });

  // Respond with an error message
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: 'Internal server error' });
};
