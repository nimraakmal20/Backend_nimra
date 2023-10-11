/* eslint-disable class-methods-use-this */
// service/notificationService.js
const notificationDAO = require('../dao/notification');

class NotificationService {
  createNotification(
    name,
    description,
    isActive,
    eventId,
    isDeleted, // Add the isDeleted field here
  ) {
    return notificationDAO.createNotification(
      name,
      description,
      isActive,
      eventId,
      isDeleted, // Pass the isDeleted value here
    );
  }

  updateNotification(
    id,
    name,
    description,
    isActive,
    eventId,
    isDeleted, // Add the isDeleted field here
  ) {
    return notificationDAO.updateNotification(
      id,
      name,
      description,
      isActive,
      eventId,
      isDeleted, // Pass the isDeleted value here
    );
  }

  deleteNotification(id) {
    return notificationDAO.deleteNotification(id);
  }

  getNotifications() {
    return notificationDAO.getNotifications();
  }

  getNotificationById(id) {
    return notificationDAO.getNotificationById(id);
  }
}

module.exports = new NotificationService();
