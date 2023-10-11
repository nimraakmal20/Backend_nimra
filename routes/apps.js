/* eslint-disable import/no-dynamic-require */
const express = require('express');

const router = express.Router();

const { DB_TYPE } = process.env;

const dbname = DB_TYPE;
// Import your PostgreSQL route handlers
const { validateApp } = require('../middleware/validations');
const { validateUpdateapp } = require('../middleware/updatevalidations');
const { validateGetAppsFilter } = require('../middleware/getValidations');

const {
  createApp,
  updateApp,
  deleteApp,
  getApps,
  getAppById,
} = require(`../controllers/${dbname}/app`);
const traceId = require('../middleware/traceId');

router.use(traceId);
// Create a new app
router.post('/', validateApp, createApp); // req call, middleware call, header tracid

// Update an app
router.patch('/:id', validateUpdateapp, updateApp);

// delete
router.patch('/delete/:id', deleteApp);

// Get
router.get('/', validateGetAppsFilter, getApps);

router.get('/:id', getAppById);

module.exports = router;
