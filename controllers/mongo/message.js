/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
require('regenerator-runtime/runtime');
const { StatusCodes } = require('http-status-codes');
const config = require('config');
const { Ntype } = require('../../models/notiftype');
const { Stub } = require('../../models/stub');
const { Message } = require('../../models/message');
const logger = require('../../startup/logging');

const defaultpagesize = config.get('page.size');
const defaultpagenum = config.get('page.num');

async function createAndSendMessages(req, res) {
  const { ntypeId } = req.body; // Retrieve ntypeId from the request body
  const ntype = await Ntype.findById(ntypeId);

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
      ntypeId,
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
  const sortOptions = {};

  if (sortBy) {
    sortOptions[sortBy] = parseInt(sortOrder, 10) || 1;
  }

  const filter = {};
  for (const key in filterParams) {
    filter[key] = filterParams[key];
  }

  // Add any additional filter criteria you need here

  let messagesQuery = Message.find(filter).skip(skipCount).limit(pageSize);

  if (sortBy) {
    messagesQuery = messagesQuery.sort(sortOptions);
  }

  const messages = await messagesQuery.exec();

  const totalMessagesCount = await Message.countDocuments(filter);

  const responseData = {
    messages,
    pageSize,
    pageNum,
    totalMessagesCount,
  };

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

module.exports = {
  createAndSendMessages,
  getMessages,
  getMessageById,
};
