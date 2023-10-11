/* eslint-disable class-methods-use-this */
const postgredb = require('../startup/db/postgresDb/postgresDb');

class MessageDAO {
  async createMessage(sendTo, messageSubject, messageBody) {
    const [message] = await postgredb('messages')
      .insert({
        sendto: sendTo,
        messageSubject,
        messageBody,
      })
      .returning('*');

    return message;
  }

  async getMessageById(id) {
    const message = await postgredb('message').where('id', id).first();
    return message;
  }
}

module.exports = new MessageDAO();
