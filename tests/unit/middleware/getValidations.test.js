/* eslint-disable no-undef */
const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');
const {
  validateGetAppsFilter,
  validateGetEventsFilter,
  validateGetMessagesFilter,
  validateGetNotificationsFilter,
  validateGetNtypesFilter,
} = require('../../../middleware/getValidations'); // Adjust the path as needed

describe('validateGetAppsFilter Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      query: {},
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should pass validation for valid input', () => {
    req.query.pagesize = '10';
    req.query.pagenum = '1';
    req.query.sortBy = 'name';
    req.query.name = 'Test App';
    req.query.isActive = 'true';

    validateGetAppsFilter(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return StatusCodes.NOT_FOUND for invalid pagesize', () => {
    req.query.pagesize = 'invalid';
    validateGetAppsFilter(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid pagesize',
    });
  });

  it('should return StatusCodes.NOT_FOUND for invalid sortBy parameter', () => {
    req.query.sortBy = 'invalid';
    validateGetAppsFilter(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid sortBy parameter',
    });
  });

  // Add more test cases for other scenarios and edge cases
});

describe('validateGetEventsFilter Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      query: {},
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should pass validation for valid input', () => {
    req.query.pagesize = '10';
    req.query.pagenum = '1';
    req.query.sortBy = 'name';
    req.query.name = 'Test Event';
    req.query.description = 'Test Description';

    validateGetEventsFilter(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return StatusCodes.NOT_FOUND for invalid pagesize', () => {
    req.query.pagesize = 'invalid';
    validateGetEventsFilter(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid pagesize',
    });
  });

  it('should return StatusCodes.NOT_FOUND for invalid sortBy parameter', () => {
    req.query.sortBy = 'invalid';
    validateGetEventsFilter(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid sortBy parameter',
    });
  });

  // Add more test cases for other scenarios and edge cases
});

describe('validateGetMessagesFilter Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      query: {},
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should pass validation for valid input', () => {
    req.query.pagesize = '10';
    req.query.pagenum = '1';
    req.query.sortBy = 'sendto';
    req.query.sendto = 'example@example.com';
    req.query.messageSubject = 'Test Subject';

    validateGetMessagesFilter(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return StatusCodes.NOT_FOUND for invalid pagesize', () => {
    req.query.pagesize = 'invalid';
    validateGetMessagesFilter(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid pagesize',
    });
  });

  it('should return StatusCodes.NOT_FOUND for invalid sortBy parameter', () => {
    req.query.sortBy = 'invalid';
    validateGetMessagesFilter(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid sortBy parameter',
    });
  });

  // Add more test cases for other scenarios and edge cases
});
describe('validateGetNotificationsFilter Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      query: {},
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should pass validation for valid input', () => {
    req.query.pagesize = '10';
    req.query.pagenum = '1';
    req.query.sortBy = 'name';
    req.query.name = 'Notification Name';
    req.query.isActive = 'true';

    validateGetNotificationsFilter(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return StatusCodes.NOT_FOUND for invalid pagesize', () => {
    req.query.pagesize = '-1';

    validateGetNotificationsFilter(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid pagesize',
    });
  });

  it('should return StatusCodes.NOT_FOUND for invalid sortBy parameter', () => {
    req.query.sortBy = 'invalidSortBy';

    validateGetNotificationsFilter(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid sortBy parameter',
    });
  });

  // Add more test cases for other scenarios and edge cases
});
describe('validateGetNtypesFilter Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      query: {},
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should pass validation for valid input', () => {
    req.query.pagesize = '10';
    req.query.pagenum = '1';
    req.query.sortBy = 'name';
    req.query.name = 'Ntype Name';
    req.query.description = 'Ntype Description';
    req.query.templateSubject = 'Ntype Subject';

    validateGetNtypesFilter(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return StatusCodes.NOT_FOUND for invalid pagenum', () => {
    req.query.pagenum = '0';

    validateGetNtypesFilter(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid pagenum',
    });
  });

  it('should return StatusCodes.NOT_FOUND for invalid sortBy parameter', () => {
    req.query.sortBy = 'invalidSortBy';

    validateGetNtypesFilter(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid sortBy parameter',
    });
  });

  // Add more test cases for other scenarios and edge cases
});
