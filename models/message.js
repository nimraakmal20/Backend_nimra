const Joi = require('joi');
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sendto: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  messageSubject: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  messageBody: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 500,
  },
});

const Message = mongoose.model('Message', messageSchema);

function validatemessage(message) {
  const schema = Joi.object({
    sendto: Joi.string().min(5).max(255),
    messageSubject: Joi.string().min(5).max(255).required(),
    messageBody: Joi.string().min(5).max(500).required(),
  });

  return schema.validate(message);
}

function validateUpdatemessage(message) {
  const schema = Joi.object({
    sendto: Joi.string().min(5).max(255),
    messageSubject: Joi.string().min(5).max(255),
    messageBody: Joi.string().min(5).max(500),
  });

  return schema.validate(message);
}

exports.Message = Message;
exports.validate = validatemessage;
exports.validateUpdatemessage = validateUpdatemessage;
