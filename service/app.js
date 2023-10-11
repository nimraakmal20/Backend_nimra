/* eslint-disable class-methods-use-this */
const appDAO = require('../dao/app');

class AppService {
  createApp(name, description, isActive, isDeleted) {
    return appDAO.createApp(name, description, isActive, isDeleted);
  }

  updateApp(id, name, description, isActive, isDeleted) {
    return appDAO.updateApp(id, name, description, isActive, isDeleted);
  }

  deleteApp(id) {
    return appDAO.deleteApp(id);
  }

  getApps() {
    return appDAO.getApps();
  }

  getAppById(id) {
    return appDAO.getAppById(id);
  }
}

module.exports = new AppService();
