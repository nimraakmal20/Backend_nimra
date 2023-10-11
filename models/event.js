const Joi = require('joi');
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  description: {
    type: String,
    required: true,
    maxlength: 255,
  },
  applicationId: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    required: true,
  },
  // created at, when created
});
const Event = mongoose.model('event', eventSchema);

function validateevent(event) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    description: Joi.string().max(255).required(),
    isActive: Joi.boolean().required(),
    isDeleted: Joi.boolean().required(),
  });

  return schema.validate(event);
}
function validateUpdateevent(event) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255),
    description: Joi.string().max(255),
    isActive: Joi.boolean(),
    isDeleted: Joi.boolean(),
  });

  return schema.validate(event);
}
exports.Event = Event;
exports.validate = validateevent;
exports.validateUpdateevent = validateUpdateevent;
