const Joi = require('joi');
const mongoose = require('mongoose');

const ntypeSchema = new mongoose.Schema({
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
  templateSubject: {
    type: String,
    required: true,
    maxlength: 255,
  },
  templateBody: {
    type: String,
    required: true,
    maxlength: 255,
  },
  eventId: {
    type: String,
    required: true,
  },
  tags: [String],
  isDeleted: {
    type: Boolean,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
});

const Ntype = mongoose.model('ntype', ntypeSchema);

exports.Ntype = Ntype;
