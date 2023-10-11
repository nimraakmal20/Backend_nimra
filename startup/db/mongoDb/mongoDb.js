const mongoose = require('mongoose');
const express = require('express');
const config = require('config');
const logger = require('../../logging');

const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.get('mongodb_connection'));
    logger.info('Connected to MongoDB...');
  } catch (err) {
    logger.error('Could not connect to MongoDB...', err);
  }
};

module.exports = connectToDatabase;
