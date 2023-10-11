const { afterEach } = require('node:test');
const request = require('supertest');
const { StatusCodes } = require('http-status-codes');
const knex = require('../../../../startup/db/postgresDb/postgresDb');
const server = require('../../../../index');

describe('POST /api/createNtype', () => {
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

  it('Should create a new ntype', async () => {
    const event = await knex('event').first(); // Get the first event
    const newNtype = {
      name: 'New Ntype',
      description: 'New ntype description',
      templateSubject: 'Subject template',
      templateBody: 'Body template with [[tag]]',
      eventId: event.id, // Pass the event ID in the request body
    };
    const response = await request(server)
      .post('/api/notiftypes')
      .send(newNtype); // Send the request with the eventId in the request body
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.text).toBe('Ntype created successfully');

    // Additional assertions can be added here to check the database state
  });
  afterAll(async () => {
    await knex.migrate.rollback(true);
    await server.close();
  });

  // Add more test cases as needed
});

describe('PATCH /api/updateNtype', () => {
  beforeAll(async () => {
    // Perform necessary setup such as database migrations and seeding
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
    await knex('event').insert([
      {
        name: 'event1',
        description: 'event1 desc',
        isDeleted: false,
        isActive: true,
        applicationId: 1,
      },
    ]);
    await knex('ntype').insert({
      name: 'Test Ntype',
      eventId: 1,
      description: 'Test ntype description',
      templateSubject: 'Subject template',
      templateBody: 'Body template with [[tag]]',
      tags: [],
      isDeleted: false,
      isActive: true,
    });
  });

  afterAll(async () => {
    // Perform necessary teardown such as database rollback and server close
    await knex.migrate.rollback(true);
    await server.close();
  });

  it('Should update an existing ntype', async () => {
    // Assuming ntypeId 1 exists in the database
    const ntypeId = 1;
    const updatedNtype = {
      name: 'Updated Ntype',
      templateBody: 'Updated Body template with [[tag]]',
    };

    const response = await request(server)
      .patch(`/api/notiftypes/${ntypeId}`)
      .send(updatedNtype);
    expect(response.status).toBe(StatusCodes.OK);
    // Additional assertions can be added here to check the response body and database state
  });

  it('Should return 400 if request body is empty', async () => {
    const ntypeId = 1; // Assuming ntypeId 1 exists in the database
    const response = await request(server)
      .patch(`/api/notiftypes/${ntypeId}`)
      .send({});

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it('Should return 400 for an invalid ntypeId', async () => {
    const invalidNtypeId = 999; // An invalid ntypeId
    const updatedNtype = {
      name: 'Updated Ntype',
      templateBody: 'Updated Body template with [[tag]]',
    };

    const response = await request(server)
      .patch(`/api/notiftypes/${invalidNtypeId}`)
      .send(updatedNtype);

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  // Add more test cases as needed
});
describe('GET /api/getNtypes', () => {
  beforeAll(async () => {
    // Perform necessary setup such as database migrations and seeding
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
    await knex('event').insert([
      {
        name: 'event1',
        description: 'event1 desc',
        isDeleted: false,
        isActive: true,
        applicationId: 1,
      },
    ]);
    await knex('ntype').insert({
      name: 'Test Ntype',
      eventId: 1,
      description: 'Test ntype description',
      templateSubject: 'Subject template',
      templateBody: 'Body template with [[tag]]',
      tags: [],
      isDeleted: false,
      isActive: true,
    });
  });

  afterAll(async () => {
    // Perform necessary teardown such as database rollback and server close
    await knex.migrate.rollback(true);
    await server.close();
  });

  it('Should retrieve ntypes with default pagination and sorting', async () => {
    const response = await request(server).get('/api/notiftypes');

    expect(response.status).toBe(StatusCodes.OK);
    // Add assertions to check the response structure and data
  });
});
