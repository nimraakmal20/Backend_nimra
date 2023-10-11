const request = require('supertest');
const express = require('express');
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const {
  validateGetAppsFilter,
  validateGetEventsFilter,
  validateGetMessagesFilter,
  validateGetNotificationsFilter,
  validateGetNtypesFilter,
} = require('../../../middleware/getValidations');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn();
  next();
});
describe('validateGetAppsFilter', () => {
  test('Valid filter parameters should pass validation', () => {
    const validQuery = {
      pagesize: '10',
      pagenum: '1',
      sortBy: 'name',
      name: 'Valid App',
      description: 'This is a valid app.',
      isActive: 'true',
    };
    const req = { query: validQuery };
    const res = {};
    const next = jest.fn();
    validateGetAppsFilter(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('Invalid pagesize parameter should return StatusCodes.NOT_FOUND Bad Request', () => {
    const invalidQuery = {
      pagesize: '0',
      pagenum: '1',
      sortBy: 'name',
      name: 'Valid App',
      description: 'This is a valid app.',
      isActive: 'true',
    };
    const req = { query: invalidQuery };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validateGetAppsFilter(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid pagesize' });
    expect(next).not.toHaveBeenCalled();
  });

  test('Invalid sortBy parameter should return StatusCodes.NOT_FOUND Bad Request', () => {
    const invalidQuery = {
      pagesize: '10',
      pagenum: '1',
      sortBy: 'invalid',
      name: 'Valid App',
      description: 'This is a valid app.',
      isActive: 'true',
    };
    const req = { query: invalidQuery };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validateGetAppsFilter(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid sortBy parameter',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('Invalid name filter parameter should return StatusCodes.NOT_FOUND Bad Request', () => {
    const invalidQuery = {
      pagesize: '10',
      pagenum: '1',
      sortBy: 'name',
      name: 'Two',
      description: 'This app has a short name.',
      isActive: 'true',
    };
    const req = { query: invalidQuery };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validateGetAppsFilter(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });

  // Add more test cases for other filter parameters and scenarios as needed
});
describe('validateGetEventsFilter', () => {
  test('Valid filter parameters should pass validation', () => {
    const validQuery = {
      pagesize: '10',
      pagenum: '1',
      sortBy: 'name',
      name: 'Valid Event',
      description: 'This is a valid event.',
    };
    const req = { query: validQuery };
    const res = {};
    const next = jest.fn();
    validateGetEventsFilter(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('Invalid pagesize parameter should return StatusCodes.NOT_FOUND Bad Request', () => {
    const invalidQuery = {
      pagesize: '0',
      pagenum: '1',
      sortBy: 'name',
      name: 'Valid Event',
      description: 'This is a valid event.',
    };
    const req = { query: invalidQuery };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validateGetEventsFilter(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid pagesize' });
    expect(next).not.toHaveBeenCalled();
  });

  test('Invalid sortBy parameter should return StatusCodes.NOT_FOUND Bad Request', () => {
    const invalidQuery = {
      pagesize: '10',
      pagenum: '1',
      sortBy: 'invalid',
      name: 'Valid Event',
      description: 'This is a valid event.',
    };
    const req = { query: invalidQuery };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validateGetEventsFilter(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid sortBy parameter',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('Invalid name filter parameter should return StatusCodes.NOT_FOUND Bad Request', () => {
    const invalidQuery = {
      pagesize: '10',
      pagenum: '1',
      sortBy: 'name',
      name: 'Two',
      description: 'This event has a short name.',
    };
    const req = { query: invalidQuery };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validateGetEventsFilter(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });

  // Add more test cases for other filter parameters and scenarios as needed
});
describe('validateGetMessagesFilter', () => {
  test('Invalid pagesize should return StatusCodes.NOT_FOUND Bad Request', () => {
    const req = {
      query: {
        pagesize: 'invalid',
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validateGetMessagesFilter(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid pagesize' });
    expect(next).not.toHaveBeenCalled();
  });

  test('Invalid pagenum should return StatusCodes.NOT_FOUND Bad Request', () => {
    const req = {
      query: {
        pagenum: 'invalid',
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validateGetMessagesFilter(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid pagenum' });
    expect(next).not.toHaveBeenCalled();
  });

  test('Invalid sortBy parameter should return StatusCodes.NOT_FOUND Bad Request', () => {
    const req = {
      query: {
        sortBy: 'invalid',
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validateGetMessagesFilter(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid sortBy parameter',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('Invalid filter parameter should return StatusCodes.NOT_FOUND Bad Request', () => {
    const req = {
      query: {
        sendto: 'Two', // Should be at least 5 characters long
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validateGetMessagesFilter(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });

  test('Valid filter parameters should call next', () => {
    const req = {
      query: {
        sendto: 'ValidRecipient',
        messageSubject: 'ValidSubject',
      },
    };
    const res = {};
    const next = jest.fn();
    validateGetMessagesFilter(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
describe('validateGetNotificationsFilter', () => {
  test('Valid filter parameters should pass validation', () => {
    const validQuery = {
      pagesize: '10',
      pagenum: '1',
      sortBy: 'name',
      name: 'Valid Notification',
      isActive: 'true',
    };
    const req = { query: validQuery };
    const res = {};
    const next = jest.fn();
    validateGetNotificationsFilter(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('Invalid pagesize parameter should return StatusCodes.NOT_FOUND Bad Request', () => {
    const invalidQuery = {
      pagesize: '0',
      pagenum: '1',
      sortBy: 'name',
      name: 'Valid Notification',
      isActive: 'true',
    };
    const req = { query: invalidQuery };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validateGetNotificationsFilter(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid pagesize' });
    expect(next).not.toHaveBeenCalled();
  });

  test('Invalid sortBy parameter should return StatusCodes.NOT_FOUND Bad Request', () => {
    const invalidQuery = {
      pagesize: '10',
      pagenum: '1',
      sortBy: 'invalid',
      name: 'Valid Notification',
      isActive: 'true',
    };
    const req = { query: invalidQuery };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validateGetNotificationsFilter(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid sortBy parameter',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('Invalid name filter parameter should return StatusCodes.NOT_FOUND Bad Request', () => {
    const invalidQuery = {
      pagesize: '10',
      pagenum: '1',
      sortBy: 'name',
      name: 'Two',
      isActive: 'true',
    };
    const req = { query: invalidQuery };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validateGetNotificationsFilter(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });

  // Add more test cases for other filter parameters and scenarios as needed
});
describe('validateGetNtypesFilter', () => {
  test('Invalid pagesize should return StatusCodes.NOT_FOUND Bad Request', () => {
    const req = {
      query: {
        pagesize: 'invalid',
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validateGetNtypesFilter(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid pagesize' });
    expect(next).not.toHaveBeenCalled();
  });

  test('Invalid pagenum should return StatusCodes.NOT_FOUND Bad Request', () => {
    const req = {
      query: {
        pagenum: 'invalid',
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validateGetNtypesFilter(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid pagenum' });
    expect(next).not.toHaveBeenCalled();
  });

  test('Invalid sortBy parameter should return StatusCodes.NOT_FOUND Bad Request', () => {
    const req = {
      query: {
        sortBy: 'invalid',
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validateGetNtypesFilter(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid sortBy parameter',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('Invalid filter parameter should return StatusCodes.NOT_FOUND Bad Request', () => {
    const req = {
      query: {
        name: 'Two', // Should be at least 5 characters long
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    validateGetNtypesFilter(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });

  test('Valid filter parameters should call next', () => {
    const req = {
      query: {
        name: 'ValidNType',
        description: 'ValidDescription',
        templateSubject: 'ValidSubject',
      },
    };
    const res = {};
    const next = jest.fn();
    validateGetNtypesFilter(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
