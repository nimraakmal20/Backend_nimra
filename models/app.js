const Joi = require('joi');
const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    required: true,
  },
});

const App = mongoose.model('App', appSchema);

function validateApp(app) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    description: Joi.string().min(5).max(255).required(),
    isActive: Joi.boolean().required(),
    isDeleted: Joi.boolean().required(),
  });

  return schema.validate(app);
}
function validateUpdateapp(app) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255),
    description: Joi.string().min(5).max(255),
    isActive: Joi.boolean(),
    isDeleted: Joi.boolean(),
  });

  return schema.validate(app);
}
exports.App = App;
exports.validate = validateApp;
exports.validateUpdateapp = validateUpdateapp;
