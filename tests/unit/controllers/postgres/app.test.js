/* eslint-disable no-undef */
const httpMocks = require('node-mocks-http');
const { StatusCodes } = require('http-status-codes');
const appController = require('../../../../controllers/postgres/app'); // Update the path
// Mock the dependencies
const knex = require('../../../../startup/db/postgresDb/postgresDb');

jest.mock('../../../../startup/db/postgresDb/postgresDb');

describe('createApp', () => {
  it('should return StatusCodes.CONFLICT if app with same name already exists', async () => {
    // Set up your test data and mock responses
    const req = {
      body: {
        name: 'Helooo App',
        description: 'New Description',
        isActive: true,
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    const existingApp = {
      /* Existing app data here */
    };

    // Mock the behavior of the 'where' function
    knex.mockReturnValue({
      where: jest.fn().mockReturnValue({
        first: jest.fn().mockReturnValue(existingApp),
      }),
    });

    // Call the method
    await appController.createApp(req, res);
    // Verify the interactions
    expect(res.status).toHaveBeenCalledWith(StatusCodes.CONFLICT);
  });

  it('should create a new app if no app with the same name exists', async () => {
    // Set up your test data and mock responses
    const req = {
      body: {
        name: 'New App',
        description: 'New Description',
        isActive: true,
        isDeleted: false,
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mock the behavior of the 'where' and 'insert' functions
    knex.mockReturnValue({
      where: jest.fn().mockReturnValue({
        first: jest.fn().mockReturnValue(undefined),
      }),
      insert: jest.fn().mockReturnValue({
        returning: jest.fn().mockReturnValue(1),
      }),
    });

    // Call the method
    await appController.createApp(req, res);

    // Verify the interactions
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
  });

  // ... other test cases
});
describe('updateApp', () => {
  it('should return 404 if app with specified ID is not found', async () => {
    // Set up your test data and mock responses
    const req = {
      params: { id: 'nonExistentId' },
      body: {
        name: 'Updated App',
        description: 'Updated Description',
        isActive: true,
        isDeleted: false,
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mock the behavior of the 'where' function
    knex.mockReturnValue({
      where: jest.fn().mockReturnValue({
        first: jest.fn().mockReturnValue(undefined),
      }),
    });

    // Call the method
    await appController.updateApp(req, res);

    // Verify the interactions
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'App not found' });
  });

  it('should return StatusCodes.NOT_FOUND if the app has already been deleted', async () => {
    // Set up your test data and mock responses
    const req = {
      params: { id: 'existingId' },
      body: {
        name: 'Updated App',
        description: 'Updated Description',
        isActive: true,
        isDeleted: true,
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    const existingApp = {
      isDeleted: true,
    };

    // Mock the behavior of the 'where' function
    knex.mockReturnValue({
      where: jest.fn().mockReturnValue({
        first: jest.fn().mockReturnValue(existingApp),
      }),
    });

    // Call the method
    await appController.updateApp(req, res);

    // Verify the interactions
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
  });

  // ... other test cases
});
describe('getApps', () => {
  it('should return a list of apps with pagination and filters', async () => {
    // Prepare a mock request and response
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/api/apps',
      query: {
        pagesize: '5',
        pagenum: '2',
        sortBy: 'name',
        isActive: true,
        // Add other query parameters as needed
      },
    });
    const res = httpMocks.createResponse();

    // Mock the Knex query methods
    const mockApplications = [
      {
        id: 1,
        name: 'Test App 1',
        description: 'Description for Test App 1',
        isActive: true,
        isDeleted: false,
      },
      {
        id: 2,
        name: 'Test App 2',
        description: 'Description for Test App 2',
        isActive: true,
        isDeleted: false,
      },
      // Add more mocked apps as needed
    ];

    knex.mockReturnValue({
      select: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            orderBy: jest.fn().mockReturnValue({
              offset: jest.fn().mockReturnValue({
                limit: jest.fn().mockReturnValue(mockApplications),
              }),
            }),
          }),
        }),
      }),
      count: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            first: jest.fn().mockReturnValue({ count: 2 }),
          }),
        }),
      }),
    });

    // Call the method
    await appController.getApps(req, res);

    // Parse the response data
    const responseData = JSON.parse(res._getData());

    const expected = {
      apps: mockApplications,
      pageSize: 5,
      pageNum: 2,
      totalAppsCount: 2,
    };
    // Assertions
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res._isEndCalled()).toBeTruthy();
    expect(responseData).toEqual(expected);
  });

  // Add more test cases to cover other scenarios
});
describe('getAppById', () => {
  it('should return the app with the given ID if it exists and is not deleted', async () => {
    // Mock request and response objects
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/api/apps/1', // Replace with the appropriate app ID
      params: {
        id: 1, // Replace with the appropriate app ID
      },
    });
    const res = httpMocks.createResponse();

    // Mock the postgredb query method to return a mock app
    knex.mockReturnValue({
      where: jest.fn().mockReturnValue({
        first: jest.fn().mockReturnValue({
          id: 1,
          name: 'Test App',
          description: 'This is a test app',
          isDeleted: false,
        }),
      }),
    });

    // Call the method
    await appController.getAppById(req, res);

    // Parse the response data
    const responseData = JSON.parse(res._getData());

    // Assertions
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res._isEndCalled()).toBeTruthy();
    expect(responseData.id).toBe(1);
    expect(responseData.name).toBe('Test App');
    expect(responseData.description).toBe('This is a test app');
    expect(responseData.isDeleted).toBe(false);
  });

  it('should return a 404 error if the app with the given ID is not found', async () => {
    // Mock request and response objects
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/api/apps/1', // Replace with the appropriate app ID
      params: {
        id: 1, // Replace with the appropriate app ID
      },
    });
    const res = httpMocks.createResponse();

    // Mock the postgredb query method to return null (app not found)
    knex.mockReturnValue({
      where: jest.fn().mockReturnValue({
        first: jest.fn().mockReturnValue(null),
      }),
    });

    // Call the method
    await appController.getAppById(req, res);

    // Assertions
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Application not found',
    });
  });

  it('should return a message if the app with the given ID is deleted', async () => {
    // Mock request and response objects
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/api/apps/1', // Replace with the appropriate app ID
      params: {
        id: 1, // Replace with the appropriate app ID
      },
    });
    const res = httpMocks.createResponse();

    // Mock the postgredb query method to return a deleted app
    knex.mockReturnValue({
      where: jest.fn().mockReturnValue({
        first: jest.fn().mockReturnValue({
          isDeleted: true,
        }),
      }),
    });

    // Call the method
    await appController.getAppById(req, res);

    // Assertions
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res._isEndCalled()).toBeTruthy();
    expect(JSON.parse(res._getData())).toEqual({
      message: 'The app has been deleted',
    });
  });
});
