/* eslint-disable no-undef */
const request = require('supertest');
const { StatusCodes } = require('http-status-codes');
const appController = require('../../../../controllers/postgres/app'); // Update the path
// Mock the dependencies
const knex = require('../../../../startup/db/postgresDb/postgresDb');

const server = require('../../../../index');

describe('/api/apps', () => {
  beforeAll(async () => {
    await knex.migrate.latest();
    await knex('apps').insert([
      {
        name: 'application1',
        description: 'app1 desc',
        isActive: 'true',
        isDeleted: 'false',
      },
      {
        name: 'application1',
        description: 'app2 desc',
        isActive: 'true',
        isDeleted: 'false',
      },
      {
        name: 'application1',
        description: 'app3 desc',
        isActive: 'true',
        isDeleted: 'false',
      },
    ]);
  });

  beforeEach(async () => {
    await knex.migrate.latest();
  });

  it('Should return an error if app name already exists', async () => {
    await knex('apps').insert([
      {
        name: 'application1',
        description: 'app1 desc',
        isActive: 'true',
        isDeleted: 'false',
      },
    ]);

    const existingApp = {
      name: 'application1', // This name already exists based on your beforeAll setup
      description: 'Existing app description',
      isActive: true,
      isDeleted: false,
    };

    const response = await request(server).post('/api/apps').send(existingApp);

    expect(response.status).toBe(StatusCodes.CONFLICT);
    expect(response.body).toHaveProperty(
      'error',
      'An app with the same name already exists',
    );
  });
  afterEach(async () => {
    await knex.migrate.rollback(true);
  });
  afterAll(async () => {
    await server.close();
  });
});
describe('PATCH /api/apps/:id', () => {
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
        name: 'application1',
        description: 'app2 desc',
        isActive: 'true',
        isDeleted: 'false',
      },
      {
        name: 'application1',
        description: 'app3 desc',
        isActive: 'true',
        isDeleted: 'false',
      },
    ]);
  });
  it('Should return an error if app does not exist', async () => {
    const nonExistentAppId = 9999;
    const updatedAppData = {
      name: 'UpdatedAppName',
      description: 'Updated app description',
      isActive: false,
      isDeleted: true,
    };
    const response = await request(server)
      .patch(`/api/apps/${nonExistentAppId}`)
      .send(updatedAppData);
    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });
  it('Should update an existing app', async () => {
    const existingApp = await knex('apps').first();
    const updatedAppData = {
      name: 'UpdatedAppName',
      description: 'Updated app description',
      isActive: false,
      isDeleted: true,
    };
    const response = await request(server)
      .patch(`/api/apps/${existingApp.id}`)
      .send(updatedAppData);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveProperty('message', 'App updated successfully');
  });

  afterAll(async () => {
    await knex.migrate.rollback(true);
    await server.close();
  });
});
describe('GET /api/apps', () => {
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
        name: 'application1',
        description: 'app2 desc',
        isActive: 'true',
        isDeleted: 'false',
      },
      {
        name: 'application1',
        description: 'app3 desc',
        isActive: 'true',
        isDeleted: 'false',
      },
    ]);
  });
  it('Should get a list of apps with pagination and sorting', async () => {
    const response = await request(server).get('/api/apps').query({
      pagesize: 2,
      pagenum: 1,
      sortBy: 'name',
      // ... any other filter parameters ...
    });

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveProperty('apps');
    expect(response.body).toHaveProperty('pageSize', 2);
    expect(response.body).toHaveProperty('pageNum', 1);
    expect(response.body).toHaveProperty('totalAppsCount');

    // You can add more assertions to validate the structure and content of the response
  });
  afterAll(async () => {
    await knex.migrate.rollback(true);
    await server.close();
  });
  // Add more test cases for edge cases, filtering, and sorting
});
describe('GET /api/apps/:id', () => {
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
        name: 'application1',
        description: 'app2 desc',
        isActive: 'true',
        isDeleted: 'false',
      },
      {
        name: 'application1',
        description: 'app3 desc',
        isActive: 'true',
        isDeleted: 'false',
      },
    ]);
  });

  it('Should get an app by ID', async () => {
    const existingApp = await knex('apps').first();
    const response = await request(server).get(`/api/apps/${existingApp.id}`);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('description');
    // ... validate other properties ...

    // You can add more assertions to validate the structure and content of the response
  });

  it('Should return an error if app does not exist', async () => {
    const nonExistentAppId = 9999;
    const response = await request(server).get(`/api/apps/${nonExistentAppId}`);

    expect(response.status).toBe(StatusCodes.NOT_FOUND);
    expect(response.body).toHaveProperty('error', 'Application not found');
  });
  afterAll(async () => {
    await knex.migrate.rollback(true);
    await server.close();
  });
  // Add more test cases for edge cases and deleted apps
});
