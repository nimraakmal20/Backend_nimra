/* eslint-disable class-methods-use-this */
// service/eventService.js
// services/event.js
const eventDAO = require('../dao/event');

class EventService {
  createEvent(name, description, isDeleted, applicationId) {
    return eventDAO.createEvent(name, description, isDeleted, applicationId);
  }

  updateEvent(id, name, description, isDeleted, applicationId) {
    return eventDAO.updateEvent(
      id,
      name,
      description,
      isDeleted,
      applicationId,
    );
  }

  deleteEvent(id) {
    return eventDAO.deleteEvent(id);
  }

  getEvents() {
    return eventDAO.getEvents();
  }

  getEventById(id) {
    return eventDAO.getEventById(id);
  }
}

module.exports = new EventService();
