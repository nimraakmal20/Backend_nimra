/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const { StatusCodes } = require('http-status-codes');
const configuration = require('config');
const { App } = require('../../models/app');
const { Event } = require('../../models/event');
const { Ntype } = require('../../models/notiftype');
const { Message } = require('../../models/message');

const defaultpagesize = configuration.get('page.size');
const defaultpagenum = configuration.get('page.num');

// create an app
async function createApp(req, res) {
  // Check if an app with the same name already exists
  const existingApp = await App.findOne({
    name: req.body.name,
    isDeleted: false,
  });
  if (existingApp) {
    return res
      .status(StatusCodes.CONFLICT)
      .send('An app with the same name already exists.');
  }

  // Set isDeleted to false if not provided in the request body
  const isDeleted =
    req.body.isDeleted !== undefined ? req.body.isDeleted : false;
  // Set isDeleted to false if not provided in the request body
  const isActive = req.body.isActive !== undefined ? req.body.isActive : true;
  let app = new App({
    name: req.body.name,
    description: req.body.description,
    isActive,
    isDeleted, // Set the value here
  });
  app = await app.save();
  return res.status(StatusCodes.OK).send(app);
}

async function updateApp(req, res) {
  // Check if req.body is empty
  if (Object.keys(req.body).length === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send('Request body cannot be empty.');
  }

  const appId = req.params.id;

  // Fetch the existing app before updating
  const existingApp = await App.findById(appId);

  if (!existingApp) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'App not found' });
  }

  // If the existing app is deleted, return a message
  if (existingApp.isDeleted) {
    return res.json({ message: 'The app has been deleted.' });
  }

  // Check if an app with the same name and same ID already exists
  const appWithSameName = await App.findOne({
    name: req.body.name,
    _id: { $ne: appId }, // Exclude the current app from the search
  });

  if (appWithSameName) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ error: 'App with the same name already exists.' });
  }

  // Update the app
  const updatedApp = await App.findByIdAndUpdate(
    appId,
    {
      name: req.body.name,
      description: req.body.description,
      isActive: req.body.isActive,
      isDeleted: req.body.isDeleted,
    },
    { new: true },
  );

  if (!updatedApp) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'App not found' });
  }

  return res.json(updatedApp);
}

async function getApps(req, res) {
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

  // Add isDeleted: false to the filter to exclude deleted apps
  filter.isDeleted = false;

  let appsQuery = App.find(filter).skip(skipCount).limit(pageSize);

  if (sortBy) {
    appsQuery = appsQuery.sort(sortOptions);
  }

  const apps = await appsQuery.exec();

  const totalAppsCount = await App.countDocuments(filter);

  const responseData = {
    apps,
    pageSize,
    pageNum,
    totalAppsCount,
  };

  return res.json(responseData);
}

async function getAppById(req, res) {
  const appId = req.params.id;

  const app = await App.findById(appId);

  if (!app || app.isDeleted) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: 'App is either unknown or deleted' });
  }

  return res.json(app);
}
async function deleteApp(req, res) {
  const appId = req.params.id;

  // Fetch the existing app before updating
  const existingApp = await App.findById(appId);

  if (!existingApp) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'App not found' });
  }

  // If the existing app is already deleted, return a message
  if (existingApp.isDeleted) {
    return res.json({ message: 'The app has already been deleted.' });
  }

  // Set isDeleted=true and isActive=false for the app
  existingApp.isDeleted = true;
  existingApp.isActive = false;
  await existingApp.save();

  // Update related events with applicationId and get deleted events
  const deletedEvents = await Event.find({ applicationId: appId });
  await Event.updateMany(
    { applicationId: appId },
    { $set: { isDeleted: true } },
  );

  // Get the eventIds of deleted events
  const deletedEventIds = deletedEvents.map((event) => event._id);

  // Update related Ntypes with eventIds and get deleted Ntypes
  const deletedNtypes = await Ntype.find({
    eventId: { $in: deletedEventIds },
  });
  await Ntype.updateMany(
    { eventId: { $in: deletedEventIds } },
    { $set: { isDeleted: true } },
  );

  // Get the ntypeIds of deleted Ntypes
  const deletedNtypeIds = deletedNtypes.map((ntype) => ntype._id);

  // Update related messages with ntypeIds
  await Message.updateMany(
    { ntypeId: { $in: deletedNtypeIds } },
    { $set: { isDeleted: true } },
  );

  return res.json({
    message: 'The app and related data have been deleted.',
    deletedEvents,
    deletedNtypes,
  });
}

module.exports = {
  createApp,
  updateApp,
  getApps,
  getAppById,
  deleteApp,
};
