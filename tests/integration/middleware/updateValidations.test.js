const request = require('supertest');
const express = require('express');
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const {
  validateUpdateapp,
  validateUpdateevent,
  validateUpdatemessage,
  validateUpdatenotification,
  validateUpdatentype,
} = require('../../../middleware/updatevalidations');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn();
  next();
});
describe('validateUpdateapp', () => {
  test('Valid request body should pass validation', () => {
    const validRequestBody = {
      name: 'Updated App',
      description: 'This is an updated app.',
      isActive: true,
    };
    const req = { body: validRequestBody };
    const res = {};
    const next = jest.fn();
    validateUpdateapp(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('Invalid request body with short name should return StatusCodes.NOT_FOUND Bad Request', () => {
    const invalidRequestBody = {
      name: 'Two',
      description: 'This app has a short name.',
      isActive: true,
    };
    const req = { body: invalidRequestBody };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validateUpdateapp(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });

  test('Request body with missing isActive should pass validation', () => {
    const validRequestBody = {
      name: 'Updated App',
      description: 'This is an updated app.',
    };
    const req = { body: validRequestBody };
    const res = {};
    const next = jest.fn();
    validateUpdateapp(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  // Add more test cases for other fields and scenarios as needed
});
describe('validateUpdateevent', () => {
  test('Valid request body should pass validation', () => {
    const validRequestBody = {
      name: 'Updated Event',
      description: 'This is an updated event.',
    };
    const req = { body: validRequestBody };
    const res = {};
    const next = jest.fn();
    validateUpdateevent(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('Invalid request body with short name should return StatusCodes.NOT_FOUND Bad Request', () => {
    const invalidRequestBody = {
      name: 'Two',
      description: 'This event has a short name.',
    };
    const req = { body: invalidRequestBody };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validateUpdateevent(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });

  test('Request body with missing description should pass validation', () => {
    const validRequestBody = {
      name: 'Updated Event',
    };
    const req = { body: validRequestBody };
    const res = {};
    const next = jest.fn();
    validateUpdateevent(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  // Add more test cases for other fields and scenarios as needed
});
describe('validateUpdatemessage', () => {
  test('Valid request body should pass validation', () => {
    const validRequestBody = {
      sendto: 'user@example.com',
      messageSubject: 'Updated Message Subject',
      messageBody: 'This is an updated message body.',
    };
    const req = { body: validRequestBody };
    const res = {};
    const next = jest.fn();
    validateUpdatemessage(req, res, next);
    expect(next).toHaveBeenCalled();
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
    validateUpdatemessage(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });

  test('Request body with missing messageSubject should pass validation', () => {
    const validRequestBody = {
      sendto: 'user@example.com',
      messageBody: 'This is an updated message body.',
    };
    const req = { body: validRequestBody };
    const res = {};
    const next = jest.fn();
    validateUpdatemessage(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  // Add more test cases for other fields and scenarios as needed
});
describe('validateUpdatenotification', () => {
  test('Valid request body should pass validation', () => {
    const validRequestBody = {
      name: 'Updated Notification',
      description: 'This is an updated notification.',
      isActive: true,
    };
    const req = { body: validRequestBody };
    const res = {};
    const next = jest.fn();
    validateUpdatenotification(req, res, next);
    expect(next).toHaveBeenCalled();
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
    validateUpdatenotification(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });

  test('Request body with missing isActive should pass validation', () => {
    const validRequestBody = {
      name: 'Updated Notification',
      description: 'This is an updated notification.',
    };
    const req = { body: validRequestBody };
    const res = {};
    const next = jest.fn();
    validateUpdatenotification(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  // Add more test cases for other fields and scenarios as needed
});
describe('validateUpdatentype', () => {
  test('Valid request body should pass validation', () => {
    const validRequestBody = {
      name: 'Updated Type',
      description: 'This is an updated type.',
      templateSubject: 'Updated Template Subject',
      templateBody: 'This is an updated template body.',
      tags: 'tag1,tag2',
    };
    const req = { body: validRequestBody };
    const res = {};
    const next = jest.fn();
    validateUpdatentype(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('Invalid request body with short name should return StatusCodes.NOT_FOUND Bad Request', () => {
    const invalidRequestBody = {
      name: 'Two',
      description: 'This type has a short name.',
      templateSubject: 'Updated Template Subject',
      templateBody: 'This is an updated template body.',
      tags: 'tag1,tag2',
    };
    const req = { body: invalidRequestBody };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validateUpdatentype(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });

  test('Request body with missing templateSubject should pass validation', () => {
    const validRequestBody = {
      name: 'Updated Type',
      description: 'This is an updated type.',
      templateBody: 'This is an updated template body.',
      tags: 'tag1,tag2',
    };
    const req = { body: validRequestBody };
    const res = {};
    const next = jest.fn();
    validateUpdatentype(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  // Add more test cases for other fields and scenarios as needed
});
