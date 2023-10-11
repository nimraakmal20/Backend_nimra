const Joi = require('joi');
const mongoose = require('mongoose');
const { App } = require('./app');
const { Event } = require('./event');
const { Ntype } = require('./notiftype');

const messageSchema = new mongoose.Schema({
  ntypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Ntype,
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Event,
    required: true,
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: App,
    required: true,
  },
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
  processed: {
    type: Boolean,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Message = mongoose.model('Message', messageSchema);

exports.Message = Message;
