const request = require('supertest');
const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const { Event } = require('../../../../models/event');
const { Ntype } = require('../../../../models/notiftype');
const { Stub } = require('../../../../models/stub');
const { createNtype } = require('../../../../controllers/mongo/notiftypes');

let server;

describe('ntypeController', () => {
  beforeEach(() => {
    server = require('../../../../index');
  });

  afterEach(async () => {
    server.close();
    await Ntype.deleteMany({});
    await Event.deleteMany({});
    await Stub.deleteMany({});
  });

  describe('createNtype', () => {
    it('should create a new Ntype', async () => {
      const event = new Event({
        name: 'Test Event',
        description: 'Event description',
        applicationId: 'someId',
        isDeleted: false,
        isActive: true,
      });
      await event.save();
      const evntid = event._id.toString();

      const ntypeData = {
        name: 'Test Ntype',
        description: 'This is a test Ntype.',
        templateSubject: 'Test Subject',
        templateBody: 'Test Body',
        isDeleted: false,
        isActive: true,
        eventId: evntid,
      };

      const req = {
        name: 'Test Ntype',
        description: 'This is a test Ntype.',
        templateSubject: 'Test Subject',
        templateBody: 'Test Body',
        isDeleted: false,
        isActive: true,
        eventId: evntid,
      };

      const res = await request(server).post('/api/notiftypes').send(req);

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', ntypeData.name);
      expect(res.body).toHaveProperty('description', ntypeData.description);
      // Add more assertions as needed
    });

    it('should return 404 if Event ID is missing', async () => {
      const ntypeData = {
        name: 'Test Ntype',
        description: 'This is a test Ntype.',
        templateSubject: 'Test Subject',
        templateBody: 'Test Body',
        isDeleted: false,
        isActive: true,
      };

      const req = {
        name: 'Test Ntype',
        description: 'This is a test Ntype.',
        templateSubject: 'Test Subject',
        templateBody: 'Test Body',
        isDeleted: false,
        isActive: true,
      };

      const res = await request(server).post('/api/notiftypes').send(req);
      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      // Add more assertions as needed
    });

    it('should return 404 if Event is invalid or deleted', async () => {
      const ntypeData = {
        name: 'Test Ntype',
        description: 'This is a test Ntype.',
        templateSubject: 'Test Subject',
        templateBody: 'Test Body',
        eventId: 'anything',
        isDeleted: false,
        isActive: true,
      };

      const req = {
        name: 'Test Ntype',
        description: 'This is a test Ntype.',
        templateSubject: 'Test Subject',
        templateBody: 'Test Body',
        eventId: 'anything',
        isDeleted: false,
        isActive: true,
        body: ntypeData,
      };

      const res = await request(server).post('/api/notiftypes').send(req);

      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      // Add more assertions as needed
    });

    it('should handle conflict for duplicate Ntype name for an Event', async () => {
      const event = new Event({
        name: 'Test Event',
        description: 'Event description',
        applicationId: 'someId',
        isDeleted: false,
        isActive: true,
      });
      await event.save();

      const existingNtype = new Ntype({
        name: 'Existing Ntype',
        description: 'Existing Ntype description',
        templateSubject: 'Existing Subject',
        templateBody: 'Existing Body',
        eventId: event._id.toString(),
        isActive: true,

        isDeleted: false,
      });
      await existingNtype.save();

      const ntypeData = {
        name: 'Existing Ntype', // Attempting to use the same name
        description: 'This is a test Ntype.',
        templateSubject: 'Test Subject',
        templateBody: 'Test Body',
        eventId: event._id.toString(),
        isActive: true,
        isDeleted: false,
      };

      const req = {
        name: 'Existing Ntype', // Attempting to use the same name
        description: 'This is a test Ntype.',
        templateSubject: 'Test Subject',
        templateBody: 'Test Body',
        eventId: event._id.toString(),
        isActive: true,
        isDeleted: false,
      };

      const res = await request(server).post('/api/notiftypes').send(req);

      expect(res.status).toBe(StatusCodes.CONFLICT);
      // Add more assertions as needed
    });
  });
  describe('updateNtype', () => {
    it('should update an existing Ntype', async () => {
      const event = new Event({
        name: 'Test Event',
        description: 'Event description',
        applicationId: 'someId',
        isDeleted: false,
        isActive: true,
      });
      await event.save();
      const evntid = event._id.toString();
      // Create a mock Ntype
      const ntype = new Ntype({
        name: 'Test Ntype',
        description: 'This is a test Ntype.',
        templateSubject: 'Test Subject',
        templateBody: 'Test Body',
        isDeleted: false,
        isActive: true,
        eventId: evntid,
      });
      await ntype.save();

      // Create a mock request to update the Ntype
      const updatedNtypeData = {
        name: 'Updated Ntype Name',
        description: 'Updated Ntype description.',
        templateSubject: 'Updated Subject',
        templateBody: 'Updated Body',
        isDeleted: true,
        isActive: false,
      };

      const res = await request(server)
        .patch(`/api/notiftypes/${ntype._id}`)
        .send(updatedNtypeData);

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toHaveProperty('name', updatedNtypeData.name);
      expect(res.body).toHaveProperty(
        'description',
        updatedNtypeData.description,
      );
      // Add more assertions as needed
    });

    it('should handle invalid or deleted Ntype', async () => {
      // Attempt to update a non-existing Ntype
      const res = await request(server)
        .patch(`/api/notiftypes/invalid-id`)
        .send({
          name: 'Updated Ntype Name',
          description: 'Updated Ntype description.',
          templateSubject: 'Updated Subject',
          templateBody: 'Updated Body',
          isDeleted: true,
          isActive: false,
        });
      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      // Add more assertions as needed
    });

    it('should handle duplicate Ntype name for an Event', async () => {
      const event = new Event({
        name: 'Test Event',
        description: 'Event description',
        applicationId: 'someId',
        isDeleted: false,
        isActive: true,
      });
      await event.save();
      const evntid = event._id.toString();
      const ntype1 = new Ntype({
        name: 'Test Ntype 1',
        description: 'Description 1',
        templateSubject: 'Subject 1',
        templateBody: 'Body 1',
        isDeleted: false,
        isActive: true,
        eventId: evntid,
      });
      await ntype1.save();

      const ntype2 = new Ntype({
        name: 'Test Ntype 2',
        description: 'Description 2',
        templateSubject: 'Subject 2',
        templateBody: 'Body 2',
        isDeleted: false,
        isActive: true,
        eventId: evntid,
      });
      await ntype2.save();

      // Attempt to update ntype2 with the name of ntype1
      const updatedNtypeData = {
        name: 'Test Ntype 1',
        description: 'Updated Ntype description.',
        templateSubject: 'Updated Subject',
        templateBody: 'Updated Body',
        isDeleted: true,
        isActive: false,
      };

      const res = await request(server)
        .patch(`/api/notiftypes/${ntype2._id}`)
        .send(updatedNtypeData);
      expect(res.status).toBe(StatusCodes.CONFLICT);
      // Add more assertions as needed
    });
  });
  describe('getNtypes', () => {
    it('should retrieve Ntypes with default pagination and sorting', async () => {
      const event = new Event({
        name: 'Test Event',
        description: 'Event description',
        applicationId: 'someId',
        isDeleted: false,
        isActive: true,
      });
      await event.save();
      const evntid = event._id.toString();
      // Create some mock Ntypes
      const ntype1 = new Ntype({
        name: 'Ntype 1',
        description: 'Description 1',
        templateSubject: 'Subject 1',
        templateBody: 'Body 1',
        isDeleted: false,
        isActive: true,
        eventId: evntid,
      });
      await ntype1.save();

      const ntype2 = new Ntype({
        name: 'Ntype 2',
        description: 'Description 2',
        templateSubject: 'Subject 2',
        templateBody: 'Body 2',
        isDeleted: false,
        isActive: true,
        eventId: evntid,
      });
      await ntype2.save();

      const res = await request(server).get('/api/notiftypes');

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.ntypes).toHaveLength(2);
      // Add more assertions as needed
    });

    it('should retrieve Ntypes with custom pagination and sorting', async () => {
      const event = new Event({
        name: 'Test Event',
        description: 'Event description',
        applicationId: 'someId',
        isDeleted: false,
        isActive: true,
      });
      await event.save();
      const evntid = event._id.toString();
      // Create some mock Ntypes
      const ntype1 = new Ntype({
        name: 'Ntype 3',
        description: 'Description 1',
        templateSubject: 'Subject 1',
        templateBody: 'Body 1',
        isDeleted: false,
        isActive: true,
        eventId: evntid,
      });
      await ntype1.save();

      const ntype2 = new Ntype({
        name: 'Ntype 4',
        description: 'Description 2',
        templateSubject: 'Subject 2',
        templateBody: 'Body 2',
        isDeleted: false,
        isActive: true,
        eventId: evntid,
      });
      await ntype2.save();

      const res = await request(server)
        .get('/api/notiftypes')
        .query({ pagesize: 1, pagenum: 1, sortBy: 'name' });

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.ntypes).toHaveLength(1);
      // Add more assertions as needed
    });

    it('should handle invalid pagination parameters', async () => {
      const res = await request(server)
        .get('/api/notiftypes')
        .query({ pagesize: 'invalid', pagenum: 'invalid' });

      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      // Add more assertions as needed
    });

    it('should handle filtering by parameters', async () => {
      const event = new Event({
        name: 'Test Event',
        description: 'Event description',
        applicationId: 'someId',
        isDeleted: false,
        isActive: true,
      });
      await event.save();
      const evntid = event._id.toString();
      // Create some mock Ntypes with specific properties
      const ntype1 = new Ntype({
        name: 'Ntype 1',
        description: 'Description 1',
        templateSubject: 'Subject 1',
        templateBody: 'Body 1',
        isDeleted: false,
        isActive: true,
        eventId: evntid,
      });
      await ntype1.save();

      const ntype2 = new Ntype({
        name: 'Ntype 2',
        description: 'Description 2',
        templateSubject: 'Subject 2',
        templateBody: 'Body 2',
        isDeleted: false,
        isActive: true,
        eventId: evntid,
      });
      await ntype2.save();

      const res = await request(server)
        .get('/api/notiftypes')
        .query({ name: 'Ntype 1' }); // Filter by name

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.ntypes).toHaveLength(1);
      expect(res.body.ntypes[0].name).toBe('Ntype 1');
      // Add more assertions as needed
    });
  });
});
