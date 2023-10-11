/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable class-methods-use-this */
// controllers/eventController.js
const { StatusCodes } = require('http-status-codes');
const config = require('config');
const eventService = require('../../service/event');
const postgredb = require('../../startup/db/postgresDb/postgresDb');
const logger = require('../../startup/logging');

const defaultpagesize = config.get('page.size');
const defaultpagenum = config.get('page.num');

class EventController {
  // Create Event
  async createEvent(req, res) {
    const { name, description, applicationId, isActive, isDeleted } = req.body;

    // Set default values if not provided
    const eventData = {
      name,
      description,
      applicationId,
      isActive: isActive !== undefined ? isActive : true,
      isDeleted: isDeleted !== undefined ? isDeleted : false,
    };

    // Check if the app with the provided applicationId exists and is not deleted
    const app = await postgredb('apps')
      .where({ id: applicationId, isDeleted: false })
      .first();

    if (!app) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'App is deleted' });
    }

    // Check if an event with the same name already exists for this application
    const existingEvent = await postgredb('event')
      .where({ name, applicationId, isDeleted: false })
      .first();

    if (existingEvent) {
      return res.status(StatusCodes.CONFLICT).json({
        error:
          'An event with the same name already exists for this application',
      });
    }

    // Create the new event
    const [id] = await postgredb('event').insert(eventData).returning('id');

    return res
      .status(StatusCodes.OK)
      .json({ message: 'Event posted successfully' });
  }

  // Update Event
  async updateEvent(req, res) {
    const id = req.params.id;
    const { name, description, isDeleted } = req.body;

    // Check if the request body is empty
    if (!name && !description && isDeleted === undefined) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error:
          'At least one field (name, description, isDeleted) is required for updating the event',
      });
    }

    // Get the event
    const event = await postgredb('event').where({ id }).first();

    if (!event) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Event not found' });
    }

    // If event is already deleted, show a message
    if (event.isDeleted) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'The event has already been deleted' });
    }

    // Check if an event with the same name already exists for this application
    let existingEvent = null;
    if (name) {
      existingEvent = await postgredb('event')
        .whereNot('id', id)
        .andWhere({ name, applicationId: event.applicationId })
        .first();

      if (existingEvent) {
        return res.status(StatusCodes.CONFLICT).json({
          error:
            'An event with the same name already exists for this application',
        });
      }
    }

    // Update the event
    await postgredb('event').where({ id }).update({
      name,
      description,
      isDeleted,
    });

    return res
      .status(StatusCodes.OK)
      .json({ message: 'Event updated successfully' });
  }

  async deleteEvent(req, res) {
    const eventId = req.params.id;

    // Check if the event exists
    const existingEvent = await postgredb('event')
      .where({ id: eventId })
      .first();

    if (!existingEvent) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Event not found' });
    }

    // If the event is already deleted, return a message
    if (existingEvent.isDeleted) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'The event has already been deleted' });
    }

    let deletedNtypes;

    // Begin a transaction
    await postgredb.transaction(async (trx) => {
      // Update the event to set isDeleted=true and isActive=false
      await trx('event')
        .where({ id: eventId })
        .update({ isDeleted: true, isActive: false });

      // Update ntypes associated with the event to set isDeleted=true and isActive=false
      deletedNtypes = await trx('ntype')
        .where('eventId', eventId)
        .update({ isDeleted: true, isActive: false });
    });

    return res.status(StatusCodes.OK).json({
      message: 'Event and associated ntypes deleted successfully',
      deletedNtypes,
    });
  }

  async getEvents(req, res) {
    const { pagesize, pagenum, sortBy, sortOrder, ...filterParams } = req.query;

    const pageSize = parseInt(pagesize, 10) || defaultpagesize;
    const pageNum = parseInt(pagenum, 10) || defaultpagenum;
    const skipCount = (pageNum - 1) * pageSize;
    const sortField = sortBy || 'id';
    const sortDirection = parseInt(sortOrder, 10) === -1 ? 'desc' : 'asc';

    const filter = {};
    for (const key in filterParams) {
      filter[key] = filterParams[key];
    }

    let query = postgredb('event')
      .select('*')
      .where(filter)
      .andWhere({ isDeleted: false });

    // Apply sorting options to the query
    query = query.orderBy(sortField, sortDirection);

    const events = await query.offset(skipCount).limit(pageSize);

    const totalEventsCount = await postgredb('event')
      .count('id as count')
      .where(filter)
      .andWhere({ isDeleted: false })
      .first();

    const responseData = {
      events,
      pageSize,
      pageNum,
      totalEventsCount: totalEventsCount.count,
    };

    return res.json(responseData);
  }

  // getEventById
  async getEventById(req, res) {
    const eventId = req.params.id; // Assuming the parameter is named 'id'

    const event = await postgredb('event')
      .where('id', eventId)
      .andWhere({ isDeleted: false })
      .first();

    if (!event) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Event not found' });
    }

    return res.json(event);
  }
}

module.exports = new EventController();
