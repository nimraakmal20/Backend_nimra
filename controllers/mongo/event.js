/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const { StatusCodes } = require('http-status-codes');
const config = require('config');
const { App } = require('../../models/app');
const { Event } = require('../../models/event');
const { Ntype } = require('../../models/notiftype');
const logger = require('../../startup/logging');

const defaultpagesize = config.get('page.size');
const defaultpagenum = config.get('page.num');

async function createEvent(req, res) {
  const { applicationId, name, description, isDeleted } = req.body;

  if (!applicationId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send('Missing applicationId in request body.');
  }

  const application = await App.findById(applicationId);
  if (!application || application.isDeleted) {
    return res.status(StatusCodes.NOT_FOUND).send('Invalid application.');
  }

  // Check if an event with the same name and applicationId already exists
  const existingEvent = await Event.findOne({
    name,
    applicationId,
    isDeleted: false,
  });

  if (existingEvent) {
    return res
      .status(StatusCodes.CONFLICT)
      .send('An event with the same name and applicationId already exists.');
  }

  // Set isDeleted to false if not provided in the request body
  const isEventDeleted = isDeleted !== undefined ? isDeleted : false;

  // Set isActive to true when creating the event
  const isActive = true;

  const event = new Event({
    name,
    description,
    applicationId,
    isDeleted: isEventDeleted,
    isActive, // Set isActive to true
  });

  await event.save();
  return res.send(event);
}

async function updateEvent(req, res) {
  // Check if req.body is empty
  if (Object.keys(req.body).length === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send('Request body cannot be empty.');
  }

  const event = await Event.findById(req.params.id);
  if (!event || event.isDeleted)
    return res.status(StatusCodes.NOT_FOUND).send('Invalid event.');

  // Check if an event with the same name already exists for this application
  const existingEventWithSameName = await Event.findOne({
    name: req.body.name,
    applicationId: event.applicationId, // Use the existing event's eventId
    _id: { $ne: event._id }, // Exclude the current event from the check
  });

  if (existingEventWithSameName) {
    return res
      .status(StatusCodes.CONFLICT)
      .send('An event with the same name already exists for this application.');
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    req.params.id, // Using `req.params.id` instead of `req.query.eventId`
    req.body,
    { new: true },
  );
  return res.send(updatedEvent);
}

async function getEvents(req, res) {
  const { pagesize, pagenum, sortBy, sortOrder, ...filterParams } = req.query;

  const pageSize = parseInt(pagesize, 10) || defaultpagesize;
  const pageNum = parseInt(pagenum, 10) || defaultpagenum;
  const skipCount = (pageNum - 1) * pageSize;
  const sortOptions = {};

  if (sortBy) {
    sortOptions[sortBy] = parseInt(sortOrder, 10) || 1;
  }

  const filter = {};
  for (const key in filterParams) {
    filter[key] = filterParams[key];
  }

  // Add isDeleted: false to the filter to exclude deleted events
  filter.isDeleted = false;

  let eventsQuery = Event.find(filter).skip(skipCount).limit(pageSize);

  if (sortBy) {
    eventsQuery = eventsQuery.sort(sortOptions);
  }

  const events = await eventsQuery.exec();

  const totalEventsCount = await Event.countDocuments(filter);

  const responseData = {
    events,
    pageSize,
    pageNum,
    totalEventsCount,
  };

  return res.json(responseData);
}

async function getEventById(req, res) {
  const eventId = req.params.id;

  const event = await Event.findById(eventId);

  if (!event || event.isDeleted) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'Event not found' });
  }

  return res.json(event);
}
async function deleteEvent(req, res) {
  const eventId = req.params.id;

  // Fetch the existing event before updating
  const existingEvent = await Event.findById(eventId);

  if (!existingEvent) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'Event not found' });
  }

  // If the existing event is already deleted, return a message
  if (existingEvent.isDeleted) {
    return res.json({ message: 'The event has already been deleted.' });
  }
  // Set isDeleted=true for the event
  existingEvent.isDeleted = true;
  await existingEvent.save();

  // Update related Ntypes with notificationIds
  await Ntype.updateMany(
    { eventId },
    { $set: { isDeleted: true, isActive: false } },
  );

  // Retrieve the IDs of updated Ntypes
  const updatedNtypes = await Ntype.find({
    eventId,
    isDeleted: true,
    isActive: false,
  });

  return res.json({
    message: 'The event and related data have been deleted.',
    updatedNtypes,
  });
}

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  getEventById,
  deleteEvent,
};
