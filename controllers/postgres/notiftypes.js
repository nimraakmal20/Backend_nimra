/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-cond-assign */
/* eslint-disable class-methods-use-this */
// controllers/ntypeController.js
const { StatusCodes } = require('http-status-codes');
const config = require('config');
const ntypeService = require('../../service/ntype');
const postgredb = require('../../startup/db/postgresDb/postgresDb');
const logger = require('../../startup/logging');

const defaultpagesize = config.get('page.size');
const defaultpagenum = config.get('page.num');

function extractTagsFromText(text) {
  const regex = /\[\[(.*?)\]\]/g;
  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

class NtypeController {
  async createNtype(req, res) {
    // Extract tags from the body
    const tags = extractTagsFromText(req.body.templateBody);
    const stringifiedTags = tags.map((tag) => tag.toString()); // Convert all elements to strings
    const { eventId, isActive, isDeleted } = req.body;

    // Set default values if not provided
    const ntypeData = {
      name: req.body.name,
      description: req.body.description,
      templateSubject: req.body.templateSubject,
      templateBody: req.body.templateBody,
      tags: JSON.stringify(stringifiedTags),
      eventId,
      isActive: isActive !== undefined ? isActive : true,
      isDeleted: isDeleted !== undefined ? isDeleted : false,
    };

    const event = await postgredb('event').where({ id: eventId }).first();

    if (!event) {
      return res.status(StatusCodes.BAD_REQUEST).send('Invalid event.');
    }

    const existingNtype = await postgredb('ntype')
      .where({
        name: req.body.name,
        eventId, // Corrected to use query instead of body
        isDeleted: false,
      })
      .first();

    if (existingNtype) {
      return res
        .status(StatusCodes.CONFLICT)
        .send(
          'An ntype with the same name, eventId, and isDeleted=false already exists for this notification.',
        );
    }

    await postgredb.transaction(async (trx) => {
      const [ntypeId] = await postgredb('ntype')
        .insert({
          ...ntypeData,
          isDeleted: false,
        })
        .returning('id');

      const [stubId] = await postgredb('stubs')
        .insert({
          stubsArr: JSON.stringify(stringifiedTags),
          ntypeId: ntypeId.id,
        })
        .returning('id');

      logger.info(stubId);
    });

    return res.status(StatusCodes.OK).send('Ntype created successfully'); // Respond outside the transaction
  }

  async updateNtype(req, res) {
    // Check if req.body is empty
    if (Object.keys(req.body).length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send('Request body cannot be empty.');
    }

    const ntypeId = req.params.id;

    // Check if ntype exists
    const ntype = await postgredb('ntype').where({ id: ntypeId }).first();

    if (!ntype) {
      return res.status(StatusCodes.BAD_REQUEST).send('Invalid ntype.');
    }

    const { name, templateBody } = req.body;

    if (name) {
      const existingNtype = await postgredb('ntype')
        .whereNot('id', ntypeId)
        .where({
          name,
          eventId: ntype.eventId,
          isDeleted: false,
        })
        .first();

      if (existingNtype) {
        return res
          .status(StatusCodes.CONFLICT)
          .send(
            'An ntype with the same name already exists for this notification.',
          );
      }
    }

    // Extract tags from the updated templateBody
    const updatedTags = extractTagsFromText(templateBody);

    const updateFields = {
      ...req.body,
      tags: JSON.stringify(updatedTags), // Update tags with the new tag array
    };

    // Update the Ntype
    await postgredb('ntype').where({ id: ntypeId }).update(updateFields);

    // Fetch the updated Ntype
    const updatedNtype = await postgredb('ntype')
      .where({ id: ntypeId })
      .first();

    return res.send(updatedNtype);
  }

  async deleteNtype(req, res) {
    const deletedCount = await postgredb('ntype')
      .where('id', req.query.ntypeId)
      .del();

    if (deletedCount > 0) {
      return res.send({ message: 'Ntype deleted successfully' });
    }
    return res.status(400).send('Invalid ntype.');
  }

  async getNtypes(req, res) {
    const { pagesize, pagenum, sortBy, sortOrder, ...filterParams } = req.query;

    // Convert query parameters to integers
    const pageSizeInt = parseInt(pagesize, 10) || defaultpagesize;
    const pageNumInt = parseInt(pagenum, 10) || defaultpagenum;

    // Calculate skip count based on page size and page number
    const skipCount = (pageNumInt - 1) * pageSizeInt;

    // Define sorting options based on query parameters
    const sortField = sortBy || 'id'; // Default sort field if sortBy is not provided
    const sortDirection = parseInt(sortOrder, 10) === -1 ? 'desc' : 'asc';

    // Build the filter object based on the remaining query parameters
    const filter = {};
    for (const key in filterParams) {
      filter[key] = filterParams[key];
    }

    let query = postgredb('ntype').where(filter);

    // Apply sorting options to the query
    query = query.orderBy(sortField, sortDirection);

    const ntypes = await query.offset(skipCount).limit(pageSizeInt);

    const totalNtypesCount = await postgredb('ntype')
      .count('id as count')
      .where(filter)
      .first();

    const responseData = {
      ntypes,
      pageSize: pageSizeInt,
      pageNum: pageNumInt,
      totalNtypesCount: parseInt(totalNtypesCount.count, 10),
    };

    return res.json(responseData);
  }

  async getNtypeById(req, res) {
    const appId = req.params.id; // Assuming the parameter is named 'id'

    const app = await postgredb('ntype').where('id', appId).first();

    if (!app) {
      return res.status(404).json({ error: 'Ntype not found' });
    }

    return res.json(app);
  }
}

module.exports = new NtypeController();
