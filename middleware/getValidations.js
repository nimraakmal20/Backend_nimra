/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable radix */
/* eslint-disable consistent-return */
const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');

function validateGetAppsFilter(req, res, next) {
  const { pagesize, pagenum, sortBy, sortOrder, ...filterParams } = req.query;

  // Define schema for pagesize, pagenum, and sortBy
  const querySchema = Joi.object({
    pagesize: Joi.number().integer().positive(),
    pagenum: Joi.number().integer().positive(),
    sortBy: Joi.string().valid('name', 'isActive'),
    sortOrder: Joi.number().valid(1, -1),
  });

  // Validate pagesize, pagenum, and sortBy using the schema
  const { error: queryError } = querySchema.validate({
    pagesize,
    pagenum,
    sortBy,
    sortOrder,
  });

  if (queryError) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: queryError.details[0].message });
  }

  // Define schema for filter parameters
  const filterSchema = Joi.object({
    name: Joi.string().min(5).max(255),
    description: Joi.string().min(5).max(255),
    isActive: Joi.boolean(),
    // Add other filter parameters here
  });

  // Iterate over filter parameters and validate each using the schema
  for (const filterKey in filterParams) {
    const filterValue = filterParams[filterKey];

    const filterData = {
      [filterKey]: filterValue,
    };

    const { error } = filterSchema.validate(filterData);

    if (error) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: error.details[0].message });
    }
  }
  next();
}

function validateGetEventsFilter(req, res, next) {
  const { pagesize, pagenum, sortBy, sortOrder, ...filterParams } = req.query;

  // Define schema for pagesize, pagenum, sortBy, and sortOrder
  const querySchema = Joi.object({
    pagesize: Joi.number().integer().positive(),
    pagenum: Joi.number().integer().positive(),
    sortBy: Joi.string().valid('name', 'description'),
    sortOrder: Joi.number().valid(1, -1),
  });

  // Validate pagesize, pagenum, sortBy, and sortOrder using the schema
  const { error: queryError } = querySchema.validate({
    pagesize,
    pagenum,
    sortBy,
    sortOrder,
  });

  if (queryError) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: queryError.details[0].message });
  }

  // Define schema for filter parameters
  const filterSchema = Joi.object({
    name: Joi.string().min(5).max(255),
    description: Joi.string().max(255),
    applicationId: Joi.string(),
    isActive: Joi.boolean(),
    isDeleted: Joi.boolean(),
    // Add other filter parameters here
  });

  // Iterate over filter parameters and validate each using the schema
  for (const filterKey in filterParams) {
    const filterValue = filterParams[filterKey];

    const filterData = {
      [filterKey]: filterValue,
    };

    const { error } = filterSchema.validate(filterData);

    if (error) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: error.details[0].message });
    }
  }

  next();
}

function validateGetMessagesFilter(req, res, next) {
  const { pagesize, pagenum, sortBy, sortOrder, ...filterParams } = req.query;

  // Define schema for pagesize, pagenum, sortBy, and sortOrder
  const querySchema = Joi.object({
    pagesize: Joi.number().integer().positive(),
    pagenum: Joi.number().integer().positive(),
    sortBy: Joi.string().valid(
      'sendto',
      'messageSubject',
      'applicationName',
      'eventName',
      'notificationtypeName',
    ),
    sortOrder: Joi.number().valid(1, -1),
  });

  // Validate pagesize, pagenum, sortBy, and sortOrder using the schema
  const { error: queryError } = querySchema.validate({
    pagesize,
    pagenum,
    sortBy,
  });

  if (queryError) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: queryError.details[0].message });
  }

  // Define schema for filter parameters
  const filterSchema = Joi.object({
    sendto: Joi.string().min(5).max(255),
    messageSubject: Joi.string().min(5).max(255),
    processed: Joi.bool(),
    messageBody: Joi.string().min(5).max(255),
    applicationId: Joi.string(), // Allow applicationId to be a string
    eventId: Joi.string(),
    ntypeId: Joi.string(),
    FromDate: Joi.date(),
    ToDate: Joi.date(),
    // Add other filter parameters here
  });

  // Iterate over filter parameters and validate each using the schema
  for (const filterKey in filterParams) {
    const filterValue = filterParams[filterKey];

    const filterData = {
      [filterKey]: filterValue,
    };

    const { error } = filterSchema.validate(filterData);

    if (error) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: error.details[0].message });
    }
  }

  next();
}

function validateGetNtypesFilter(req, res, next) {
  const { pagesize, pagenum, sortBy, sortOrder, ...filterParams } = req.query;

  // Define schema for pagesize, pagenum, sortBy, and sortOrder
  const querySchema = Joi.object({
    pagesize: Joi.number().integer().positive(),
    pagenum: Joi.number().integer().positive(),
    sortBy: Joi.string().valid('name', 'ntypestatus', 'description', 'eventId'),
    sortOrder: Joi.number().valid(1, -1),
  });

  // Validate pagesize, pagenum, sortBy, and sortOrder using the schema
  const { error: queryError } = querySchema.validate({
    pagesize,
    pagenum,
    sortBy,
    sortOrder,
  });

  if (queryError) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: queryError.details[0].message });
  }

  // Define schema for filter parameters
  const filterSchema = Joi.object({
    name: Joi.string().min(5).max(255),
    description: Joi.string().max(255),
    templateSubject: Joi.string().min(5).max(255),
    templateBody: Joi.string().min(5).max(255),
    isActive: Joi.boolean(),
    isDeleted: Joi.boolean(),
    eventId: Joi.string(),
    // Add other filter parameters here
  });

  // Iterate over filter parameters and validate each using the schema
  for (const filterKey in filterParams) {
    const filterValue = filterParams[filterKey];

    const filterData = {
      [filterKey]: filterValue,
    };

    const { error } = filterSchema.validate(filterData);

    if (error) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: error.details[0].message });
    }
  }

  next();
}

module.exports = {
  validateGetAppsFilter,
  validateGetEventsFilter,
  validateGetMessagesFilter,
  validateGetNtypesFilter,
};
