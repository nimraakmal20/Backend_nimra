/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-await-in-loop */
const logger = require('../startup/logging');
const MessageDAO = require('../dao/message');

class MessageService {
  async createMessage(ntypeId, stubId, recipients) {
    // Fetch ntype and stub details from the database if needed
    // For simplicity, let's assume they're already retrieved

    const tags = stub.stubsArr;
    const { templateBody } = ntype;

    const savedMessages = [];

    for (const recipient of recipients) {
      let messageSubject = ntype.templateSubject;
      let messageBody = templateBody;

      for (const key of Object.keys(recipient)) {
        if (tags.includes(key)) {
          const tagValue = recipient[key];
          messageSubject = messageSubject.replace(`[[${key}]]`, tagValue);
          messageBody = messageBody.replace(`[[${key}]]`, tagValue);
        }
      }

      const message = await MessageDAO.createMessage(
        recipient.email,
        messageSubject,
        messageBody,
      );

      savedMessages.push(message);
    }

    const formattedOutput = savedMessages.map((message) => ({
      sending: message.sendto,
      subject: message.messageSubject,
      messagebody: message.messageBody,
    }));

    return formattedOutput;
  }

  async getMessageById(id) {
    return MessageDAO.getMessageById(id);
  }
}

module.exports = new MessageService();
