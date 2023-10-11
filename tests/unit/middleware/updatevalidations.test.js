/* eslint-disable no-undef */
const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');
const {
  validateUpdateapp,
  validateUpdateevent,
  validateUpdatemessage,
  validateUpdatenotification,
  validateUpdatentype,
} = require('../../../middleware/updatevalidations'); // Replace with the actual path

describe('validateUpdateapp Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        name: 'Updated App',
        description: 'Updated description',
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
    validateUpdateapp(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return StatusCodes.NOT_FOUND for invalid input', () => {
    req.body.name = 'Shor'; // Violates the min length constraint
    const originalNext = next;
    next = jest.fn();

    validateUpdateapp(req, res, originalNext);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: '"name" length must be at least 5 characters long',
    });

    next = originalNext;
  });

  // Add more test cases for other scenarios and edge cases
});

describe('validateUpdateevent Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        name: 'Updated Event',
        description: 'Updated description',
      },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should pass validation for valid input', () => {
    validateUpdateevent(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return StatusCodes.NOT_FOUND for invalid input', () => {
    req.body.description =
      "The quick brown fox jumps over the lazy dog, showcasing its agility and speed in a timeless demonstration of nature's wonders CHECKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK."; // Exactly 255 characters
    const originalNext = next;
    next = jest.fn();

    validateUpdateevent(req, res, originalNext);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error:
        '"description" length must be less than or equal to 255 characters long',
    });

    next = originalNext;
  });

  // Add more test cases for other scenarios and edge cases
});
describe('validateUpdatemessage Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should pass validation for valid input', () => {
    req.body.sendto = 'example@example.com';
    req.body.messageSubject = 'Test Subject';
    req.body.messageBody = 'Test Body';

    validateUpdatemessage(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return StatusCodes.NOT_FOUND for invalid input', () => {
    req.body.messageSubject = 'Too';
    validateUpdatemessage(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: '"messageSubject" length must be at least 5 characters long',
    });
  });

  // Add more test cases for other scenarios and edge cases
});
describe('validateUpdatenotification Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should pass validation for valid input', () => {
    req.body.name = 'Updated Notification';
    req.body.isActive = true;

    validateUpdatenotification(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return StatusCodes.NOT_FOUND for invalid input', () => {
    req.body.isActive = 'invalid';
    validateUpdatenotification(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: '"isActive" must be a boolean',
    });
  });

  // Add more test cases for other scenarios and edge cases
});
describe('validateUpdatentype Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should pass validation for valid input', () => {
    req.body.name = 'Updated Type';
    req.body.description = 'Updated Description';
    req.body.templateSubject = 'Updated Subject';
    req.body.templateBody = 'Updated Body';
    req.body.tags = 'tag1, tag2';
    req.body.isDeleted = false;

    validateUpdatentype(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return StatusCodes.NOT_FOUND for invalid input', () => {
    req.body.name = 'Type';
    validateUpdatentype(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: '"name" length must be at least 5 characters long',
    });
  });

  // Add more test cases for other scenarios and edge cases
});
