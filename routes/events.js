/* eslint-disable import/no-dynamic-require */
const express = require('express');

const router = express.Router();
const { DB_TYPE } = process.env;

const dbname = DB_TYPE;
const { validateevent } = require('../middleware/validations');
const { validateUpdateevent } = require('../middleware/updatevalidations');
const { validateGetEventsFilter } = require('../middleware/getValidations');

const {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getEventById,
} = require(`../controllers/${dbname}/event`);
const traceId = require('../middleware/traceId');

router.use(traceId);
// Create a new app
router.post('/', validateevent, createEvent);

// Update an event
router.patch('/:id', validateUpdateevent, updateEvent);

router.patch('/delete/:id', deleteEvent);

// Get an event
router.get('/', validateGetEventsFilter, getEvents);

router.get('/:id', getEventById);

module.exports = router;
