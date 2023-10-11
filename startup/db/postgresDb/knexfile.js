/* eslint-disable prettier/prettier */
const config = require('config');
const configuration = require('config');
/**
 *
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const postgresqlConfig = config.get('postgres');
module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: postgresqlConfig.database,
      user: 'postgres',
      password: configuration.get('postgres_password.postgres_password'),
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: `${__dirname}/migrations`,
      tableName: 'knex_migrations',
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
  },
};
