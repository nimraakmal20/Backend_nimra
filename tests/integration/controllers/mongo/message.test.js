const request = require('supertest');
const { StatusCodes } = require('http-status-codes');
const { Ntype } = require('../../../../models/notiftype');
const { Message } = require('../../../../models/message');
const { createMessage } = require('../../../../controllers/mongo/message'); // Adjust the path as per your project structure

describe('/api/messages', () => {
  describe('POST /', () => {
    let server;

    beforeEach(() => {
      server = require('../../../../index');
    });

    afterEach(async () => {
      server.close();
      await Ntype.deleteMany({});
      await Message.deleteMany({});
    });

    it('should create and send messages based on Ntype and recipients', async () => {
      // Create a sample Ntype for testing
      const ntype = new Ntype({
        name: 'Test Ntype',
        description: 'Ntype description',
        templateSubject: 'Hello,',
        templateBody: 'Template body with [[tag]]',
        tags: ['tag'],
        eventId: 'some-event-id',
        isActive: true,
        isDeleted: false,
      });
      await ntype.save();

      const recipientData = [
        { email: 'user1@example.com', tag: 'Tag 1' },
        { email: 'user2@example.com', tag: 'Tag 2' },
      ];

      const res = await request(server)
        .post('/api/messages/')
        .send({ ntypeId: ntype.id, sending: recipientData });

      expect(res.status).toBe(StatusCodes.OK);
    });
  });
});
