const request = require('supertest');
const express = require('express');
const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');
const {
  validateApp,
  validateevent,
  validatenotification,
  validatentype,
  validatemessage,
  validateStub,
} = require('../../../middleware/validations');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn();
  next();
});

describe('validateApp', () => {
  test('should pass validation with valid query parameters', async () => {
    const response = await request(app)
      .get('/test')
      .query({ name: 'TestApp', description: 'Description', isActive: true });
    expect(response.status).toBe(404);
  });
  test('Valid request body should pass validation', () => {
    const validRequestBody = {
      name: 'Valid App',
      description: 'This is a valid app.',
      isActive: true,
    };
    const req = { body: validRequestBody };
    const res = {};
    const next = jest.fn();
    validateApp(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  test('Invalid request body should return StatusCodes.NOT_FOUND Bad Request', () => {
    const invalidRequestBody = {};
    const req = { body: invalidRequestBody };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validateApp(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });
});
describe('validateevent', () => {
  test('Valid request body should pass validation', () => {
    const validRequestBody = {
      name: 'Valid Event',
      description: 'This is a valid event.',
      isDeleted: false,
    };
    const req = { body: validRequestBody };
    const res = {};
    const next = jest.fn();
    validateevent(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('Invalid request body should return StatusCodes.NOT_FOUND Bad Request', () => {
    const invalidRequestBody = {};
    const req = { body: invalidRequestBody };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validateevent(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });

  test('Request body with missing required fields should return StatusCodes.NOT_FOUND Bad Request', () => {
    const invalidRequestBody = {
      description: 'This is an invalid event without a name.',
      isDeleted: true,
    };
    const req = { body: invalidRequestBody };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validateevent(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });

  test('Request body with name length less than 5 characters should return StatusCodes.NOT_FOUND Bad Request', () => {
    const invalidRequestBody = {
      name: 'Two',
      description: 'This event has a short name.',
      isDeleted: false,
    };
    const req = { body: invalidRequestBody };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validateevent(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });

  test('Request body with description length exceeding 255 characters should return StatusCodes.NOT_FOUND Bad Request', () => {
    const longDescription = 'a'.repeat(256);
    const invalidRequestBody = {
      name: 'Event with Long Description',
      description: longDescription,
      isDeleted: false,
    };
    const req = { body: invalidRequestBody };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validateevent(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });
});
describe('validatenotification', () => {
  test('Valid request body should pass validation', () => {
    const validRequestBody = {
      name: 'Valid Notification',
      description: 'This is a valid notification.',
      isActive: true,
    };
    const req = { body: validRequestBody };
    const res = {};
    const next = jest.fn();
    validatenotification(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('Invalid request body with missing required fields should return StatusCodes.NOT_FOUND Bad Request', () => {
    const invalidRequestBody = {
      description: 'This is an invalid notification without a name.',
      isActive: true,
    };
    const req = { body: invalidRequestBody };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validatenotification(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });

  test('Invalid request body with short name should return StatusCodes.NOT_FOUND Bad Request', () => {
    const invalidRequestBody = {
      name: 'Two',
      description: 'This notification has a short name.',
      isActive: true,
    };
    const req = { body: invalidRequestBody };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validatenotification(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });

  test('Invalid request body with missing isActive should return StatusCodes.NOT_FOUND Bad Request', () => {
    const invalidRequestBody = {
      name: 'Invalid Notification',
      description: 'This notification is missing isActive.',
    };
    const req = { body: invalidRequestBody };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validatenotification(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });

  test('Request body with description length exceeding 255 characters should return StatusCodes.NOT_FOUND Bad Request', () => {
    const longDescription = 'a'.repeat(256);
    const invalidRequestBody = {
      name: 'Notification with Long Description',
      description: longDescription,
      isActive: true,
    };
    const req = { body: invalidRequestBody };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validatenotification(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });
});
describe('validatentype', () => {
  test('Valid request body should pass validation', () => {
    const validRequestBody = {
      name: 'Valid Type',
      description: 'This is a valid type.',
      templateSubject: 'Template Subject',
      templateBody: 'Template Body',
      tags: 'tag1,tag2',
    };
    const req = { body: validRequestBody };
    const res = {};
    const next = jest.fn();
    validatentype(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('Invalid request body with missing required fields should return StatusCodes.NOT_FOUND Bad Request', () => {
    const invalidRequestBody = {
      description: 'This is an invalid type without a name.',
      templateSubject: 'Template Subject',
      templateBody: 'Template Body',
    };
    const req = { body: invalidRequestBody };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validatentype(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });

  test('Invalid request body with short name should return StatusCodes.NOT_FOUND Bad Request', () => {
    const invalidRequestBody = {
      name: 'Two',
      description: 'This type has a short name.',
      templateSubject: 'Template Subject',
      templateBody: 'Template Body',
    };
    const req = { body: invalidRequestBody };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validatentype(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });

  test('Request body with missing templateSubject should return StatusCodes.NOT_FOUND Bad Request', () => {
    const invalidRequestBody = {
      name: 'Invalid Type',
      description: 'This type is missing templateSubject.',
      templateBody: 'Template Body',
    };
    const req = { body: invalidRequestBody };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validatentype(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });

  // Add more test cases for other fields as needed
});
describe('validatemessage', () => {
  test('Valid request body should pass validation', () => {
    const validRequestBody = {
      sendto: 'user@example.com',
      messageSubject: 'Valid Message Subject',
      messageBody: 'This is a valid message body.',
    };
    const req = { body: validRequestBody };
    const res = {};
    const next = jest.fn();
    validatemessage(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('Invalid request body with missing required fields should return StatusCodes.NOT_FOUND Bad Request', () => {
    const invalidRequestBody = {
      sendto: 'user@example.com',
    };
    const req = { body: invalidRequestBody };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validatemessage(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });

  test('Invalid request body with short name should return StatusCodes.NOT_FOUND Bad Request', () => {
    const invalidRequestBody = {
      sendto: 'user@example.com',
      messageSubject: 'Two',
      messageBody: 'This message has a short subject.',
    };
    const req = { body: invalidRequestBody };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validatemessage(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });

  test('Request body with missing sendto should pass validation', () => {
    const validRequestBody = {
      messageSubject: 'Valid Message Subject',
      messageBody: 'This is a valid message body.',
    };
    const req = { body: validRequestBody };
    const res = {};
    const next = jest.fn();
    validatemessage(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('Request body with messageBody length exceeding StatusCodes.INTERNAL_SERVER_ERROR characters should return StatusCodes.NOT_FOUND Bad Request', () => {
    const longMessageBody = 'a'.repeat(501);
    const invalidRequestBody = {
      sendto: 'user@example.com',
      messageSubject: 'Message with Long Body',
      messageBody: longMessageBody,
    };
    const req = { body: invalidRequestBody };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validatemessage(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });
});
describe('validateStub', () => {
  test('Valid request body should pass validation', () => {
    const validRequestBody = {
      stubsArr: ['stub1', 'stub2', 'stub3'],
    };
    const req = { body: validRequestBody };
    const res = {};
    const next = jest.fn();
    validateStub(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('Invalid request body with non-array value should return StatusCodes.NOT_FOUND Bad Request', () => {
    const invalidRequestBody = {
      stubsArr: 'not an array',
    };
    const req = { body: invalidRequestBody };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validateStub(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });

  test('Invalid request body with empty array should pass validation', () => {
    const invalidRequestBody = {
      stubsArr: [],
    };
    const req = { body: invalidRequestBody };
    const res = {};
    const next = jest.fn();
    validateStub(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  // Add more test cases for other scenarios as needed
});
