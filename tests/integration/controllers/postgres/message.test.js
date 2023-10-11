const request = require('supertest');
const { StatusCodes } = require('http-status-codes');
const knex = require('../../../../startup/db/postgresDb/postgresDb');
const server = require('../../../../index');

describe('POST /api/createMessage', () => {
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
    await knex('stubs').insert({
      stubsArr: JSON.stringify(['tag']), // Convert array to JSON string
      ntypeId: 1,
    });
  });

  it('Should create and send messages', async () => {
    const ntype = await knex('ntype').first(); // Get the first ntype
    const newMessage = {
      ntypeId: ntype.id.toString(),
      sending: [
        { email: 'recipient1@example.com', tag: 'Recipient 1' },
        { email: 'recipient2@example.com', tag: 'Recipient 2' },
      ],
    };

    // Make a request to the API endpoint
    const response = await request(server)
      .post('/api/messages')
      .send(newMessage); // Pass data in the request body
    expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  afterAll(async () => {
    await knex.migrate.rollback(true);
    await server.close();
  });
  // Add more test cases as needed
});

describe('GET /api/messages', () => {
  beforeAll(async () => {
    await knex.migrate.latest();
    await knex('message').insert([
      {
        sendto: 'recipient1@example.com',
        messageSubject: 'Subject 1',
        messageBody: 'Body 1',
      },
      {
        sendto: 'recipient2@example.com',
        messageSubject: 'Subject 2',
        messageBody: 'Body 2',
      },
      // Add more messages as needed
    ]);
  });

  afterAll(async () => {
    await knex.migrate.rollback(true);
    await server.close();
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    // ... populate the necessary tables as needed
  });

  afterEach(async () => {
    await knex.migrate.rollback(true);
  });

  it('Should get messages with pagination and filtering', async () => {
    // Make a request to the API endpoint
    const response = await request(server).get('/api/messages').query({
      pagesize: 10,
      pagenum: 1,
    });

    expect(response.status).toBe(StatusCodes.OK);
    // Additional assertions can be added here to check the response body and data
  });

  // Add more test cases as needed
});

describe('GET /api/messages/:id', () => {
  beforeAll(async () => {
    await knex.migrate.latest();
    await knex('message').insert([
      {
        sendto: 'recipient1@example.com',
        messageSubject: 'Subject 1',
        messageBody: 'Body 1',
      },
      {
        sendto: 'recipient2@example.com',
        messageSubject: 'Subject 2',
        messageBody: 'Body 2',
      },
      // Add more messages as needed
    ]);
  });

  afterAll(async () => {
    await knex.migrate.rollback(true);
    await server.close();
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    // ... populate the necessary tables as needed
  });

  afterEach(async () => {
    await knex.migrate.rollback(true);
  });

  it('Should get a message by ID', async () => {
    // Insert test data into the 'messages' table if needed
    // ...

    // Get a message ID from the test data
    const messageId = 1; // Replace with the actual message ID

    // Make a request to the API endpoint
    const response = await request(server).get(`/api/messages/${messageId}`);

    expect(response.status).toBe(StatusCodes.OK);
    // Additional assertions can be added here to check the response body and data
  });

  it('Should return 404 if message is not found', async () => {
    // Choose a non-existing message ID
    const nonExistingMessageId = 999; // Replace with a non-existing ID

    // Make a request to the API endpoint
    const response = await request(server).get(
      `/api/messages/${nonExistingMessageId}`,
    );

    expect(response.status).toBe(StatusCodes.NOT_FOUND);
    // Additional assertions can be added here to check the response body
  });

  // Add more test cases as needed
});
