const config = require('config');
const dbDebugger = require('debug')('app:db');
const mongoose = require('mongoose');

module.exports = function() {
    // get the db host path
    const dbHost = config.get('Database.host');
    dbDebugger(dbHost);

    // connect to db host path
    mongoose.connect(dbHost)
        .then( () => dbDebugger(`Connected to MongoDB at ${dbHost}`));
}