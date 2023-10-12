/* eslint-disable import/no-dynamic-require */
const express = require('express');

const router = express.Router();
const { DB_TYPE } = process.env;

const dbname = DB_TYPE;
const { validatemessage } = require('../middleware/validations');
const { validateGetMessagesFilter } = require('../middleware/getValidations');

const {
  createMessage,
  getMessages,
  getMessageById,
  updateProcessedFlag,
} = require(`../controllers/${dbname}/message`);
const traceId = require('../middleware/traceId');

router.use(traceId);
// Create a new app
router.post('/', createMessage);

router.get('/', validateGetMessagesFilter, getMessages);

router.get('/:id', getMessageById);

router.patch('/process/:id', updateProcessedFlag);
module.exports = router;
