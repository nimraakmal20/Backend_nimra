/* eslint-disable import/no-dynamic-require */
const express = require('express');

const router = express.Router();
const { DB_TYPE } = process.env;

const dbname = DB_TYPE;
const { validatentype } = require('../middleware/validations');
const { validateUpdatentype } = require('../middleware/updatevalidations');
const { validateGetNtypesFilter } = require('../middleware/getValidations');

const {
  createNtype,
  updateNtype,
  deleteNtype,
  getNtypes,
  getNtypeById,
} = require(`../controllers/${dbname}/notiftypes`);
const traceId = require('../middleware/traceId');

router.use(traceId);
// Create a new notification type
// change
router.post('/', validatentype, createNtype);

// Update a notification type
router.patch('/:id', validateUpdatentype, updateNtype);

// get notification types
router.get('/', validateGetNtypesFilter, getNtypes);

router.patch('/delete/:id', deleteNtype);

router.get('/:id', getNtypeById);

module.exports = router;
