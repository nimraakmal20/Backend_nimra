/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
require('regenerator-runtime/runtime');
const { StatusCodes } = require('http-status-codes');
const config = require('config');
const { App } = require('../../models/app');
const { Event } = require('../../models/event');
const { Ntype } = require('../../models/notiftype');
const { Message } = require('../../models/message');
const logger = require('../../startup/logging');

const defaultpagesize = config.get('page.size');
const defaultpagenum = config.get('page.num');

async function createMessage(req, res) {
  const { ntypeId } = req.body; // Retrieve ntypeId from the request body
  const ntype = await Ntype.findById(ntypeId);
  const { eventId } = ntype;
  const event = await Event.findById(eventId);
  const { applicationId } = event;
  const application = await App.findById(applicationId);
  if (!ntype || ntype.isDeleted)
    return res.status(StatusCodes.NOT_FOUND).send('Invalid ntype.');
  const { templateBody, tags } = ntype;
  const { sending: recipients } = req.body;
  const savedMessages = [];
  // Validate if tags in the request body match ntype tags, excluding "email"
  const invalidTags = recipients
    .flatMap((recipient) =>
      Object.keys(recipient).filter((tag) => tag !== 'email'),
    )
    .filter((tag) => !tags.includes(tag));

  if (invalidTags.length > 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(`Invalid tags: ${invalidTags.join(', ')}`);
  }

  for (const recipient of recipients) {
    let sendto = ntype.templateSubject;
    let messageSubject = ntype.templateSubject;
    let messageBody = templateBody;

    for (const key of Object.keys(recipient)) {
      if (tags.includes(key)) {
        const tagValue = recipient[key];
        sendto = ntype.templateSubject;
        messageSubject = messageSubject.replace(`[[${key}]]`, tagValue);
        messageBody = messageBody.replace(`[[${key}]]`, tagValue);
      }
    }

    const existingMessage = await Message.findOne({
      messageBody,
    });
    if (existingMessage) {
      // Handle existing message here if needed
      return res.send(`Message with body '${messageBody}' already exists'`);
    }

    const message = new Message({
      sendto: recipient.email, // Assuming the email field is present in the recipient object
      messageSubject,
      messageBody,
      processed: false,
      ntypeId: ntype,
      eventId: event,
      applicationId: application,
    });

    savedMessages.push(await message.save());
  }

  return res.send(savedMessages);
}

async function getMessages(req, res) {
  const { pagesize, pagenum, sortBy, sortOrder, ...filterParams } = req.query;
  const pageSize = parseInt(pagesize, 10) || defaultpagesize;
  const pageNum = parseInt(pagenum, 10) || defaultpagenum;
  const skipCount = (pageNum - 1) * pageSize;
  const fromDate = filterParams.FromDate;
  const toDate = filterParams.ToDate;

  const filters = [];

  if (fromDate && toDate) {
    filters.push({
      $and: [
        { created_at: { $gte: new Date(fromDate) } },
        { created_at: { $lte: new Date(toDate) } },
      ],
    });
  }

  if (filterParams.ntypeId) {
    const ntype = await Ntype.findById(filterParams.ntypeId);
    if (!ntype) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Notification Type not found' });
    }
    filters.push({ ntypeId: { $in: ntype._id } });
  } else if (filterParams.eventId) {
    const event = await Event.findById(filterParams.eventId);
    if (!event) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Event Type not found' });
    }
    filters.push({ eventId: { $in: event._id } });
  } else if (filterParams.applicationId) {
    const application = await Event.findById(filterParams.applicationId);
    if (!application) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Application Type not found' });
    }
    filters.push({ applicationId: { $in: application._id } });
  }

  let filter;

  if (filters.length > 0) {
    filter = {
      $and: filters, // Combine multiple conditions with logical AND
    };
  }

  let messagesQuery;

  if (sortBy) {
    messagesQuery = Message.find(filter).skip(skipCount).limit(pageSize);

    if (sortBy === 'applicationName') {
      messagesQuery = messagesQuery.populate({
        path: 'applicationId',
        select: 'name',
      });
    } else if (sortBy === 'eventName') {
      messagesQuery = messagesQuery.populate({
        path: 'eventId',
        select: 'name',
      });
    } else if (sortBy === 'notificationtypeName') {
      messagesQuery = messagesQuery.populate({
        path: 'ntypeId',
        select: 'name',
      });
    }
  }

  const messages = await messagesQuery.exec();

  const totalMessagesCount = await Message.countDocuments(filter);

  const responseData = {
    messages,
    pageSize,
    pageNum,
    totalMessagesCount,
  };

  if (sortOrder === '-1') {
    if (sortBy === 'applicationName') {
      responseData.messages = responseData.messages.sort((a, b) => {
        if (a.applicationId.name > b.applicationId.name) {
          return -1;
        }
        if (a.applicationId.name < b.applicationId.name) {
          return 1;
        }
        return 0;
      });
    } else if (sortBy === 'eventName') {
      responseData.messages = responseData.messages.sort((a, b) => {
        if (a.eventId.name > b.eventId.name) {
          return -1;
        }
        if (a.eventId.name < b.eventId.name) {
          return 1;
        }
        return 0;
      });
    } else if (sortBy === 'notificationtypeName') {
      responseData.messages = responseData.messages.sort((a, b) => {
        if (a.ntypeId.name > b.applicationId.name) {
          return -1;
        }
        if (a.ntypeId.name < b.ntypeId.name) {
          return 1;
        }
        return 0;
      });
    }
  } else if (sortOrder === '1') {
    if (sortBy === 'applicationName') {
      responseData.messages = responseData.messages.sort((a, b) => {
        if (a.applicationId.name > b.applicationId.name) {
          return 1;
        }
        if (a.applicationId.name < b.applicationId.name) {
          return -1;
        }
        return 0;
      });
    } else if (sortBy === 'eventName') {
      responseData.messages = responseData.messages.sort((a, b) => {
        if (a.eventId.name > b.eventId.name) {
          return 1;
        }
        if (a.eventId.name < b.eventId.name) {
          return -1;
        }
        return 0;
      });
    } else if (sortBy === 'notificationtypeName') {
      responseData.messages = responseData.messages.sort((a, b) => {
        if (a.ntypeId.name > b.applicationId.name) {
          return 1;
        }
        if (a.ntypeId.name < b.ntypeId.name) {
          return -1;
        }
        return 0;
      });
    }
  }

  return res.json(responseData);
}

async function getMessageById(req, res) {
  const messageId = req.params.id; // Assuming the parameter is named 'id'

  const message = await Message.findById(messageId);

  if (!message) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: 'Message not found' });
  }

  return res.json(message);
}
async function updateProcessedFlag(req, res) {
  const messageId = req.params.id; // Assuming the parameter is named 'id'

  const message = await Message.findById(messageId);

  if (!message) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: 'Message not found' });
  }

  message.processed = true;
  await message.save();

  return res.json({ message });
}

module.exports = {
  createMessage,
  getMessages,
  getMessageById,
  updateProcessedFlag,
};
