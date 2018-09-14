// import modules
const express = require('express');
const exDebugger = require('debug')('app:express');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const mongoose = require('mongoose');
const app = express();
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const genres = require('./routes/genres');
const root = require('./routes/root');
const customer = require('./routes/customers');
const movie = require('./routes/movies');
const rental = require('./routes/rentals');
const user = require('./routes/users');
const auth = require('./routes/auth');

// install middleware
app.use(express.json());
app.use('/api/genres', genres);
app.use('/', root);
app.use('/api/customers', customer);
app.use('/api/movies', movie);
app.use('/api/rentals', rental);
app.use('/api/users', user);
app.use('/api/auth', auth);

// get the db host path
const dbHost = config.get('Database.host');
dbDebugger(dbHost);

// connect to db host path
mongoose.connect(dbHost)
    .then( () => dbDebugger(`Connected to MongoDB at ${dbHost}`))
    .catch( () => dbDebugger('Error connecting to database'));

var port = process.env.port || 3000;
app.listen(3000, () => console.log(`Listening on port ${port}.`));