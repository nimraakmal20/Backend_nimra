/* eslint-disable consistent-return */
const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');

function validateApp(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    description: Joi.string().min(5).max(255).required(),
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
function validateevent(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    description: Joi.string().max(255).required(),
    applicationId: Joi.required(),
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
function validatentype(req, res, next) {
  const schema = Joi.object({
    eventId: Joi.required(),
    name: Joi.string().min(5).max(255).required(),
    description: Joi.string().max(255).required(),
    templateSubject: Joi.string().min(5).max(255).required(),
    templateBody: Joi.string().min(5).max(255).required(),
    tags: Joi.string(),
    isDeleted: Joi.boolean(),
    isActive: Joi.boolean(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: error.details[0].message });
  }
  next();
}
function validatemessage(req, res, next) {
  const schema = Joi.object({
    ntypeId: Joi.required(),
    stubId: Joi.required(),
    sendto: Joi.string().min(5).max(255),
    messageSubject: Joi.string().min(5).max(255).required(),
    messageBody: Joi.string()
      .min(5)
      .max(StatusCodes.INTERNAL_SERVER_ERROR)
      .required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: error.details[0].message });
  }
  next();
}
function validateStub(req, res, next) {
  const schema = Joi.object({
    stubsArr: Joi.array().items(Joi.string()), // Validating array of strings
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
  validateApp,
  validateevent,
  validatentype,
  validatemessage,
  validateStub,
};
