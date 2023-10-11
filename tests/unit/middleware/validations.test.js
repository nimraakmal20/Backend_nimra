/* eslint-disable no-undef */
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

describe('validateApp Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        name: 'Test App',
        description: 'Testing the app',
        isActive: true,
      },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should pass validation for valid input', () => {
    validateApp(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return StatusCodes.NOT_FOUND for missing required fields', () => {
    delete req.body.name;
    validateApp(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: '"name" is required',
    });
  });
  it('should return StatusCodes.NOT_FOUND for invalid input', () => {
    req.body.name = 123; // Assign a non-string value to the name field
    const originalNext = next;
    next = jest.fn();

    validateApp(req, res, originalNext);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);

    next = originalNext;
  });
});

describe('validateEvent Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        name: 'Test Event',
        description: 'Testing the event',
      },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should pass validation for valid input', () => {
    validateevent(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return StatusCodes.NOT_FOUND for missing required fields', () => {
    delete req.body.name;
    validateevent(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
  });

  it('should return StatusCodes.NOT_FOUND for invalid input', () => {
    req.body.description = ''; // An empty string violates the max length constraint
    const originalNext = next;
    next = jest.fn();

    validateevent(req, res, originalNext);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);

    next = originalNext;
  });

  // Add more test cases for edge cases and scenarios
});
describe('validatenotification Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        name: 'Test Notification',
        description: 'Testing the notification',
        isActive: true,
      },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should pass validation for valid input', () => {
    validatenotification(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return StatusCodes.NOT_FOUND for missing required fields', () => {
    delete req.body.name;
    validatenotification(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: '"name" is required',
    });
  });

  it('should return StatusCodes.NOT_FOUND for invalid input', () => {
    req.body.isActive = 'invalid'; // Non-boolean value for isActive
    const originalNext = next;
    next = jest.fn();

    validatenotification(req, res, originalNext);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: '"isActive" must be a boolean',
    });

    next = originalNext;
  });

  // Add more test cases for edge cases and scenarios
});
describe('validatentype Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        name: 'Test Type',
        description: 'Testing the type',
        templateSubject: 'Test Subject',
        templateBody: 'Test Body',
      },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should pass validation for valid input', () => {
    validatentype(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return StatusCodes.NOT_FOUND for missing required fields', () => {
    delete req.body.name;
    validatentype(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: '"name" is required',
    });
  });

  it('should return StatusCodes.NOT_FOUND for invalid input', () => {
    req.body.templateSubject = ''; // An empty string violates the min length constraint
    const originalNext = next;
    next = jest.fn();

    validatentype(req, res, originalNext);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: '"templateSubject" is not allowed to be empty',
    });

    next = originalNext;
  });

  // Add more test cases for edge cases and scenarios
});
describe('validatemessage Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        sendto: 'test@example.com',
        messageSubject: 'Test Subject',
        messageBody: 'Test Body',
      },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should pass validation for valid input', () => {
    validatemessage(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return StatusCodes.NOT_FOUND for missing required fields', () => {
    delete req.body.messageSubject;
    validatemessage(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: '"messageSubject" is required',
    });
  });

  it('should return StatusCodes.NOT_FOUND for invalid input', () => {
    req.body.messageBody = 'Shor'; // Violates the min length constraint
    const originalNext = next;
    next = jest.fn();

    validatemessage(req, res, originalNext);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: '"messageBody" length must be at least 5 characters long',
    });

    next = originalNext;
  });

  // Add more test cases for edge cases and scenarios
});
describe('validateStub Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        stubsArr: ['stub1', 'stub2'],
      },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should pass validation for valid input', () => {
    validateStub(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return StatusCodes.NOT_FOUND for invalid input', () => {
    req.body.stubsArr = ['stub1', 123]; // Array with non-string value
    const originalNext = next;
    next = jest.fn();

    validateStub(req, res, originalNext);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: '"stubsArr[1]" must be a string',
    });

    next = originalNext;
  });

  // Add more test cases for edge cases and scenarios
});
