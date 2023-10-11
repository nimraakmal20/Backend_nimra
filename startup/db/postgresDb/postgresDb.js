const knex = require('knex');
const knexfile = require('./knexfile');

const postgredb = knex(knexfile.development);

module.exports = postgredb;
