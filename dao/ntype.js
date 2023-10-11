/* eslint-disable class-methods-use-this */
// dao/ntypeDAO.js
const { Knex } = require('../startup/db/postgresDb/postgresDb');
const postgredb = require('../startup/db/postgresDb/postgresDb');

class NtypeDAO {
  async createNtype(
    name,
    description,
    templateSubject,
    templateBody,
    tags,
    eventId,
    isDeleted, // Add isDeleted parameter
  ) {
    const [ntypeId] = await Knex('ntype')
      .insert({
        name,
        description,
        templateSubject,
        templateBody,
        tags: JSON.stringify(tags),
        eventId,
        isDeleted, // Insert isDeleted field
      })
      .returning('id');

    return ntypeId;
  }

  async updateNtype(
    id,
    name,
    description,
    templateSubject,
    templateBody,
    tags,
    eventId,
    isDeleted, // Add isDeleted parameter
  ) {
    await Knex('ntype')
      .where('id', id)
      .update({
        name,
        description,
        templateSubject,
        templateBody,
        tags: JSON.stringify(tags),
        eventId,
        isDeleted, // Update isDeleted field
      });

    return id;
  }

  async deleteNtype(id) {
    await Knex('ntype').where('id', id).del();
  }

  async getNtypes() {
    const ntypes = await Knex('ntype').select('*');
    return ntypes;
  }

  async getNtypeById(id) {
    const event = await postgredb('event').where('id', id).first();
    return event;
  }
}

module.exports = new NtypeDAO();
