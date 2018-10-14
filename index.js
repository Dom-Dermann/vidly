// import modules
const express = require('express');
const app = express();
const winston = require('winston');

// get logging of errors set up
require('./startup/logging')();
// get all the routes and middleware set up
require('./startup/routes')(app);
// get the mongoDB configured
require('./startup/db')();
// get secrets from environment
require('./startup/config')();
// get the Joi API
require('./startup/validation');

const port = process.env.port || 3000;
app.listen(3000, () => winston.info(`Listening on port ${port}.`));