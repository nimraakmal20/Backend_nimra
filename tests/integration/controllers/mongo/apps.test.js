const request = require('supertest');
const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const { App } = require('../../../../models/app');
const { Event } = require('../../../../models/event'); // Replace with your Event model import
const { Ntype } = require('../../../../models/notiftype'); // Replace with your Ntype model import
const { Message } = require('../../../../models/message');
// Replace with your Message model import
let server;

describe('/api/apps', () => {
  beforeEach(async () => {
    server = require('../../../../index');
    // Populate the database with test apps
    await App.collection.insertMany([
      {
        name: 'App 1',
        description: 'Description 1',
        isActive: true,
        isDeleted: false,
      },
      {
        name: 'App 2',
        description: 'Description 2',
        isActive: false,
        isDeleted: false,
      },
      {
        name: 'Deleted App',
        description: 'Deleted Description',
        isActive: true,
        isDeleted: true,
      },
    ]);
  });

  afterEach(async () => {
    server.close();
    await App.deleteMany({});
  });

  describe('POST /', () => {
    it('should create a new app', async () => {
      const appData = {
        name: 'Test App',
        description: 'This is a test app.',
        isActive: true,
        isDeleted: false,
      };

      const res = await request(server).post('/api/apps').send(appData);

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', appData.name);
      expect(res.body).toHaveProperty('description', appData.description);
      expect(res.body).toHaveProperty('isActive', appData.isActive);
      expect(res.body).toHaveProperty('isDeleted', appData.isDeleted);
    });
  });

  describe('PATCH /:id', () => {
    it('should update an existing app', async () => {
      const existingApp = new App({
        name: 'Existing App',
        description: 'This is an existing app.',
        isActive: true,
        isDeleted: false,
      });

      await existingApp.save();

      const updatedData = {
        name: 'Updated App Name',
        description: 'Updated description.',
        isActive: false,
        isDeleted: true,
      };

      const res = await request(server)
        .patch(`/api/apps/${existingApp._id}`)
        .send(updatedData);

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toHaveProperty('_id', existingApp._id.toString());
      expect(res.body).toHaveProperty('name', updatedData.name);
      expect(res.body).toHaveProperty('description', updatedData.description);
      expect(res.body).toHaveProperty('isActive', updatedData.isActive);
      expect(res.body).toHaveProperty('isDeleted', updatedData.isDeleted);
    });
  });

  describe('GET /api/apps', () => {
    it('should get a list of apps with pagination and filtering', async () => {
      // Create test apps
      const testApps = [
        {
          name: 'App 1',
          description: 'Description 1',
          isActive: true,
          isDeleted: false,
        },
        {
          name: 'App 2',
          description: 'Description 2',
          isActive: false,
          isDeleted: false,
        },
        {
          name: 'Deleted App',
          description: 'Deleted Description',
          isActive: true,
          isDeleted: true,
        },
      ];
      await App.collection.insertMany(testApps);

      // Define query parameters for the request
      const queryParams = {
        pagesize: 2,
        pagenum: 1,
        sortBy: 'name', // Adjust as needed
      };

      const res = await request(server).get('/api/apps').query(queryParams);

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.apps.length).toBe(2);
      // Add more assertions to check the returned data based on queryParams
      // For example: expect(res.body.apps[0].name).toBe(testApps[0].name);
    });

    // Add more test cases for different scenarios
  });
  describe('GET /api/apps/:id', () => {
    it('should get an app by ID', async () => {
      const existingApp = new App({
        name: 'Existing App',
        description: 'This is an existing app.',
        isActive: true,
        isDeleted: false,
      });

      await existingApp.save();

      const res = await request(server).get(`/api/apps/${existingApp._id}`);

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toHaveProperty('name', existingApp.name);
      expect(res.body).toHaveProperty('description', existingApp.description);
      // Add more assertions to check the returned data
    });

    it('should return 404 for a deleted app', async () => {
      const deletedApp = new App({
        name: 'Deleted App',
        description: 'This app has been deleted.',
        isActive: false,
        isDeleted: true,
      });

      await deletedApp.save();

      const res = await request(server).get(`/api/apps/${deletedApp._id}`);

      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      expect(res.body).toHaveProperty(
        'error',
        'App is either unknown or deleted',
      );
    });

    it('should return 404 for an unknown app', async () => {
      const unknownAppId = '60d30d781b75e215c8e7748a'; // Some non-existing ID

      const res = await request(server).get(`/api/apps/${unknownAppId}`);

      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      expect(res.body).toHaveProperty(
        'error',
        'App is either unknown or deleted',
      );
    });

    // Add more test cases for different scenarios
  });

  describe('DELETE /api/apps/delete/:id', () => {
    it('should delete an existing app and related data', async () => {
      // Create a sample app and related data in the database
      const existingApp = new App({
        name: 'Existing App',
        description: 'This is an existing app.',
        isActive: true,
        isDeleted: false,
      });
      await existingApp.save();

      const event = new Event({
        name: 'Event Name',
        description: 'Event Description',
        applicationId: existingApp._id,
        isActive: true,
        isDeleted: false,
      });
      await event.save();

      const ntype = new Ntype({
        eventId: event._id,
        name: 'Ntype Name',
        description: 'Ntype Description',
        templateSubject: 'Ntype Subject',
        templateBody: 'Ntype Body',
        isActive: true,
        isDeleted: false,
      });
      await ntype.save();

      const message = new Message({
        ntypeId: ntype._id,
        stubId: 'Stub ID',
        sendto: 'Send To',
        messageSubject: 'Message Subject',
        messageBody: 'Message Body',
      });
      await message.save();

      const res = await request(server).patch(
        `/api/apps/delete/${existingApp._id}`,
      );
      expect(res.body.message).toBe(
        'The app and related data have been deleted.',
      );
      expect(res.body.deletedEvents.length).toBe(1);
      expect(res.body.deletedNtypes.length).toBe(1);

      // Verify that the app has been marked as deleted and isActive set to false in the database
      const updatedApp = await App.findById(existingApp._id);
      expect(updatedApp.isDeleted).toBe(true);
      expect(updatedApp.isActive).toBe(false);

      // Verify that other related data has been deleted from the database
      const deletedEvent = await Event.findById(event._id);
      expect(deletedEvent.isDeleted).toBe(true);

      const deletedNtype = await Ntype.findById(ntype._id);
      expect(deletedNtype.isDeleted).toBe(true);
    });

    it('should return 404 if the app does not exist', async () => {
      const nonExistentAppId = new mongoose.Types.ObjectId();
      // Create a non-existent ObjectId

      const res = await request(server)
        .patch(`/api/apps/delete/${nonExistentAppId}`)
        .expect(StatusCodes.NOT_FOUND);
    });

    it('should return a message if the app has already been deleted', async () => {
      const deletedApp = new App({
        name: 'Deleted App',
        description: 'This app has been deleted.',
        isActive: false,
        isDeleted: true,
      });
      await deletedApp.save();

      const res = await request(server)
        .patch(`/api/apps/delete/${deletedApp._id}`)
        .expect(StatusCodes.OK);
    });
  });
  // Add more describe blocks for other endpoints like GET /, GET /:id, etc.
});
