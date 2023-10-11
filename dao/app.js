/* eslint-disable class-methods-use-this */
const postgredb = require('../startup/db/postgresDb/postgresDb');

class AppDAO {
  async createApp(name, description, isActive, isDeleted) {
    const { id } = await postgredb('apps')
      .insert({
        name,
        description,
        isActive,
        isDeleted,
      })
      .returning('id');

    return id;
  }

  async updateApp(id, name, description, isActive, isDeleted) {
    await postgredb('apps').where('id', id).update({
      name,
      description,
      isActive,
      isDeleted,
    });

    return id;
  }

  async deleteApp(id) {
    await postgredb('apps').where('id', id).del();
  }

  async getApps() {
    const apps = await postgredb('apps').select('*');
    return apps;
  }

  async getAppById(id) {
    const app = await postgredb('apps').where('id', id).first();
    return app;
  }
}

module.exports = new AppDAO();
