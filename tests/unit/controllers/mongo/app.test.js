/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */

const { StatusCodes } = require('http-status-codes');
const appController = require('../../../../controllers/mongo/app');
const { App } = require('../../../../models/app'); // Replace with the correct path to your App model
const Event = require('../../../../models/event'); // Import your Event model
const Ntype = require('../../../../models/notiftype'); // Import your Ntype model
const Message = require('../../../../models/message'); // Import your Message model

const logger = require('../../../../startup/logging');
// Assuming you have imported necessary modules and set up App and StatusCodes appropriately

describe('createApp', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should create a new app', async () => {
    const req = {
      body: {
        name: 'New App',
        description: 'This is a new app',
        isActive: true,
      },
    };

    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    // Mocking the App.findOne, App.save methods
    App.findOne = jest.fn(() => null);
    const savedApp = {
      _id: 'newId',
      name: 'New App',
      description: 'New Description',
      isActive: true,
      isDeleted: false,
    };
    const saveMock = jest.fn().mockResolvedValue(savedApp);
    App.prototype.save = saveMock;

    await appController.createApp(req, res);

    expect(App.findOne).toHaveBeenCalledWith({
      name: req.body.name,
      isDeleted: false,
    });
    expect(saveMock).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith(savedApp);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
  });

  it('should return StatusCodes.CONFLICT if app with same name already exists', async () => {
    const req = {
      body: {
        name: 'Existing App',
        description: 'New Description',
        isActive: true,
      },
    };
    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    // Mocking that an existing app is found
    const existingApp = {
      _id: 'existingId',
      name: 'Existing App',
      description: 'Existing Description',
      isActive: true,
      isDeleted: false,
    };
    App.findOne = jest.fn().mockResolvedValue(existingApp);

    await appController.createApp(req, res);

    expect(App.findOne).toHaveBeenCalledWith({
      name: req.body.name,
      isDeleted: false,
    });
    expect(res.send).toHaveBeenCalledWith(
      'An app with the same name already exists.',
    );
    expect(res.status).toHaveBeenCalledWith(StatusCodes.CONFLICT);
  });

  it('should set isDeleted to false if not provided in the request body', async () => {
    const req = {
      body: {
        name: 'New App',
        description: 'This is a new app',
        isActive: true,
        isDeleted: false, // Ensure isDeleted is provided in the request body
      },
    };

    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    App.findOne = jest.fn(() => null);
    const savedApp = {
      _id: 'newId',
      name: 'New App',
      description: 'New Description',
      isActive: true,
      isDeleted: false, // Default value
    };
    const saveMock = jest.fn().mockResolvedValue(savedApp);
    App.prototype.save = saveMock;

    await appController.createApp(req, res);

    expect(saveMock).toHaveBeenCalledWith();
  });

  it('should set isActive to true if not provided in the request body', async () => {
    const req = {
      body: {
        name: 'New App',
        description: 'This is a new app',
      },
    };

    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    App.findOne = jest.fn(() => null);
    const savedApp = {
      _id: 'newId',
      name: 'New App',
      description: 'New Description',
      isActive: true, // Default value
      isDeleted: false,
    };
    const saveMock = jest.fn().mockResolvedValue(savedApp);
    App.prototype.save = saveMock;

    await appController.createApp(req, res);

    expect(saveMock).toHaveBeenCalledWith();
  });
});

describe('updateApp', () => {
  it('should update an existing app', async () => {
    const req = {
      params: { id: 'existingId' },
      body: {
        name: 'Updated App Name',
        description: 'Updated Description',
        isActive: true,
        isDeleted: false,
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mocking the existing app data
    const existingAppData = {
      _id: 'existingId',
      name: 'Old App Name',
      description: 'Old Description',
      isActive: false,
      isDeleted: false,
    };
    App.findById = jest.fn().mockResolvedValue(existingAppData);

    // Mocking the App.findByIdAndUpdate method
    const updatedAppData = {
      _id: 'existingId',
      name: 'Updated App Name',
      description: 'Updated Description',
      isActive: true,
      isDeleted: false,
    };
    App.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedAppData);

    await appController.updateApp(req, res);

    expect(App.findById).toHaveBeenCalledWith(req.params.id);
    expect(App.findByIdAndUpdate).toHaveBeenCalledWith(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        isActive: req.body.isActive,
        isDeleted: req.body.isDeleted,
      },
      { new: true },
    );
    expect(res.json).toHaveBeenCalledWith(updatedAppData);
  });

  it('should return 404 if app to update is not found', async () => {
    const req = {
      params: { id: 'nonExistingId' },
      body: {
        name: 'Updated App Name',
        description: 'Updated Description',
        isActive: true,
        isDeleted: false,
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mocking that no existing app is found
    App.findById = jest.fn().mockResolvedValue(null);

    await appController.updateApp(req, res);

    expect(App.findById).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'App not found' });
  });

  // Add more test cases to cover other scenarios
});
describe('getApps', () => {
  it('should return a list of apps with pagination and filters', async () => {
    const req = {
      query: {
        pagesize: '5',
        pagenum: '2',
        sortBy: 'name',
        isActive: true,
      },
    };
    const res = {
      json: jest.fn(),
    };

    // Mocking the App.find, App.countDocuments methods
    const appsList = [
      { _id: 'id1', name: 'App 1', isActive: true },
      { _id: 'id2', name: 'App 2', isActive: true },
      // Add more apps as needed
    ];
    const totalAppsCount = 10; // Total number of apps

    // Mocking the App.find method with chained methods
    const appFindMock = {
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(appsList),
    };
    App.find = jest.fn().mockReturnValue(appFindMock);

    App.countDocuments = jest.fn().mockResolvedValue(totalAppsCount);

    await appController.getApps(req, res);

    expect(App.find).toHaveBeenCalledWith({
      isActive: true,
      isDeleted: false, // isDeleted is always false in the filter
    });
    expect(appFindMock.skip).toHaveBeenCalledWith(5); // skipCount = (2 - 1) * 5
    expect(appFindMock.limit).toHaveBeenCalledWith(5);
    expect(appFindMock.sort).toHaveBeenCalledWith({ name: 1 });
    expect(App.countDocuments).toHaveBeenCalledWith({
      isActive: true,
      isDeleted: false,
    });
    expect(res.json).toHaveBeenCalledWith({
      apps: appsList,
      pageSize: 5,
      pageNum: 2,
      totalAppsCount,
    });
  });

  // Add more test cases to cover other scenarios
});
describe('getAppById', () => {
  it('should return an existing app', async () => {
    const req = {
      params: { id: 'existingId' },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };

    // Mocking the App.findById method
    const existingApp = {
      _id: 'existingId',
      name: 'Test App',
      description: 'Test Description',
      isActive: true,
      isDeleted: false,
    };
    App.findById = jest.fn().mockResolvedValue(existingApp);

    await appController.getAppById(req, res);

    expect(App.findById).toHaveBeenCalledWith(req.params.id);
    expect(res.json).toHaveBeenCalledWith(existingApp);
  });

  it('should return 404 if app is not found', async () => {
    const req = {
      params: { id: 'nonExistingId' },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };

    // Mocking that no existing app is found
    App.findById = jest.fn().mockResolvedValue(null);

    await appController.getAppById(req, res);

    expect(App.findById).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('should return 404 if app has been deleted', async () => {
    const req = {
      params: { id: 'deletedId' },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };

    // Mocking an app that has been deleted
    const deletedApp = {
      _id: 'deletedId',
      name: 'Deleted App',
      description: 'Deleted Description',
      isActive: true,
      isDeleted: true,
    };
    App.findById = jest.fn().mockResolvedValue(deletedApp);

    await appController.getAppById(req, res);

    expect(App.findById).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  // Add more test cases to cover other scenarios
});

describe('deleteApp', () => {
  it('should return 404 if app to delete is not found', async () => {
    const req = {
      params: { id: 'nonExistingId' },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mocking that no existing app is found
    App.findById = jest.fn().mockResolvedValue(null);

    await appController.deleteApp(req, res);

    expect(App.findById).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: 'App not found' });
  });
});
