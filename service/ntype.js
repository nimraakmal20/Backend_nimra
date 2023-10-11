/* eslint-disable class-methods-use-this */
// service/ntypeService.js
const NtypeDAO = require('../dao/ntype');

class NtypeService {
  createNtype(
    name,
    description,
    templateSubject,
    templateBody,
    tags,
    eventId,
    isDeleted, // Add isDeleted parameter
  ) {
    return NtypeDAO.createNtype(
      name,
      description,
      templateSubject,
      templateBody,
      tags,
      eventId,
      isDeleted, // Pass isDeleted parameter
    );
  }

  updateNtype(
    id,
    name,
    description,
    templateSubject,
    templateBody,
    tags,
    eventId,
    isDeleted, // Add isDeleted parameter
  ) {
    return NtypeDAO.updateNtype(
      id,
      name,
      description,
      templateSubject,
      templateBody,
      tags,
      eventId,
      isDeleted, // Pass isDeleted parameter
    );
  }

  deleteNtype(id) {
    return NtypeDAO.deleteNtype(id);
  }

  getNtypes() {
    return NtypeDAO.getNtypes();
  }

  getNtypeById(id) {
    return NtypeDAO.getNtypeById(id);
  }
}

module.exports = new NtypeService();
