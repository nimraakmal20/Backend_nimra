const Joi = require('joi');
const mongoose = require('mongoose');

const stubSchema = new mongoose.Schema({
  stubsArr: [String], // Adding an array of strings
  ntypeId: {
    type: String,
    required: true,
  },
});

const Stub = mongoose.model('Stub', stubSchema);

function validateStub(stub) {
  const schema = Joi.object({
    stubsArr: Joi.array().items(Joi.string()), // Validating array of strings
  });

  return schema.validate(stub);
}

exports.Stub = Stub;
exports.validate = validateStub;
