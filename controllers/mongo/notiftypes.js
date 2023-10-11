/* eslint-disable no-cond-assign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
// this one has the real message rin Event
const { StatusCodes } = require('http-status-codes');
const config = require('config');
const { Event } = require('../../models/event');
const { Ntype } = require('../../models/notiftype');
const { Stub } = require('../../models/stub');

const defaultpagesize = config.get('page.size');
const defaultpagenum = config.get('page.num');

function extractTagsFromText(text) {
  const regex = /\[\[(.*?)\]\]/g;
  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    // Corrected loop condition
    matches.push(match[1]);
  }

  return matches;
}
async function createNtype(req, res) {
  // Extract tags from the body
  const tags = extractTagsFromText(req.body.templateBody);
  // Check if an Ntype with the same name exists
  const existingNtype = await Ntype.findOne({ name: req.body.name });
  if (existingNtype) {
    return res
      .status(StatusCodes.CONFLICT)
      .send('Ntype with the same name already exists.');
  }

  // Check if 'eventId' is provided in the request body
  if (!req.body.eventId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send('Event ID is missing in the request body.');
  }

  const eventId = await Event.findById(req.body.eventId);
  if (!eventId || eventId.isDeleted) {
    return res.status(StatusCodes.NOT_FOUND).send('Invalid or deleted Event.');
  }

  // Check if an Ntype with the same name already exists for this Event
  const existingNtypeForEvent = await Ntype.findOne({
    name: req.body.name,
    eventId: req.body.eventId,
    isDeleted: false,
  });

  if (existingNtypeForEvent) {
    return res
      .status(StatusCodes.CONFLICT)
      .send('An Ntype with the same name already exists for this Event.');
  }

  // Set isDeleted to false if not provided in the request body
  const isDeleted =
    req.body.isDeleted !== undefined ? req.body.isDeleted : false;
  // Set isActive to true when creating the Ntype
  const isActive = true;

  let ntype = new Ntype({
    name: req.body.name,
    description: req.body.description,
    templateSubject: req.body.templateSubject,
    templateBody: req.body.templateBody,
    tags, // Save extracted tags in the Ntype schema
    eventId: req.body.eventId, // Use 'eventId' from the request body
    isActive,
    isDeleted,
  });
  ntype = await ntype.save();

  // Create and save the stub content with an array of tags
  const stub = new Stub({ stubsArr: tags, ntypeId: ntype._id });
  await stub.save();
  return res.send(ntype);
}

async function updateNtype(req, res) {
  // Check if req.body is empty
  if (Object.keys(req.body).length === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send('Request body cannot be empty.');
  }

  const ntype = await Ntype.findById(req.params.id);
  if (!ntype || ntype.isDeleted)
    return res.status(StatusCodes.NOT_FOUND).send('Invalid or deleted ntype.');

  // Extract tags from the updated templateBody
  const updatedTags = extractTagsFromText(req.body.templateBody);

  // Check if an Ntype with the same name exists
  const existingNtype = await Ntype.findOne({
    name: req.body.name,
    eventId: ntype.eventId, // Use the existing ntype's eventId
    _id: { $ne: ntype._id }, // Exclude the current ntype from the search
  });
  if (existingNtype) {
    return res
      .status(StatusCodes.CONFLICT)
      .send('An Ntype with the same name already exists for this Event.');
  }

  // Update the Ntype with the new tag array and other fields
  const updatedNtype = await Ntype.findByIdAndUpdate(
    req.params.id,
    { ...req.body, tags: updatedTags }, // Update tags with the new tag array
    { new: true },
  );

  // Create and save the stub content with the updated tag array
  const stub = new Stub({ stubsArr: updatedTags, ntypeId: updatedNtype._id });
  await stub.save();

  return res.send(updatedNtype);
}

async function getNtypes(req, res) {
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

  // Add isDeleted: false to the filter to exclude deleted ntypes
  filter.isDeleted = false;

  let ntypesQuery = Ntype.find(filter).skip(skipCount).limit(pageSize);

  if (sortBy) {
    ntypesQuery = ntypesQuery.sort(sortOptions);
  }

  const ntypes = await ntypesQuery.exec();

  const totalNtypesCount = await Ntype.countDocuments(filter);

  const responseData = {
    ntypes,
    pageSize,
    pageNum,
    totalNtypesCount,
  };

  return res.json(responseData);
}

async function getNtypeById(req, res) {
  const ntypeId = req.params.id; // Assuming the parameter is named 'id'

  const ntype = await Ntype.findById(ntypeId);

  if (!ntype || ntype.isDeleted) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: 'Ntype not found or deleted' });
  }

  return res.json(ntype);
}
async function deleteNtype(req, res) {
  const ntypeId = req.params.id;

  // Fetch the existing Ntype before updating
  const existingNtype = await Ntype.findById(ntypeId);

  if (!existingNtype) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'Ntype not found' });
  }

  // If the existing Ntype is already deleted, return a message
  if (existingNtype.isDeleted) {
    return res.json({ message: 'The Ntype has already been deleted.' });
  }

  // Set isDeleted=true for the Ntype
  existingNtype.isDeleted = true;
  await existingNtype.save();

  return res.json({
    message: 'The Ntype has been deleted.',
  });
}

module.exports = {
  createNtype,
  updateNtype,
  getNtypes,
  getNtypeById,
  deleteNtype,
};
