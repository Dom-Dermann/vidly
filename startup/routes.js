const genres = require('../routes/genres');
const root = require('../routes/root');
const customer = require('../routes/customers');
const movie = require('../routes/movies');
const rental = require('../routes/rentals');
const user = require('../routes/users');
const auth = require('../routes/auth');
const express = require('express');
const error_handeler = require('../middleware/error');

module.exports = function (app) {
    // install middleware
    app.use(express.json());
    app.use('/api/genres', genres);
    app.use('/', root);
    app.use('/api/customers', customer);
    app.use('/api/movies', movie);
    app.use('/api/rentals', rental);
    app.use('/api/users', user);
    app.use('/api/auth', auth);
    app.use(error_handeler);
}