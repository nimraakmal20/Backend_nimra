/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const { StatusCodes } = require('http-status-codes');
const config = require('config');
const { async } = require('regenerator-runtime');
const postgredb = require('../../startup/db/postgresDb/postgresDb');
const logger = require('../../startup/logging');

const defaultpagesize = config.get('page.size');
const defaultpagenum = config.get('page.num');

async function createMessage(req, res) {
  const { ntypeId } = req.body;
  // Fetch ntype details
  const ntype = await postgredb('ntype').where('id', ntypeId).first();
  if (!ntype)
    return res.status(StatusCodes.NOT_FOUND).send('Invalid notification type.');
  const { eventId } = ntype;
  const event = await postgredb('event').where('id', eventId).first();
  if (!event) return res.status(StatusCodes.NOT_FOUND).send('Invalid Event.');

  const { applicationId } = event;
  const app = await postgredb('apps').where('id', applicationId).first();
  if (!app) return res.status(StatusCodes.NOT_FOUND).send('Invalid App.');

  const { templateBody, tags } = ntype;

  const { sending: recipients } = req.body;
  const savedMessages = [];

  for (const recipient of recipients) {
    let messageSubject = ntype.templateSubject;
    let messageBody = templateBody;

    for (const key of Object.keys(recipient)) {
      if (tags.includes(key)) {
        const tagValue = recipient[key];
        messageSubject = messageSubject.replace(`[[${key}]]`, tagValue);
        messageBody = messageBody.replace(`[[${key}]]`, tagValue);
      }
    }

    // Check if a message with the same messageBody already exists
    const existingMessage = await postgredb('message')
      .where({
        messageBody,
        ntypeId,
        eventId,
        applicationId,
      })
      .first();

    if (existingMessage) {
      // If a duplicate message is found, return a message indicating the duplicate
      return res.status(StatusCodes.CONFLICT).send('Duplicate message found');
    }

    // Insert message into the database
    const [message] = await postgredb('message')
      .insert({
        sendto: recipient.email,
        messageSubject,
        messageBody,
        ntypeId,
        eventId,
        applicationId,
        isProcessed: false,
      })
      .returning('*');

    savedMessages.push(message);
  }

  const formattedOutput = savedMessages.map((message) => ({
    sendto: message.sendto,
    subject: message.messageSubject,
    messagebody: message.messageBody,
  }));

  return res.json(formattedOutput);
}

async function getMessages(req, res) {
  const { pagesize, pagenum, sortBy, sortOrder, ...filterParams } = req.query;

  // Convert query parameters to integers
  const pageSizeInt = parseInt(pagesize, 10) || defaultpagesize;
  const pageNumInt = parseInt(pagenum, 10) || defaultpagenum;

  // Calculate skip count based on page size and page number
  const skipCount = (pageNumInt - 1) * pageSizeInt;

  // Define sorting options based on query parameters
  const sortField = sortBy || 'id'; // Default sort field if sortBy is not provided
  const sortDirection = parseInt(sortOrder, 10) === -1 ? 'desc' : 'asc';

  // Build the filter object based on the remaining query parameters
  const filter = {};
  for (const key in filterParams) {
    filter[key] = filterParams[key];
  }

  let query = postgredb('message').where(filter);

  // Apply sorting options to the query
  query = query.orderBy(sortField, sortDirection);

  const messages = await query.offset(skipCount).limit(pageSizeInt);

  const totalMessagesCount = await postgredb('message')
    .count('id as count')
    .where(filter)
    .first();

  const responseData = {
    messages,
    pageSize: pageSizeInt,
    pageNum: pageNumInt,
    totalMessagesCount: parseInt(totalMessagesCount.count, 10),
  };

  return res.json(responseData);
}

async function getMessageById(req, res) {
  const appId = req.params.id; // Assuming the parameter is named 'id'

  const app = await postgredb('message').where('id', appId).first();

  if (!app) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: 'Message not found' });
  }

  return res.json(app);
}

async function updateProcessedFlag(req, res) {
  return 0;
}

module.exports = {
  createMessage,
  getMessages,
  getMessageById,
  updateProcessedFlag,
};
