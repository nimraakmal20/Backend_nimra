/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable class-methods-use-this */
const { StatusCodes } = require('http-status-codes');
const configuration = require('config');
const appService = require('../../service/app');
const postgredb = require('../../startup/db/postgresDb/postgresDb');
const logger = require('../../startup/logging');
const notification = require('../../dao/notification');

const defaultpagesize = configuration.get('page.size');
const defaultpagenum = configuration.get('page.num');

class AppController {
  async createApp(req, res) {
    const { name, description, isActive, isDeleted } = req.body;

    // Set default values if not provided
    const appData = {
      name,
      description,
      isActive: isActive !== undefined ? isActive : true,
      isDeleted: isDeleted !== undefined ? isDeleted : false,
    };

    // Check if an app with the same name already exists
    const existingApp = await postgredb('apps').where({ name }).first();
    if (existingApp) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: 'An app with the same name already exists' });
    }

    // Create the new app
    const id = await postgredb('apps').insert(appData).returning('id');
    return res
      .status(StatusCodes.OK)
      .json({ message: 'App posted successfully' });
  }

  async updateApp(req, res) {
    const id = req.params.id;
    const { name, description, isActive, isDeleted } = req.body;
    // Check if the request body is empty
    if (
      !name &&
      !description &&
      (isActive === undefined || isActive === null) &&
      (isDeleted === undefined || isDeleted === null)
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'At least one field is required for updating.' });
    }

    // Check if the app exists
    const existingApp = await postgredb('apps').where('id', id).first();

    if (!existingApp) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'App not found' });
    }

    // If the app is already deleted, return a message
    if (existingApp.isDeleted) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'The app has been deleted' });
    }

    // Check if an app with the same name already exists for this application
    const existingAppWithSameName = await postgredb('apps')
      .whereNot('id', id)
      .andWhere({ name, isDeleted: false })
      .first();

    if (existingAppWithSameName) {
      return res.status(StatusCodes.CONFLICT).json({
        error: 'An app with the same name already exists',
      });
    }
    const updateFields = {};

    if (name !== undefined) {
      updateFields.name = name;
    }

    if (description !== undefined) {
      updateFields.description = description;
    }

    if (isActive !== undefined) {
      updateFields.isActive = isActive;
    }

    if (isDeleted !== undefined) {
      updateFields.isDeleted = isDeleted;
    }

    await postgredb('apps').where('id', id).update(updateFields);

    return res
      .status(StatusCodes.OK)
      .json({ message: 'App updated successfully' });
  }

  async deleteApp(req, res) {
    const appId = req.params.id;

    // Check if the app exists
    const existingApp = await postgredb('apps').where('id', appId).first();

    if (!existingApp) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'App not found' });
    }

    // If the app is already deleted, return a message
    if (existingApp.isDeleted) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'The app has already been deleted' });
    }

    let deletedEvents;
    let deletedNtypes;

    // Begin a transaction
    await postgredb.transaction(async (trx) => {
      // Mark the app as deleted
      await trx('apps')
        .where({ id: appId })
        .update({ isDeleted: true, isActive: false });

      // Mark related events as deleted and get their IDs
      const eventIds = await trx('event')
        .where({ applicationId: appId })
        .update({ isDeleted: true, isActive: false })
        .returning('id');

      // Extract the integer values from eventIds
      const eventIdsArray = eventIds.map((event) => event.id);

      // Mark related ntypes as deleted
      await trx('ntype')
        .whereIn('eventId', function () {
          this.select('id').from('event').whereIn('id', eventIdsArray);
        })
        .update({ isDeleted: true, isActive: false });

      // Fetch deleted events and ntypes
      deletedEvents = await trx('event').whereIn('id', eventIdsArray);
      deletedNtypes = await trx('ntype').whereIn('eventId', function () {
        this.select('id').from('event').whereIn('id', eventIdsArray);
      });
    });

    return res.status(StatusCodes.OK).json({
      message: 'App, related events, and related ntypes deleted successfully',
      deletedEvents,
      deletedNtypes,
    });
  }

  async getApps(req, res) {
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

    const query = postgredb('apps')
      .select('*')
      .where(filter)
      .where('isDeleted', false) // Filter out deleted apps
      .orderBy(sortField, sortDirection) // Apply sorting based on sortOrder
      .offset(skipCount)
      .limit(pageSize);

    const apps = await query;

    const totalAppsCount = await postgredb('apps')
      .count('id as count')
      .where(filter)
      .where('isDeleted', false) // Filter out deleted apps
      .first();

    const responseData = {
      apps,
      pageSize,
      pageNum,
      totalAppsCount: totalAppsCount.count,
    };

    return res.json(responseData);
  }

  async getAppById(req, res) {
    const appId = req.params.id;

    const app = await postgredb('apps').where('id', appId).first();

    if (!app) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Application not found' });
    }

    if (app.isDeleted) {
      return res.json({ message: 'The app has been deleted' });
    }

    return res.json(app);
  }
}

module.exports = new AppController();
