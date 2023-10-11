/* eslint-disable class-methods-use-this */
// dao/eventDAO.js
const postgredb = require('../startup/db/postgresDb/postgresDb');

class EventDAO {
  async createEvent(name, description, isDeleted, applicationId) {
    const { id } = await postgredb('event')
      .insert({
        name,
        description,
        isDeleted,
        applicationId,
      })
      .returning('id');

    return id;
  }

  async updateEvent(id, name, description, isDeleted, applicationId) {
    await postgredb('event').where('id', id).update({
      name,
      description,
      isDeleted,
      applicationId,
    });

    return id;
  }

  async deleteEvent(id) {
    await postgredb('event').where('id', id).del();
  }

  async getEvents() {
    const events = await postgredb('event').select('*');
    return events;
  }

  async getEventById(id) {
    const event = await postgredb('event').where('id', id).first();
    return event;
  }
}

module.exports = new EventDAO();
