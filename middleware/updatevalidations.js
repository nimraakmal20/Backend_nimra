/* eslint-disable consistent-return */
const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');

function validateUpdateapp(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255),
    description: Joi.string().min(5).max(255),
    isActive: Joi.boolean(),
    isDeleted: Joi.boolean(),
  });
  // all fields optional, atleast one required
  const { error } = schema.validate(req.body);

  if (error) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: error.details[0].message });
  }

  next();
}
function validateUpdateevent(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255),
    description: Joi.string().max(255),
    isActive: Joi.boolean(),
    isDeleted: Joi.boolean(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: error.details[0].message });
  }

  next();
}
function validateUpdatemessage(req, res, next) {
  const schema = Joi.object({
    sendto: Joi.string().min(5).max(255),
    messageSubject: Joi.string().min(5).max(255),
    messageBody: Joi.string().min(5).max(StatusCodes.INTERNAL_SERVER_ERROR),
  });
  const { error } = schema.validate(req.body);

  if (error) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: error.details[0].message });
  }
  next();
}
function validateUpdatentype(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255),
    description: Joi.string().max(255),
    templateSubject: Joi.string().min(5).max(255),
    templateBody: Joi.string().min(5).max(255),
    tags: Joi.string(),
    isDeleted: Joi.boolean(),
    isActive: Joi.bool(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: error.details[0].message });
  }
  next();
}

module.exports = {
  validateUpdateapp,
  validateUpdateevent,
  validateUpdatemessage,
  validateUpdatentype,
};
