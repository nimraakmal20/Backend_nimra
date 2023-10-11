/* eslint-disable no-shadow */
const express = require('express');
const { traceId } = require('../middleware/traceId');

const app = express();
// Routes
const appsRouter = require('../routes/apps');
const eventsRouter = require('../routes/events');
const notiftypeRouter = require('../routes/notiftypes');
const messageR = require('../routes/messages');

// Middleware for parsing JSON data
app.use(express.json());

module.exports = function (app) {
  // using routes
  app.use('/api/apps', appsRouter);
  app.use('/api/events', eventsRouter);
  app.use('/api/notiftypes', notiftypeRouter);
  app.use('/api/messages', messageR);
};
