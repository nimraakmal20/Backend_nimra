/* eslint-disable class-methods-use-this */
// dao/notificationDAO.js
const postgredb = require('../startup/db/postgresDb/postgresDb');

class NotificationDAO {
  async createNotification(
    name,
    description,
    isActive,
    eventId,
    isDeleted, // Add the isDeleted field here
  ) {
    const { id } = await postgredb('notification')
      .insert({
        name,
        description,
        isActive,
        eventId,
        isDeleted, // Insert the isDeleted value here
      })
      .returning('id');

    return id;
  }

  async updateNotification(
    id,
    name,
    description,
    isActive,
    eventId,
    isDeleted, // Add the isDeleted field here
  ) {
    await postgredb('notification').where('id', id).update({
      name,
      description,
      isActive,
      eventId,
      isDeleted, // Update the isDeleted value here
    });

    return id;
  }

  async deleteNotification(id) {
    await postgredb('notification').where('id', id).del();
  }

  async getNotifications() {
    const notifications = await postgredb('notification').select('*');
    return notifications;
  }

  async getNotificationById(id) {
    const notification = await postgredb('notification')
      .where('id', id)
      .first();
    return notification;
  }
}

module.exports = new NotificationDAO();
