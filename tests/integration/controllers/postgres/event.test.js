/* eslint-disable no-undef */
const request = require('supertest');
const { StatusCodes } = require('http-status-codes');
const eventController = require('../../../../controllers/postgres/event'); // Update the path
// Mock the dependencies
const knex = require('../../../../startup/db/postgresDb/postgresDb');

const server = require('../../../../index');

describe('POST /api/events', () => {
  beforeAll(async () => {
    await knex.migrate.latest();
    await knex('apps').insert([
      {
        name: 'application1',
        description: 'app1 desc',
        isActive: true,
        isDeleted: false,
      },
      {
        name: 'application2',
        description: 'app2 desc',
        isActive: true,
        isDeleted: false,
      },
    ]);
  });

  afterAll(async () => {
    await server.close();
  });

  beforeEach(async () => {
    await knex.migrate.latest();
  });

  afterEach(async () => {
    await knex.migrate.rollback(true);
  });

  it('Should create a new event', async () => {
    const application = await knex('apps').first(); // Get the first application
    const newEvent = {
      name: 'NewEvent',
      description: 'New event description',
      applicationId: application.id, // Include applicationId in the request body
    };

    const response = await request(server).post('/api/events').send(newEvent);
    expect(response.status).toBe(StatusCodes.OK);
  });
});

describe('PATCH /api/events/:id', () => {
  beforeAll(async () => {
    await knex.migrate.latest();
    await knex('apps').insert([
      {
        name: 'application1',
        description: 'app1 desc',
        isActive: true,
        isDeleted: false,
      },
    ]);
    await knex('event').insert([
      {
        name: 'event1',
        description: 'event1 desc',
        isDeleted: false,
        isActive: true,
        applicationId: 1, // Assuming application with ID 1 exists
      },
      {
        name: 'event2',
        description: 'event2 desc',
        isDeleted: false,
        isActive: true,
        applicationId: 1,
      },
    ]);
  });

  afterAll(async () => {
    await knex.migrate.rollback(true);
    await server.close();
  });

  beforeEach(async () => {
    await knex.migrate.latest();
  });

  it('Should update an existing event', async () => {
    const existingEvent = await knex('event').first();
    const updatedEventData = {
      name: 'UpdatedEventName',
      description: 'Updated event description',
      isDeleted: true,
    };
    const response = await request(server)
      .patch(`/api/events/${existingEvent.id}`)
      .send(updatedEventData);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveProperty(
      'message',
      'Event updated successfully',
    );
  });

  it('Should return an error if event does not exist', async () => {
    const nonExistentEventId = 9999;
    const updatedEventData = {
      name: 'UpdatedEventName',
      description: 'Updated event description',
      isDeleted: true,
    };

    const response = await request(server)
      .patch(`/api/events/${nonExistentEventId}`)
      .send(updatedEventData);

    expect(response.status).toBe(StatusCodes.NOT_FOUND);
    expect(response.body).toHaveProperty('error', 'Event not found');
  });
  afterEach(async () => {
    await knex.migrate.rollback(true);
  });

  // Add more test cases as needed
});
describe('GET /api/events', () => {
  beforeAll(async () => {
    await knex.migrate.latest();
    await knex('apps').insert([
      {
        name: 'application1',
        description: 'app1 desc',
        isActive: true,
        isDeleted: false,
      },
    ]);
    await knex('event').insert([
      {
        name: 'event1',
        description: 'event1 desc',
        isDeleted: false,
        isActive: true,
        applicationId: 1, // Assuming application with ID 1 exists
      },
      {
        name: 'event2',
        description: 'event2 desc',
        isDeleted: false,
        isActive: true,
        applicationId: 1,
      },
    ]);
  });

  afterAll(async () => {
    await knex.migrate.rollback(true);
    await server.close();
  });

  beforeEach(async () => {
    await knex.migrate.latest();
  });

  afterEach(async () => {
    await knex.migrate.rollback(true);
  });

  it('Should get a list of events with pagination and sorting', async () => {
    const response = await request(server).get('/api/events').query({
      pagesize: 1,
      pagenum: 1,
      sortBy: 'name',
      // ... any other filter parameters ...
    });

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveProperty('events');
    expect(response.body).toHaveProperty('pageSize', 1);
    expect(response.body).toHaveProperty('pageNum', 1);
    expect(response.body).toHaveProperty('totalEventsCount');

    // You can add more assertions to validate the structure and content of the response
  });

  it('Should get a list of events with default pagination and sorting', async () => {
    const response = await request(server).get('/api/events');

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveProperty('events');
    expect(response.body).toHaveProperty('pageSize', 10); // Default pageSize
    expect(response.body).toHaveProperty('pageNum', 1);
    expect(response.body).toHaveProperty('totalEventsCount');

    // You can add more assertions to validate the structure and content of the response
  });

  // Add more test cases as needed
});
describe('GET /api/events/:id', () => {
  beforeAll(async () => {
    await knex.migrate.latest();
    await knex('apps').insert([
      {
        name: 'application1',
        description: 'app1 desc',
        isActive: true,
        isDeleted: false,
      },
    ]);
    await knex('event').insert([
      {
        name: 'event1',
        description: 'event1 desc',
        isDeleted: false,
        isActive: true,
        applicationId: 1, // Assuming application with ID 1 exists
      },
    ]);
  });

  afterAll(async () => {
    await knex.migrate.rollback(true);
    await server.close();
  });

  beforeEach(async () => {
    await knex.migrate.latest();
  });

  afterEach(async () => {
    await knex.migrate.rollback(true);
  });

  it('Should get an event by ID', async () => {
    const existingEvent = await knex('event').first();
    const response = await request(server).get(
      `/api/events/${existingEvent.id}`,
    );

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('description');
    // ... validate other properties ...

    // You can add more assertions to validate the structure and content of the response
  });

  it('Should return an error if event does not exist', async () => {
    const nonExistentEventId = 9999;
    const response = await request(server).get(
      `/api/events/${nonExistentEventId}`,
    );

    expect(response.status).toBe(StatusCodes.NOT_FOUND);
    expect(response.body).toHaveProperty('error', 'Event not found');
  });

  // Add more test cases for edge cases and deleted events
});
