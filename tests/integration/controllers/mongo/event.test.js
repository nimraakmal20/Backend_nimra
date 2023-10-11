const request = require('supertest');
const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const { App } = require('../../../../models/app');
const { Event } = require('../../../../models/event');
const updateEvent = require('../../../../controllers/mongo/event');

let server;

describe('/api/events', () => {
  beforeEach(async () => {
    server = require('../../../../index');
    // Populate the database with test events and apps
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

    const testEvents = [
      {
        name: 'Event 1',
        description: 'Description 1',
        applicationId: 'someApplicationId',
        isActive: true,
        isDeleted: false,
      },
      {
        name: 'Event 2',
        description: 'Description 2',
        applicationId: 'someApplicationId',
        isActive: true,
        isDeleted: false,
      },
      {
        name: 'Deleted Event',
        description: 'Deleted Description',
        applicationId: 'someApplicationId',
        isActive: true,
        isDeleted: true,
      },
    ];
    await Event.collection.insertMany(testEvents);
  });

  afterEach(async () => {
    server.close();
    await Event.deleteMany({});
    await App.deleteMany({});
  });

  describe('POST /', () => {
    it('should create a new event', async () => {
      // Create a test app to associate with the event
      const app = new App({
        name: 'Test App',
        description: 'This is a test app.',
        isActive: true,
        isDeleted: false,
      });

      const savedApp = await app.save();
      const eventData = {
        name: 'Test Event',
        description: 'This is a test event.',
        isActive: true,
        isDeleted: false,
        applicationId: savedApp._id, // Use the saved app's _id
      };

      const res = await request(server).post('/api/events').send(eventData);
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', eventData.name);
      expect(res.body).toHaveProperty('description', eventData.description);
      expect(res.body).toHaveProperty(
        'applicationId',
        eventData.applicationId.toString(),
      ); // Convert to string for comparison
      expect(res.body).toHaveProperty('isDeleted', eventData.isDeleted);
    });
  });

  describe('PATCH /api/events/:eventId', () => {
    let existingEvent;

    beforeAll(async () => {
      // Create and save the existing event to the database
      existingEvent = new Event({
        name: 'Event 2',
        description: 'Description 2',
        applicationId: 'someApplicationId',
        isActive: true,
        isDeleted: false,
      });
      await existingEvent.save();
    });

    afterAll(async () => {
      // Clean up the database
      await Event.deleteMany({});
    });
    it('should update an existing event', async () => {
      // Create and save the existing event to the database
      const existEvent = new Event({
        name: 'Event 2',
        description: 'Description 2',
        applicationId: 'someApplicationId',
        isActive: true,
        isDeleted: false,
      });
      await existEvent.save();

      const updatedData = {
        name: 'Updated Event Name',
      };

      const res = await request(server)
        .patch(`/api/events/${existEvent._id}`)
        .send(updatedData);

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toHaveProperty('_id', existEvent._id.toString());
      expect(res.body).toHaveProperty('name', updatedData.name);
    });

    it('should handle event name conflict', async () => {
      const existEvent = new Event({
        name: 'Event 2',
        description: 'Description 2',
        applicationId: 'someApplicationId',
        isActive: true,
        isDeleted: false,
      });
      await existEvent.save();
      let conflictingEvent = new Event({
        name: 'Conflicting Event',
        description: 'anyyyy desp',
        isActive: true,
        isDeleted: false,
        applicationId: 'someApplicationId',
      });
      conflictingEvent = await conflictingEvent.save();

      const updatedData = {
        name: 'Conflicting Event',
      };

      const res = await request(server)
        .patch(`/api/events/${existEvent._id}`)
        .send(updatedData);
      expect(res.status).toBe(StatusCodes.CONFLICT);
      expect(res.text).toContain('An event with the same name already exists');
    });

    it('should handle invalid event', async () => {
      const nonExistentEventId = '123456789012345678901234';

      const updatedData = {
        name: 'Updated Event Name',
      };

      const res = await request(server)
        .patch(`/api/events/${nonExistentEventId}`)
        .send(updatedData);

      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      expect(res.text).toContain('Invalid event.');
    });

    // Add more test cases for different scenarios
  });
  describe('GET /api/events', () => {
    beforeAll(async () => {
      // Populate the database with test events
      // ...
    });

    afterAll(async () => {
      // Clean up the database
      // ...
    });

    it('should get a list of events', async () => {
      const res = await request(server).get('/api/events');
      expect(res.status).toBe(StatusCodes.OK);
      // Add your own assertions to validate the response
    });

    // Add more test cases for different scenarios
  });

  describe('GET /api/events/:eventId', () => {
    let existingEvent;

    beforeAll(async () => {
      // Create and save the existing event to the database
      existingEvent = new Event({
        name: 'Event 2',
        description: 'Description 2',
        applicationId: 'someApplicationId',
        isActive: true,
        isDeleted: false,
      });
      await existingEvent.save();
    });

    afterAll(async () => {
      // Clean up the database
      await Event.deleteMany({});
    });

    it('should get an event by ID', async () => {
      const res = await request(server).get(`/api/events/${existingEvent._id}`);
      expect(res.status).toBe(StatusCodes.OK);
      // Add your own assertions to validate the response
    });

    it('should handle invalid event ID', async () => {
      const invalidEventId = '123456789012345678901234';

      const res = await request(server).get(`/api/events/${invalidEventId}`);
      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      // Add your own assertions to validate the response
    });

    // Add more test cases for different scenarios
  });
});
