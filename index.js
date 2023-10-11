const express = require('express');
const configuration = require('config');
const connectToDatabase = require('./startup/db/mongoDb/mongoDb'); // Import the function
const logger = require('./startup/logging');
require('express-async-errors');
const errorHandle = require('./middleware/errorHandle');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to the database
const { DB_TYPE } = process.env; // config
if (!DB_TYPE) {
  logger.info('Please provide a valid DB_TYPE environment variable.');
  process.exit(1);
}

if (DB_TYPE === 'mongo') {
  connectToDatabase();
  require('./startup/usedRoutes')(app);
} else if (DB_TYPE === 'postgres') {
  require('./startup/usedRoutes')(app);
} else {
  logger.info(
    "Invalid DB_TYPE provided. Supported values are 'mongo' and 'postgres'.",
  );
  process.exit(1);
}

app.get('/', (req, res) => {
  res.send('Connected');
});

app.use(errorHandle);

// Start the server
const port = configuration.get('port');
const server = app.listen(port, () => {
  logger.info(`Listening on port ${port}`);
});

module.exports = server;
// npm run start:dev:mongo
// npm run start:dev:postgres
// npm run start:prod
// npm run start:test

// // Import and use the configured routes for PostgreSQL controllers
// const usedPostgresRoutes = require('./startup/usedPostgreRoutes');

// usedPostgresRoutes(app);
// Import and use the configured routes for PostgreSQL controllers
